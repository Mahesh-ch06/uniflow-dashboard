# UniFlow Dashboard

### Demo Login Credentials

> **Student Login**
> - ID / Hall Ticket: `2303A52037`
> - Password: `@Mahesh06`
> 
> **Faculty Login**
> - ID: `F009`
> - Password: `@Mahesh06`
> 
> **Admin Login**
> - Email: `chitikeshimahesh6@gmail.com`
> - Password: `@Mahesh06`

---

## 📖 About the Project 

UniFlow Dashboard is a modern, comprehensive university management system designed to streamline and automate core academic operations. It bridges the communication gap between students, faculty, and administrators by providing secure, role-specific portals equipped with real-time data sync.

### How It Works

The platform operates through three distinct, customized workflows based on the user's role:

#### 🎓 1. Student Portal
- **Live Attendance Analytics:** Students can monitor their exact attendance percentage in real-time. The system calculates visual thresholds (Safe, Warning, Critical) based on a 75% required attendance policy.
- **Smart Predictors:** The dashboard dynamically computes "classes needed for 75%" to recover from shortages, and "classes you can safely miss" before falling under the threshold.
- **Leave & Correction Workflow:** Students can seamlessly submit leave applications or attendance correction requests right from the site. This triggers a workflow that alerts the respective faculty.
- **Course Registration:** Dynamic handling of elective and mandatory course enrollments directly linked to the student's unique mapping details (UUID/Hall Ticket fallback tracking).
- **Data Exports:** Generate and download official university reports directly into `.xlsx` (Excel), CSV, or PDF formats.
- **Visuals:** Uses interactive graphs to showcase day-by-day and subject-by-subject attendance trends over time.

#### 👨‍🏫 2. Faculty Portal
- **Class & Attendance Management:** Faculty members get a robust interface summarizing their assigned subjects and allowing them to mark class attendance efficiently.
- **Request Approvals:** A built-in triage center to review, approve, or reject student queries regarding leaves of absence and attendance corrections.

#### ⚙️ 3. Admin Portal
- **Global Overview:** Centralized control over the system.
- **Curriculum & Data:** Define and open courses for enrollment, modify university hierarchies, and ensure database integrity.

---

## 🛠 Technical Architecture

- **Frontend:** Built with React, TypeScript, and Vite.
- **UI & Styling:** Tailwind CSS coupled with shadcn/ui components for a premium, highly responsive mobile-first design.
- **Data Visualization & Export:** `recharts` for performance trend graphs, `xlsx` library for spreadsheet generation.
- **Backend & Database:** Powered by Supabase (PostgreSQL). Heavily utilizes:
  - Row Level Security (RLS) policies for strict endpoint isolation.
  - RPC Database Functions (e.g., automated increment course enrollment counts).
  - Realtime Subscriptions (`postgres_changes`) to instantly update graphs when faculty mark attendance.

## 🚀 Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Configure your environment variables to link your local instance to your Supabase project
4. Start the application with `npm run dev`
