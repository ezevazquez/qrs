import { client } from '@/sanity/lib/client'
import { notFound } from 'next/navigation'
import ContentViewer from './content-viewer'

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
      hasCode,
      code,
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

  return <ContentViewer document={document} />
}
