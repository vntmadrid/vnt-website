# VNT Madrid – Web Experience

The official website for **VNT Madrid**, a dynamic space combining a café, art gallery, event venue, and online shop. This full-stack application showcases contemporary art and culture while enabling e-commerce and event management with a seamless bilingual experience (English & Spanish).

## Overview

VNT Madrid evolved from a simple informational site into a comprehensive platform that:
- **Showcases spaces & content** – Art galleries, coffee experiences, collaboration opportunities, and team introductions  
- **Manages events** – Browse, filter, and book upcoming events and experiences
- **Operates an online shop** – Product catalog with real-time inventory managed in Sanity, integrated payment processing with Stripe
- **Handles logistics** – Live shipping rate calculations via Shippo (currently Spain-focused), order tracking via Stripe webhooks
- **Engages visitors** – Multi-language content, contact forms with Web3Forms, newsletter signups

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, React 19) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/), custom WebGL ([OGL](https://ogl.dev/)) |
| **Content/CMS** | [Sanity.io](https://www.sanity.io/) (headless CMS with embedded Studio) |
| **E-commerce** | [Stripe](https://stripe.com/) (payments & webhooks for inventory sync) |
| **Shipping** | [Shippo](https://goshippo.com/) (live rate calculations) |
| **Forms** | [Web3Forms](https://web3forms.com/) (contact form handling) |
| **Validation** | [Zod](https://zod.dev/) (runtime type validation) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) (cart store) |
| **Hosting** | [Vercel](https://vercel.com/) (with Analytics & Speed Insights) |

## Key Features

✨ **Multi-language Support** – Full English/Spanish content powered by Sanity locale fields  
🛍️ **Online Shop** – Product browsing with images, pricing, and real-time inventory  
📦 **Smart Inventory** – Stock decremented via Stripe webhook after successful payment  
🚚 **Live Shipping Rates** – Real-time rate calculations through Shippo API  
📅 **Event Management** – Browse and filter upcoming events with detailed information  
🎨 **Rich Content** – Portable Text fields for flexible content creation in Sanity  
📱 **Responsive Design** – Mobile-first approach with Tailwind CSS  
🔐 **Secure Payments** – PCI-compliant with Stripe integration and webhook verification  

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Access to a Sanity.io workspace (or create one at [sanity.io](https://www.sanity.io))
- Stripe account (test mode for development)
- Shippo account (optional for shipping calculation testing)
- Web3Forms API key (for contact forms)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd vnt-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the project root with the following variables:

   ```env
   # Sanity CMS
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2026-03-17
   SANITY_API_TOKEN=your_write_token

   # Stripe (get from https://dashboard.stripe.com/apikeys)
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # Shippo (get from https://goshippo.com/docs/reference/)
   SHIPPO_API_KEY=shippo_test_...

   # Web3Forms (get from https://web3forms.com/)
   NEXT_PUBLIC_WEB3FORMS_KEY=your_key

   # App configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser. The Sanity Studio is available at [http://localhost:3000/studio](http://localhost:3000/studio).

## Project Structure

```
vnt-website/
├── app/
│   ├── [lang]/                      # Dynamic language routing
│   │   ├── page.tsx                 # Home page
│   │   ├── events/                  # Event listing & detail pages
│   │   ├── shop/                    # Shop & product detail pages
│   │   └── layout.tsx               # Language-specific layout
│   ├── api/
│   │   ├── checkout/                # Stripe checkout session creation
│   │   ├── shipping-rates/          # Shippo rate calculation endpoint
│   │   └── webhook/stripe/          # Stripe webhook for inventory sync
│   ├── components/                  # Reusable React components
│   │   ├── home/                    # Home page sections
│   │   ├── events/                  # Event-related components
│   │   └── shop/                    # Shop & cart components
│   ├── lib/
│   │   ├── validation/              # Zod schemas (e.g., contact form)
│   │   └── hooks/                   # Custom React hooks
│   ├── studio/[[...tool]]/          # Sanity Studio embedded page
│   └── globals.css                  # Global Tailwind & custom styles
├── components/                      # Shared component library
│   └── shop/                        # Shop-specific components (cart drawer, etc.)
├── lib/
│   ├── store/                       # Zustand stores (cart state)
│   └── utils.ts                     # Utility functions
├── sanity/
│   ├── schemaTypes/                 # Document schemas (product, event, order, etc.)
│   ├── structure.ts                 # Sanity Studio custom structure
│   └── lib/
│       ├── client.ts                # Sanity client configuration
│       ├── image.ts                 # Image URL builder
│       └── live.ts                  # Live Preview configuration
├── public/                          # Static assets
├── sanity.config.ts                 # Sanity project configuration
├── next.config.ts                   # Next.js configuration
└── package.json                     # Dependencies & scripts
```

## API Routes

### `/api/checkout` (POST)
Creates a Stripe checkout session with:
- Cart items with prices from Sanity
- Shipping rates from Shippo (if applicable)
- Customer email and delivery address
- Language preference

**Request:**
```json
{
  "items": [{ "id": "product-id", "quantity": 2 }],
  "lang": "en",
  "shippoRate": { "amount": "15.00", "title": "Standard", "objectId": "rate-id" },
  "customerEmail": "customer@example.com",
  "address": { /* Shippo address object */ }
}
```

### `/api/shipping-rates` (POST)
Fetches real-time shipping rates from Shippo based on:
- Destination address
- Package weight/dimensions
- Carrier availability

### `/api/webhook/stripe` (POST)
Handles Stripe webhook events:
- `payment_intent.succeeded` – Decrements product stock in Sanity, creates order document
- Updates inventory atomically to prevent overselling

## Content Management

All content is managed through **Sanity Studio** at `/studio`. Key document types:

- **Product** – E-commerce items with pricing, inventory, images, descriptions (multi-language)
- **Event** – Event listings with dates, descriptions, capacity, images
- **Order** – Order records created by Stripe webhooks
- **introSection, vntSpaces, collaborateSection** – Homepage content sections
- **siteFooter** – Footer navigation & links

### Locale Support

Content supports both English and Spanish through:
- `localeString` – Locale-aware string fields
- `localeText` – Locale-aware rich text (Portable Text)

## Development

### Available Scripts

```bash
npm run dev           # Start local dev server (port 3000)
npm run build         # Build for production
npm run start         # Start production server (requires build first)
npm run lint          # Run ESLint
```

### Key Hooks & Utilities

- `useShippingRates()` – Fetch shipping rates from Shippo
- `useCartStore()` – Global cart state (add/remove items, quantities)
- `urlFor()` – Build Sanity image URLs with optimization

## Deployment

### Automatic Deployment via Vercel

- Pushes to `main` branch → automatically deploy to production
- Pushes to other branches (e.g., `development`) → generate preview URLs

### Environment Setup on Vercel

1. Go to your Vercel project settings
2. Add the same `.env.local` variables under **Settings → Environment Variables**
3. Trigger a redeployment

### Stripe Webhook Configuration

1. In [Stripe Dashboard](https://dashboard.stripe.com/webhooks), add endpoint:
   - URL: `https://your-domain.com/api/webhook/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Secret: Update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Sanity images not loading | Ensure `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct and images are on Sanity CDN |
| Checkout fails | Check Stripe keys are in test/live mode consistently; verify webhook secret |
| Shipping rates return 0 results | Confirm Shippo API key is active; ensure address format matches Shippo requirements |
| Inventory not decrementing | Check Stripe webhook is firing; verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard |
| Language not switching | Confirm locale parameter in URL (e.g., `/en/`, `/es/`); check Sanity locale field setup |

## Security Notes

- **Never commit** `.env.local` to version control
- Stripe webhook verification happens server-side to prevent tampering
- Sanity API token scoped to write-only for backend operations
- CORS configured to accept requests only from your domain

## Future Enhancements

- Adjust shippo to stop using "virtual" box sized so please correos's old system (causes issues with other carriers like fedex)
- Implement email notifications for orders via Resend or similar

## Contact

For questions or support, Contact original dev at [Nichita.dev](https://www.nichita.dev/)