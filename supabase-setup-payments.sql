-- Add paid_amount to student_fees if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_fees' AND column_name='paid_amount') THEN
        ALTER TABLE public.student_fees ADD COLUMN paid_amount NUMERIC(10, 2) DEFAULT 0;
    END IF;
END
$$;

-- Create payments history table
CREATE TABLE IF NOT EXISTS public.student_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fee_id UUID NOT NULL REFERENCES public.student_fees(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'online',
    receipt_no TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.student_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all operations for public on student_payments" ON public.student_payments;
CREATE POLICY "Enable all operations for public on student_payments"
ON public.student_payments
FOR ALL USING (true);

-- Ensure status/remarks exist for payment verification workflows
ALTER TABLE public.student_payments ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'success';
ALTER TABLE public.student_payments ADD COLUMN IF NOT EXISTS remarks TEXT;

-- Backfill old re-verification requests where amount was saved as 0
WITH reverify_rows AS (
    SELECT
        rp.id,
        COALESCE((
            SELECT SUM(sp.amount)::NUMERIC(10, 2)
            FROM public.student_payments sp
            WHERE sp.student_id = rp.student_id
                AND sp.fee_id = rp.fee_id
                AND COALESCE(sp.status, 'success') = 'success'
                AND sp.created_at <= rp.created_at
        ), 0)::NUMERIC(10, 2) AS computed_amount
    FROM public.student_payments rp
    WHERE COALESCE(rp.status, '') = 'reverify_requested'
        AND COALESCE(rp.amount, 0) = 0
)
UPDATE public.student_payments target
SET amount = rr.computed_amount,
        remarks = COALESCE(
            NULLIF(target.remarks, ''),
            'Student requested re-verification.'
        )
FROM reverify_rows rr
WHERE target.id = rr.id;
