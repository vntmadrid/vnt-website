import { defineType, defineField } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Product Description',
      type: 'localeText', // Typically products need localized text. If not, use 'text'. Since title is localeString, let's try localeText or text. Let's see if localeText exists. wait
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (€)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).integer(),
      description: 'Number of items available. Set to 0 when sold out.',
    }),
    defineField({
      name: 'image',
      title: 'Legacy Image',
      type: 'image',
      hidden: true, // Hides it from the UI but stops "Unknown field" errors for old products
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'stripePriceId',
      title: 'Stripe Price ID',
      type: 'string',
      description: 'Optional: The Price ID from your Stripe Dashboard (starts with price_)',
    }),
  ],
  preview: {
    select: {
      titleEn: 'title.en',
      titleEs: 'title.es',
      images: 'images',
      price: 'price',
      stock: 'stock',
    },
    prepare(selection) {
      const { titleEn, titleEs, images, price, stock } = selection
      return {
        title: titleEn || titleEs || 'Untitled Product',
        subtitle: `€${price} (${stock} in stock)`,
        media: images && images[0],
      }
    }
  }
})
