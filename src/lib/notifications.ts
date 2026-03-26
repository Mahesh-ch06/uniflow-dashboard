import type { UserRole } from "@/lib/mock-data";

export type NotificationType = "info" | "warning" | "success" | "urgent";
export type NotificationTargetRole = "student" | "faculty" | "all";
export type NotificationTargetScope = "all" | "selected";

export interface NotificationRow {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  target_role: NotificationTargetRole;
  target_scope: NotificationTargetScope;
  recipient_ids: string[] | null;
  created_by: string | null;
  created_by_name: string | null;
  created_by_role: UserRole | "system" | null;
  created_at: string;
}

export interface NotificationUserStateRow {
  id: string;
  notification_id: string;
  user_role: UserRole;
  user_id: string;
  is_read: boolean;
  is_opened: boolean;
  is_important: boolean;
  is_pinned: boolean;
  opened_at: string | null;
  read_at: string | null;
  updated_at: string;
}

export interface NotificationViewRow extends NotificationRow {
  is_read: boolean;
  is_opened: boolean;
  is_important: boolean;
  is_pinned: boolean;
}

export const isNotificationsTableMissing = (errorCode?: string) => {
  return errorCode === "PGRST205" || errorCode === "42P01";
};

export const isNotificationStatesTableMissing = (errorCode?: string) => {
  return errorCode === "PGRST205" || errorCode === "42P01";
};

const normalize = (value: string | null | undefined) => String(value || "").trim().toLowerCase();

export const normalizeRecipientIds = (recipientIds: unknown): string[] => {
  if (Array.isArray(recipientIds)) {
    return recipientIds.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof recipientIds === "string") {
    const trimmed = recipientIds.trim();
    if (!trimmed) return [];
    return [trimmed];
  }

  return [];
};

export const isNotificationForUser = (
  notification: Pick<NotificationRow, "target_role" | "target_scope" | "recipient_ids">,
  role: UserRole,
  userId: string,
) => {
  if (!userId) return false;

  if (notification.target_role !== "all" && notification.target_role !== role) {
    return false;
  }

  if (notification.target_scope === "all") {
    return true;
  }

  const normalizedUserId = normalize(userId);
  const recipients = normalizeRecipientIds(notification.recipient_ids).map((item) => normalize(item));
  return recipients.includes(normalizedUserId);
};

export const formatNotificationDateTime = (createdAt: string) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const notificationTargetLabel = (
  targetRole: NotificationTargetRole,
  targetScope: NotificationTargetScope,
) => {
  if (targetRole === "all") return "All Users";
  if (targetRole === "student") return targetScope === "all" ? "All Students" : "Selected Students";
  return targetScope === "all" ? "All Faculty" : "Selected Faculty";
};

export const mergeNotificationState = (
  notifications: NotificationRow[],
  states: NotificationUserStateRow[],
  role: UserRole,
  userId: string,
) => {
  const stateMap = new Map<string, NotificationUserStateRow>();
  states.forEach((state) => {
    stateMap.set(state.notification_id, state);
  });

  const targeted = notifications.filter((item) => isNotificationForUser(item, role, userId));

  const merged: NotificationViewRow[] = targeted.map((notification) => {
    const state = stateMap.get(notification.id);
    return {
      ...notification,
      is_read: state?.is_read ?? false,
      is_opened: state?.is_opened ?? false,
      is_important: state?.is_important ?? false,
      is_pinned: state?.is_pinned ?? false,
    };
  });

  return merged.sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

export const defaultNotificationState = (notificationId: string, role: UserRole, userId: string): Omit<NotificationUserStateRow, "id"> => ({
  notification_id: notificationId,
  user_role: role,
  user_id: userId,
  is_read: false,
  is_opened: false,
  is_important: false,
  is_pinned: false,
  opened_at: null,
  read_at: null,
  updated_at: new Date().toISOString(),
});
