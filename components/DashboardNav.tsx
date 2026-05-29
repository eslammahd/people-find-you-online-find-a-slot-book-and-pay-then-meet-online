'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface Props {
  user: User;
  isTherapist: boolean;
}

export default function DashboardNav({ user, isTherapist }: Props) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <div>
            <span className="font-semibold text-slate-800">Dr. Saad Al Ghanam</span>
            {isTherapist && (
              <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                Therapist
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden sm:block">
            {user.user_metadata?.full_name || user.email}
          </span>
          <button onClick={handleSignOut} className="btn-secondary text-sm px-4 py-2">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
