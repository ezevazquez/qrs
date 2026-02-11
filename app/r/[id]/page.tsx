import { client } from '@/sanity/lib/client'
import { notFound } from 'next/navigation'

interface ContentPageProps {
  params: Promise<{
    id: string
  }>
}

async function getDocument(id: string) {
  // Limpiar el ID si viene con prefijo drafts.
  const cleanId = id.startsWith('drafts.') ? id.replace('drafts.', '') : id
  
  const document = await client.fetch(
    `*[_type == "content" && _id == $id && !(_id in path("drafts.**"))][0]{
      _id,
      title,
      contentType,
      imageFile{
        asset->{
          url,
          _id
        }
      },
      audioFile{
        asset->{
          url,
          _id
        },
        title
      },
      videoFile{
        asset->{
          url,
          _id
        },
        title
      }
    }`,
    { id: cleanId }
  )

  return document
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { id } = await params
  const document = await getDocument(id)

  if (!document) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Mostrar contenido según el tipo */}
        {document.contentType === 'image' && document.imageFile?.asset?.url && (
          <div className="w-full">
            <img
              src={document.imageFile.asset.url}
              alt={document.title || 'Imagen'}
              className="w-full h-auto"
            />
          </div>
        )}
        
        {document.contentType === 'audio' && document.audioFile?.asset?.url && (
          <div className="w-full">
            <audio controls className="w-full">
              <source src={document.audioFile.asset.url} />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}
        
        {document.contentType === 'video' && document.videoFile?.asset?.url && (
          <div className="w-full">
            <video controls className="w-full">
              <source src={document.videoFile.asset.url} />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        )}
      </div>
    </main>
  )
}
