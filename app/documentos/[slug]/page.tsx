import { client } from '@/sanity/lib/client'
import { notFound } from 'next/navigation'
import Image from 'next/image'

interface DocumentPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getDocument(slug: string) {
  const document = await client.fetch(
    `*[_type == "content" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
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
      },
      publishedAt,
      qrCode,
      "qrCodeUrl": qrCode.asset->url
    }`,
    { slug }
  )

  return document
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { slug } = await params
  const document = await getDocument(slug)

  if (!document) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Mostrar imagen si el tipo es imagen */}
          {document.contentType === 'image' && document.imageFile?.asset?.url && (
            <div className="relative w-full h-96">
              <Image
                src={document.imageFile.asset.url}
                alt={document.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">{document.title}</h1>
            
            {document.publishedAt && (
              <p className="text-sm text-gray-500 mb-6">
                Publicado el:{' '}
                {new Date(document.publishedAt).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
            
            {/* Mostrar contenido según el tipo */}
            {document.contentType === 'image' && document.imageFile?.asset?.url && (
              <div className="my-8">
                <div className="relative w-full max-w-2xl mx-auto">
                  <Image
                    src={document.imageFile.asset.url}
                    alt={document.title}
                    width={1200}
                    height={800}
                    className="rounded-lg w-full h-auto"
                  />
                </div>
              </div>
            )}
            
            {document.contentType === 'audio' && document.audioFile?.asset?.url && (
              <div className="my-8">
                <div className="bg-gray-100 rounded-lg p-6">
                  {document.audioFile.title && (
                    <h2 className="text-xl font-semibold mb-4">{document.audioFile.title}</h2>
                  )}
                  <audio controls className="w-full">
                    <source src={document.audioFile.asset.url} />
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </div>
              </div>
            )}
            
            {document.contentType === 'video' && document.videoFile?.asset?.url && (
              <div className="my-8">
                <div className="bg-gray-100 rounded-lg p-6">
                  {document.videoFile.title && (
                    <h2 className="text-xl font-semibold mb-4">{document.videoFile.title}</h2>
                  )}
                  <video controls className="w-full rounded-lg">
                    <source src={document.videoFile.asset.url} />
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
              </div>
            )}
            
            {document.qrCodeUrl && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Código QR</h2>
                <div className="flex flex-col items-center">
                  <Image
                    src={document.qrCodeUrl}
                    alt="QR Code"
                    width={256}
                    height={256}
                    className="mb-4"
                  />
                  <a
                    href={document.qrCodeUrl}
                    download={`qr-${document._id}.png`}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Descargar QR
                  </a>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  )
}
