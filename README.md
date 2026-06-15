# FeedbackHub - Event Feedback Management System

FeedbackHub is a modern, responsive full-stack web application designed for collecting, storing, and reviewing attendee feedback for corporate events, tech workshops, and conferences. Built using the MERN stack (React, Fastify, MongoDB), it features professional layouts, sleek dark mode aesthetics, dynamic category filtering, skeleton loading states, and instant database-backed toast confirmations.

## 🚀 Key Features

* **Professional Hero & Landing Pages**: Sleek dark mode visual overlays, gradients, and engaging copy detailing feedback mechanics.
* **Responsive Navigation**: Adaptive header routing with a collapsible mobile menu.
* **Category Event Filtering**: Dynamic filter buttons on the events page to isolate categories (Technology, Design, Business) with smooth transition effects.
* **Smart Redirect**: Pre-populates the feedback form's selected event when navigating directly from any Event Card.
* **Form Validation**: Rigorous client-side input checking (empty properties, email format regex, minimum message lengths).
* **Database Integration**: Fully integrated with MongoDB via Mongoose for persistent data storage.
* **Premium UX Feedbacks**:
  * **Toast Alerts**: Self-dismissing slide-in notifications validating successful inserts or connection drops.
  * **Loading Skeletons**: Pulsing placeholders matching the card schema during server query loading phases.
  * **Initials Avatars**: Generates profile bubbles using initials (e.g. `AM` for Alex Mercer) on feed items.
  * **Illustrated Empty State**: Graceful fallback UI when no records exist.

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
│   ├── favicon.svg
│   ├── tech_summit.png
│   ├── design_conf.png
│   └── pitch_night.png
├── backend/                    # Fastify API Server
│   ├── .env                    # (Ignored) Server credentials
│   ├── .env.example            # Environment variables example template
│   ├── package.json            # Server package configurations
│   ├── server.js               # Entry point and db connectors
│   └── src/
│       ├── app.js              # Fastify registration and CORS settings
│       ├── config/
│       │   └── db.js           # MongoDB Mongoose connection
│       ├── models/
│       │   └── Feedback.js     # Mongoose Feedback Schema
│       └── routes/
│           ├── welcome.js      # /api/welcome
│           └── feedback.js     # /api/feedback (GET and POST)
└── src/                        # React Frontend
    ├── main.jsx                # Router wrapping and mounting
    ├── App.jsx                 # Routing and layout structure
    ├── index.css               # Fonts import (Outfit, Plus Jakarta Sans)
    ├── components/
    │   ├── Navbar.jsx          # Mobile collapsible header
    │   ├── EventCard.jsx       # Reusable card component
    │   ├── Skeleton.jsx        # Pulsing card loading card
    │   └── Toast.jsx           # Animated alert toaster
    ├── services/
    │   └── api.js              # Axios connection module
    └── pages/
        ├── Home.jsx            # Landing and hero CTAs
        ├── Events.jsx          # Event lists and category filters
        └── Feedback.jsx        # Submission form, skeletons, and recent feed
```

---

## 🛠️ Local Development & Quick Start

Follow these instructions to run both the frontend and backend applications on your local environment:

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
   ```
4. Start the Fastify backend server:
   ```bash
   # Production script
   npm start
   
   # Dev script (runs with Node's native file-watcher for live reload)
   npm run dev
   ```

### 2. Set Up the Frontend
1. Open a new terminal and navigate to the root folder:
   ```bash
   cd ..
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite local dev server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173/`.
