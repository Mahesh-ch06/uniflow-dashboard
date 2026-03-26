-- Run this SQL in Supabase SQL Editor to enable realtime app notifications

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'urgent')),
  target_role TEXT NOT NULL DEFAULT 'student' CHECK (target_role IN ('student', 'faculty', 'all')),
  target_scope TEXT NOT NULL DEFAULT 'all' CHECK (target_scope IN ('all', 'selected')),
  recipient_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_by TEXT,
  created_by_name TEXT,
  created_by_role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT notifications_selected_requires_recipients CHECK (
    target_scope = 'all' OR COALESCE(array_length(recipient_ids, 1), 0) > 0
  )
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all operations for public on notifications" ON notifications;
CREATE POLICY "Enable all operations for public on notifications"
ON notifications
FOR ALL
USING (true)
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_target_role_scope ON notifications (target_role, target_scope);

CREATE TABLE IF NOT EXISTS notification_user_states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  user_role TEXT NOT NULL CHECK (user_role IN ('student', 'faculty', 'admin')),
  user_id TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  is_opened BOOLEAN NOT NULL DEFAULT FALSE,
  is_important BOOLEAN NOT NULL DEFAULT FALSE,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  opened_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(notification_id, user_role, user_id)
);

ALTER TABLE notification_user_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all operations for public on notification_user_states" ON notification_user_states;
CREATE POLICY "Enable all operations for public on notification_user_states"
ON notification_user_states
FOR ALL
USING (true)
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_notification_user_states_user ON notification_user_states (user_role, user_id);
CREATE INDEX IF NOT EXISTS idx_notification_user_states_notification ON notification_user_states (notification_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'notification_user_states'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notification_user_states;
  END IF;
END $$;
