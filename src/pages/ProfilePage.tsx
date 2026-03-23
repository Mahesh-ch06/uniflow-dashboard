import { useAuth } from "@/contexts/AuthContext";
import { UserCircle, Mail, Phone, Building2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>
      <div className="bg-card rounded-xl p-6 border shadow-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">{user.name.split(" ").map(n => n[0]).join("")}</span>
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground capitalize">{user.role} • {user.department}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name</Label>
            <Input value={user.name} readOnly className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user.email} readOnly className="mt-1" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={user.phone || ""} readOnly className="mt-1" />
          </div>
          <div>
            <Label>Department</Label>
            <Input value={user.department || ""} readOnly className="mt-1" />
          </div>
        </div>
        <Button className="gradient-primary text-primary-foreground mt-6">Update Profile</Button>
      </div>
    </div>
  );
}
