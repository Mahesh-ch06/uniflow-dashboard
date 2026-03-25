-- Run this logic in your Supabase SQL editor to support assigning batches to faculty
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS assigned_batches TEXT[] DEFAULT '{}';
