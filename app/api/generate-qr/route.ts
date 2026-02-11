import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

// Cliente con permisos de escritura para la API
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Token con permisos de escritura
})

export async function POST(request: NextRequest) {
  try {
    const { documentId, baseUrl } = await request.json()

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId es requerido' },
        { status: 400 }
      )
    }

    // Construir la URL del redirect
    const redirectUrl = `${baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/r/${documentId}`

    // Generar QR como buffer
    const qrBuffer = await QRCode.toBuffer(redirectUrl, {
      type: 'png',
      width: 512,
      margin: 2,
      errorCorrectionLevel: 'M',
    })

    // Convertir buffer a blob
    const blob = new Blob([qrBuffer], { type: 'image/png' })

    // Subir a Sanity
    const asset = await writeClient.assets.upload('image', blob, {
      filename: `qr-${documentId}.png`,
    })

    // Actualizar el documento con el QR
    await writeClient
      .patch(documentId)
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

    return NextResponse.json({ success: true, assetId: asset._id })
  } catch (error) {
    console.error('Error generando QR:', error)
    return NextResponse.json(
      { error: 'Error generando QR', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
