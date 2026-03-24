import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User, UserRole } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string, role: UserRole) => Promise<boolean>;
  logout: (reason?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('uniflow_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const INACTIVITY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  const logout = useCallback((reason?: string) => {
    setUser(null);
    localStorage.removeItem('uniflow_user');
    localStorage.removeItem('uniflow_last_active');
    if (reason) {
      toast.error(reason, { duration: 5000 });
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    // Check if session expired while the user was away/tab was closed
    const lastActive = localStorage.getItem('uniflow_last_active');
    if (lastActive && Date.now() - parseInt(lastActive) > INACTIVITY_TIME) {
      setShowSessionExpired(true);
      logout();
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      localStorage.setItem('uniflow_last_active', Date.now().toString());
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowSessionExpired(true);
        logout();
      }, INACTIVITY_TIME);
    };

    // Initialize timer
    resetTimer();

    // Event listeners to detect user activity
    const events = ['mousemove', 'keydown', 'wheel', 'mousedown', 'touchstart', 'scroll'];
    
    // Throttle the tracking to avoid performance issues
    let throttleId: boolean = false;
    const handleActivity = () => {
      if (throttleId) return;
      throttleId = true;
      resetTimer();
      setTimeout(() => { throttleId = false; }, 1000);
    };

    events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));
    
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [user, logout]);

  const login = async (identifier: string, password: string, role: UserRole): Promise<boolean> => {
    if (role === "student") {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('hall_ticket_no', identifier)
        .eq('password', password)
        .single();

      if (data && !error) {
        const studentUser: User = {
          id: data.hall_ticket_no,
          name: data.name,
          email: `${data.hall_ticket_no}@student.edu`,
          role: "student",
          batch: data.batch_name,
          department: data.department
        };
        setUser(studentUser);
        localStorage.setItem('uniflow_user', JSON.stringify(studentUser));
        localStorage.setItem('uniflow_last_active', Date.now().toString());
        return true;
      }
      return false;
    } else if (role === "faculty") {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .eq('staff_id', identifier)
        .eq('password', password)
        .single();

      if (data && !error) {
        const facultyUser: User = {
          id: data.staff_id,
          name: data.name,
          email: data.email,
          role: "faculty",
          department: data.department,
          phone: data.phone
        };
        setUser(facultyUser);
        localStorage.setItem('uniflow_user', JSON.stringify(facultyUser));
        localStorage.setItem('uniflow_last_active', Date.now().toString());
        return true;
      }
      return false;
    } else if (role === "admin") {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', identifier)
        .eq('password', password)
        .single();

      if (data && !error) {
        const adminUser: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: "admin",
        };
        setUser(adminUser);
        localStorage.setItem('uniflow_user', JSON.stringify(adminUser));
        localStorage.setItem('uniflow_last_active', Date.now().toString());
        return true;
      }
      return false;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
      
      <AlertDialog open={showSessionExpired} onOpenChange={setShowSessionExpired}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Session Expired</AlertDialogTitle>
            <AlertDialogDescription>
                Your session has expired. For your security, you have been automatically logged out. Please log in again to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSessionExpired(false)}>
              Back to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
