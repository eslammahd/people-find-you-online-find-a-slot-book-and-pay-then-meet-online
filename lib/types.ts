export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: 'patient' | 'therapist';
  created_at: string;
}

export interface TherapySlot {
  id: string;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  price_cents: number;
  currency: string;
  status: 'available' | 'booked' | 'archived';
  meeting_link: string | null;
  notes: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  slot_id: string;
  patient_id: string;
  patient_name: string | null;
  patient_email: string | null;
  status: 'pending' | 'paid' | 'cancelled' | 'completed';
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  patient_notes: string | null;
  created_at: string;
  therapy_slots?: TherapySlot;
}
