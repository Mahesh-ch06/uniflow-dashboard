// Mock data for the University Management System

export type UserRole = "admin" | "faculty" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  phone?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  facultyId: string;
  facultyName: string;
  semester: string;
  enrolledStudents: number;
  maxCapacity: number;
  schedule: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: string;
  status: "present" | "absent" | "late";
}

export interface MarksRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  assignment1: number;
  midterm: number;
  assignment2: number;
  final: number;
  total: number;
  grade: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  semester: string;
  tuitionFee: number;
  labFee: number;
  libraryFee: number;
  totalFee: number;
  paidAmount: number;
  fine: number;
  status: "paid" | "partial" | "unpaid";
  dueDate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "urgent";
  date: string;
  read: boolean;
  targetRole: UserRole | "all";
}

export interface TimetableEntry {
  id: string;
  courseCode: string;
  courseName: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  facultyName: string;
}

// Demo users
export const demoUsers: Record<UserRole, User> = {
  admin: { id: "A001", name: "Dr. Sarah Mitchell", email: "admin@university.edu", role: "admin", department: "Administration", phone: "+1-555-0100" },
  faculty: { id: "F001", name: "Prof. James Anderson", email: "faculty@university.edu", role: "faculty", department: "Computer Science", phone: "+1-555-0201" },
  student: { id: "S001", name: "Alex Thompson", email: "student@university.edu", role: "student", department: "Computer Science", phone: "+1-555-0301" },
};

export const allStudents: User[] = [
  { id: "S001", name: "Alex Thompson", email: "alex.t@university.edu", role: "student", department: "Computer Science" },
  { id: "S002", name: "Maria Garcia", email: "maria.g@university.edu", role: "student", department: "Computer Science" },
  { id: "S003", name: "David Chen", email: "david.c@university.edu", role: "student", department: "Mathematics" },
  { id: "S004", name: "Emma Wilson", email: "emma.w@university.edu", role: "student", department: "Physics" },
  { id: "S005", name: "Ryan Patel", email: "ryan.p@university.edu", role: "student", department: "Computer Science" },
  { id: "S006", name: "Sophie Brown", email: "sophie.b@university.edu", role: "student", department: "Mathematics" },
  { id: "S007", name: "James Lee", email: "james.l@university.edu", role: "student", department: "Physics" },
  { id: "S008", name: "Olivia Martinez", email: "olivia.m@university.edu", role: "student", department: "Computer Science" },
];

export const allFaculty: User[] = [
  { id: "F001", name: "Prof. James Anderson", email: "james.a@university.edu", role: "faculty", department: "Computer Science" },
  { id: "F002", name: "Dr. Lisa Park", email: "lisa.p@university.edu", role: "faculty", department: "Mathematics" },
  { id: "F003", name: "Prof. Robert Kim", email: "robert.k@university.edu", role: "faculty", department: "Physics" },
  { id: "F004", name: "Dr. Emily Davis", email: "emily.d@university.edu", role: "faculty", department: "Computer Science" },
];

export const courses: Course[] = [
  { id: "C001", code: "CS301", name: "Data Structures & Algorithms", department: "Computer Science", credits: 4, facultyId: "F001", facultyName: "Prof. James Anderson", semester: "Fall 2024", enrolledStudents: 45, maxCapacity: 60, schedule: "MWF 9:00-10:00" },
  { id: "C002", code: "CS401", name: "Machine Learning", department: "Computer Science", credits: 3, facultyId: "F004", facultyName: "Dr. Emily Davis", semester: "Fall 2024", enrolledStudents: 38, maxCapacity: 50, schedule: "TTh 11:00-12:30" },
  { id: "C003", code: "MATH201", name: "Linear Algebra", department: "Mathematics", credits: 3, facultyId: "F002", facultyName: "Dr. Lisa Park", semester: "Fall 2024", enrolledStudents: 55, maxCapacity: 60, schedule: "MWF 11:00-12:00" },
  { id: "C004", code: "PHY301", name: "Quantum Mechanics", department: "Physics", credits: 4, facultyId: "F003", facultyName: "Prof. Robert Kim", semester: "Fall 2024", enrolledStudents: 30, maxCapacity: 40, schedule: "TTh 2:00-3:30" },
  { id: "C005", code: "CS201", name: "Database Systems", department: "Computer Science", credits: 3, facultyId: "F001", facultyName: "Prof. James Anderson", semester: "Fall 2024", enrolledStudents: 42, maxCapacity: 50, schedule: "MWF 2:00-3:00" },
  { id: "C006", code: "MATH301", name: "Probability & Statistics", department: "Mathematics", credits: 3, facultyId: "F002", facultyName: "Dr. Lisa Park", semester: "Fall 2024", enrolledStudents: 48, maxCapacity: 55, schedule: "TTh 9:00-10:30" },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: "AT001", studentId: "S001", studentName: "Alex Thompson", courseId: "C001", courseName: "Data Structures & Algorithms", date: "2024-03-18", status: "present" },
  { id: "AT002", studentId: "S002", studentName: "Maria Garcia", courseId: "C001", courseName: "Data Structures & Algorithms", date: "2024-03-18", status: "present" },
  { id: "AT003", studentId: "S003", studentName: "David Chen", courseId: "C001", courseName: "Data Structures & Algorithms", date: "2024-03-18", status: "absent" },
  { id: "AT004", studentId: "S001", studentName: "Alex Thompson", courseId: "C001", courseName: "Data Structures & Algorithms", date: "2024-03-19", status: "present" },
  { id: "AT005", studentId: "S001", studentName: "Alex Thompson", courseId: "C002", courseName: "Machine Learning", date: "2024-03-18", status: "late" },
  { id: "AT006", studentId: "S004", studentName: "Emma Wilson", courseId: "C004", courseName: "Quantum Mechanics", date: "2024-03-18", status: "present" },
  { id: "AT007", studentId: "S005", studentName: "Ryan Patel", courseId: "C001", courseName: "Data Structures & Algorithms", date: "2024-03-18", status: "present" },
  { id: "AT008", studentId: "S005", studentName: "Ryan Patel", courseId: "C002", courseName: "Machine Learning", date: "2024-03-18", status: "absent" },
];

export const marksRecords: MarksRecord[] = [
  { id: "M001", studentId: "S001", studentName: "Alex Thompson", courseId: "C001", courseName: "Data Structures & Algorithms", assignment1: 88, midterm: 82, assignment2: 90, final: 85, total: 86, grade: "A" },
  { id: "M002", studentId: "S001", studentName: "Alex Thompson", courseId: "C002", courseName: "Machine Learning", assignment1: 75, midterm: 78, assignment2: 80, final: 72, total: 76, grade: "B+" },
  { id: "M003", studentId: "S002", studentName: "Maria Garcia", courseId: "C001", courseName: "Data Structures & Algorithms", assignment1: 92, midterm: 95, assignment2: 88, final: 91, total: 92, grade: "A+" },
  { id: "M004", studentId: "S003", studentName: "David Chen", courseId: "C003", courseName: "Linear Algebra", assignment1: 70, midterm: 65, assignment2: 72, final: 68, total: 69, grade: "B-" },
  { id: "M005", studentId: "S004", studentName: "Emma Wilson", courseId: "C004", courseName: "Quantum Mechanics", assignment1: 85, midterm: 88, assignment2: 82, final: 90, total: 87, grade: "A" },
  { id: "M006", studentId: "S005", studentName: "Ryan Patel", courseId: "C001", courseName: "Data Structures & Algorithms", assignment1: 60, midterm: 55, assignment2: 65, final: 58, total: 60, grade: "C" },
];

export const feeRecords: FeeRecord[] = [
  { id: "FE001", studentId: "S001", studentName: "Alex Thompson", semester: "Fall 2024", tuitionFee: 15000, labFee: 2000, libraryFee: 500, totalFee: 17500, paidAmount: 17500, fine: 0, status: "paid", dueDate: "2024-08-15" },
  { id: "FE002", studentId: "S002", studentName: "Maria Garcia", semester: "Fall 2024", tuitionFee: 15000, labFee: 2000, libraryFee: 500, totalFee: 17500, paidAmount: 10000, fine: 0, status: "partial", dueDate: "2024-08-15" },
  { id: "FE003", studentId: "S003", studentName: "David Chen", semester: "Fall 2024", tuitionFee: 15000, labFee: 1500, libraryFee: 500, totalFee: 17000, paidAmount: 0, fine: 500, status: "unpaid", dueDate: "2024-08-15" },
  { id: "FE004", studentId: "S004", studentName: "Emma Wilson", semester: "Fall 2024", tuitionFee: 15000, labFee: 2500, libraryFee: 500, totalFee: 18000, paidAmount: 18000, fine: 0, status: "paid", dueDate: "2024-08-15" },
  { id: "FE005", studentId: "S005", studentName: "Ryan Patel", semester: "Fall 2024", tuitionFee: 15000, labFee: 2000, libraryFee: 500, totalFee: 17500, paidAmount: 5000, fine: 200, status: "partial", dueDate: "2024-08-15" },
];

export const notifications: Notification[] = [
  { id: "N001", title: "Mid-term Exams Schedule", message: "Mid-term examinations will be held from March 25-29. Please check your timetable for details.", type: "urgent", date: "2024-03-15", read: false, targetRole: "all" },
  { id: "N002", title: "Library Hours Extended", message: "The library will remain open until 11 PM during exam week.", type: "info", date: "2024-03-14", read: true, targetRole: "all" },
  { id: "N003", title: "Fee Payment Reminder", message: "Last date for fee payment without fine is March 20. Please clear your dues.", type: "warning", date: "2024-03-13", read: false, targetRole: "student" },
  { id: "N004", title: "Faculty Meeting", message: "Monthly faculty meeting scheduled for March 22 at 3 PM in the conference hall.", type: "info", date: "2024-03-12", read: false, targetRole: "faculty" },
  { id: "N005", title: "New Course Added", message: "Advanced AI (CS501) has been added for the Spring 2025 semester.", type: "success", date: "2024-03-11", read: true, targetRole: "all" },
  { id: "N006", title: "Attendance Warning", message: "Students with attendance below 75% will not be allowed to sit for final exams.", type: "warning", date: "2024-03-10", read: false, targetRole: "student" },
];

export const timetable: TimetableEntry[] = [
  { id: "T001", courseCode: "CS301", courseName: "Data Structures & Algorithms", day: "Monday", startTime: "9:00", endTime: "10:00", room: "Room 301", facultyName: "Prof. James Anderson" },
  { id: "T002", courseCode: "CS401", courseName: "Machine Learning", day: "Monday", startTime: "11:00", endTime: "12:30", room: "Lab 201", facultyName: "Dr. Emily Davis" },
  { id: "T003", courseCode: "MATH201", courseName: "Linear Algebra", day: "Monday", startTime: "2:00", endTime: "3:00", room: "Room 105", facultyName: "Dr. Lisa Park" },
  { id: "T004", courseCode: "CS301", courseName: "Data Structures & Algorithms", day: "Tuesday", startTime: "9:00", endTime: "10:00", room: "Room 301", facultyName: "Prof. James Anderson" },
  { id: "T005", courseCode: "PHY301", courseName: "Quantum Mechanics", day: "Tuesday", startTime: "2:00", endTime: "3:30", room: "Room 402", facultyName: "Prof. Robert Kim" },
  { id: "T006", courseCode: "CS201", courseName: "Database Systems", day: "Wednesday", startTime: "9:00", endTime: "10:00", room: "Lab 102", facultyName: "Prof. James Anderson" },
  { id: "T007", courseCode: "CS401", courseName: "Machine Learning", day: "Wednesday", startTime: "11:00", endTime: "12:30", room: "Lab 201", facultyName: "Dr. Emily Davis" },
  { id: "T008", courseCode: "MATH301", courseName: "Probability & Statistics", day: "Thursday", startTime: "9:00", endTime: "10:30", room: "Room 205", facultyName: "Dr. Lisa Park" },
  { id: "T009", courseCode: "CS301", courseName: "Data Structures & Algorithms", day: "Friday", startTime: "9:00", endTime: "10:00", room: "Room 301", facultyName: "Prof. James Anderson" },
  { id: "T010", courseCode: "CS201", courseName: "Database Systems", day: "Friday", startTime: "2:00", endTime: "3:00", room: "Lab 102", facultyName: "Prof. James Anderson" },
];

// Stats for dashboards
export const adminStats = {
  totalStudents: 1250,
  totalFaculty: 85,
  totalCourses: 120,
  totalDepartments: 12,
  attendanceRate: 87,
  feeCollectionRate: 78,
  pendingFees: 245000,
  activeNotifications: 4,
};

export const monthlyAttendanceData = [
  { month: "Sep", rate: 92 },
  { month: "Oct", rate: 88 },
  { month: "Nov", rate: 85 },
  { month: "Dec", rate: 78 },
  { month: "Jan", rate: 90 },
  { month: "Feb", rate: 87 },
  { month: "Mar", rate: 89 },
];

export const departmentEnrollment = [
  { department: "Computer Science", students: 380 },
  { department: "Mathematics", students: 220 },
  { department: "Physics", students: 180 },
  { department: "Chemistry", students: 150 },
  { department: "Biology", students: 170 },
  { department: "English", students: 150 },
];

export const feeCollectionData = [
  { month: "Sep", collected: 450000, pending: 50000 },
  { month: "Oct", collected: 420000, pending: 80000 },
  { month: "Nov", collected: 480000, pending: 20000 },
  { month: "Dec", collected: 390000, pending: 110000 },
  { month: "Jan", collected: 460000, pending: 40000 },
  { month: "Feb", collected: 430000, pending: 70000 },
  { month: "Mar", collected: 470000, pending: 30000 },
];

export const gradeDistribution = [
  { grade: "A+", count: 45 },
  { grade: "A", count: 120 },
  { grade: "B+", count: 180 },
  { grade: "B", count: 210 },
  { grade: "B-", count: 150 },
  { grade: "C", count: 95 },
  { grade: "D", count: 40 },
  { grade: "F", count: 10 },
];
