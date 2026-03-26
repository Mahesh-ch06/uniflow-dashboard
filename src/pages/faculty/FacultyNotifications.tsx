import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, CheckCheck, CheckCircle, Info, MailOpen, Pin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  defaultNotificationState,
  mergeNotificationState,
  NotificationRow,
  NotificationUserStateRow,
  formatNotificationDateTime,
  isNotificationStatesTableMissing,
  isNotificationsTableMissing,
  notificationTargetLabel,
  NotificationViewRow,
} from "@/lib/notifications";

const typeConfig = {
  info: { icon: Info, color: "text-info", bg: "bg-info/10" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  success: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  urgent: { icon: Bell, color: "text-destructive", bg: "bg-destructive/10" },
};

export default function FacultyNotifications() {
  const { user } = useAuth();
  const [allNotifications, setAllNotifications] = useState<NotificationRow[]>([]);
  const [notificationStates, setNotificationStates] = useState<NotificationUserStateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableReady, setTableReady] = useState(true);
  const [stateTableReady, setStateTableReady] = useState(true);
  const [updatingState, setUpdatingState] = useState<Record<string, boolean>>({});

  const myNotifications = useMemo<NotificationViewRow[]>(() => {
    if (!user?.id) return [];
    return mergeNotificationState(allNotifications, notificationStates, "faculty", user.id);
  }, [allNotifications, notificationStates, user?.id]);

  const fetchNotifications = async () => {
    if (!user?.id) return;

    const [{ data: notificationsData, error: notificationsError }, { data: statesData, error: statesError }] = await Promise.all([
      supabase
        .from("notifications")
        .select("id, title, message, type, target_role, target_scope, recipient_ids, created_by, created_by_name, created_by_role, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("notification_user_states")
        .select("id, notification_id, user_role, user_id, is_read, is_opened, is_important, is_pinned, opened_at, read_at, updated_at")
        .eq("user_role", "faculty")
        .eq("user_id", user.id)
        .limit(500),
    ]);

    if (notificationsError) {
      if (isNotificationsTableMissing(notificationsError.code)) {
        setTableReady(false);
        setAllNotifications([]);
      }
      setLoading(false);
      return;
    }

    setTableReady(true);
    setAllNotifications((notificationsData || []) as NotificationRow[]);

    if (statesError) {
      if (isNotificationStatesTableMissing(statesError.code)) {
        setStateTableReady(false);
        setNotificationStates([]);
      }
    } else {
      setStateTableReady(true);
      setNotificationStates((statesData || []) as NotificationUserStateRow[]);
    }

    setLoading(false);
  };

  const updateNotificationState = async (
    notificationId: string,
    updates: Partial<Pick<NotificationUserStateRow, "is_read" | "is_opened" | "is_important" | "is_pinned">>,
  ) => {
    if (!user?.id) return;

    const existing = notificationStates.find((item) => item.notification_id === notificationId);
    const base = existing || defaultNotificationState(notificationId, "faculty", user.id);
    const now = new Date().toISOString();

    const payload: Omit<NotificationUserStateRow, "id"> = {
      ...base,
      ...updates,
      opened_at: updates.is_opened === true ? (base.opened_at || now) : updates.is_opened === false ? null : base.opened_at,
      read_at: updates.is_read === true ? (base.read_at || now) : updates.is_read === false ? null : base.read_at,
      updated_at: now,
    };

    setNotificationStates((prev) => {
      const idx = prev.findIndex((item) => item.notification_id === notificationId);
      if (idx === -1) {
        return [...prev, { id: `local-${notificationId}`, ...payload }];
      }

      const next = [...prev];
      next[idx] = { ...next[idx], ...payload };
      return next;
    });

    if (!stateTableReady) return;

    setUpdatingState((prev) => ({ ...prev, [notificationId]: true }));
    const { data, error } = await supabase
      .from("notification_user_states")
      .upsert(payload, { onConflict: "notification_id,user_role,user_id" })
      .select("id, notification_id, user_role, user_id, is_read, is_opened, is_important, is_pinned, opened_at, read_at, updated_at")
      .single();

    if (error) {
      if (isNotificationStatesTableMissing(error.code)) {
        setStateTableReady(false);
      } else {
        fetchNotifications();
      }
      setUpdatingState((prev) => ({ ...prev, [notificationId]: false }));
      return;
    }

    if (data) {
      setNotificationStates((prev) => {
        const idx = prev.findIndex((item) => item.notification_id === notificationId);
        if (idx === -1) return [...prev, data as NotificationUserStateRow];
        const next = [...prev];
        next[idx] = data as NotificationUserStateRow;
        return next;
      });
    }

    setUpdatingState((prev) => ({ ...prev, [notificationId]: false }));
  };

  const markAllAsRead = async () => {
    const unread = myNotifications.filter((item) => !item.is_read);
    await Promise.all(
      unread.map((item) =>
        updateNotificationState(item.id, {
          is_read: true,
          is_opened: true,
        }),
      ),
    );
  };

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel(`faculty-notifications-${user?.id || "unknown"}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => fetchNotifications())
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notification_user_states", filter: `user_role=eq.faculty` },
        () => fetchNotifications(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">Realtime updates and announcements for faculty</p>
      </div>

      {!tableReady && (
        <div className="rounded-xl border border-warning/40 bg-warning/5 p-4 text-sm text-warning">
          Notifications table is not configured yet. Run <span className="font-semibold">supabase-setup-notifications.sql</span> in Supabase.
        </div>
      )}

      {!loading && !stateTableReady && (
        <div className="rounded-xl border border-warning/40 bg-warning/5 p-4 text-sm text-warning">
          Notification state table is not configured. Run <span className="font-semibold">supabase-setup-notifications.sql</span> again to enable read/pin/important tracking.
        </div>
      )}

      {!loading && myNotifications.length > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        </div>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading notifications...</div>
      ) : myNotifications.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No notifications available.
        </div>
      ) : (
        <div className="space-y-3">
          {myNotifications.map((n) => {
            const config = typeConfig[n.type] || typeConfig.info;
            const Icon = config.icon;
            const isBusy = Boolean(updatingState[n.id]);

            return (
              <div key={n.id} className={cn("bg-card rounded-xl p-4 border shadow-card flex items-start gap-4 border-l-4", n.is_read ? "border-l-muted" : "border-l-primary")}> 
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
                  <Icon className={cn("w-5 h-5", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{n.title}</h3>
                    {!n.is_read && <Badge className="text-[10px]">Unread</Badge>}
                    {n.is_opened && <Badge variant="secondary" className="text-[10px]">Opened</Badge>}
                    {n.is_important && <Badge variant="destructive" className="text-[10px]">Important</Badge>}
                    {n.is_pinned && <Badge variant="outline" className="text-[10px]">Pinned</Badge>}
                    <Badge variant="outline" className="capitalize text-xs">{notificationTargetLabel(n.target_role, n.target_scope)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {formatNotificationDateTime(n.created_at)}
                    {n.created_by_name ? ` • By ${n.created_by_name}` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isBusy || n.is_opened}
                      onClick={() => updateNotificationState(n.id, { is_opened: true, is_read: true })}
                    >
                      <MailOpen className="w-4 h-4 mr-2" />
                      {n.is_opened ? "Opened" : "Open"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={n.is_read ? "secondary" : "default"}
                      disabled={isBusy}
                      onClick={() => updateNotificationState(n.id, { is_read: !n.is_read })}
                    >
                      {n.is_read ? "Mark Unread" : "Mark Read"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={n.is_important ? "destructive" : "outline"}
                      disabled={isBusy}
                      onClick={() => updateNotificationState(n.id, { is_important: !n.is_important })}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      {n.is_important ? "Unmark Important" : "Mark Important"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={n.is_pinned ? "secondary" : "outline"}
                      disabled={isBusy}
                      onClick={() => updateNotificationState(n.id, { is_pinned: !n.is_pinned })}
                    >
                      <Pin className="w-4 h-4 mr-2" />
                      {n.is_pinned ? "Unpin" : "Pin"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
