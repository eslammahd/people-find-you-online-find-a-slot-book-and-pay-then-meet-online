import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="font-semibold text-slate-800">Dr. Saad Al Ghanam</span>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/signin" className="btn-secondary text-sm px-4 py-2">
            Sign In
          </Link>
          <Link href="/auth/signup" className="btn-primary text-sm px-4 py-2">
            Book a Session
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-4 py-2 text-teal-700 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          Online therapy sessions available
        </div>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
          Therapy that fits
          <span className="text-teal-600"> your life</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Book a session with Dr. Saad Al Ghanam, MD. View available slots, book online, pay securely, and meet via video — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup" className="btn-primary text-base px-8 py-4">
            Book Your First Session
          </Link>
          <Link href="/auth/signin" className="btn-secondary text-base px-8 py-4">
            Already have an account?
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Find a slot', desc: 'Browse available therapy sessions that fit your schedule.' },
            { step: '02', title: 'Book & pay', desc: 'Reserve your slot and pay securely online via Stripe.' },
            { step: '03', title: 'Meet online', desc: 'Receive a video link and meet Dr. Saad at the scheduled time.' },
          ].map((item) => (
            <div key={item.step} className="card">
              <div className="text-4xl font-bold text-teal-100 mb-3">{item.step}</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="card text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">SG</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Dr. Saad Al Ghanam, MD</h2>
          <p className="text-teal-600 font-medium mb-4">Licensed Therapist &amp; Psychiatrist</p>
          <p className="text-slate-500 leading-relaxed">
            Providing compassionate, evidence-based therapy to help you navigate life's challenges.
            Sessions are conducted online, making quality mental healthcare accessible wherever you are.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-400 text-sm">
        © {new Date().getFullYear()} Dr. Saad Al Ghanam Therapy. All rights reserved.
      </footer>
    </main>
  );
}
