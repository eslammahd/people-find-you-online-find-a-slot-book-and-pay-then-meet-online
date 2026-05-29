'use client';

import { useState } from 'react';
import type { TherapySlot } from '@/lib/types';
import type { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface Props {
  slot: TherapySlot;
  user: User;
}

export default function BookingForm({ slot, user }: Props) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: slot.id, notes }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Failed to initiate payment');
        setLoading(false);
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 className="font-semibold text-slate-800 mb-4">Your Information</h2>
      <form onSubmit={handleBook} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
          <input
            type="text"
            value={user.user_metadata?.full_name || ''}
            readOnly
            className="input-field bg-slate-50 text-slate-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input
            type="email"
            value={user.email || ''}
            readOnly
            className="input-field bg-slate-50 text-slate-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Notes for Dr. Saad <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Anything you'd like Dr. Saad to know before the session..."
            className="input-field resize-none"
          />
        </div>
        <div className="pt-2">
          <button type="submit" disabled={loading} className="btn-primary w-full text-base py-4">
            {loading ? 'Redirecting to payment…' : `Pay $${(slot.price_cents / 100).toFixed(2)} & Confirm Booking`}
          </button>
          <p className="text-xs text-slate-400 text-center mt-3">
            You'll be redirected to Stripe's secure checkout.
          </p>
        </div>
      </form>
    </div>
  );
}
