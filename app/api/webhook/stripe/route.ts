import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { writeClient } from '@/sanity/lib/client';

export const runtime = 'nodejs';

type PurchasedItem = {
  id: string;
  quantity: number;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_value', {
  apiVersion: '2026-04-22.dahlia' as any,
});

function parseCompactPurchase(value: string | undefined): PurchasedItem[] {
  if (!value) return [];

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [id, qty] = entry.split(':');
      const quantity = Number.parseInt(qty, 10);
      return { id, quantity };
    })
    .filter((item) => item.id && Number.isInteger(item.quantity) && item.quantity > 0);
}

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { message: 'Missing Stripe webhook signature or secret' },
      { status: 400 }
    );
  }

  const payload = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid webhook signature';
    return NextResponse.json({ message }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const purchasedItems = parseCompactPurchase(session.metadata?.p);

  if (purchasedItems.length === 0) {
    return NextResponse.json(
      { message: 'No purchased items metadata found for session' },
      { status: 400 }
    );
  }

  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json(
      { message: 'Missing SANITY_API_TOKEN for stock update' },
      { status: 500 }
    );
  }

  try {
    const transaction = writeClient.transaction();

    for (const item of purchasedItems) {
      transaction.patch(item.id, {
        dec: { stock: item.quantity },
      });
    }

    await transaction.commit();

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Stock update failed';
    return NextResponse.json({ message }, { status: 500 });
  }
}
