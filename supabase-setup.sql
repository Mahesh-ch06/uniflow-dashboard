-- Run this SQL in your Supabase SQL Editor to create the batches table:

CREATE TABLE IF NOT EXISTS batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow public read access on batches"
  ON batches FOR SELECT
  USING (true);

-- Allow anonymous insert access (for the seed script)
CREATE POLICY "Allow public insert access on batches"
  ON batches FOR INSERT
  WITH CHECK (true);

-- Allow anonymous update access (optional, if upsert is needed)
CREATE POLICY "Allow public update access on batches"
  ON batches FOR UPDATE
  WITH CHECK (true);
