import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { urlFor } from '@/sanity/lib/image';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_value', {
  apiVersion: '2026-04-22.dahlia' as any, // bypassing strict version checks since the version just released.
});

// Calculate total cart value simply based on provided prices. In a real-world scenario
// we'd probably re-fetch prices from Sanity or Stripe inside this endpoint to prevent tampering.
export async function POST(req: Request) {
  try {
    const { items, lang } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: 'Cart is empty' },
        { status: 400 }
      );
    }

    const host = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

    const lineItems = items.map((item: any) => {
      // If we have a Pre-created Stripe Price ID in Sanity schema
      if (item.stripePriceId) {
        return {
          price: item.stripePriceId,
          quantity: item.quantity,
        };
      }

      // Fallback: Dynamically generate price data if no ID provided in Sanity CMS
      const imageUrl = item.image ? urlFor(item.image).url() : undefined;
      const title = item.title[lang] || item.title.en || 'VNT Product';

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: title,
            images: imageUrl ? [imageUrl] : undefined,
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${host}/${lang}/shop?success=true`,
      cancel_url: `${host}/${lang}/shop?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ['ES', 'PT', 'FR', 'IT', 'DE', 'NL'], // Example
      },
    });

    if (!session.id) {
       throw new Error('Could not create Stripe session');
    }

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
    
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
