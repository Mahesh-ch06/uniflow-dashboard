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
  course_type TEXT DEFAULT 'mandatory' CHECK (course_type IN ('mandatory', 'elective')),
  enrolled_students INTEGER DEFAULT 0,
  max_capacity INTEGER DEFAULT 60,
  schedule TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_type TEXT DEFAULT 'mandatory' CHECK (course_type IN ('mandatory', 'elective'));

-- Enable RLS and create policy (allow all for now)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'courses'
      AND policyname = 'Enable all operations for public on courses'
  ) THEN
    CREATE POLICY "Enable all operations for public on courses"
    ON courses FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Registration table used by Student Dashboard and Course Registration page
CREATE TABLE IF NOT EXISTS student_courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(hall_ticket_no) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
  grade NUMERIC(4,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

ALTER TABLE student_courses ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'student_courses'
      AND policyname = 'Enable all operations for public on student_courses'
  ) THEN
    CREATE POLICY "Enable all operations for public on student_courses"
    ON student_courses FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_student_courses_student_id ON student_courses(student_id);
CREATE INDEX IF NOT EXISTS idx_student_courses_course_id ON student_courses(course_id);

-- RPC used when a student registers for a course
CREATE OR REPLACE FUNCTION increment_course_enrollment(c_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE courses
  SET enrolled_students = COALESCE(enrolled_students, 0) + 1
  WHERE id = c_id;
END;
$$;

-- Insert demo data
INSERT INTO courses (code, name, department, credits, faculty_id, faculty_name, semester, course_type, enrolled_students, max_capacity, schedule)
VALUES
('CS301', 'Data Structures & Algorithms', 'Computer Science', 4, 'F001', 'Prof. James Anderson', 'Fall 2026', 'mandatory', 45, 60, 'Mon/Wed 10:00 AM'),
('IT402', 'Web Development', 'Information Technology', 3, 'F002', 'Dr. Emily Chen', 'Fall 2026', 'elective', 55, 60, 'Tue/Thu 2:00 PM'),
('CS405', 'Machine Learning', 'Computer Science', 3, 'F001', 'Prof. James Anderson', 'Fall 2026', 'elective', 30, 40, 'Fri 1:00 PM')
ON CONFLICT (code) DO NOTHING;
