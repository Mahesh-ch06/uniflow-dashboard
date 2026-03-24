-- Attendance leave/correction workflow setup
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS attendance_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('leave', 'correction')),
  subject TEXT,
  request_date DATE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_requests_student_id ON attendance_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_requests_status ON attendance_requests(status);
CREATE INDEX IF NOT EXISTS idx_attendance_requests_created_at ON attendance_requests(created_at DESC);

ALTER TABLE attendance_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'attendance_requests'
      AND policyname = 'Enable all operations for public on attendance_requests'
  ) THEN
    CREATE POLICY "Enable all operations for public on attendance_requests"
    ON attendance_requests FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
