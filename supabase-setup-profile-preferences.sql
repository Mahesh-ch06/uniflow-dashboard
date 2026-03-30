-- Run this SQL in Supabase SQL Editor to store profile preferences in database

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_role TEXT NOT NULL CHECK (user_role IN ('student', 'faculty', 'admin')),
  email_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  attendance_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  marketing_updates BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, user_role)
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all operations for public on user_preferences" ON user_preferences;
CREATE POLICY "Enable all operations for public on user_preferences"
ON user_preferences
FOR ALL
USING (true)
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON user_preferences (user_role, user_id);

CREATE OR REPLACE FUNCTION set_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER trg_user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION set_user_preferences_updated_at();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'user_preferences'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_preferences;
  END IF;
END $$;
