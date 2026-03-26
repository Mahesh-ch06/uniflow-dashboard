# UniFlow Dashboard

An end-to-end university academic operations platform built as a course project, with dedicated portals for Students, Faculty, and Admin.

## Demo Login Credentials

### Student
- Login ID / Hall Ticket: `2303A52037`
- Password: `@Mahesh06`

### Faculty
- Login ID: `F009`
- Password: `@Mahesh06`

### Admin
- Email: `chitikeshimahesh6@gmail.com`
- Password: `@Mahesh06`

---

## Table of Contents
- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [Core Features](#core-features)
- [Role-Based Workflows](#role-based-workflows)
- [System Architecture](#system-architecture)
- [Database Design (Supabase)](#database-design-supabase)
- [Realtime & Business Logic](#realtime--business-logic)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Setup and Run](#setup-and-run)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

---

## Project Overview

UniFlow Dashboard is a centralized academic management application designed to digitize day-to-day university operations. It provides secure, role-aware dashboards where:
- Students track attendance, request corrections, and manage course registrations.
- Faculty manage attendance operations and review student requests.
- Admins maintain institutional master data and monitor platform-level activity.

The project focuses on practical campus needs: transparency, faster approvals, real-time visibility, and reducing manual paperwork.

## Problem Statement

Traditional campus workflows often depend on disconnected systems, manual records, and delayed updates. This creates common issues:
- Students cannot quickly verify if attendance was marked correctly.
- Faculty spends time managing repetitive manual updates.
- Admin teams struggle with data consistency across modules.

UniFlow solves this through a unified web platform backed by a real-time cloud database.

## Objectives

1. Build a responsive academic dashboard for three user roles.
2. Provide real-time, date-wise attendance visibility.
3. Implement attendance compliance analytics based on minimum required percentage.
4. Enable request-based workflows (leave/correction) with tracking.
5. Improve reliability for course registration and user identity mapping.

## Core Features

### 1) Authentication & Session Management
- Role-based login for Student, Faculty, and Admin.
- Session inactivity expiry support for improved security.
- Persistent login state using browser storage.

### 2) Advanced Attendance Module
- Live attendance percentage and compliance status.
- Date-wise attendance logs and filtering by semester/subject.
- “Today” view to verify current-day attendance quickly.
- Risk indicators:
  - Classes needed to reach 75%.
  - Number of classes that can be missed safely.
- Attendance trend charts for performance tracking.

### 3) Leave / Correction Request Pipeline
- Students submit attendance-related requests with reason and date.
- Faculty reviews pending requests and takes action.
- Request history visible to students with status tracking.

### 4) Course Registration Reliability
- Handles schema differences and fallback identity mapping.
- Supports elective/mandatory logic for enroll/drop workflows.

### 5) Reporting & Export
- Export attendance data as CSV, Excel, and print-friendly PDF.

## Role-Based Workflows

### Student Workflow
1. Login using hall ticket and password.
2. Open attendance dashboard.
3. Check “Today” tab to verify latest class status.
4. Review analytics and shortage alerts.
5. Submit leave/correction request if needed.
6. Track request approval status.

### Faculty Workflow
1. Login using faculty ID and password.
2. Mark student attendance by class/date.
3. Review and process pending student requests.
4. Maintain course-level attendance integrity.

### Admin Workflow
1. Login with admin email and password.
2. Manage master entities (students, courses, departments).
3. Monitor system data consistency and operational readiness.

## System Architecture

The application follows a client-driven architecture with cloud-backed data services:

- Frontend (React + TypeScript)
  - Role-specific pages and dashboards.
  - Reusable UI components for consistency.
  - Data visualization and export features.

- Backend as a Service (Supabase)
  - PostgreSQL database.
  - Realtime channels for instant updates.
  - Access controls and policy-based data protection.

## Database Design (Supabase)

The platform uses academic-domain tables such as:
- `students`, `faculty`, `admins`
- `courses`, `student_courses`
- `attendance`
- `attendance_requests`

Supporting SQL setup scripts are included in the repository for easier environment initialization.

## Realtime & Business Logic

- Attendance pages subscribe to `postgres_changes` to reflect updates without refresh.
- Attendance metrics are calculated from present/absent/late records.
- Compliance logic centers around a 75% attendance benchmark.
- Defensive fallback handling is implemented to avoid failures from schema/key mismatches.

## Project Structure

Key directories:
- `src/pages/student` – Student-facing dashboard modules
- `src/pages/faculty` – Faculty attendance and request handling pages
- `src/pages/admin` – Admin management pages
- `src/components` – Shared UI and table components
- `src/contexts` – Auth/session state management
- SQL setup files in repository root – Supabase schema and workflow setup

## Technology Stack

- Frontend: React, TypeScript, Vite
- Styling/UI: Tailwind CSS, shadcn/ui
- Charts: Recharts
- Data export: xlsx, CSV utilities, browser print
- Backend: Supabase (PostgreSQL + Realtime)
- Testing: Vitest (basic setup)
- Deployment: Vercel

## Setup and Run

### Prerequisites
- Node.js 18+
- npm (or compatible package manager)
- Supabase project with required schema/tables

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd uniflow-dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env` (you can copy from `.env.example`):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_EMAILJS_SERVICE_ID`
  - `VITE_EMAILJS_PUBLIC_KEY`
  - `VITE_EMAILJS_TEMPLATE_FACULTY_WELCOME`
  - `VITE_EMAILJS_TEMPLATE_STUDENT_ABSENT`
4. Create EmailJS templates using `EMAILJS_TEMPLATES.md`.
5. Run SQL setup scripts in your Supabase SQL editor (as needed by modules).
6. Start development server:
   ```bash
   npm run dev
   ```

### Email Notifications (EmailJS)

Integrated notification flows:
- Admin creating a faculty account sends a welcome email with faculty ID and temporary password.
- Faculty marking absent students sends attendance alert emails including class name, date, and current attendance.
- Admin realtime in-app notifications support all students, selected students, all faculty, and selected faculty.

Template reference:
- `EMAILJS_TEMPLATES.md`
- Realtime notifications SQL setup: `supabase-setup-notifications.sql`

### Build for Production
```bash
npm run build
```

## Deployment

The project is deployment-ready for Vercel:
- Ensure environment variables are set in deployment settings.
- Trigger deploy from GitHub integration or CLI.

## Future Enhancements

- Notification center for request approvals/rejections.
- Timetable-aware attendance reminders.
- OTP/2FA for stronger authentication.
- Analytics dashboard for institutional insights.
- Audit logs for admin actions.

---

## Course Project Notes

This project demonstrates practical application of:
- Full-stack web engineering concepts
- Role-based access and workflow design
- Real-time systems using event-driven updates
- Data modeling for academic operations
- Production-style UI/UX and module architecture

It is suitable for academic project evaluation, demos, and portfolio presentation.
