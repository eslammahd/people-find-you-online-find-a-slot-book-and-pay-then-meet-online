'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import type { TherapySlot } from '@/lib/types';
import toast from 'react-hot-toast';

type SlotForm = {
  starts_at: string;
  duration_minutes: number;
  price_cents: number;
  meeting_link: string;
  notes: string;
};

const emptyForm: SlotForm = {
  starts_at: '',
  duration_minutes: 60,
  price_cents: 10000,
  meeting_link: '',
  notes: '',
};

export default function TherapistDashboard() {
  const [slots, setSlots] = useState<TherapySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<SlotForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'upcoming' | 'booked'>('upcoming');

  async function loadSlots() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('therapy_slots')
      .select(`*, bookings(*)`)
      .order('starts_at', { ascending: true });
    setSlots(data || []);
    setLoading(false);
  }

  useEffect(() => { loadSlots(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const ends_at = new Date(new Date(form.starts_at).getTime() + form.duration_minutes * 60000).toISOString();
    const { error } = await supabase.from('therapy_slots').insert({
      starts_at: new Date(form.starts_at).toISOString(),
      ends_at,
      duration_minutes: form.duration_minutes,
      price_cents: form.price_cents,
      meeting_link: form.meeting_link || null,
      notes: form.notes || null,
      status: 'available',
    });
    if (error) {
      toast.error('Failed to create slot: ' + error.message);
    } else {
      toast.success('Slot created!');
      setForm(emptyForm);
      setShowForm(false);
      loadSlots();
    }
    setSaving(false);
  }

  async function handleArchive(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('therapy_slots')
      .update({ status: 'archived' })
      .eq('id', id);
    if (error) toast.error('Failed to archive slot');
    else { toast.success('Slot archived'); loadSlots(); }
  }

  const upcoming = slots.filter(s => s.status === 'available');
  const booked = slots.filter(s => s.status === 'booked');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Slots</h1>
          <p className="text-slate-500 mt-1">Manage your available therapy sessions.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ New Slot'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">Create New Slot</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date &amp; Time</label>
              <input
                type="datetime-local"
                required
                value={form.starts_at}
                onChange={e => setForm({ ...form, starts_at: e.target.value })}
                className="input-field"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration (minutes)</label>
              <select
                value={form.duration_minutes}
                onChange={e => setForm({ ...form, duration_minutes: +e.target.value })}
                className="input-field"
              >
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.price_cents / 100}
                  onChange={e => setForm({ ...form, price_cents: Math.round(+e.target.value * 100) })}
                  className="input-field pl-7"
                  placeholder="100"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Video Meeting Link</label>
              <input
                type="url"
                value={form.meeting_link}
                onChange={e => setForm({ ...form, meeting_link: e.target.value })}
                placeholder="https://zoom.us/j/..."
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={2}
                placeholder="Any notes for this session..."
                className="input-field resize-none"
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Creating…' : 'Create Slot'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 w-fit">
        {(['upcoming', 'booked'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t} ({t === 'upcoming' ? upcoming.length : booked.length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(tab === 'upcoming' ? upcoming : booked).map(slot => (
            <div key={slot.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-teal-600">
                    {format(new Date(slot.starts_at), 'EEE, MMM d yyyy')}
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    {format(new Date(slot.starts_at), 'h:mm a')}
                  </div>
                  <div className="text-sm text-slate-500">{slot.duration_minutes} min</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-900">${(slot.price_cents / 100).toFixed(0)}</div>
                  <div className={`text-xs mt-1 px-2 py-0.5 rounded-full font-medium ${
                    slot.status === 'available' ? 'bg-green-100 text-green-700' :
                    slot.status === 'booked' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {slot.status}
                  </div>
                </div>
              </div>
              {slot.notes && <p className="text-sm text-slate-500 mb-3">{slot.notes}</p>}
              {slot.meeting_link && (
                <a href={slot.meeting_link} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-teal-600 hover:underline mb-3 block truncate">
                  Meeting link
                </a>
              )}
              {slot.status === 'available' && (
                <button
                  onClick={() => handleArchive(slot.id)}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors mt-1"
                >
                  Archive slot
                </button>
              )}
            </div>
          ))}
          {(tab === 'upcoming' ? upcoming : booked).length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 card text-center py-12">
              <p className="text-slate-500">No {tab} slots.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
