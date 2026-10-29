# Smart Library Management System

## Product Requirements + UI/UX + Implementation Blueprint

**Project type:** Full-stack web application\
**Frontend:** React.js + Vite\
**Backend:** Node.js + Express.js\
**Database:** MongoDB + Mongoose\
**Authentication:** JWT access/session strategy with secure password
hashing\
**UI:** Responsive, accessible, modern SaaS dashboard\
**Project status:** Build-ready specification for Antigravity

------------------------------------------------------------------------

## 1. Product Vision

Build a polished **Smart Library Management System** for students,
librarians, and administrators. It should make discovering books,
borrowing and returning books, tracking due dates, calculating fines,
and understanding library activity simple.

The application must be functional end-to-end---not just a static UI.
Frontend screens must connect to real Express API endpoints and MongoDB
data. Use sensible demo/seed data so the app can be evaluated
immediately.

### Main user roles

1.  **Guest:** Explore the public home page and book catalogue; sign in
    or register.
2.  **Student:** Search books, save favourites, request/borrow books
    according to library rules, see current loans, due dates, history,
    fines, recommendations, barcode/QR information, alerts, and chat
    with the library assistant.
3.  **Librarian:** Manage book inventory, issue/return books, inspect
    overdue loans, calculate/record fines, and assist students.
4.  **Admin:** Manage users, roles, catalogue, circulation settings,
    fines, notifications, analytics, and audit/activity records.

Use role-based access control on both the client and server. Hiding a
button in the UI is not security; protected API routes must enforce
permissions.

------------------------------------------------------------------------

## 2. Information Architecture / Routes

### Public

-   `/` --- Smart home / landing page
-   `/books` --- Public book explorer
-   `/books/:id` --- Book details
-   `/login` --- Sign in
-   `/register` --- Student registration
-   `/forgot-password` --- Password reset request (if email delivery is
    not configured, provide a clearly labelled development flow)

### Student

-   `/student` --- Student dashboard
-   `/student/loans` --- Current and past loans
-   `/student/saved` --- Saved books
-   `/student/recommendations` --- Recommended books
-   `/student/fines` --- Fine summary and payment/status history
-   `/student/notifications` --- Due-date alerts and messages
-   `/student/assistant` --- AI/library assistant chat
-   `/student/profile` --- Profile and preferences

### Librarian

-   `/librarian` --- Circulation overview
-   `/librarian/issue-return` --- Issue and return workflow
-   `/librarian/loans` --- All active, returned, and overdue loans
-   `/librarian/fines` --- Fine review and recording
-   `/librarian/scan` --- Barcode/QR scanning interface with manual
    fallback

### Admin

-   `/admin` --- Admin dashboard
-   `/admin/books` --- Book catalogue and inventory management
-   `/admin/books/new` --- Add a book
-   `/admin/users` --- User and role management
-   `/admin/loans` --- All issue/return records
-   `/admin/fines` --- Fine settings and records
-   `/admin/analytics` --- Library analytics
-   `/admin/categories` --- Category/subject management
-   `/admin/settings` --- Loan policy, alerts, and system settings
-   `/admin/activity` --- Audit log

If a single role is used initially, implement student and admin fully
and create a coherent librarian workflow. Do not create dead-end pages
or fake buttons.

------------------------------------------------------------------------

## 3. UI/UX Direction

### Visual language

-   Premium, clean, calm, academic technology product.
-   Light neutral background (`#F7F8FA`), white surfaces, deep ink text
    (`#171923`), and a restrained blue/indigo accent (`#4F46E5`).
-   Avoid neon colors, excessive gradients, glassmorphism, and
    over-decorated cards.
-   Use generous whitespace, consistent spacing, crisp borders, subtle
    shadows, and clear typography.
-   Use Lucide icons consistently. Use real book cover thumbnails where
    available; fall back to a tasteful cover placeholder with title
    initials.
-   Use a responsive layout: desktop sidebar + top bar; mobile bottom
    navigation or compact drawer.
-   Include loading skeletons, empty states, validation messages, toast
    feedback, confirmation dialogs, and error states.
-   Follow accessibility basics: semantic HTML, visible focus states,
    keyboard navigation, sufficient contrast, and labelled form
    controls.

### Core shell

**Desktop:** Fixed/collapsible left sidebar, top bar with global search,
notifications, help/assistant entry, and user profile menu.\
**Mobile:** Compact header, drawer navigation, stacked cards, responsive
tables converted to usable lists/cards.

### Design quality rules

-   Establish reusable design tokens and components before building
    pages.
-   Avoid a generic template look: use thoughtful hierarchy, meaningful
    book imagery, compact but readable analytics, and purposeful
    micro-interactions.
-   Every interactive element must work.
-   Tables need search, sorting where useful, pagination, loading,
    empty, and error states.
-   Confirm destructive actions such as deleting a book or changing a
    user's role.

------------------------------------------------------------------------

## 4. Smart Home Page

Create a modern public landing page with:

1.  **Navigation:** Brand/logo, Explore Books, Features, About, Sign In,
    and a primary "Explore Library" CTA.
2.  **Hero section:** Clear headline such as "Your library,
    intelligently connected." Supporting copy describing discovery,
    borrowing, and due-date tracking. Include a prominent search field
    that searches title, author, subject, and ISBN.
3.  **Quick discovery:** Popular categories and subject chips.
4.  **Featured books:** Book covers, title, author, availability label,
    and details link.
5.  **How it works:** Discover → Borrow → Track → Return.
6.  **Smart features:** AI/library assistant, due-date reminders,
    barcode-assisted circulation, saved books, and library insights.
7.  **Library statistics:** Show real API-driven numbers when available.
    Never invent live counts; demo seed values must be labelled as
    demo/sample data.
8.  **Footer:** Useful navigation, contact/help information, and privacy
    links.

The home page must work on small mobile screens and provide a clear
route to the catalogue.

------------------------------------------------------------------------

## 5. Authentication & Registration

-   Student registration fields: full name, email, password, confirm
    password, student ID (if required by the institution), and optional
    department/course.
-   Login by email and password.
-   Hash passwords with bcrypt or bcryptjs; never store plaintext
    passwords.
-   Validate all fields on both client and server.
-   Use secure authentication handling. Prefer httpOnly secure cookies
    where practical; if using bearer tokens, document the
    storage/security trade-offs and avoid unsafe long-lived tokens in
    localStorage.
-   Add logout, session expiry handling, protected routes, role-aware
    navigation, and useful error messages.
-   Prevent duplicate email/student ID.
-   Admin accounts must not be publicly self-registered. Seed a
    development admin through environment configuration or a seed
    script.
-   Do not expose secrets or credentials in frontend code or commit
    `.env`.

------------------------------------------------------------------------

## 6. Book Explorer & Catalogue

### Search

Search across: - Title - Author - Subject/description - ISBN -
Category/tags

Support debounced search, clear-search action, empty results, and
pagination. Search must be implemented on the server for larger
datasets.

### Filters and sorting

-   Category/subject
-   Availability: available / unavailable / all
-   Author
-   Publication year (optional)
-   Language (optional)
-   Sort by relevance, title, author, newest added, or popularity if the
    required data exists

Keep active filters visible and make "Clear all" easy to find.

### Book cards

Each card should display: - Cover image or fallback - Title and author -
Category/subject - Availability badge - Available copies / total
copies - Save/favourite control (for signed-in users) - "View details"
action

### Book detail page

-   Cover, title, author(s), ISBN, publisher, publication year,
    language, category, subject, and description
-   Availability and stock status
-   Total copies and available copies
-   Borrow/request action according to policy and user eligibility
-   Save/unsave action
-   Similar/recommended books
-   Clear explanation if the book is unavailable

Do not allow available copies to become negative. The backend must check
inventory atomically or with a safe transaction/conditional update.

------------------------------------------------------------------------

## 7. Student Dashboard

Design a personalized dashboard with the following modules:

### Summary cards

-   Currently borrowed
-   Due soon
-   Overdue
-   Outstanding fines

### Current loans

For each loan show book cover/title, issue date, due date, days
remaining or days overdue, status, and available actions. Use a clear
visual warning for near-due/overdue books without relying on color
alone.

### Other modules

-   Recently borrowed / borrowing history
-   Saved books
-   Recommended books
-   Recent notifications
-   Quick search and "Explore books" action
-   AI/library assistant shortcut

### Student history

Show issue date, due date, return date, status, and fine amount for each
record. Support filtering by current, returned, overdue, and all.

### Recommendations

Start with a transparent, practical recommendation engine: - Same
category/subject as saved or borrowed books - Popular books based on
actual loan counts - New additions - Exclude unavailable books only if
the library policy requires it; otherwise label availability clearly

Do not claim recommendations are AI-powered unless an actual AI service
is integrated.

------------------------------------------------------------------------

## 8. Issue, Return, Loan Records & Fine Calculation

Create one reliable circulation system shared by student, librarian, and
admin screens.

### Issue workflow

-   Search/select a student and book.
-   Validate student account, book availability, borrowing limit, and
    any outstanding restrictions configured by the library.
-   Create a loan record with `issuedAt`, `dueAt`, `status`, and the
    issuing staff member.
-   Decrease available inventory safely.
-   Show a success confirmation and update the dashboard.

### Return workflow

-   Find a loan by student, book title, loan ID, or barcode/ISBN.
-   Confirm the selected loan and return action.
-   Record `returnedAt`, calculate the final fine, update loan status,
    and restore inventory exactly once.
-   Prevent double returns and duplicate inventory increments.
-   Record the staff member performing the return.

### Default fine policy

Make policy configurable from admin settings. Seed sensible defaults,
clearly labelled as examples: - Loan duration: 14 days - Grace period: 0
days - Fine: ₹5 per overdue day - Maximum fine: configurable (default
₹500) - Fine applies only to overdue calendar days, not future days. -
`overdueDays = max(0, calendarDaysBetween(dueAt + gracePeriod, returnedAtOrNow))`,
according to the policy's exact boundary rule. -
`fine = min(overdueDays × finePerDay, maximumFine)`

Implement date calculations consistently in one backend utility using
the library's configured timezone. Clearly document whether the due date
itself is fine-free and start charging on the next calendar day. Never
calculate authoritative fines only in the browser.

### Loan statuses

-   `ACTIVE`
-   `OVERDUE` (derived from due date when not returned, or maintained
    safely)
-   `RETURNED`
-   `LOST` (optional)
-   `CANCELLED` (optional)

Prefer deriving overdue status from loan state and due date to avoid
stale statuses. Keep status transitions validated.

### All records

Provide searchable, filterable, paginated records for: - Active loans -
Returned loans - Overdue loans - Fine records - Issue/return audit
events

Store fine amount and policy context at the time of calculation where
appropriate, and preserve a history of adjustments. Do not silently
overwrite financial records.

### Fine payments

If online payment is not integrated, implement a clear payment status
such as `UNPAID`, `PAID`, `WAIVED`, with admin/librarian recording and
audit trail. Do not show a fake payment gateway or claim payment has
occurred.

------------------------------------------------------------------------

## 9. AI Library Assistant

Create a chat interface that helps users discover books and understand
library rules.

### Capabilities

-   Find books by topic, reading level, author, subject, or interest.
-   Recommend available books using the actual catalogue.
-   Answer library policy questions using configured policy data.
-   Explain the user's own loan due dates and fine status only after
    authentication and authorization.
-   Provide quick prompt chips such as "Recommend beginner-friendly
    books", "Find books on web development", and "What is my next due
    date?"
-   Offer book cards with availability and a direct details link when
    relevant.

### Implementation requirements

-   Create a provider abstraction so a real LLM can be connected later
    through a server-side API key.
-   Keep all AI keys on the server in environment variables.
-   If no AI provider/key is configured, use a clearly labelled fallback
    assistant that searches the catalogue and answers from stored
    library policy. Never pretend a real LLM is connected.
-   Treat user input as untrusted. The assistant must not bypass role
    permissions or reveal another student's information.
-   Include a short disclaimer that recommendations can be imperfect and
    library records are authoritative.
-   Add rate limiting and safe error handling to the chat endpoint.

------------------------------------------------------------------------

## 10. Smart Due-Date Alerts & Notifications

-   Create in-app notifications for loans due soon and overdue.
-   Default reminder schedule (configurable): 3 days before due date, 1
    day before, on due date, and after becoming overdue.
-   Avoid sending duplicate reminders for the same loan and reminder
    stage.
-   Add a notification bell with unread count, notification list,
    read/unread state, and "mark all as read".
-   Implement a scheduled backend job (e.g. node-cron) for reminders,
    with a documented timezone and idempotent logic.
-   Email/SMS delivery is optional and must be configured with real
    credentials before being presented as enabled. In-app notifications
    must work without external services.
-   Provide a development/manual trigger for testing reminder
    generation.

------------------------------------------------------------------------

## 11. Barcode / QR Support

-   Generate a unique barcode or QR code for each book copy or library
    accession ID. ISBN alone may identify a title rather than an
    individual physical copy, so support copy-level IDs.
-   Add a scan page using a browser-compatible camera scanner library if
    supported.
-   Ask for camera permission only when the user starts scanning.
-   Include manual entry/search fallback for unsupported devices or
    denied permission.
-   On scan, show the matching book/copy and current status, then allow
    authorized staff to issue or return after confirmation.
-   Validate all scanned values on the server; never trust a scanned
    code as authorization.

------------------------------------------------------------------------

## 12. Admin Dashboard & Analytics

### Overview cards

-   Total catalogue titles
-   Total physical copies
-   Available copies
-   Active loans
-   Overdue loans
-   Outstanding fines
-   Registered students

### Charts and insights

-   Issues and returns over time
-   Most borrowed books
-   Popular categories
-   Overdue trend
-   Inventory availability breakdown
-   Active users/borrowers, if data supports it

All metrics must come from API/database aggregation, not hardcoded
values. Show useful empty states when there is insufficient data. Label
demo seed data as sample data.

### Management tools

-   Create, edit, archive/delete books with safeguards
-   Manage categories and metadata
-   Manage users and roles
-   Suspend/reactivate student accounts
-   Review loans and returns
-   Configure borrowing rules and fines
-   Review fine adjustments/waivers
-   View audit log
-   Export filtered records to CSV where practical

Use soft deletion/archive for books that have historical loans, rather
than breaking historical records.

------------------------------------------------------------------------

## 13. Data Model (Suggested Mongoose Schemas)

### User

-   `name`
-   `email` (unique, normalized)
-   `passwordHash`
-   `role` (`STUDENT`, `LIBRARIAN`, `ADMIN`)
-   `studentId` (optional, unique when present)
-   `department` (optional)
-   `isActive`
-   `createdAt`, `updatedAt`

### Book

-   `title`
-   `authors` (array)
-   `isbn` (indexed; unique only where the chosen ISBN policy supports
    it)
-   `description`
-   `categoryId`
-   `subjects` (array)
-   `publisher`
-   `publicationYear`
-   `language`
-   `coverImageUrl`
-   `totalCopies`
-   `availableCopies`
-   `popularityCount` or derive popularity from loans
-   `isArchived`
-   timestamps

### BookCopy (recommended for copy-level tracking)

-   `bookId`
-   `accessionCode` (unique)
-   `barcodeValue` (unique)
-   `status` (`AVAILABLE`, `ISSUED`, `LOST`, `DAMAGED`)
-   `location` / shelf code
-   timestamps

### Loan

-   `userId`
-   `bookId`
-   `bookCopyId` (if copy-level tracking enabled)
-   `issuedAt`
-   `dueAt`
-   `returnedAt`
-   `status`
-   `issuedBy`
-   `returnedBy`
-   `fineAtReturn`
-   `finePolicySnapshot`
-   timestamps

### Fine

-   `loanId`
-   `userId`
-   `amount`
-   `paidAmount`
-   `status` (`UNPAID`, `PARTIALLY_PAID`, `PAID`, `WAIVED`)
-   `reason`
-   `adjustments` (with actor, amount, reason, timestamp)
-   timestamps

### SavedBook

-   `userId`
-   `bookId`
-   unique compound index on `userId + bookId`

### Notification

-   `userId`
-   `type`
-   `title`
-   `message`
-   `relatedLoanId`
-   `scheduledFor`
-   `sentAt`
-   `readAt`
-   `deduplicationKey` (unique where appropriate)
-   timestamps

### Category

-   `name`
-   `slug` (unique)
-   `description`

### ChatConversation / ChatMessage (optional)

-   `userId`
-   messages with role, content, timestamp
-   apply retention limits and do not store unnecessary sensitive data

### AuditLog

-   `actorUserId`
-   `action`
-   `entityType`
-   `entityId`
-   safe metadata (no password hashes/tokens)
-   timestamp

Use references and indexes thoughtfully. Do not duplicate user passwords
or sensitive data into loan/chat records.

------------------------------------------------------------------------

## 14. REST API Plan

Use a consistent response format and central error middleware.

### Authentication

-   `POST /api/auth/register`
-   `POST /api/auth/login`
-   `POST /api/auth/logout`
-   `GET /api/auth/me`
-   `POST /api/auth/forgot-password` (optional, only if safely
    implemented)

### Books

-   `GET /api/books` --- query, filters, sorting, pagination
-   `GET /api/books/:id`
-   `POST /api/books` --- librarian/admin
-   `PATCH /api/books/:id` --- librarian/admin
-   `DELETE /api/books/:id` --- admin; archive where history exists
-   `GET /api/books/featured`
-   `GET /api/books/recommendations` --- authenticated
-   `POST /api/books/:id/save` --- authenticated
-   `DELETE /api/books/:id/save` --- authenticated
-   `GET /api/books/saved` --- authenticated

### Loans / circulation

-   `GET /api/loans/me`
-   `GET /api/loans/me/history`
-   `GET /api/loans` --- staff/admin with filters
-   `POST /api/loans/issue` --- staff/admin
-   `POST /api/loans/:id/return` --- staff/admin
-   `GET /api/loans/:id`

### Fines

-   `GET /api/fines/me`
-   `GET /api/fines` --- staff/admin
-   `PATCH /api/fines/:id/payment-status` --- authorized staff/admin,
    audited
-   `POST /api/fines/:id/adjustments` --- admin/authorized staff with
    reason

### Users and admin

-   `GET /api/users` --- admin
-   `GET /api/users/:id` --- self or admin
-   `PATCH /api/users/:id` --- permission-checked
-   `PATCH /api/users/:id/status` --- admin
-   `GET /api/admin/analytics/overview`
-   `GET /api/admin/analytics/borrowing`
-   `GET /api/admin/activity`
-   `GET /api/categories`
-   `POST /api/categories` --- staff/admin
-   `PATCH /api/settings/library-policy` --- admin

### Notifications and assistant

-   `GET /api/notifications`
-   `PATCH /api/notifications/:id/read`
-   `PATCH /api/notifications/read-all`
-   `POST /api/assistant/chat`
-   `POST /api/notifications/test-reminders` --- development/admin only

Document request parameters and response shapes in the README. Validate
object IDs, query params, payloads, and authorization on every protected
route.

------------------------------------------------------------------------

## 15. Recommended Folder Structure

``` text
smart-library/
  client/
    src/
      app/ or routes/
      components/
        ui/
        layout/
        books/
        dashboard/
        circulation/
        assistant/
      pages/
      hooks/
      services/
      context/
      utils/
      styles/
      assets/
    public/
    .env.example
    package.json
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      jobs/
      utils/
      validators/
      seed/
      app.js
      server.js
    .env.example
    package.json
  README.md
  .gitignore
```

Use JavaScript consistently unless there is a compelling reason to
introduce TypeScript. Keep frontend and backend responsibilities
separate. Avoid placing all logic in a single file.

------------------------------------------------------------------------

## 16. Security, Reliability & Quality

-   Use `helmet`, strict CORS allowlist, request rate limiting, and safe
    error handling.
-   Validate and sanitize incoming data with a schema validator such as
    Zod, Joi, or express-validator.
-   Use Mongoose schema validation and indexes.
-   Hash passwords with bcrypt/bcryptjs.
-   Keep secrets in `.env`; include only placeholder values in
    `.env.example`.
-   Never commit real credentials or database connection strings.
-   Use role-based authorization middleware.
-   Prevent NoSQL injection and mass assignment; explicitly allow
    editable fields.
-   Use safe pagination limits and query allowlists.
-   Make issue/return operations atomic or transaction-safe where
    supported.
-   Avoid logging passwords, tokens, or unnecessary personal
    information.
-   Use centralized API errors and user-friendly frontend messages.
-   Add tests for authentication, role permissions, issue/return
    inventory, fine boundaries, and duplicate reminders.
-   Ensure responsive layouts and keyboard accessibility.
-   Add an error boundary and a not-found page.

------------------------------------------------------------------------

## 17. Environment Variables

Provide `.env.example` files with placeholders, for example:

### Server

``` env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/smart_library
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
LIBRARY_TIMEZONE=Asia/Kolkata
FINE_PER_DAY=5
MAX_FINE=500
LOAN_DURATION_DAYS=14
AI_PROVIDER=none
AI_API_KEY=
```

### Client

``` env
VITE_API_BASE_URL=http://localhost:5000/api
```

Do not put server secrets in variables prefixed with `VITE_`. Add `.env`
to `.gitignore`.

------------------------------------------------------------------------

## 18. Seed Data & Demo Experience

Create a seed script that adds: - 1 development admin - 1 librarian -
5--10 sample student accounts - 25--40 sample books across multiple
categories - Categories, book copies, and a mix of active, returned, and
overdue loans - Example notifications and fine records

Use fictional sample identities and clearly document seed credentials in
the local README only. Do not create a public default admin credential
for production. Ensure the seed script is safe to rerun without creating
duplicates.

------------------------------------------------------------------------

## 19. Implementation Phases

Build in small, verifiable phases. Do not attempt a huge untested code
dump.

### Phase 1 --- Foundation

-   Inspect existing repository and preserve working code.
-   Set up React/Vite client and Express server if missing.
-   Configure MongoDB connection, environment variables, shared error
    handling, and health endpoint.
-   Establish design tokens, routing, layout shell, and responsive
    navigation.

### Phase 2 --- Authentication & catalogue

-   Implement registration/login/logout/me.
-   Implement role middleware and protected routes.
-   Build home page, book explorer, details page, filters, pagination,
    and book management.
-   Seed demo catalogue.

### Phase 3 --- Circulation

-   Implement issue/return operations, copy-level stock, loan records,
    due dates, fine calculations, and audit logs.
-   Add automated tests for stock integrity and fine boundaries.

### Phase 4 --- Student experience

-   Build dashboard, current loans, history, saved books,
    recommendations, fines, and notifications.

### Phase 5 --- Admin/librarian

-   Build dashboards, inventory/users/categories management, circulation
    console, fine management, analytics, and CSV export.

### Phase 6 --- Assistant, alerts, barcode

-   Build catalogue/policy assistant fallback and optional LLM adapter.
-   Add scheduled reminder job and deduplication.
-   Add barcode/QR generation and scanning with manual fallback.

### Phase 7 --- QA & handoff

-   Test every route and workflow.
-   Fix console errors, server errors, broken links, and responsive
    issues.
-   Run lint/build/tests and report actual outcomes.
-   Write complete README with setup, environment variables, seed
    process, API summary, limitations, and deployment instructions.

After each phase, run the relevant checks and fix failures before
continuing.

------------------------------------------------------------------------

## 20. Definition of Done

The project is complete only when:

-   The frontend and backend start using documented commands.
-   MongoDB connects successfully, or a clear setup error explains what
    is missing.
-   Registration/login/logout and protected routes work.
-   Roles are enforced server-side.
-   Search, filters, sorting, and pagination work against the API.
-   Book inventory is correct after issue and return.
-   Fine calculations are server-side, tested, and configurable.
-   Students can see their own loans, history, saved books,
    recommendations, fines, and notifications.
-   Staff can issue/return books and review records.
-   Admin can manage books, users, policies, and analytics.
-   Barcode/QR flow has a manual fallback.
-   Assistant fallback works without an AI key and is honest about its
    capabilities.
-   Due-date reminder generation is idempotent and documented.
-   Loading, empty, success, and error states exist.
-   Mobile and desktop layouts are usable.
-   No critical buttons are decorative or nonfunctional.
-   `.env.example`, seed script, README, and tests are included.
-   Final report lists what is complete, what is optional/unconfigured,
    commands run, test/build results, and any remaining issues.

------------------------------------------------------------------------

# Antigravity Execution Instructions

Use this document as the source of truth. First inspect the existing
project and identify the current framework, files, dependencies, and
incomplete features. Do not overwrite working code blindly.

**Execution rules:** 1. Implement the project in the phases above. 2.
Before editing, provide a short repository assessment and a concrete
implementation checklist. 3. Then start implementation immediately; do
not stop after planning or merely generate a mockup. 4. Work directly in
the project files. Create and edit all required client/server code. 5.
Run installation, lint, tests, and production build commands where
available. Fix errors caused by your changes. 6. Verify real end-to-end
flows: register/login, search books, issue a book, return a book,
calculate fine, and role-based admin access. 7. Do not fake API
responses, analytics, AI, payment, email, or barcode scanning. If an
external integration cannot be configured, build a truthful fallback and
document the limitation. 8. Do not delete existing files or replace the
repository architecture without explaining why and preserving useful
work. 9. Never hardcode secrets. Create `.env.example` and explain what
values the developer must supply. 10. If a command fails, diagnose and
fix it; do not silently skip it. 11. Keep the interface polished and
consistent with the UI/UX direction in this specification. 12. Continue
phase by phase until the Definition of Done is met. If context or time
limits interrupt work, leave a concise progress note in
`IMPLEMENTATION_STATUS.md` with completed work, files changed, tests
run, current blocker, and exact next steps.

At the end, summarize: - Features implemented - Main files/routes
created - Setup and run commands - Required environment variables -
Seed/demo account instructions - Tests/builds actually run and their
results - Integrations still requiring credentials - Known limitations
and next steps

**Important:** Do not claim a feature is complete unless it is
implemented and verified. Start by inspecting the repository, then
execute the work---not just describe how it could be done.
