import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import DashboardLayout from "@/components/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import Index from "@/pages/Index";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminStudents from "@/pages/admin/AdminStudents";
import AdminFaculty from "@/pages/admin/AdminFacultyPage";
import AdminAttendance from "@/pages/admin/AdminAttendance";
import AdminFees from "@/pages/admin/AdminFees";
import AdminNotifications from "@/pages/admin/AdminNotifications";
import AdminTimetable from "@/pages/admin/AdminTimetable";
import AdminReports from "@/pages/admin/AdminReports";

// Faculty pages
import FacultyDashboard from "@/pages/faculty/FacultyDashboard";
import FacultyCourses from "@/pages/faculty/FacultyCourses";
import FacultyAttendance from "@/pages/faculty/FacultyAttendance";
import FacultyAttendanceEdit from "@/pages/faculty/FacultyAttendanceEdit";
import FacultyMarks from "@/pages/faculty/FacultyMarks";
import FacultyStudents from "@/pages/faculty/FacultyStudents";

// Student pages
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentAttendance from "@/pages/student/StudentAttendance";
import StudentAttendanceWarnings from "@/pages/student/StudentAttendanceWarnings";
import StudentMarks from "@/pages/student/StudentMarks";
import StudentLibrary from "@/pages/student/StudentLibrary";
import StudentFees from "./pages/student/StudentFees";
import StudentCourses from "./pages/student/StudentCourses";
import StudentTimetable from "@/pages/student/StudentTimetable";
import StudentNotifications from "@/pages/student/StudentNotifications";

import StudentResult from "@/pages/student/StudentResult";
import StudentPlacement from "@/pages/student/StudentPlacement";
import StudentSeating from "@/pages/student/StudentSeating";
import StudentExamTimetable from "@/pages/student/StudentExamTimetable";
import StudentHallTicket from "@/pages/student/StudentHallTicket";
import StudentPreviousPapers from "@/pages/student/StudentPreviousPapers";

// Shared
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== allowedRole) return <Navigate to={`/${user?.role}`} replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function LoginGuard() {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user) return <Navigate to={`/${user.role}`} replace />;
  return <LoginPage />;
}

function HomeGuard() {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user) return <Navigate to={`/${user.role}`} replace />;
  return <Index />;
}

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<HomeGuard />} />
            <Route path="/login" element={<LoginGuard />} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/courses" element={<ProtectedRoute allowedRole="admin"><AdminCourses /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute allowedRole="admin"><AdminStudents /></ProtectedRoute>} />
            <Route path="/admin/faculty" element={<ProtectedRoute allowedRole="admin"><AdminFaculty /></ProtectedRoute>} />
            <Route path="/admin/attendance" element={<ProtectedRoute allowedRole="admin"><AdminAttendance /></ProtectedRoute>} />
            <Route path="/admin/fees" element={<ProtectedRoute allowedRole="admin"><AdminFees /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute allowedRole="admin"><AdminNotifications /></ProtectedRoute>} />
            <Route path="/admin/timetable" element={<ProtectedRoute allowedRole="admin"><AdminTimetable /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><AdminReports /></ProtectedRoute>} />

            {/* Faculty routes */}
            <Route path="/faculty" element={<ProtectedRoute allowedRole="faculty"><FacultyDashboard /></ProtectedRoute>} />
            <Route path="/faculty/courses" element={<ProtectedRoute allowedRole="faculty"><FacultyCourses /></ProtectedRoute>} />
            <Route path="/faculty/attendance" element={<ProtectedRoute allowedRole="faculty"><FacultyAttendance /></ProtectedRoute>} />
            <Route path="/faculty/attendance/edit" element={<ProtectedRoute allowedRole="faculty"><FacultyAttendanceEdit /></ProtectedRoute>} />
            <Route path="/faculty/marks" element={<ProtectedRoute allowedRole="faculty"><FacultyMarks /></ProtectedRoute>} />
            <Route path="/faculty/students" element={<ProtectedRoute allowedRole="faculty"><FacultyStudents /></ProtectedRoute>} />
            <Route path="/faculty/profile" element={<ProtectedRoute allowedRole="faculty"><ProfilePage /></ProtectedRoute>} />

            {/* Student routes */}
            <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/attendance" element={<ProtectedRoute allowedRole="student"><StudentAttendance /></ProtectedRoute>} />
            <Route path="/student/attendance-warnings" element={<ProtectedRoute allowedRole="student"><StudentAttendanceWarnings /></ProtectedRoute>} />
            <Route path="/student/marks" element={<ProtectedRoute allowedRole="student"><StudentMarks /></ProtectedRoute>} />
            <Route path="/student/library" element={<ProtectedRoute allowedRole="student"><StudentLibrary /></ProtectedRoute>} />
            <Route path="/student/fees" element={<ProtectedRoute allowedRole="student"><StudentFees /></ProtectedRoute>} />
            <Route path="/student/timetable" element={<ProtectedRoute allowedRole="student"><StudentTimetable /></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute allowedRole="student"><StudentNotifications /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute allowedRole="student"><ProfilePage /></ProtectedRoute>} />

            <Route path="/student/result" element={<ProtectedRoute allowedRole="student"><StudentResult /></ProtectedRoute>} />
            <Route path="/student/placement" element={<ProtectedRoute allowedRole="student"><StudentPlacement /></ProtectedRoute>} />
            <Route path="/student/seating" element={<ProtectedRoute allowedRole="student"><StudentSeating /></ProtectedRoute>} />
            <Route path="/student/exam-timetable" element={<ProtectedRoute allowedRole="student"><StudentExamTimetable /></ProtectedRoute>} />
            <Route path="/student/ticket" element={<ProtectedRoute allowedRole="student"><StudentHallTicket /></ProtectedRoute>} />
            <Route path="/student/papers" element={<ProtectedRoute allowedRole="student"><StudentPreviousPapers /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
