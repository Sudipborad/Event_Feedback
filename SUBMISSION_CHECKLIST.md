# QA Submission Checklist - Event Feedback Management System

Use this checklist to perform quality assurance checks on the application before final submission.

---

## 1. Routing & Navigation Checkpoints

- [x] **Desktop Nav Links**: Clicking Home, Events, and Feedback links correctly switches routes.
- [x] **Active Page Indicator**: Active links display a bottom border to indicate the current page.
- [x] **Mobile Drawer Collapsible**: Screens below `768px` render a hamburger menu button that slides open the drawer when clicked.
- [x] **Card Redirects**: Clicking "Share Feedback" on any Event card redirects to `/feedback` with the matching event URL parameter (e.g. `?event=Global%20Design%20Conference`).
- [x] **Automatic Selection**: When arriving via a card link, the event name input dropdown automatically selects that event.

---

## 2. Form Input & Validation Checkpoints

- [x] **Null Value Blockers**: Clicking "Submit Feedback" with blank fields triggers inline validation errors.
- [x] **Format Filters**: Entering an invalid email structure (e.g., `test@`) blocks submissions and displays a format error.
- [x] **Length Controls**: Feedback messages with fewer than `10` characters display a validation error.
- [x] **Button Blockers**: Submitting the form disables the Submit button, changes the text to "Submitting...", and prevents duplicate network requests.

---

## 3. Data Integration Checkpoints

- [x] **MongoDB Atlas storage**: Successful submission writes the record directly to your Atlas database.
- [x] **Retrieval & Feed Update**: Newly submitted feedback is retrieved via `GET /api/feedback` and displayed at the top of the submissions list (ordered by `createdAt` descending).
- [x] **Avatar Badge Generation**: Feedback list items display profile circle icons with the user's initials.
- [x] **Database Error Indicators**: Disabling connection links or database instances triggers a global network warning banner in the client and displays a Toast alert.
- [x] **Illustrated Empty State**: Clearing database collections displays the illustrated "No feedback submissions" card.
