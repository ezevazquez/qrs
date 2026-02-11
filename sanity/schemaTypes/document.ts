import { defineField, defineType } from 'sanity'
import { QrCodeFieldInput } from './qrCodeField'

export default defineType({
  name: 'content',
  title: 'Documento',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contentType',
      title: 'Tipo de contenido',
      type: 'string',
      options: {
        list: [
          { title: 'Imagen', value: 'image' },
          { title: 'Audio', value: 'audio' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'image',
    }),
    // Campo condicional: Imagen
    defineField({
      name: 'imageFile',
      title: 'Imagen',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.contentType !== 'image',
    }),
    // Campo condicional: Audio
    defineField({
      name: 'audioFile',
      title: 'Audio',
      type: 'file',
      options: {
        accept: 'audio/*',
      },
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Título del audio',
        },
      ],
      hidden: ({ parent }) => parent?.contentType !== 'audio',
    }),
    // Campo condicional: Video
    defineField({
      name: 'videoFile',
      title: 'Video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Título del video',
        },
      ],
      hidden: ({ parent }) => parent?.contentType !== 'video',
    }),
    defineField({
      name: 'qrCode',
      title: 'Código QR',
      type: 'image',
      description: 'Haz click en "Generar QR" para crear el código',
      readOnly: true,
      components: {
        input: QrCodeFieldInput,
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      contentType: 'contentType',
      imageFile: 'imageFile',
      audioFile: 'audioFile',
      videoFile: 'videoFile',
    },
    prepare({ title, contentType, imageFile, audioFile, videoFile }) {
      let media
      if (contentType === 'image' && imageFile) {
        media = imageFile
      } else if (contentType === 'audio' && audioFile) {
        media = audioFile
      } else if (contentType === 'video' && videoFile) {
        media = videoFile
      }
      
      const typeLabels: Record<string, string> = {
        image: 'Imagen',
        audio: 'Audio',
        video: 'Video',
      }
      
      return {
        title: title || 'Sin título',
        subtitle: typeLabels[contentType] || 'Sin tipo',
        media,
      }
    },
  },
})
