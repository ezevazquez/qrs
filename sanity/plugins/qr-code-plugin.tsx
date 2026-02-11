'use client'

import { definePlugin } from 'sanity'

interface QrCodePluginOptions {
  baseUrl?: string
}

export const qrCodePlugin = definePlugin<QrCodePluginOptions>((options = {}) => {
  const baseUrl = options.baseUrl || 'http://localhost:3000'

  return {
    name: 'qr-code-plugin',
    document: {
      actions: (prev, context) => {
        // Crear una nueva acción de publish personalizada
        const publishAction = prev.find((action) => action.action === 'publish')
        
        if (!publishAction) {
          return prev
        }

        // Crear nueva acción que extiende la original
        const customPublishAction = {
          ...publishAction,
          onHandle: async (props: any) => {
            // Ejecutar la acción de publicación original primero
            if (publishAction.onHandle) {
              await publishAction.onHandle(props)
            }
            
            // Esperar un poco para asegurar que el documento se haya guardado
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Obtener el documento publicado
            const doc = props.published || props.draft
            
            if (doc && !doc.qrCode) {
              try {
                await generateQRCode(doc, context, baseUrl)
              } catch (error) {
                console.error('Error generando QR:', error)
              }
            }
          },
        }

        // Reemplazar la acción original con la personalizada
        return prev.map((action) =>
          action.action === 'publish' ? customPublishAction : action
        )
      },
    },
  }
})

async function generateQRCode(doc: any, context: any, baseUrl: string) {
  try {
    // Importar QRCode dinámicamente
    const QRCode = (await import('qrcode')).default
    
    // Obtener cliente de Sanity
    const client = context.getClient({ apiVersion: '2026-02-11' })
    
    // Construir la URL del redirect
    const redirectUrl = `${baseUrl}/r/${doc._id}`
    
    // Generar QR como data URL
    const dataUrl = await QRCode.toDataURL(redirectUrl, {
      type: 'image/png',
      width: 512,
      margin: 2,
      errorCorrectionLevel: 'M',
    })
    
    // Convertir data URL a blob
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    
    // Subir a Sanity
    const asset = await client.assets.upload('image', blob, {
      filename: `qr-${doc._id}.png`,
    })
    
    // Actualizar el documento con el QR
    await client
      .patch(doc._id)
      .set({
        qrCode: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
      })
      .commit()
    
    console.log('QR generado exitosamente')
  } catch (error) {
    console.error('Error generando QR:', error)
    throw error
  }
}
