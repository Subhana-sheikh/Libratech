# Libratech — Smart Library Management System

[![Node.js](https://img.shields.io/badge/Node.js-v20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-v4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://mongoosejs.com/)

Libratech is a modern, production-minded Smart Library Management System designed for university and institutional environments. It provides seamless catalog discovery, atomic circulation workflows, authoritative server-side fine calculations, real-time stock tracking, in-app due-date alerts, an AI-powered library assistant, and database-driven analytics.

---

## 1. System Architecture

```text
Libratech/
├── client/                     # Frontend (React 18, Vite, Tailwind CSS, Lucide, Recharts)
│   ├── src/
│   │   ├── components/         # Reusable UI, layout, book cards, circulation modals, AI drawer
│   │   ├── context/            # Authentication & role-based permission context
│   │   ├── pages/              # Public, Student, Librarian, and Admin views
│   │   ├── services/           # Reusable API service with Bearer token handling
│   │   ├── App.jsx             # Route definitions & Role-based ProtectedRoute guards
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                     # Backend (Node.js, Express.js, Mongoose, JWT, Cron)
│   ├── src/
│   │   ├── config/             # DB connection resilience & constants
│   │   ├── controllers/        # Auth, Books, Loans, Fines, Users, Admin, Assistant
│   │   ├── jobs/               # Idempotent due-date reminder cron job
│   │   ├── middleware/         # Auth, Role authorization, Centralized error handling
│   │   ├── models/             # Mongoose schemas (User, Book, BookCopy, Loan, Fine, etc.)
│   │   ├── routes/             # RESTful API routing under /api/*
│   │   ├── seed/               # Deterministic seed script with demo credentials
│   │   ├── services/           # Circulation, Recommendation, and Assistant services
│   │   ├── utils/              # Authoritative fine calculator, JWT helpers, Audit logger
│   │   ├── app.js              # Express app setup, security headers, CORS, rate limiting
│   │   └── server.js           # Server bootstrap & background jobs launcher
│   ├── tests/                  # Automated unit test suite (Native Node.js test runner)
│   └── package.json
├── IMPLEMENTATION_STATUS.md    # Real-time task and phase execution checklist
└── smart-library-management-system-spec.md  # Original system blueprint
```

---

## 2. Core Features Implemented

### Public & Discovery
- **Smart Public Home Page:** Hero banner with quick topic search, real-time database-driven metrics, discipline category grid, featured collection additions, 4-step circulation workflow breakdown, and responsive navigation.
- **Book Explorer (`/books`):** Multi-field search (title, author, subject, ISBN, description) with debouncing, category facet filtering, availability toggles (`all`, `available`, `unavailable`), sorting options, and pagination.
- **Book Details (`/books/:id`):** Real-time shelf inventory badge, copy-level accession codes, shelf location codes, similar book recommendations, and one-click bookmarking.

### Authentication & Authorization
- **Role-Based Access Control (RBAC):** Server-side enforcement with JWT bearer tokens / httpOnly cookies for three distinct roles: `STUDENT`, `LIBRARIAN`, and `ADMIN`.
- **Student Registration:** Public self-registration for students with client and server validation (name, email, student ID, department, password hashing with `bcryptjs`).
- **Staff Security:** Administrative and librarian accounts cannot be registered publicly and must be provisioned by an existing admin or initialized via the database setup script.
- **Production-Ready Login Flow:** Clean, secure email and password authentication with validation, error handling, session cookies, and JWT tokens.

### Circulation & Inventory Integrity
- **Atomic Book Issuing:** Server atomically decrements `availableCopies` with safe concurrency guards (`availableCopies: { $gt: 0 }`), assigns physical copy accession codes, validates student loan limits (max 4 books), and records staff issuer IDs.
- **Duplicate Return Prevention:** Returned loans transition to `RETURNED` state and cannot be returned twice. Restores physical copy inventory exactly once.
- **Authoritative Server Fine Engine:** Evaluates calendar boundaries past `dueAt + gracePeriodDays`. Overdue days and fines are calculated on the server with daily rates (default ₹5/day) and configurable ceiling caps (default ₹500/book).
- **Physical Copy Level Tracking:** Each book manages multiple physical `BookCopy` records with unique `accessionCode`, `barcodeValue`, and shelf locations.

### Barcode & QR Scanner
- **Camera-Based Scanning (`html5-qrcode`):** Scans accession barcodes or QR stickers directly through browser cameras with on-demand permission prompts.
- **Manual Fallback Search:** Instant lookup by barcode or accession code if a camera is unavailable. Resolves the physical copy and immediately routes to either Return (if active) or Issue (if available).

### AI Library Assistant
- **Grounded Assistant:** Researches the actual university catalogue, checks personal active loans and due dates for authenticated users, and explains circulation policies.
- **Honest Provider Fallback:** Clear disclaimer indicating catalogue & policy search mode when external LLM API keys are not supplied.

### Notifications & Reminders
- **Idempotent Reminder Scheduler:** Node-cron job running daily at 08:00 AM. Evaluates active loans at 3 days before due date, 1 day before, on due date, and overdue milestones. Deduplication keys prevent duplicate alerts.
- **Notification Center:** Header dropdown with unread badge, dedicated alerts page, mark read, and mark all read capabilities.

### Administrator Workspace
- **System Analytics Dashboard:** Interactive charts (Circulation Trends Area Chart, Category Distribution Bar Chart, Top Borrowed Books leaderboard).
- **Catalogue & Inventory Manager:** Add, edit, and safe-archive books (archived instead of deleted if loan history exists to preserve audit integrity).
- **User & Role Administration:** Deactivate/reactivate student accounts and change user roles.
- **Policy Settings:** Configurable loan duration, grace period, fine per day, maximum fine cap, and student loan limits.
- **Immutable Audit Trail:** Paginated audit log tracking user registrations, loan issues, returns, payments, and policy changes.

---

## 3. Installation & Setup

### Prerequisites
- Node.js v18+ (tested on Node.js v20 LTS)
- npm v9+
- MongoDB instance (local service or MongoDB Atlas connection string)

### 1. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables Configuration

#### Server (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/smart_library
JWT_SECRET=libratech_super_secret_jwt_key_development_2026_xyz
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
LIBRARY_TIMEZONE=Asia/Kolkata
FINE_PER_DAY=5
MAX_FINE=500
LOAN_DURATION_DAYS=14
GRACE_PERIOD_DAYS=0
MAX_BOOKS_PER_STUDENT=4
AI_PROVIDER=none
AI_API_KEY=
```

#### Client (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 4. Database Setup & Seeding

### Starting MongoDB
1. **Local MongoDB:** Start the MongoDB service:
   ```powershell
   net start MongoDB
   # or run mongod directly
   mongod --dbpath <data-dir>
   ```
2. **MongoDB Atlas (Cloud):** Update `server/.env` with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_library?retryWrites=true&w=majority
   ```

### Populating Seed Data
Run the idempotent seed script to populate categories, 30 books, physical copies, and demo accounts:
```bash
cd server
npm run seed
```

### Pre-configured Demo Accounts
| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@libratech.edu` | `Password@123` | Full administrative console, analytics, settings |
| **Librarian** | `librarian@libratech.edu` | `Password@123` | Circulation desk, issue/return, barcode scanning |
| **Student 1** | `aarav.sharma@student.edu` | `Password@123` | Active loans due in 5 days and tomorrow |
| **Student 2** | `ananya.iyer@student.edu` | `Password@123` | Active loan 4 days overdue |
| **Student 3** | `rohan.gupta@student.edu` | `Password@123` | Has outstanding unpaid returned fine record |

---

## 5. Running the Application

### Start Backend API Server
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### Start Frontend Client
```bash
cd client
npm run dev
# Frontend starts on http://localhost:5173
```

---

## 6. Verification & Automated Testing

### Backend Test Suite
The backend contains automated tests verifying fine boundary calculations, grace periods, maximum fine caps, password hashing, and role-based route middleware.

Run the test suite:
```bash
cd server
npm test
```

**Actual Execution Results:**
```text
# tests 12
# suites 2
# pass 12
# fail 0
# cancelled 0
# skipped 0
# duration_ms 1225.7294
```

### Frontend Production Build
Verify the production Vite bundle:
```bash
cd client
npm run build
```

**Actual Execution Results:**
```text
✓ 2445 modules transformed.
dist/index.html                     0.85 kB │ gzip:   0.50 kB
dist/assets/index-DM8nCBWc.css     39.75 kB │ gzip:   7.09 kB
dist/assets/index-Db04KDp0.js   1,086.05 kB │ gzip: 305.27 kB
✓ built in 13.67s
```

---

## 7. External Integrations & Fallbacks

- **AI Provider:** When `AI_PROVIDER=none` or unconfigured, the assistant defaults to a catalogue search and stored circulation policy engine. For real LLM reasoning, set `AI_PROVIDER=gemini` or `openai` and provide `AI_API_KEY` in `server/.env`.
- **Payment Gateway:** Fine payments support administrative recording (`PAID`, `PARTIALLY_PAID`, `WAIVED`) with full audit notes. No simulated external payment gateway is displayed.
- **Email Delivery:** SMTP email transport is optional. Automated due-date reminders are delivered directly in-app.
