import { defineType, defineField } from 'sanity'

export const introSection = defineType({
  name: 'introSection',
  title: 'Intro Section',
  type: 'document',
  fields: [
    defineField({
      name: 'leftTitle',
      title: 'Left Section Title',
      type: 'localeString',
    }),
    defineField({
      name: 'leftBody',
      title: 'left Section body',
      type: 'localeString',
    }),
    defineField({
      name: 'rightTitle',
      title: 'Right Section Title',
      type: 'localeString',
    }),
    defineField({
      name: 'rightBody',
      title: 'Right Section body',
      type: 'localeString',
    }),
    defineField({
      name: 'mobileTitle',
      title: 'Mobile Heading',
      description: 'Used on mobile instead of desktop titles',
      type: 'localeString',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'background Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'featuredImage',
      title: 'featured Image',
      type: 'image',
      options: { hotspot: true }
    }),
  ],
})
