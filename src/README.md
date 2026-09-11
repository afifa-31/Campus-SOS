# 🚨 CampusSOS

CampusSOS is a role-based campus issue reporting and tracking system designed to make it easier for students to report campus problems and for management to review, prioritize, and resolve them.

The system separates student and management access so that students can privately track their own complaints while management can monitor issues across the campus.

---

## 📌 Problem Statement

Students often face problems such as:

- Water leakage
- Electrical issues
- Damaged furniture
- Cleanliness problems
- Missing or damaged facilities
- Campus safety concerns
- Other maintenance issues

When these complaints are handled through scattered communication channels, it becomes difficult to track their progress and know whether an issue has actually been resolved.

CampusSOS provides one centralized platform for reporting and managing these issues.

---

## 🎯 Objective

The main objective of CampusSOS is to provide a simple and structured workflow:

**Student reports an issue → Management reviews it → Management assigns priority → Management updates status → Issue gets resolved**

This creates better visibility and accountability for campus complaints.

---

# 👥 User Roles

CampusSOS has two separate user roles.

## 🎓 Student

Students can:

- Log in using their roll number and password
- Report a new campus issue
- Enter the issue title
- Enter the location
- Describe the problem
- View only their own submitted reports
- Search their own reports
- View report details
- Track the current status of their reports

Students cannot:

- View other students' reports
- Assign priority
- Change report status
- Delete reports

This keeps the reporting experience simple and prevents students from changing operational information.

---

## 🏫 Management

Management can:

- Log in through the management portal
- View all campus reports
- Search reports
- Filter reports by status
- Filter reports by priority
- View reporter information
- Review issue descriptions
- Assign priority
- Update issue status
- Track the resolution progress
- Delete unnecessary or duplicate reports

Management has the operational controls required to process and resolve campus complaints.

---

# 🔄 Issue Status Workflow

Every new report starts with:

**Open**

Management can then move it through:

**Open → In Review → Resolved**

### Open

The complaint has been submitted but has not yet been processed.

### In Review

Management is reviewing or working on the issue.

### Resolved

The issue has been addressed and completed.

Students can see the current status of their own reports.

---

# 🚦 Priority System

Priority is controlled by management.

Available priority levels:

- 🔴 High
- 🟠 Medium
- 🟢 Low

Students do not select priority because priority should be determined according to the severity and campus impact of the issue.

For example:

- Electrical safety issue → High
- Broken classroom furniture → Medium
- Minor facility inconvenience → Low

Management can also filter reports based on priority.

---

# 🔐 Authentication

CampusSOS provides separate login experiences for students and management.

### Student Login

Students enter:

- Roll number
- Password

For the hackathon demo, any non-empty student roll number and password can be used.

The roll number becomes the student's unique identifier for separating their reports in the application.

### Management Login

Demo management credentials:

- Email: management@campussos.com
- Password: admin123

---

## ⚠️ Authentication Note

The current authentication system is a frontend/demo implementation created for the hackathon.

It is not connected to the college's real authentication system.

In a production deployment, authentication should be handled through a secure backend or college SSO system, with:

- Secure password handling
- Server-side authentication
- Server-side authorization
- Protected API endpoints
- Role-based access control

---

# 🔒 Student Report Privacy

Students only see reports associated with their logged-in student ID.

The application filters reports using the student's account identifier.

This creates separate student views while management can access the complete operational report list.

### Production consideration

The current hackathon version performs this filtering in the frontend.

For a real production system, access control must also be enforced by the backend so that a student cannot directly request another student's report through an API.

---

# 🗃️ Data Layer

CampusSOS uses MockAPI as the remote data layer.

The application uses asynchronous CRUD operations:

- GET — retrieve reports
- POST — create a report
- PUT — update a report
- DELETE — remove a report

This gives the application a real asynchronous data flow instead of using fake `setTimeout()` calls.

---

# 💾 Local Storage

Local storage is used for lightweight frontend persistence.

It is used for:

- Maintaining the demo login session
- Preserving an unfinished report form draft

Local storage is not used as the primary report database.

Reports are stored through the MockAPI data layer.

---

# 🧩 Core Features

## 1. Role-Based Login

Users enter through either:

- Student Portal
- Management Portal

Each role receives a different dashboard and different permissions.

## 2. Student Issue Reporting

Students can submit:

- Issue title
- Location
- Description

A newly submitted issue receives the default status:

**Open**

## 3. Student Report Tracking

Students can view their own submitted reports and track:

- Current status
- Issue information
- Assigned priority, when management has assigned one
- Resolution progress

## 4. Management Dashboard

Management receives an overview of:

- Total issues
- Open issues
- In Review issues
- Resolved issues
- High-priority issues
- Medium-priority issues
- Low-priority issues

## 5. Search and Filtering

Management can search across reports and filter them by:

- Status
- Priority

Students can search only within their own reports.

## 6. Priority Management

Management can assign:

- High
- Medium
- Low

priority based on severity and impact.

## 7. Status Management

Management can update reports through:

**Open → In Review → Resolved**

## 8. Report Deletion

Management can remove unnecessary or duplicate reports.

Students do not have delete permission.

---

# 🖥️ Application Screens

### Authentication

- Student Login
- Management Login

### Student Portal

- Student Dashboard
- Report Issue
- Student Report Details

### Management Portal

- Management Dashboard
- Management Report Details

---

# 🛠️ Technology Stack

- React
- Vite
- JavaScript
- CSS
- MockAPI
- Browser Local Storage
- Git & GitHub

---

# 📁 Project Structure

```text
CampusSOS/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── PriorityBadge.jsx
│   │   ├── ReportCard.jsx
│   │   └── StatusTracker.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── ReportIssue.jsx
│   │   ├── StudentReportDetails.jsx
│   │   ├── ManagementDashboard.jsx
│   │   └── ManagementReportDetails.jsx
│   │
│   ├── services/
│   │   ├── auth.js
│   │   └── reportsApi.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── README.md
└── vite.config.js
