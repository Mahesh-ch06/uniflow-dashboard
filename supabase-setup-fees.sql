-- Setup student fees table

-- Create an enum for fee types
CREATE TYPE fee_type AS ENUM ('semester', 'exam', 'fine', 'other');
CREATE TYPE fee_status AS ENUM ('paid', 'partial', 'unpaid');

CREATE TABLE IF NOT EXISTS public.student_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    fee_type fee_type NOT NULL DEFAULT 'other',
    amount NUMERIC(10, 2) NOT NULL,
    due_date DATE,
    status fee_status NOT NULL DEFAULT 'unpaid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.student_fees ENABLE ROW LEVEL SECURITY;

-- Allow everything for now (public dev mode)
CREATE POLICY "Enable all operations for public on student_fees"
ON public.student_fees 
FOR ALL 
USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_fees;
ALTER TABLE public.student_fees ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(10, 2) DEFAULT 0;
