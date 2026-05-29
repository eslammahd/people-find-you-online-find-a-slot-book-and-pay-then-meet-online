import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';
import PatientDashboard from '@/components/PatientDashboard';
import TherapistDashboard from '@/components/TherapistDashboard';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/signin');

  const isTherapist = user.user_metadata?.role === 'therapist' ||
    user.email === process.env.THERAPIST_EMAIL;

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav user={user} isTherapist={isTherapist} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {isTherapist ? <TherapistDashboard /> : <PatientDashboard />}
      </main>
    </div>
  );
}
