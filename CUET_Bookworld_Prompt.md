# 🎓 CUET Bookworld — Full-Stack React Website Prompt

## Overview

Build a complete, modern, responsive web application called **CUET Bookworld** — a digital library management system exclusively for students and staff of **Chittagong University of Engineering & Technology (CUET)**. The app should feel like a premium university platform — clean, professional, and student-friendly. The tech stack is **React** (with hooks, React Router for navigation). Use **Tailwind CSS** for styling. You may use any UI component library you prefer (shadcn/ui, Radix, etc.). You are free to add any feature, animation, Easter egg, creative UI element, or creative interaction you feel would enhance the experience — just keep it professional and university-appropriate.

---

## 🎨 Design System & Theme

- **Primary Color:** A rich university blue (`#1a56db` or similar deep blue)
- **Accent Color:** Gold/amber (`#d4a017` — inspired by CUET's logo colors)
- **Background:** Light gray/white (`#f8fafc`)
- **Dark Mode:** Fully supported — toggle in header and in user settings
- **Typography:** Clean sans-serif (Inter or Poppins)
- **Border radius:** Rounded cards (8–12px)
- **Shadows:** Soft card shadows throughout
- **Animations:** Subtle fade-in on page load, hover lift effects on cards, smooth transitions between pages
- **Logo:** A book icon combined with CUET gear/cog icon in the header — display "CUET Bookworld" as the brand name
- **Favicon:** Book icon

---

## 👥 User Roles & Access Control

The system has **three distinct roles**. Each role sees a different navigation and dashboard:

### 1. 🎓 Student (Primary User)
- Can register and log in with CUET email
- Can browse, search, and filter the book catalog
- Can borrow books (physical) — submit borrow request
- Can renew borrowed books — submit renewal request with preferred time slot
- Can read e-books online
- Can view their profile: borrowed books, due dates, fines, renewal history
- Can receive book recommendations based on their department/year
- Can manage notification and theme settings
- Can join/schedule video conference sessions with librarians or peers

### 2. 📚 Librarian / Library Authority
- Full access to book inventory management (add, edit, delete books)
- Approve or reject borrow requests
- Approve or reject renewal requests
- Schedule video conference meeting slots for students
- View all student borrowing records
- Issue fine notifications
- Generate basic reports (most borrowed books, overdue list, etc.)
- Manage e-book uploads/links

### 3. ⚙️ System Administrator
- Full access to everything the Librarian can do
- Manage user accounts (approve new registrations, suspend/deactivate accounts)
- Assign roles (promote a user to Librarian, etc.)
- View system-wide analytics dashboard (total users, total books, borrowing trends)
- Manage site settings (announcement banners, maintenance mode)

---

## 🗂️ Pages & Routes

### Public Pages (No Login Required)

#### `/` — Landing / Home Page
- Full-width hero section with gradient background (blue to dark blue):
  - Headline: "Welcome to CUET Bookworld"
  - Subheadline: "Your digital gateway to CUET's academic library — borrow, read, and learn from anywhere."
  - Two CTA buttons: **"Browse Books"** and **"Get Started"**
- **Feature Highlights Section** — 4 cards in a grid:
  - 📖 Online Book Borrowing
  - 🔄 Easy Renewal
  - 📱 Read E-Books Anywhere
  - 🎥 Video Consultation with Librarians
- **Stats Bar** — Animated counters:
  - Total Books: e.g. 2,500+
  - Registered Students: 1,200+
  - E-Books Available: 400+
  - Departments Covered: 12+
- **How It Works Section** — 3-step visual process:
  1. Register with your CUET email
  2. Browse and borrow books
  3. Read online or pick up from library
- **Featured / Recommended Books Carousel** — horizontal scroll of 6–8 book cards
- **Announcement Banner** (if set by Admin): e.g. "Library will be closed on 21st February"
- **Footer:**
  - Links: Home, Book List, E-Books, Renew, Login
  - Contact: library@cuet.ac.bd | +880-31-XXXXXX
  - Address: CUET, Chittagong-4349, Bangladesh
  - Social media icons (Facebook, YouTube)
  - Copyright notice

#### `/auth` — Authentication Page
- Split screen layout:
  - Left side: CUET Bookworld branding, logo, tagline, a background book-shelf illustration
  - Right side: Login / Register toggle
- **Login Form:**
  - Email field (must be @cuet.ac.bd or accepted CUET email)
  - Password field with show/hide toggle
  - "Forgot Password?" link
  - "Log In" button
  - Link to switch to Sign Up
- **Sign Up / Register Form:**
  - Full Name
  - Student/Staff ID (e.g. 2204010)
  - Department (dropdown: CSE, EEE, CE, ME, URP, etc. — all CUET departments)
  - Academic Year (1st / 2nd / 3rd / 4th year — for students; "Faculty" for teachers)
  - CUET Email address
  - Password + Confirm Password
  - "Register" button
  - Note: "Your account will be verified by the admin before activation."
- **Forgot Password Page** (`/auth/forgot-password`):
  - Enter registered email, receive reset link (simulated)

---

### Protected Pages (Login Required)

#### `/home` — Student Dashboard (after login)
- Welcome message: "Hello, [Name] 👋 — [Department], [Year] Year"
- **Quick Action Cards** (large icon buttons):
  - 📚 Browse Book List
  - 🔄 Renew a Book
  - 📖 Read E-Books
  - 👤 View My Profile
- **My Borrowed Books Widget** — table showing currently borrowed books:
  - Columns: Book Title | Author | Borrow Date | Due Date | Remaining Days | Fine (Tk) | Status (Active / Overdue)
  - Overdue rows highlighted in red with a warning icon
- **Notifications Panel** — recent alerts:
  - "Your renewal request for [book] has been approved."
  - "Book [title] is due in 3 days."
  - "A new e-book has been added: [title]."
- **Recommended Books Section** — 4 book cards recommended based on user's department
- **Upcoming Video Meeting** — if scheduled, show date/time and join button

---

#### `/books` — Book List / Catalog Page
- Page header: "CSE Book List" (dynamic based on filter)
- Subheader: "Browse and borrow academic books from CUET Bookworld"
- **Search Bar** — search by title, author, or ISBN
- **Filter Sidebar / Top Filter Bar:**
  - Category/Subject (Algorithms, Networks, Operating Systems, AI, Database, Mathematics, Physics, etc.)
  - Availability (All / Available Now / Borrowed)
  - Department (CSE, EEE, CE, etc.)
  - Year Level (1st year books, 2nd year, etc.)
  - Sort by: Newest | Alphabetical | Most Borrowed
- **Book Grid** — responsive 3-column grid (2 on tablet, 1 on mobile):

  Each **Book Card** contains:
  - Book cover image (placeholder if not available — styled "image not available" tile)
  - Book Title (bold)
  - Author(s)
  - Short description / tagline (1–2 lines)
  - Subject/Category badge (e.g. "Algorithms", "Networks")
  - Department tag
  - Availability status badge: ✅ Available | ❌ Unavailable | ⚠️ Limited (1 copy left)
  - Number of copies available (e.g. "3 of 5 available")
  - ⭐ Rating (average from student reviews)
  - "View Details" button → opens book detail modal or page
  - "Borrow" button (disabled if unavailable or user already has max books)

- **Pagination** — bottom pagination controls
- **Empty State** — "No books found. Try a different search."

---

#### `/books/:id` — Book Detail Page
- Full book information:
  - Large cover image (left side)
  - Title, Author, Publisher, Year, ISBN, Edition
  - Subject / Department / Year Level tags
  - Full description / synopsis
  - Number of copies: total / available
  - Availability status
  - Current borrowers count
- **Action Buttons:**
  - "Borrow This Book" → opens Borrow Request Modal
  - "Read Online" (if e-book link is available)
  - "Add to Wishlist / Save" (bookmarked for later)
- **Borrow Request Modal:**
  - Confirm student name and ID (pre-filled)
  - Select pickup date
  - Submit borrow request
  - Note: "Borrow limit: 1st–3rd year = 3 books | 4th year = 4 books"
- **Student Reviews & Ratings Section:**
  - 5-star rating widget
  - Text review form
  - Display existing reviews with name, rating, date, comment
- **Related Books Section** — 4 cards of similar subject books

---

#### `/ebooks` — E-Books Library Page
- Page header: "E-Books Library"
- Subheader: "Search and read Computer Science e-books online from anywhere"
- **Search bar** — search by title or author
- **Subject Filter Dropdown:**
  - All Topics
  - Algorithms
  - Networks
  - Operating Systems
  - Artificial Intelligence
  - Database
  - Mathematics
  - Programming
- **E-Book Grid** — 3-column responsive grid:

  Each **E-Book Card** contains:
  - Book cover image / placeholder
  - Title (bold)
  - Author(s)
  - Subject badge
  - Short description
  - "Read Online" button (opens in a modal reader or new tab PDF viewer)
  - "Download PDF" button (if allowed)
  - View count badge (e.g. "👁️ 1,240 reads")

- **Featured E-Book Banner** — highlighted e-book at the top with a large card

---

#### `/renew` — Book Renewal Page
- Page header: "Renew Your Borrowed Books"
- Subheader: "Please read the rules carefully before applying for renewal"

- **Borrowing Rules Panel** (styled info box):
  - 1st, 2nd, and 3rd year students can borrow up to **3 books**
  - 4th year students can borrow up to **4 books**
  - Books can be renewed within **30 days** from the borrow date
  - After 30 days, a fine of **1 Tk per day per book** will be applied
  - Renewal requires applying for a **time slot** and attending a **live meeting** for approval

- **Apply for Renewal Slot Form:**
  - Select Your Year (dropdown: 1st / 2nd / 3rd / 4th / Faculty)
  - Number of Books Currently Borrowed (number input)
  - Preferred Date for Renewal Meeting (date picker)
  - Preferred Time Slot (dropdown: 9:00 AM / 10:00 AM / 11:00 AM / 2:00 PM / 3:00 PM / 4:00 PM)
  - Additional Notes (optional textarea)
  - "Apply for Renewal" submit button
  - Confirmation message: "After submitting, the authority will contact you with a meeting link for live renewal."

- **My Current Borrows Table** (below the form):
  - Columns: Book Title | Borrow Date | Due Date | Remaining Days | Fine (Tk) | Action
  - "Select for Renewal" checkbox on each row
  - Overdue rows in red

---

#### `/profile` — User Profile Page
- Header: "Your Profile" — "Manage your info, borrowed books, renewals, fines, and settings here."
- **Two-column layout:**

  **Left Column — Personal Information Card:**
  - Avatar / profile photo (with upload button)
  - Name
  - Student ID
  - Department
  - Academic Year
  - Email
  - Member Since date
  - Account Status badge (Active / Pending / Suspended)
  - "Edit Profile" button → inline edit mode

  **Right Column — Borrowed Books Table:**
  - Columns: Book Title | Borrow Date | Renewal Due | Remaining Days | Fine (Tk)
  - Overdue shown in red with "Overdue" badge
  - "Request Renewal" button per row

- **Tabs below the main section:**
  - **Borrowing History** — all past borrowed & returned books with dates
  - **Wishlist / Saved Books** — books the student saved
  - **Reviews Given** — books the student reviewed
  - **Notifications** — all past notifications

- **Settings Panel (bottom of left column):**
  - Email Notifications: Enabled / Disabled (toggle)
  - Theme: Light / Dark (dropdown or toggle)
  - Change Password:
    - Current Password
    - New Password
    - Confirm New Password
    - "Save Password" button
  - "Save Settings" button

---

#### `/video` — Video Consultation / Conference Page
- Page header: "Academic Video Consultations"
- Subheader: "Connect with librarians or join group study sessions"
- **Upcoming Sessions Panel:**
  - List of scheduled meetings for the logged-in student
  - Each session card shows: Title, Date, Time, Host (Librarian name), "Join Meeting" button (links to Zoom/Google Meet URL)
- **Request a Session Form:**
  - Topic / Reason (text input)
  - Preferred Date (date picker)
  - Preferred Time Slot (dropdown)
  - Type: One-on-One with Librarian / Group Study Session
  - "Submit Request" button
- **Past Sessions History** — list of past attended sessions

---

### Librarian Dashboard Pages

#### `/librarian/dashboard` — Librarian Home
- Stats cards at top:
  - Total Books in Inventory
  - Books Currently Borrowed
  - Pending Borrow Requests
  - Overdue Books
  - Active Students
- **Pending Borrow Requests Table:**
  - Student Name | Student ID | Book Requested | Department | Date Requested | Action (Approve / Reject)
- **Pending Renewal Requests Table:**
  - Student Name | Book | Meeting Date Requested | Time Slot | Action (Approve & Set Link / Reject)
- **Overdue Books Alert Table:**
  - Student Name | Book Title | Due Date | Days Overdue | Fine Amount | "Notify Student" button
- **Quick Links:** Add New Book | Manage E-Books | View All Students | Generate Report

#### `/librarian/books` — Book Inventory Management
- Full CRUD for books:
  - **Add New Book Form:**
    - Title, Author(s), Publisher, Year, ISBN, Edition
    - Subject/Category (multi-select)
    - Department tags
    - Year Level tags
    - Number of copies
    - Cover image upload
    - Description/Synopsis
    - E-Book PDF link (optional)
    - "Add Book" button
  - **Book List Table** with Edit / Delete buttons per row
  - Bulk actions: Delete selected, Export list as CSV

#### `/librarian/ebooks` — E-Book Management
- Add / Edit / Delete e-books
- Fields: Title, Author, Subject, PDF link, cover image, description
- Toggle "publicly visible" on/off

#### `/librarian/students` — Student Records
- Search students by name or ID
- View each student's full borrowing history
- Mark fines as paid
- Suspend / activate accounts (forward request to admin)

#### `/librarian/reports` — Reports Page
- Most Borrowed Books (bar chart)
- Overdue Rate by Department (pie chart)
- Monthly Borrowing Activity (line chart)
- Export reports as PDF or CSV

---

### Admin Dashboard Pages

#### `/admin/dashboard` — Admin Home
- System-wide stats:
  - Total Registered Users
  - Pending Account Approvals
  - Total Books
  - Total E-Books
  - Active Borrowings
  - Total Fines Collected
- **Pending Registration Approvals Table:**
  - Name | ID | Email | Department | Registered On | Action (Approve / Reject)
- **System Health Panel:** Server status, last backup date (simulated)
- Announcement management: add/edit/remove site-wide banners

#### `/admin/users` — User Management
- Full list of all users with role, status, department
- Search and filter by role, department, status
- Edit user role (Student / Librarian / Admin)
- Activate / Deactivate / Delete accounts
- Bulk actions

#### `/admin/analytics` — Analytics Dashboard
- User growth over time (line chart)
- Books by department (bar chart)
- E-book reads by subject (pie chart)
- Login activity heatmap (optional, creative addition)

---

## 📐 Navigation Structure

### Header (all authenticated pages):
- Left: CUET Bookworld logo + name
- Center (desktop): Nav links — Home | Book List | E-Books | Renew | Video
- Right: 🔔 Notification bell (with badge count) | Dark mode toggle | User avatar dropdown:
  - My Profile
  - Settings
  - [If librarian: Librarian Dashboard]
  - [If admin: Admin Panel]
  - Logout

### Sidebar (Librarian & Admin dashboards):
- Collapsible sidebar on the left
- Icons + labels for each section
- Active link highlighted

---

## 🧩 Reusable Components to Build

- `BookCard` — used in catalog, recommendations, wishlist
- `EBookCard` — used in e-books page
- `BorrowedBooksTable` — used in profile and librarian views
- `NotificationBell` — with dropdown notification list
- `StarRating` — interactive and display versions
- `SearchBar` — with debounce
- `FilterPanel` — sidebar or top bar version
- `Modal` — generic modal wrapper (used for borrow form, book details, confirmations)
- `StatusBadge` — "Available", "Overdue", "Pending", "Approved" etc.
- `AvatarUpload` — profile picture component
- `ConfirmDialog` — "Are you sure?" confirmation modal
- `Pagination` — page navigation
- `Spinner / Skeleton Loader` — loading states for all data fetches
- `EmptyState` — friendly illustration + message when no data
- `AnnouncementBanner` — dismissible top banner
- `DarkModeToggle` — moon/sun icon toggle
- `ChartCard` — wrapper for charts in reports/analytics

---

## 📋 Data Models (Mock Data / State)

### Book Object:
```json
{
  "id": "book_001",
  "title": "Introduction to Algorithms",
  "authors": ["Thomas H. Cormen", "Charles E. Leiserson", "Ronald L. Rivest", "Clifford Stein"],
  "publisher": "MIT Press",
  "year": 2022,
  "isbn": "978-0262046305",
  "edition": "4th",
  "subject": ["Algorithms", "Data Structures"],
  "department": ["CSE"],
  "yearLevel": [1, 2, 3, 4],
  "totalCopies": 5,
  "availableCopies": 3,
  "description": "A comprehensive introduction to the modern study of algorithms.",
  "coverImage": null,
  "ebookLink": "https://example.com/algo.pdf",
  "rating": 4.7,
  "reviewCount": 24
}
```

### Student Object:
```json
{
  "id": "user_2204010",
  "name": "Angkan Chowdhury",
  "studentId": "2204010",
  "department": "CSE",
  "year": 3,
  "email": "angkan.cuet@gmail.com",
  "role": "student",
  "status": "active",
  "memberSince": "2022-10-01",
  "borrowLimit": 3,
  "notifications": true,
  "theme": "light"
}
```

### Borrow Record Object:
```json
{
  "id": "borrow_001",
  "studentId": "2204010",
  "bookId": "book_001",
  "borrowDate": "2026-01-15",
  "dueDate": "2026-02-14",
  "renewalDate": null,
  "status": "active",
  "fine": 0
}
```

### Review Object:
```json
{
  "id": "review_001",
  "bookId": "book_001",
  "studentId": "2204010",
  "studentName": "Angkan Chowdhury",
  "rating": 5,
  "comment": "Excellent book! Very helpful for algorithms coursework.",
  "date": "2026-02-01"
}
```

---

## 📚 Seed Data — Pre-populate the app with these books:

1. **Introduction to Algorithms** — Cormen, Leiserson, Rivest, Stein | Subject: Algorithms | CSE
2. **Computer Networks** — Andrew S. Tanenbaum, David J. Wetherall | Subject: Networks | CSE
3. **Operating System Concepts** — Abraham Silberschatz, Peter Baer Galvin, Greg Gagne | Subject: OS | CSE
4. **Artificial Intelligence: A Modern Approach** — Russell & Norvig | Subject: AI | CSE
5. **Database System Concepts** — Silberschatz, Korth, Sudarshan | Subject: Database | CSE
6. **Computer Organization and Architecture** — William Stallings | Subject: Architecture | CSE
7. **Discrete Mathematics and Its Applications** — Kenneth Rosen | Subject: Mathematics | CSE
8. **The C Programming Language** — Kernighan & Ritchie | Subject: Programming | CSE, EEE
9. **Engineering Mathematics** — Erwin Kreyszig | Subject: Mathematics | All Departments
10. **Fundamentals of Electric Circuits** — Alexander & Sadiku | Subject: Circuits | EEE
11. **Structural Analysis** — R.C. Hibbeler | Subject: Structures | CE
12. **Thermodynamics: An Engineering Approach** — Cengel & Boles | Subject: Thermodynamics | ME

---

## 🔐 Authentication Logic (Simulated, No Backend)

- Use **React Context + localStorage** to simulate auth state
- On login: check mock user list, set user in context and localStorage
- Role-based route protection: redirect to login if not authenticated; redirect to correct dashboard based on role
- On logout: clear context and localStorage, redirect to `/auth`
- Student email validation: accept any email for demo purposes but flag non-CUET emails with a warning

---

## 🌟 Additional Features (Beyond the PDF — Add These)

1. **📌 Wishlist / Save Book** — Students can bookmark books and view saved list in profile
2. **⭐ Book Reviews & Ratings** — Students can rate and review books
3. **🔔 In-App Notifications** — Bell icon with dropdown showing recent alerts
4. **📢 Announcements Banner** — Admin-posted news shown on home and dashboard
5. **🌙 Dark Mode** — Full dark mode with toggle
6. **📊 Admin Analytics Charts** — Visual charts for admin using recharts or chart.js
7. **🗃️ Borrowing History** — Full log of all past borrows per student
8. **📝 Book Request Feature** — Students can request a book not in the catalog; librarian reviews
9. **🔍 Advanced Search** — Filter by year, department, availability, rating all at once
10. **📱 Fully Responsive** — Mobile-first design, works perfectly on phones
11. **🎓 Personalized Recommendations** — "Books for CSE 3rd Year" section
12. **📅 Calendar View** — Video meeting scheduling with a mini calendar picker
13. **🏷️ New Arrivals Badge** — "NEW" badge on books added within the last 30 days
14. **💬 FAQ Page** (`/faq`) — Commonly asked questions about borrowing rules, fines, etc.
15. **📞 Contact/Support Page** (`/contact`) — Form to email library support
16. **🔢 Fine Calculator Widget** — On the renew page, a mini calculator: input days overdue → shows fine amount
17. **📥 Export Profile Data** — Student can export their borrowing history as PDF
18. **🌐 Language Toggle** — English / Bengali (Bangla) basic toggle (optional, if you want to be creative)

---

## ⚡ UX & Interaction Guidelines

- All buttons should have hover and active states
- Destructive actions (delete, reject) must show a confirmation dialog
- Form validation on all forms — show inline error messages in red
- Show success toasts (top-right corner) after form submissions
- Loading skeleton screens (not just a spinner) for book lists and tables
- Smooth page transitions (fade or slide) when navigating between routes
- Sticky header on scroll
- Back to top button on long pages
- Empty states with friendly illustrations and helpful messages
- All modals closable via Escape key and clicking outside

---

## 🏫 CUET-Specific Details to Include

- **University Name:** Chittagong University of Engineering & Technology (CUET)
- **Location:** Chittagong-4349, Bangladesh
- **Departments:** CSE, EEE, CE (Civil), ME (Mechanical), URP (Urban & Regional Planning), ECE, MSE, PME, WRE, Architecture, Mathematics, Physics, Chemistry, Humanities
- **Library email (mock):** library@cuet.ac.bd
- **Borrowing policy:**
  - 1st, 2nd, 3rd year: max 3 books
  - 4th year: max 4 books
  - Faculty: max 6 books
  - Renewal window: within 30 days of borrow date
  - Fine: 1 Tk per day per book after due date
- **Library hours (show in footer/contact page):** Sat–Thu: 8:00 AM – 8:00 PM | Fri: Closed

---

## 🎨 Creative Freedom Note

> You (the developer/AI) are encouraged to add anything creative that enhances this university library experience. This could include: animated book-opening effects, a hero section with floating book illustrations, a Lottie animation on the empty state, a sound effect when a borrow request is approved, a confetti animation when a student returns a book with no fine, creative 404 page with a "book not found" joke, or any other thoughtful addition. The goal is to make this feel like a real, polished, student-loved application — not just a basic CRUD app.

---

*Built with ❤️ for CUET students — Group A1-06 | CSE-326 Internet Programming (Sessional)*
