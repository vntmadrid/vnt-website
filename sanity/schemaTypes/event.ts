import { defineType, defineField } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'localeString',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'coverPhoto',
      title: 'Cover Photo (Used for cards and hero)',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'description',
      title: 'Main Description',
      type: 'localeText',
    }),
    defineField({
      name: 'artist',
      title: 'Artist Information',
      type: 'object',
      fields: [
        defineField({ name: 'name', title: 'Artist Name', type: 'string' }),
        defineField({ name: 'description', title: 'Artist Description', type: 'localeText' }),
        defineField({ name: 'siteHref', title: 'Artist Website', type: 'string' }),
      ]
    }),
    defineField({
      name: 'typeInfo',
      title: 'Type Information',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Type Title (e.g. Design Selection)', type: 'localeString' }),
        defineField({ name: 'description', title: 'Type Description', type: 'localeText' }),
      ]
    }),
    defineField({
      name: 'space',
      title: 'Space Information',
      type: 'string',
      options: {
        list: [
          { title: 'VNT Coffee_Gallery', value: 'VNT Coffee_Gallery' },
          { title: 'VNT Events_Space', value: 'VNT Events_Space' }
        ]
      }
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images (3 images, Order based on importance)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }]
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      media: 'coverPhoto',
    },
    prepare(selection) {
      const { title, media } = selection
      return {
        title: title || 'Untitled Event',
        media
      }
    }
  }
})
