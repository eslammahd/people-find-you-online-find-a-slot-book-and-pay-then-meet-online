import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import BookingForm from '@/components/BookingForm';
import DashboardNav from '@/components/DashboardNav';
import { format } from 'date-fns';

export default async function BookSlotPage({ params }: { params: { slotId: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/signin');

  const { data: slot } = await supabase
    .from('therapy_slots')
    .select('*')
    .eq('id', params.slotId)
    .eq('status', 'available')
    .single();

  if (!slot) notFound();

  const isTherapist = user.user_metadata?.role === 'therapist' || user.email === process.env.THERAPIST_EMAIL;

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav user={user} isTherapist={isTherapist} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Book Your Session</h1>
          <p className="text-slate-500 mt-1">Review details and confirm your booking.</p>
        </div>

        <div className="card mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">Session Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-500">Date</div>
              <div className="font-medium text-slate-900">{format(new Date(slot.starts_at), 'EEEE, MMMM d, yyyy')}</div>
            </div>
            <div>
              <div className="text-slate-500">Time</div>
              <div className="font-medium text-slate-900">{format(new Date(slot.starts_at), 'h:mm a')}</div>
            </div>
            <div>
              <div className="text-slate-500">Duration</div>
              <div className="font-medium text-slate-900">{slot.duration_minutes} minutes</div>
            </div>
            <div>
              <div className="text-slate-500">Price</div>
              <div className="font-medium text-slate-900 text-xl">${(slot.price_cents / 100).toFixed(2)}</div>
            </div>
          </div>
          {slot.notes && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-slate-500 text-sm mb-1">Notes from Dr. Saad</div>
              <div className="text-slate-700 text-sm">{slot.notes}</div>
            </div>
          )}
        </div>

        <BookingForm slot={slot} user={user} />
      </main>
    </div>
  );
}
