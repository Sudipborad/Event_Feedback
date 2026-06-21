# FeedbackHub - Event Feedback Management System

FeedbackHub is a modern, responsive full-stack web application designed for collecting, storing, and reviewing attendee feedback for corporate events, tech workshops, and conferences. Built using the MERN stack (React, Fastify, MongoDB), it features role-based access control (RBAC), admin consoles, user review panels, professional layouts, sleek dark mode aesthetics, dynamic category filtering, and database-backed toast confirmations.

---

## 🚀 Key Features

* **Role-Based Access Control (RBAC)**: Enforces clear separation between roles.
  * **Admin Role**: Global access to create, edit, and delete events, view analytics, and view feedbacks specifically matching selected events (with server-side search filters). Admins are barred from submitting reviews.
  * **User Role**: Browse events, submit feedback (tied to their authenticated account), and view/edit/delete their own feedback history (searchable).
* **Anonymous Guest Submissions**: Allows unauthenticated visitors (Guests) to submit feedback on events directly by entering their `Name` and `Email` in addition to their rating and message. Guests cannot view histories, edit, or delete feedback later.
* **Cascading Deletions**: Deleting an event as an admin automatically deletes all reviews submitted for that event in the database, preventing orphaned data records.
* **Easiest Admin Promotion Route**: Instant promotion query endpoint allowing developers and QA engineers to elevate any user to Admin:
  `GET /api/auth/promote?email=user@example.com&code=admin123`
* **Professional Hero & Landing Pages**: Sleek dark mode visual overlays, gradients, and engaging copy detailing feedback mechanics.
* **Responsive Navigation**: Dynamic header options and sidebar components that adapt to screen sizes and user roles.
* **UX Premium Feedbacks**:
  * **Toast Alerts**: Micro-animations validating successful edits, deletions, or errors.
  * **Interactive Rating Stars**: Hover effects and click interactions for feedback submissions and editing.
  * **Loading Skeletons**: Pulsing placeholders matching card layouts during backend query phases.

---

## 📁 Repository Structure

```text
c:\Users\HP\Desktop\InternShip\
├── index.html                  # Main HTML entry and SEO metadata
├── tailwind.config.js          # Tailwind CSS settings
├── postcss.config.js           # PostCSS processor setup
├── vite.config.js              # Vite React bundler settings
├── package.json                # Frontend package configurations
├── README.md                   # Project instructions
├── DOCUMENTATION.md            # Technical design, schemas, and QA
├── DEPLOYMENT.md               # Step-by-step production guides
├── SUBMISSION_CHECKLIST.md     # Quality assurance and testing checklist
├── public/                     # Horizontal image assets
├── backend/                    # Fastify API Server
│   ├── .env                    # (Ignored) Server credentials
│   ├── .env.example            # Environment variables example template
│   ├── package.json            # Server package configurations
│   ├── server.js               # Entry point and db connectors
│   └── src/
│       ├── app.js              # Fastify registration and CORS settings
│       ├── config/
│       │   └── db.js           # MongoDB connection and Admin Seeding
│       ├── middlewares/
│       │   └── auth.js         # verifyJWT and verifyAdmin guards
│       ├── models/
│       │   ├── User.js         # Mongoose User Schema
│       │   ├── Event.js        # Mongoose Event Schema
│       │   └── Feedback.js     # Mongoose Feedback Schema
│       ├── controllers/
│       │   ├── authController.js     # User registration and login
│       │   ├── eventController.js    # Event CRUD (with cascading delete)
│       │   ├── feedbackController.js # User-only reviews and Admin inspection
│       │   └── dashboardController.js# Aggregated Admin dashboard stats
│       └── routes/
│           ├── auth.js         # Authentication endpoints
│           ├── events.js       # Event routes
│           ├── feedback.js     # Feedback routes
│           └── dashboard.js    # Dashboard analytics routes
└── src/                        # React Frontend
    ├── main.jsx                # Router wrapping and mounting
    ├── App.jsx                 # Routing and layout structure
    ├── index.css               # Fonts import (Outfit, Plus Jakarta Sans)
    ├── components/
    │   ├── Navbar.jsx          # Mobile collapsible header
    │   ├── AdminSidebar.jsx    # Sidebar navigation for admin views
    │   ├── EventCard.jsx       # Reusable card component
    │   ├── ProtectedRoute.jsx  # Role-based route guard
    │   └── Skeleton.jsx        # Pulsing card loading card
    ├── services/
    │   └── api.js              # Axios connection module
    └── pages/
        ├── Home.jsx            # Landing and hero CTAs
        ├── Events.jsx          # Event lists and category filters
        ├── EventDetails.jsx    # Event details and inline review forms
        ├── Login.jsx           # User authentication login page
        ├── Register.jsx        # User account signup page
        ├── MyFeedback.jsx      # User reviews panel (inline edit/delete)
        ├── AdminDashboard.jsx  # System statistics grid and highlights
        ├── AdminEvents.jsx     # Event CRUD modals control center
        └── AdminFeedback.jsx   # Platform-wide review management stream
```

---

## 🛠️ Local Development & Quick Start

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **MongoDB** (A local running instance on port `27017` or a MongoDB Atlas connection string)

### 1. Set Up the Backend
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the server dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory based on the `.env.example` file:
   ```env
   PORT=5000
   HOST=127.0.0.1
   FRONTEND_URL=http://localhost:5173
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/event_feedback
   JWT_SECRET=event-feedback-management-secret-key-2026
   ```
4. Start the Fastify backend server:
   ```bash
   # Dev script (runs with Node's native file-watcher for live reload)
   npm run dev
   ```

---

## 🔑 Admin Setup & Access

On backend startup, the system automatically checks if an Admin account exists. If not, it seeds a default Admin:
* **Admin Email**: `admin@example.com`
* **Admin Password**: `AdminPassword123!`

### Easiest Way to Promote Any User to Admin (Developer/QA Hook):
If you want to elevate any other registered user account (e.g. `test@example.com`) to Admin:
1. Register the user normally on the website.
2. Enter this URL in your browser:
   `http://localhost:5000/api/auth/promote?email=test@example.com&code=admin123`
3. Log in with that account, and they will immediately have Admin Console access.
   *(Note: For registration convenience, any email ending with `@admin.com` also gets the Admin role automatically)*
