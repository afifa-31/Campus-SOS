# CampusSOS 🚨

CampusSOS is a campus issue reporting and tracking platform designed to help students report maintenance, safety, and facility-related problems in a structured and centralized way.

Instead of depending on scattered communication channels, students can submit an issue, provide its location and description, select its priority, and track whether the issue is Open or Resolved.

---

## Problem Statement

Students often face problems such as damaged classroom equipment, water leakage, broken furniture, access-card problems, and other campus facility issues.

When these problems are reported through different communication channels, they can be difficult to organize, search, prioritize, and track.

CampusSOS provides one centralized interface for reporting and monitoring these issues.

---

## Target Users

College students who need to report campus maintenance, safety, and facility issues and track their resolution status.

---

## Core Features

1. Create issue reports
2. View all reported issues
3. Search and filter reports
4. View complete report details
5. Update issue status between Open and Resolved

---

## Stretch Features

1. Priority-based dashboard insights
2. Confirmed report deletion

---

## Technology Stack

- React
- Vite
- JavaScript
- CSS
- MockAPI
- Browser localStorage

---

## Data Layer

CampusSOS uses MockAPI as its primary data source.

The application performs real CRUD operations:

- GET - retrieve reports
- POST - create reports
- PUT - update report status
- DELETE - delete reports

localStorage is also used for client-side persistence and to preserve an unfinished report draft across page refreshes.

---

## Application Flow

Student opens CampusSOS
        ↓
Creates an issue report
        ↓
Adds title, location, description and priority
        ↓
Report is stored through MockAPI
        ↓
Report appears in the issue dashboard
        ↓
Student can search/filter the report
        ↓
Student can view report details
        ↓
Issue status can be changed
        ↓
Open → Resolved

---

## Validation and Error Handling

The application includes:

- Required-field validation
- Maximum 400-character description
- Submit protection while a request is in progress
- Loading states
- Empty states
- API error handling
- localStorage fallback
- Form draft persistence
- Confirmation before deletion
- Responsive layout for mobile screens

---

## Responsive Design

CampusSOS is designed to work on desktop and mobile screen sizes.

The application was specifically tested against the 375px mobile width required by the hackathon evaluation.

---

## AI Disclosure

AI tools were used during development.

We used ChatGPT as a development assistant for several implementation-heavy and complex parts of the project, including:

- React component structure and implementation
- MockAPI CRUD integration
- Asynchronous API request handling
- Loading, empty and error states
- Form validation and submission handling
- localStorage persistence
- Form draft persistence across refreshes
- Search and filtering logic
- Priority-based dashboard calculations
- Responsive CSS implementation
- Debugging and improving application behavior
- Reviewing the application against the hackathon stress-test requirements

The team was responsible for defining the project idea, Scope Card, feature decisions, UI requirements, testing requirements, integration, and final review of the application.

We reviewed and tested the generated implementation so that we could understand the application logic and explain the code during evaluation.

---

## Why CampusSOS?

CampusSOS helps make campus issue reporting more organized and visible.

Its main advantages are:

- Centralized issue reporting
- Easy searching and filtering
- Clear Open/Resolved tracking
- Priority-based issue visibility
- Persistent report data
- Better organization of campus problems
- Simple and student-friendly interface

---

## Future Improvements

For a production version, CampusSOS could be extended with:

- Student and staff authentication
- Role-based access
- Assigning issues to maintenance staff
- Status history/timeline
- Notifications
- Photo attachments
- Department/category assignment
- Integration with the college maintenance workflow

These features are not part of the current hackathon Scope Card.

---

## Team

- Team Member 1: [Bantu Kavyanjali]
- Team Member 2: [Desiraju Poojitha]
- Team Member 3: [Shaik Farhana]
- Team Member 4: [Afifa Afsar]

---

## Hackathon

Built for the PVPSIT Frontend Hackathon.