-- Run this SQL in your Supabase SQL Editor to create the faculty table:

CREATE TABLE IF NOT EXISTS faculty (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT,
  phone TEXT,
  password TEXT NOT NULL DEFAULT 'UniManage@2026',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

-- Allow everything for now (public dev mode)
CREATE POLICY "Enable all operations for public on faculty" 
ON faculty 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Insert a demo faculty member
INSERT INTO faculty (staff_id, name, email, department, phone, password)
VALUES (
  'F001', 
  'Prof. James Anderson', 
  'j.anderson@university.edu', 
  'Computer Science', 
  '+1-555-0201', 
  'faculty123'
) ON CONFLICT (staff_id) DO NOTHING;

INSERT INTO faculty (staff_id, name, email, department, phone, password)
VALUES (
  'F002', 
  'Dr. Emily Chen', 
  'e.chen@university.edu', 
  'Information Technology', 
  '+1-555-0202', 
  'faculty123'
) ON CONFLICT (staff_id) DO NOTHING;