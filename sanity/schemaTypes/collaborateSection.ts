import { defineType, defineField, defineArrayMember } from 'sanity'

export const collaborateSection = defineType({
  name: 'collaborateSection',
  title: 'Collaborate Section',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'localeString',
    }),
    defineField({
      name: 'offers',
      title: 'Offers',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'offer',
          fields: [
            defineField({ name: 'title', title: 'Offer Title', type: 'localeString' }),
            defineField({ name: 'description', title: 'Offer Description', type: 'localeText' }),
          ],
          preview: {
            select: {
              title: 'title.en',
            },
            prepare(selection) {
              const { title } = selection
              return {
                title: title || 'Unnamed Offer',
              }
            }
          }
        })
      ]
    }),
    defineField({
      name: 'ctaTitle',
      title: 'Call to Action Title',
      type: 'localeString',
      description: 'Use Enter to create new lines where needed.'
    }),
    defineField({
      name: 'ctaDescription',
      title: 'Call to Action Description',
      type: 'localeText',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'Call to Action Button Text',
      type: 'localeString',
    }),
  ]
})
