import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Copy, KeyRound, Lock, RotateCcw, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

type ProfileFields = {
  name: string;
  email: string;
  phone: string;
  department: string;
  batch: string;
  section: string;
};

type ProfilePreferences = {
  emailAlerts: boolean;
  attendanceAlerts: boolean;
  marketingUpdates: boolean;
};

const isColumnMissing = (errorCode?: string) => {
  return errorCode === "42703" || errorCode === "PGRST204";
};

const isTableMissing = (errorCode?: string) => {
  return errorCode === "PGRST205" || errorCode === "42P01";
};

export default function ProfilePage() {
  const { user, setUserProfile } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileFields>({
    name: "",
    email: "",
    phone: "",
    department: "",
    batch: "",
    section: "",
  });
  const [initialForm, setInitialForm] = useState<ProfileFields | null>(null);
  const [studentContactColumnsAvailable, setStudentContactColumnsAvailable] = useState(true);
  const [preferences, setPreferences] = useState<ProfilePreferences>({
    emailAlerts: true,
    attendanceAlerts: true,
    marketingUpdates: false,
  });
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [preferencesSaving, setPreferencesSaving] = useState(false);
  const [preferencesTableReady, setPreferencesTableReady] = useState(true);
  const [lastProfileUpdate, setLastProfileUpdate] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  if (!user) return null;

  const editableRules = useMemo(() => {
    if (user.role === "student") {
      return {
        canEditEmail: true,
        canEditPhone: true,
        canEditName: false,
        canEditDepartment: false,
        canEditBatch: false,
        canEditSection: false,
      };
    }

    return {
      canEditEmail: true,
      canEditPhone: true,
      canEditName: false,
      canEditDepartment: false,
      canEditBatch: false,
      canEditSection: false,
    };
  }, [user.role]);

  const profileCompleteness = useMemo(() => {
    const values = [form.name, form.email, form.phone, form.department];
    if (user.role === "student") values.push(form.batch, form.section);
    const filled = values.filter((value) => value && value.trim().length > 0).length;
    return Math.round((filled / values.length) * 100);
  }, [form, user.role]);

  const hasUnsavedChanges = useMemo(() => {
    if (!initialForm) return false;
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  }, [form, initialForm]);

  const canUpdateProfile = useMemo(() => {
    if (loading || saving || !hasUnsavedChanges) return false;
    if (user.role === "student" && !studentContactColumnsAvailable) return false;
    return true;
  }, [hasUnsavedChanges, loading, saving, studentContactColumnsAvailable, user.role]);

  useEffect(() => {
    const updateKey = `uniflow.lastProfileUpdate.${user.id}`;
    setLastProfileUpdate(localStorage.getItem(updateKey));

    const fetchPreferences = async () => {
      setPreferencesLoading(true);

      const { data, error } = await supabase
        .from("user_preferences")
        .select("email_alerts, attendance_alerts, marketing_updates")
        .eq("user_id", user.id)
        .eq("user_role", user.role)
        .maybeSingle();

      if (error) {
        if (isTableMissing(error.code)) {
          setPreferencesTableReady(false);
        } else {
          toast({ title: "Preferences not loaded", description: error.message, variant: "destructive" });
        }
        setPreferencesLoading(false);
        return;
      }

      setPreferencesTableReady(true);
      if (data) {
        const record = data as {
          email_alerts: boolean;
          attendance_alerts: boolean;
          marketing_updates: boolean;
        };

        setPreferences({
          emailAlerts: record.email_alerts,
          attendanceAlerts: record.attendance_alerts,
          marketingUpdates: record.marketing_updates,
        });
      }

      setPreferencesLoading(false);
    };

    const fetchProfile = async () => {
      if (user.role === "student") {
        const profileRes = await supabase
          .from("students")
          .select("hall_ticket_no, name, department, batch_name, section, email, phone")
          .eq("hall_ticket_no", user.id)
          .single();

        if (profileRes.error && isColumnMissing(profileRes.error.code)) {
          setStudentContactColumnsAvailable(false);

          const fallback = await supabase
            .from("students")
            .select("hall_ticket_no, name, department, batch_name, section")
            .eq("hall_ticket_no", user.id)
            .single();

          if (!fallback.error && fallback.data) {
            const data = fallback.data as any;
            setForm({
              name: data.name || user.name,
              email: user.email || "",
              phone: user.phone || "",
              department: data.department || user.department || "",
              batch: data.batch_name || user.batch || "",
              section: data.section || "",
            });
            setInitialForm({
              name: data.name || user.name,
              email: user.email || "",
              phone: user.phone || "",
              department: data.department || user.department || "",
              batch: data.batch_name || user.batch || "",
              section: data.section || "",
            });
          }

          setLoading(false);
          return;
        }

        if (!profileRes.error && profileRes.data) {
          const data = profileRes.data as any;
          setForm({
            name: data.name || user.name,
            email: data.email || user.email || "",
            phone: data.phone || user.phone || "",
            department: data.department || user.department || "",
            batch: data.batch_name || user.batch || "",
            section: data.section || "",
          });
          setInitialForm({
            name: data.name || user.name,
            email: data.email || user.email || "",
            phone: data.phone || user.phone || "",
            department: data.department || user.department || "",
            batch: data.batch_name || user.batch || "",
            section: data.section || "",
          });
        }

        setLoading(false);
        return;
      }

      if (user.role === "faculty") {
        const { data } = await supabase
          .from("faculty")
          .select("name, email, phone, department")
          .eq("staff_id", user.id)
          .single();

        const d = data as any;
        setForm({
          name: d?.name || user.name,
          email: d?.email || user.email || "",
          phone: d?.phone || user.phone || "",
          department: d?.department || user.department || "",
          batch: "",
          section: "",
        });
        setInitialForm({
          name: d?.name || user.name,
          email: d?.email || user.email || "",
          phone: d?.phone || user.phone || "",
          department: d?.department || user.department || "",
          batch: "",
          section: "",
        });
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("admins")
        .select("name, email")
        .eq("id", user.id)
        .single();

      const d = data as any;
      setForm({
        name: d?.name || user.name,
        email: d?.email || user.email || "",
        phone: user.phone || "",
        department: user.department || "",
        batch: user.batch || "",
        section: "",
      });
      setInitialForm({
        name: d?.name || user.name,
        email: d?.email || user.email || "",
        phone: user.phone || "",
        department: user.department || "",
        batch: user.batch || "",
        section: "",
      });
      setLoading(false);
    };

    fetchProfile();
    fetchPreferences();
  }, [user.id, user.role]);

  const handleSave = async () => {
    const normalizedEmail = form.email.trim();
    const normalizedPhone = form.phone.trim();

    if (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    if (normalizedPhone && !/^[0-9+\-()\s]{7,20}$/.test(normalizedPhone)) {
      toast({ title: "Invalid phone", description: "Use only numbers and phone symbols in phone field.", variant: "destructive" });
      return;
    }

    setSaving(true);

    const markProfileUpdated = () => {
      const iso = new Date().toISOString();
      localStorage.setItem(`uniflow.lastProfileUpdate.${user.id}`, iso);
      setLastProfileUpdate(iso);
    };

    if (user.role === "student") {
      if (!studentContactColumnsAvailable) {
        toast({
          title: "Profile schema update needed",
          description: "Students table is missing email/phone columns. Add those columns to enable student profile edits.",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from("students")
        .update({ email: normalizedEmail, phone: normalizedPhone })
        .eq("hall_ticket_no", user.id);

      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }

      setUserProfile({ email: normalizedEmail, phone: normalizedPhone });
      setInitialForm((prev) => prev ? { ...prev, email: normalizedEmail, phone: normalizedPhone } : prev);
      markProfileUpdated();
      toast({ title: "Profile updated", description: "Your editable details were saved successfully." });
      setSaving(false);
      return;
    }

    if (user.role === "faculty") {
      const { error } = await supabase
        .from("faculty")
        .update({ email: normalizedEmail, phone: normalizedPhone })
        .eq("staff_id", user.id);

      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }

      setUserProfile({ email: normalizedEmail, phone: normalizedPhone });
      setInitialForm((prev) => prev ? { ...prev, email: normalizedEmail, phone: normalizedPhone } : prev);
      markProfileUpdated();
      toast({ title: "Profile updated", description: "Your profile changes have been saved." });
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("admins")
      .update({ email: normalizedEmail })
      .eq("id", user.id);

    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      setSaving(false);
      return;
    }

    setUserProfile({ email: normalizedEmail });
    setInitialForm((prev) => prev ? { ...prev, email: normalizedEmail } : prev);
    markProfileUpdated();
    toast({ title: "Profile updated", description: "Your email has been updated." });
    setSaving(false);
  };

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: `${label} copied`, description: "Copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", description: `Unable to copy ${label}.`, variant: "destructive" });
    }
  };

  const persistPreferences = async (nextPreferences: ProfilePreferences) => {
    if (!preferencesTableReady) return;

    setPreferencesSaving(true);
    const { error } = await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: user.id,
          user_role: user.role,
          email_alerts: nextPreferences.emailAlerts,
          attendance_alerts: nextPreferences.attendanceAlerts,
          marketing_updates: nextPreferences.marketingUpdates,
        },
        { onConflict: "user_id,user_role" },
      );

    if (error) {
      if (isTableMissing(error.code)) {
        setPreferencesTableReady(false);
        toast({
          title: "Preferences schema missing",
          description: "Run profile preferences SQL setup to save preferences in database.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Preference update failed", description: error.message, variant: "destructive" });
      }
    }

    setPreferencesSaving(false);
  };

  const handlePreferenceChange = (key: keyof ProfilePreferences, checked: boolean) => {
    const nextPreferences = { ...preferences, [key]: checked };
    setPreferences(nextPreferences);
    persistPreferences(nextPreferences);
  };

  const handleResetForm = () => {
    if (!initialForm) return;
    setForm(initialForm);
  };

  const handlePasswordUpdate = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({ title: "Missing fields", description: "Fill all password fields.", variant: "destructive" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({ title: "Weak password", description: "New password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Mismatch", description: "New password and confirm password must match.", variant: "destructive" });
      return;
    }

    setUpdatingPassword(true);

    if (user.role === "student") {
      const { data: authData, error: authError } = await supabase
        .from("students")
        .select("hall_ticket_no")
        .eq("hall_ticket_no", user.id)
        .eq("password", passwordForm.currentPassword)
        .single();

      if (authError || !authData) {
        toast({ title: "Invalid current password", description: "Please check your current password.", variant: "destructive" });
        setUpdatingPassword(false);
        return;
      }

      const { error } = await supabase
        .from("students")
        .update({ password: passwordForm.newPassword })
        .eq("hall_ticket_no", user.id);

      if (error) {
        toast({ title: "Password update failed", description: error.message, variant: "destructive" });
        setUpdatingPassword(false);
        return;
      }
    } else if (user.role === "faculty") {
      const { data: authData, error: authError } = await supabase
        .from("faculty")
        .select("staff_id")
        .eq("staff_id", user.id)
        .eq("password", passwordForm.currentPassword)
        .single();

      if (authError || !authData) {
        toast({ title: "Invalid current password", description: "Please check your current password.", variant: "destructive" });
        setUpdatingPassword(false);
        return;
      }

      const { error } = await supabase
        .from("faculty")
        .update({ password: passwordForm.newPassword })
        .eq("staff_id", user.id);

      if (error) {
        toast({ title: "Password update failed", description: error.message, variant: "destructive" });
        setUpdatingPassword(false);
        return;
      }
    } else {
      const { data: authData, error: authError } = await supabase
        .from("admins")
        .select("id")
        .eq("id", user.id)
        .eq("password", passwordForm.currentPassword)
        .single();

      if (authError || !authData) {
        toast({ title: "Invalid current password", description: "Please check your current password.", variant: "destructive" });
        setUpdatingPassword(false);
        return;
      }

      const { error } = await supabase
        .from("admins")
        .update({ password: passwordForm.newPassword })
        .eq("id", user.id);

      if (error) {
        toast({ title: "Password update failed", description: error.message, variant: "destructive" });
        setUpdatingPassword(false);
        return;
      }
    }

    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setUpdatingPassword(false);
    toast({ title: "Password updated", description: "Your password has been changed successfully." });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information with protected identity fields</p>
      </div>

      {user.role === "student" && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary flex items-start gap-2">
          <Lock className="h-4 w-4 mt-0.5" />
          For security, Hall Ticket, Name, Batch, Department and Section are locked. You can edit only allowed contact fields.
        </div>
      )}

      {!studentContactColumnsAvailable && user.role === "student" && (
        <div className="rounded-lg border border-warning/40 bg-warning/5 p-3 text-sm text-warning">
          Student email/phone columns are not available in database yet. Ask admin to run a schema update.
        </div>
      )}

      <div className="bg-card rounded-xl p-6 border shadow-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">{form.name.split(" ").map(n => n[0]).join("")}</span>
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">{form.name}</h2>
            <p className="text-sm text-muted-foreground capitalize">{user.role} • {form.department || "N/A"}</p>
          </div>
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Profile Completeness</span>
            <span className="font-semibold text-foreground">{profileCompleteness}%</span>
          </div>
          <Progress value={profileCompleteness} />
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-1">Full Name <Badge variant="outline" className="text-[10px]">Locked</Badge></Label>
            <Input value={form.name} readOnly className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              readOnly={!editableRules.canEditEmail}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              readOnly={!editableRules.canEditPhone}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="flex items-center gap-1">Department <Badge variant="outline" className="text-[10px]">Locked</Badge></Label>
            <Input value={form.department} readOnly className="mt-1" />
          </div>

          {user.role === "student" && (
            <>
              <div>
                <Label className="flex items-center gap-1">Hall Ticket <Badge variant="outline" className="text-[10px]">Locked</Badge></Label>
                <Input value={user.id} readOnly className="mt-1" />
              </div>
              <div>
                <Label className="flex items-center gap-1">Batch <Badge variant="outline" className="text-[10px]">Locked</Badge></Label>
                <Input value={form.batch || "N/A"} readOnly className="mt-1" />
              </div>
              <div>
                <Label className="flex items-center gap-1">Section <Badge variant="outline" className="text-[10px]">Locked</Badge></Label>
                <Input value={form.section || "N/A"} readOnly className="mt-1" />
              </div>
            </>
          )}
        </div>
        )}

        {hasUnsavedChanges && (
          <div className="mt-4 text-xs text-warning">You have unsaved profile changes.</div>
        )}

        <Button className="gradient-primary text-primary-foreground mt-6" onClick={handleSave} disabled={!canUpdateProfile}>
          {saving ? "Saving..." : "Update Profile"}
        </Button>
        <Button className="mt-6 ml-2" variant="outline" onClick={handleResetForm} disabled={saving || loading || !hasUnsavedChanges}>
          <RotateCcw className="h-4 w-4 mr-2" /> Reset Changes
        </Button>
      </div>

      <div className="bg-card rounded-xl p-6 border shadow-card space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-display font-bold text-foreground">Account Snapshot</h3>
            <p className="text-sm text-muted-foreground">Quick access to your account identity and status</p>
          </div>
          <Badge variant="outline" className="capitalize">{user.role}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Account ID</p>
            <div className="flex items-center justify-between gap-2 mt-1">
              <p className="font-mono text-sm text-foreground truncate">{user.id}</p>
              <Button size="sm" variant="ghost" onClick={() => handleCopy(user.id, "Account ID")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Last Profile Update</p>
            <p className="text-sm text-foreground mt-1">{lastProfileUpdate ? new Date(lastProfileUpdate).toLocaleString() : "Never"}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border shadow-card space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-display font-bold text-foreground">Preferences</h3>
            <p className="text-sm text-muted-foreground">Control in-app communication and reminders</p>
          </div>
          <Badge variant={preferencesTableReady ? "secondary" : "outline"} className="gap-1">
            <Bell className="h-3.5 w-3.5" /> {preferencesTableReady ? "Synced" : "Schema Needed"}
          </Badge>
        </div>

        {!preferencesTableReady && (
          <div className="rounded-lg border border-warning/40 bg-warning/5 p-3 text-xs text-warning">
            Preferences table is not configured yet. Run profile preferences SQL setup to persist these settings.
          </div>
        )}

        {preferencesSaving && <p className="text-xs text-muted-foreground">Saving preferences...</p>}

        <div className="space-y-3">
          <div className="rounded-lg border p-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">Email Alerts</p>
              <p className="text-xs text-muted-foreground">Receive updates for timetable, notices and account activity.</p>
            </div>
            <Switch
              checked={preferences.emailAlerts}
              onCheckedChange={(checked) => handlePreferenceChange("emailAlerts", checked)}
              disabled={preferencesLoading || preferencesSaving}
            />
          </div>

          <div className="rounded-lg border p-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">Attendance Alerts</p>
              <p className="text-xs text-muted-foreground">Get reminders when attendance drops below safe levels.</p>
            </div>
            <Switch
              checked={preferences.attendanceAlerts}
              onCheckedChange={(checked) => handlePreferenceChange("attendanceAlerts", checked)}
              disabled={preferencesLoading || preferencesSaving}
            />
          </div>

          <div className="rounded-lg border p-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">Product Updates</p>
              <p className="text-xs text-muted-foreground">Receive occasional feature highlights and release updates.</p>
            </div>
            <Switch
              checked={preferences.marketingUpdates}
              onCheckedChange={(checked) => handlePreferenceChange("marketingUpdates", checked)}
              disabled={preferencesLoading || preferencesSaving}
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border shadow-card space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-display font-bold text-foreground">Security</h3>
            <p className="text-sm text-muted-foreground">Update your account password securely</p>
          </div>
          <Badge variant="secondary" className="gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Protected</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label>Current Password</Label>
            <Input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              className="mt-1"
            />
          </div>
        </div>

        <Button onClick={handlePasswordUpdate} disabled={updatingPassword || loading}>
          <KeyRound className="h-4 w-4 mr-2" />
          {updatingPassword ? "Updating Password..." : "Change Password"}
        </Button>
      </div>
    </div>
  );
}
