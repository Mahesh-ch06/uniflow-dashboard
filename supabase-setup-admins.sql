-- Create admins table for Admin Portal Authentication
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS for the admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow public read access so Edge functions or client API can verify logins (Make sure you set better policies in production!)
CREATE POLICY "Allow public read access to admins"
    ON public.admins
    FOR SELECT
    USING (true);

-- Insert the primary admin user with the requested credentials
INSERT INTO public.admins (email, password, name)
VALUES ('chitikeshimahesh6@gmail.com', '@Mahesh06..', 'Mahesh Chitikeshi')
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password;