-- Run this SQL in your Supabase SQL Editor to create the courses table:

CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  department TEXT,
  credits INTEGER DEFAULT 3,
  faculty_id TEXT REFERENCES faculty(staff_id) ON DELETE SET NULL,
  faculty_name TEXT,
  semester TEXT,
  enrolled_students INTEGER DEFAULT 0,
  max_capacity INTEGER DEFAULT 60,
  schedule TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create policy (allow all for now)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for public on courses"
ON courses FOR ALL USING (true) WITH CHECK (true);

-- Insert demo data
INSERT INTO courses (code, name, department, credits, faculty_id, faculty_name, semester, enrolled_students, max_capacity, schedule)
VALUES
('CS301', 'Data Structures & Algorithms', 'Computer Science', 4, 'F001', 'Prof. James Anderson', 'Fall 2026', 45, 60, 'Mon/Wed 10:00 AM'),
('IT402', 'Web Development', 'Information Technology', 3, 'F002', 'Dr. Emily Chen', 'Fall 2026', 55, 60, 'Tue/Thu 2:00 PM'),
('CS405', 'Machine Learning', 'Computer Science', 3, 'F001', 'Prof. James Anderson', 'Fall 2026', 30, 40, 'Fri 1:00 PM')
ON CONFLICT (code) DO NOTHING;
