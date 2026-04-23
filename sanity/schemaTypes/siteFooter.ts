import { defineType, defineField } from 'sanity'

export const siteFooter = defineType({
  name: 'siteFooter',
  title: 'Site Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Footer Logo',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'locationLabel',
      title: 'Location Label',
      type: 'localeString',
    }),
    defineField({
      name: 'locationText',
      title: 'Location Address',
      type: 'localeString',
    }),
    defineField({
      name: 'locationLink',
      title: 'Location Google Maps Link',
      type: 'url',
    }),
    defineField({
      name: 'hoursLabel',
      title: 'Hours Label',
      type: 'localeString',
    }),
    defineField({
      name: 'hoursText',
      title: 'Hours Text',
      type: 'localeString',
    }),
    defineField({
      name: 'emailLabel',
      title: 'Email Label',
      type: 'localeString',
    }),
    defineField({
      name: 'emailText',
      title: 'Contact Email',
      type: 'string',
    })
  ]
})