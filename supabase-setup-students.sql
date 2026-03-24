-- Run this SQL in your Supabase SQL Editor to create the students table:

CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hall_ticket_no TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  batch_name TEXT REFERENCES batches(name) ON DELETE SET NULL,
  department TEXT,
  password TEXT NOT NULL DEFAULT 'UniManage@2026',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Allow everything for now (public dev mode)
CREATE POLICY "Enable all operations for public on students" 
ON students 
FOR ALL 
USING (true) 
WITH CHECK (true);
