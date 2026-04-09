# VNT Madrid

The official website for VNT Madrid, featuring event spaces, coffee galleries, concept stores, and collaboration experiences.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **CMS (Headless):** [Sanity.io](https://www.sanity.io/)
- **Form Validation:** [Zod](https://zod.dev/)
- **Hosting:** [Vercel](https://vercel.com/)

## Getting Started

### 1. Environment Variables
To get the site running locally, you'll need the required environment variables connected to your Sanity.io workspace. Create a `.env.local` file in the root of the project with your specific Sanity project values:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
```

### 2. Installation & Development
Install the dependencies and start the local development server:

```bash
npm install
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` – Next.js App Router including pages, API routes, layout, and styling.
- `app/components/` – Reusable React components organized by page features (Home components, Event components, etc.)
- `app/api/` – Serverless routes. Includes a `talk-to-us` endpoint for form submissions.
- `app/studio/` – Embedded Sanity Studio running locally inside the Next.js app at `/studio`.
- `app/lib/` – Helper utilities and Zod validation schemas (`talkToUsSchema.ts`).
- `sanity/` – Everything related to Sanity CMS (client scripts, GROQ queries, document schemas, and Studio structure). 

## Available Scripts

- `npm run dev` - Start local development server.
- `npm run build` - Build the Next.js optimized production package.
- `npm run start` - Start production HTTP server locally outputted from the build.
- `npm run lint` - Run ESLint.

## Deployment

Pushes to the `main` branch are automatically deployed to production via Vercel. Pushes to other branches (like `development`) automatically generate preview URLs.