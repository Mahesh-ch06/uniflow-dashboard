import emailjs from "@emailjs/browser";

export interface FacultyWelcomePayload {
  toEmail: string;
  facultyName: string;
  facultyId: string;
  password: string;
  department?: string;
  loginUrl?: string;
}

export interface AbsentAttendancePayload {
  toEmail: string;
  studentName: string;
  hallTicket: string;
  courseName: string;
  batchName: string;
  attendanceDate: string;
  currentAttendance: string;
  facultyName: string;
  portalUrl?: string;
}

interface EmailSendResult {
  ok: boolean;
  error?: string;
}

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
const facultyWelcomeTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_FACULTY_WELCOME as string | undefined;
const absentAlertTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_STUDENT_ABSENT as string | undefined;
const appName = "UniFlow Dashboard";
const defaultFromEmail = "noreply@uniflow.local";

const formatError = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Unknown email error";
};

const sendTemplate = async (templateId: string | undefined, params: Record<string, string>): Promise<EmailSendResult> => {
  if (!serviceId || !publicKey || !templateId) {
    return {
      ok: false,
      error: "EmailJS config is incomplete. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_PUBLIC_KEY and template IDs.",
    };
  }

  try {
    await emailjs.send(serviceId, templateId, params, { publicKey });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: formatError(error) };
  }
};

export const isEmailJsConfigured = Boolean(
  serviceId && publicKey && facultyWelcomeTemplateId && absentAlertTemplateId,
);

export const sendFacultyWelcomeEmail = async (payload: FacultyWelcomePayload): Promise<EmailSendResult> => {
  return sendTemplate(facultyWelcomeTemplateId, {
    to_email: payload.toEmail,
    to_name: payload.facultyName,
    name: payload.facultyName,
    email: payload.toEmail,
    from_name: `${appName} Admin`,
    from_email: defaultFromEmail,
    reply_to: defaultFromEmail,
    faculty_name: payload.facultyName,
    faculty_id: payload.facultyId,
    temp_password: payload.password,
    department: payload.department || "Not Assigned",
    login_url: payload.loginUrl || window.location.origin,
    app_name: appName,
  });
};

export const sendStudentAbsentAlertEmail = async (payload: AbsentAttendancePayload): Promise<EmailSendResult> => {
  return sendTemplate(absentAlertTemplateId, {
    to_email: payload.toEmail,
    to_name: payload.studentName,
    name: payload.studentName,
    email: payload.toEmail,
    from_name: payload.facultyName || `${appName} Faculty`,
    from_email: defaultFromEmail,
    reply_to: defaultFromEmail,
    student_name: payload.studentName,
    hall_ticket: payload.hallTicket,
    course_name: payload.courseName,
    batch_name: payload.batchName,
    attendance_date: payload.attendanceDate,
    attendance_dat: payload.attendanceDate,
    attendance_d: payload.attendanceDate,
    current_attendance: payload.currentAttendance,
    faculty_name: payload.facultyName,
    portal_url: payload.portalUrl || window.location.origin,
    app_name: appName,
    status: "Absent",
  });
};
