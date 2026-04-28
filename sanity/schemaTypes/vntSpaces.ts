import { defineType, defineField, defineArrayMember } from 'sanity'

export const vntSpaces = defineType({
  name: 'vntSpaces',
  title: 'VNT Spaces Section',
  type: 'document',
  fields: [
    defineField({
      name: 'coffeeBg',
      title: 'Coffee Gallery Background Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'conceptBg',
      title: 'Concept Store Background Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'coffeeLabel',
      title: 'Coffee Gallery Label',
      type: 'localeString',
    }),
    defineField({
      name: 'coffeeTitle',
      title: 'Coffee Gallery Title',
      type: 'localeString',
    }),
    defineField({
      name: 'coffeeDesc',
      title: 'Coffee Gallery Description',
      type: 'localeString',
    }),
    defineField({
      name: 'menuButtonText',
      title: 'View Menu Button Text',
      type: 'localeString',
    }),
    defineField({
      name: 'conceptLabel',
      title: 'Concept Store Label',
      type: 'localeString',
    }),
    defineField({
      name: 'conceptTitle',
      title: 'Concept Store Title',
      type: 'localeString',
    }),
    defineField({
      name: 'conceptDesc',
      title: 'Concept Store Description',
      type: 'localeString',
    }),
    defineField({
      name: 'menuTitle',
      title: 'Menu Title (e.g., VNT Coffee)',
      type: 'localeString',
    }),
    defineField({
      name: 'menuFooter',
      title: 'Menu Footer Text',
      type: 'localeString',
    }),
    defineField({
      name: 'menuSections',
      title: 'Menu Sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'menuSection',
          fields: [
            defineField({
              name: 'sectionName',
              title: 'Section Name',
              type: 'localeString',
            }),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'menuItem',
                  fields: [
                    defineField({ name: 'name', title: 'Item Name', type: 'localeString' }),
                    defineField({ name: 'description', title: 'Item Description', type: 'localeString' }),
                    defineField({ name: 'price', title: 'Price (EUR)', type: 'number' }),
                  ],
                  preview: {
                    select: {
                      title: 'name.en',
                      subtitle: 'price'
                    },
                    prepare(selection) {
                      const { title, subtitle } = selection
                      return {
                        title: title || 'Unnamed Item',
                        subtitle: `€${subtitle}`
                      }
                    }
                  }
                })
              ]
            })
          ],
          preview: {
            select: {
              title: 'sectionName.en'
            },
            prepare(selection) {
              const { title } = selection
              return { title: title || 'Unnamed Section' }
            }
          }
        })
      ]
    })
  ],
})