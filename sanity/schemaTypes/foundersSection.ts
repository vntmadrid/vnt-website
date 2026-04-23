import { defineType, defineField, defineArrayMember } from 'sanity'

export const foundersSection = defineType({
  name: 'foundersSection',
  title: 'Founders Section',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'localeString',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'foundersImage',
      title: 'Founders Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'founders',
      title: 'Founders',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'founder',
          fields: [
            defineField({ name: 'name', title: 'Founder Name', type: 'string' }),
            defineField({ name: 'description', title: 'Founder Description', type: 'localeText' }),
          ],
          preview: {
            select: {
              title: 'name',
            }
          }
        })
      ]
    })
  ]
})