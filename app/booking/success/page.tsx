import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { booking_id?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/signin');

  const { data: booking } = await supabase
    .from('bookings')
    .select(`*, therapy_slots(*)`)
    .eq('id', searchParams.booking_id || '')
    .single();

  const slot = booking?.therapy_slots as Record<string, unknown> | undefined;

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
        <p className="text-slate-500 mb-8">Your session has been booked. Dr. Saad will be in touch with the meeting details.</p>

        {slot && (
          <div className="card mb-6 text-left">
            <div className="text-sm font-medium text-teal-600 mb-1">Your Session</div>
            <div className="text-lg font-bold text-slate-900">
              {format(new Date(slot.starts_at as string), 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="text-slate-600">{format(new Date(slot.starts_at as string), 'h:mm a')} • {slot.duration_minutes as number} minutes</div>
            {slot.meeting_link && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-sm text-slate-500 mb-1">Meeting Link</div>
                <a href={slot.meeting_link as string} target="_blank" rel="noopener noreferrer"
                  className="text-teal-600 hover:underline text-sm font-medium">
                  Join Session
                </a>
              </div>
            )}
          </div>
        )}

        <Link href="/dashboard" className="btn-primary inline-block px-8">
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
