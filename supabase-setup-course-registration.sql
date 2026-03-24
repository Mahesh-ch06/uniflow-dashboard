-- Add course_type to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_type TEXT DEFAULT 'mandatory' CHECK (course_type IN ('mandatory', 'elective'));

-- Create student_courses for registration and grades
CREATE TABLE IF NOT EXISTS student_courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(hall_ticket_no) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
  grade NUMERIC(4,2), -- for GPA calculation (e.g., 4.0 scale or 10.0 scale)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Enable RLS
ALTER TABLE student_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for public on student_courses"
ON student_courses FOR ALL USING (true) WITH CHECK (true);
