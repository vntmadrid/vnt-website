import { defineType, defineField } from 'sanity'

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 5
    }),
    defineField({
      name: 'es',
      title: 'Spanish',
      type: 'text',
      rows: 5
    }),
  ],
})
