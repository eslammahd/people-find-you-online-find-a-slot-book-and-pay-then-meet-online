import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { format } from 'date-fns';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { slotId, notes } = await request.json();
    if (!slotId) return NextResponse.json({ error: 'Missing slotId' }, { status: 400 });

    const { data: slot, error: slotError } = await supabase
      .from('therapy_slots')
      .select('*')
      .eq('id', slotId)
      .eq('status', 'available')
      .single();

    if (slotError || !slot) {
      return NextResponse.json({ error: 'Slot not available' }, { status: 404 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Create a pending booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        slot_id: slotId,
        patient_id: user.id,
        patient_name: user.user_metadata?.full_name || '',
        patient_email: user.email || '',
        patient_notes: notes || null,
        status: 'pending',
      })
      .select()
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }

    const sessionDate = format(new Date(slot.starts_at), 'EEEE, MMMM d yyyy \u2022 h:mm a');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: slot.currency || 'usd',
          product_data: {
            name: `Therapy Session — Dr. Saad Al Ghanam`,
            description: sessionDate,
          },
          unit_amount: slot.price_cents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: user.email || undefined,
      metadata: {
        booking_id: booking.id,
        slot_id: slotId,
        patient_id: user.id,
      },
      success_url: `${origin}/booking/success?booking_id=${booking.id}`,
      cancel_url: `${origin}/book/${slotId}`,
    });

    // Save stripe session id
    await supabase
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
