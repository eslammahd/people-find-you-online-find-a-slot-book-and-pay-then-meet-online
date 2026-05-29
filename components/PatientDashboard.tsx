'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import type { TherapySlot } from '@/lib/types';
import Link from 'next/link';

export default function PatientDashboard() {
  const [slots, setSlots] = useState<TherapySlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('therapy_slots')
        .select('*')
        .eq('status', 'available')
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
        .limit(20);
      setSlots(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Available Sessions</h1>
        <p className="text-slate-500 mt-1">Choose a slot that works for you and book it online.</p>
      </div>

      {slots.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No slots available right now</h3>
          <p className="text-slate-500">Check back soon — new slots are added regularly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map((slot) => (
            <div key={slot.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm font-medium text-teal-600 mb-1">
                    {format(new Date(slot.starts_at), 'EEEE, MMM d')}
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    {format(new Date(slot.starts_at), 'h:mm a')}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {slot.duration_minutes} min session
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">
                    ${(slot.price_cents / 100).toFixed(0)}
                  </div>
                  <div className="text-xs text-slate-400">{slot.currency.toUpperCase()}</div>
                </div>
              </div>
              {slot.notes && (
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{slot.notes}</p>
              )}
              <Link
                href={`/book/${slot.id}`}
                className="btn-primary w-full block text-center text-sm py-2.5"
              >
                Book This Slot
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
