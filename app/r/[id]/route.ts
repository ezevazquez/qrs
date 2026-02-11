import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
// Usar la versión de API más reciente si no está configurada
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

async function fetchFromSanity(query: string, params: Record<string, any>) {
  if (!SANITY_PROJECT_ID) {
    throw new Error('SANITY_PROJECT_ID no está configurado')
  }
  
  // Construir la query con parámetros reemplazados directamente
  let finalQuery = query
  Object.keys(params).forEach(key => {
    const value = JSON.stringify(params[key])
    finalQuery = finalQuery.replace(`$${key}`, value)
  })
  
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(finalQuery)}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Sanity API error: ${response.statusText} - ${errorText}`)
  }
  
  const data = await response.json()
  return data.result
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Limpiar el ID si viene con prefijo drafts.
    const cleanId = id.startsWith('drafts.') ? id.replace('drafts.', '') : id
    
    // Consultar documento en Sanity (solo documentos publicados)
    const query = `*[_id == $id && !(_id in path("drafts.**"))][0]{
      _id,
      title
    }`
    
    const document = await fetchFromSanity(query, { id: cleanId })

    if (!document) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      )
    }

    // Redirigir a la página pública del documento usando el ID
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (request.headers.get('host') 
        ? `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('host')}`
        : 'http://localhost:3000')
    const destination = `${baseUrl}/documentos/${cleanId}`

    // Redirect 302 (temporal) para permitir cambios futuros
    return NextResponse.redirect(destination, 302)
  } catch (error) {
    console.error('Error en redirect:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: errorMessage,
        projectId: SANITY_PROJECT_ID,
        dataset: SANITY_DATASET,
        apiVersion: SANITY_API_VERSION
      },
      { status: 500 }
    )
  }
}
