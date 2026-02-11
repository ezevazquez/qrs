'use client'

import { useState } from 'react'
import { useDocumentOperation, useFormValue } from 'sanity'
import { Stack, Card, Text, Button, Box } from '@sanity/ui'
import { DownloadIcon, RefreshIcon } from '@sanity/icons'

export function QrCodeFieldInput(props: any) {
  const [isGenerating, setIsGenerating] = useState(false)
  const qrCode = props.value
  const documentId = useFormValue(['_id']) as string
  const publishedId = useFormValue(['_id']) as string | undefined
  const { patch, publish } = useDocumentOperation(props.id || documentId, props.type)

  const handleGenerateQR = async () => {
    setIsGenerating(true)
    try {
      // Obtener el ID del documento - siempre usar el ID sin prefijo drafts.
      let docId = documentId || props.id || props.document?._id
      
      if (!docId) {
        alert('No se pudo obtener el ID del documento')
        setIsGenerating(false)
        return
      }

      // Siempre quitar el prefijo drafts. - el QR debe apuntar al documento publicado
      docId = docId.replace(/^drafts\./, '')

      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin.replace(':3333', ':3000')
        : 'http://localhost:3000'

      const response = await fetch(`${baseUrl}/api/generate-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: docId,
          baseUrl,
        }),
      })

      if (response.ok) {
        // Recargar el documento para mostrar el QR
        window.location.reload()
      } else {
        const error = await response.json()
        console.error('Error generando QR:', error)
        alert('Error al generar el QR. Revisa la consola.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al generar el QR')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      
      {!qrCode && (
        <Card padding={3} radius={2} tone="caution">
          <Stack space={3}>
            <Text size={1} weight="semibold">
              QR no generado
            </Text>
            <Text size={1}>
              Haz click en el botón para generar el código QR automáticamente.
            </Text>
            <Button
              onClick={handleGenerateQR}
              disabled={isGenerating}
              icon={RefreshIcon}
              text={isGenerating ? 'Generando...' : 'Generar QR'}
              tone="primary"
            />
          </Stack>
        </Card>
      )}
      
      {qrCode?.asset && (
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Código QR generado
            </Text>
            <Box>
              <img
                src={`${qrCode.asset.url}?w=300`}
                alt="QR Code"
                style={{ maxWidth: '300px', height: 'auto', display: 'block' }}
              />
            </Box>
            <Stack space={2}>
            <Button
              as="a"
              href={qrCode.asset.url}
              download={`qr-${documentId || 'document'}.png`}
              icon={DownloadIcon}
              text="Descargar QR"
              tone="primary"
            />
              <Button
                onClick={handleGenerateQR}
                disabled={isGenerating}
                icon={RefreshIcon}
                text={isGenerating ? 'Regenerando...' : 'Regenerar QR'}
                tone="default"
              />
            </Stack>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
