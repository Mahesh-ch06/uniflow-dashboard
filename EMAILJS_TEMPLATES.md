# EmailJS Templates for UniFlow Dashboard

Use these templates in your EmailJS dashboard.

## 1) Faculty Welcome Template

- Template ID suggestion: `template_faculty_welcome`
- Used by: Admin → Create Faculty

### Subject
```text
Welcome to UniFlow Dashboard - Faculty Account Credentials
```

### Email Body
```text
Hello {{to_name}},

Welcome to {{app_name}}.

Your faculty account has been created successfully.

Faculty ID: {{faculty_id}}
Temporary Password: {{temp_password}}
Department: {{department}}

Login URL: {{login_url}}

Please log in and change your password after first sign-in.

Regards,
University Admin Team
```

### Required Template Variables
- `to_email`
- `to_name`
- `faculty_name`
- `faculty_id`
- `temp_password`
- `department`
- `login_url`
- `app_name`

---

## 2) Student Absent Alert Template

- Template ID suggestion: `template_student_absent`
- Used by: Faculty → Save Attendance (for absent students)

### Subject
```text
Attendance Alert: Marked Absent in {{course_name}} on {{attendance_d}}
```

If your template was using `{{attendance_dat}}` by mistake, change it to `{{attendance_date}}`.

### Email Body
```text
Hello {{to_name}},

You have been marked as {{status}} in the following class:

Course: {{course_name}}
Batch / Section: {{batch_name}}
Date: {{attendance_d}}
Faculty: {{faculty_name}}

Current Attendance: {{current_attendance}}
Hall Ticket: {{hall_ticket}}

Please review your attendance in the portal:
{{portal_url}}

If this is incorrect, submit a correction request from your student dashboard.

Regards,
{{app_name}} Notification Service
```

### Required Template Variables
- `to_email`
- `to_name`
- `name` (compatibility)
- `email` (compatibility)
- `from_name`
- `from_email`
- `reply_to`
- `student_name`
- `hall_ticket`
- `course_name`
- `batch_name`
- `attendance_date`
- `attendance_dat` (compatibility alias)
- `attendance_d` (compatibility alias)
- `current_attendance`
- `faculty_name`
- `portal_url`
- `app_name`
- `status`

---

## EmailJS UI Field Mapping (Important)

In EmailJS template settings, use these values:

- To Email: `{{to_email}}`
- From Name: `{{from_name}}` (or `{{app_name}}`)
- From Email: keep **Use Default Email Address** enabled
- Reply To: `{{reply_to}}`
- Cc / Bcc: optional (keep empty unless needed)

Do not use broken placeholders like `{{attendance_dat` (missing `}}`) — EmailJS will not render it.
