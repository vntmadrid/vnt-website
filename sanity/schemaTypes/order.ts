import { defineType, defineField } from 'sanity'

export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Ready for Pickup', value: 'ready_for_pickup' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customer',
      title: 'Customer',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', title: 'Name' },
        { name: 'email', type: 'string', title: 'Email' },
      ],
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'orderItem',
          fields: [
            { name: 'product', type: 'reference', to: [{ type: 'product' }] },
            { name: 'quantity', type: 'number' },
            { name: 'priceAtPurchase', type: 'number', title: 'Price at Purchase' },
          ],
          preview: {
            select: {
              title: 'product.title.en',
              quantity: 'quantity',
              images: 'product.images',
            },
            prepare({ title, quantity, images }) {
              return {
                title: title || 'Unknown Product',
                subtitle: `Qty: ${quantity}`,
                media: images && images[0],
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
    }),
    defineField({
      name: 'deliveryMethod',
      title: 'Delivery Method',
      type: 'string',
      options: {
        list: [
          { title: 'Pickup', value: 'pickup' },
          { title: 'Shipping', value: 'shipping' },
        ],
      },
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      hidden: ({ parent }) => parent?.deliveryMethod !== 'shipping',
      fields: [
        { name: 'line1', type: 'string' },
        { name: 'line2', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'postal_code', type: 'string' },
        { name: 'country', type: 'string' },
      ],
    }),
    defineField({
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      orderNumber: 'orderNumber',
      customerName: 'customer.name',
      status: 'status',
      total: 'totalAmount',
      images: 'items.0.product.images',
    },
    prepare({ orderNumber, customerName, status, total, images }) {
      return {
        title: `${orderNumber} - ${customerName}`,
        subtitle: `${status.toUpperCase()} | €${(total / 100).toFixed(2)}`,
        media: images && images[0],
      }
    },
  },
})
