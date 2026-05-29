-- Run this in your Supabase SQL editor
-- Schema: user_32b62920

SET search_path TO "user_32b62920", public;

-- Profiles
CREATE TABLE IF NOT EXISTS "user_32b62920".profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'patient',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Therapy slots
CREATE TABLE IF NOT EXISTS "user_32b62920".therapy_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'available',
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS "user_32b62920".bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES "user_32b62920".therapy_slots(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL,
  patient_name TEXT,
  patient_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  patient_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_therapy_slots_status ON "user_32b62920".therapy_slots(status);
CREATE INDEX IF NOT EXISTS idx_therapy_slots_starts_at ON "user_32b62920".therapy_slots(starts_at);
CREATE INDEX IF NOT EXISTS idx_bookings_patient ON "user_32b62920".bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_bookings_slot ON "user_32b62920".bookings(slot_id);
