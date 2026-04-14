# 🎓 CUET Bookworld

**CUET Bookworld** is a modern, full-stack digital library management system designed exclusively for the students and staff of Chittagong University of Engineering & Technology (CUET). It offers a professional, student-centric interface for borrowing books, renewing them, reading e-books, and scheduling video consultations with library staff.

The application is built with a sleek, responsive design adhering to CUET's branding, featuring role-based access controls for Students, Librarians, and System Administrators.

---

## 🔐 Demo Accounts

The following demo accounts are pre-configured for testing all three roles:

| Role | Email | Password | Name |
|------|-------|----------|------|
| 🎓 **Student** | `student@cuet.ac.bd` | `Student@123` | Rafiq Ahmed (CSE, 3rd Year) |
| 📚 **Librarian** | `librarian@cuet.ac.bd` | `Librarian@123` | Dr. Nazrul Islam (Faculty) |
| ⚙️ **Admin** | `admin@cuet.ac.bd` | `Admin@123` | Prof. Kamal Hossain (Faculty) |

> **Note:** These accounts must be created in the Firebase Console under Authentication → Email/Password. The MongoDB user profiles are seeded automatically via `node seed.js`.

### Student Features
- Browse, search, and filter the book catalog
- Borrow books with automatic limit enforcement (3 books for 1st-3rd year, 4 for 4th year)
- Submit renewal requests with preferred time slots
- Read e-books online
- Schedule video consultations with librarians
- View profile, borrowed books, fines, and notifications

### Librarian Features
- Dashboard with stats (total books, pending requests, overdue books)
- Approve/reject borrow requests
- Approve/reject renewal requests with meeting links
- Full CRUD management of physical books and e-books
- View student records and borrowing history

### Admin Features
- System-wide analytics dashboard
- User management (search, filter by role, change roles, suspend/activate, delete)
- Announcement management (create, delete site-wide banners)
- Access to all Librarian features

---

## 🚀 Technologies Used

### Frontend (Client)
- **Framework:** React 19 (Hooks, React Router DOM v7)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Authentication:** Firebase (Email/Password + Google Sign-In)
- **HTTP Client:** Axios
- **Date Formatting:** date-fns

### Backend (Server)
- **Environment:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB Atlas (via Mongoose)
- **Authentication:** Firebase Auth (client-side) + UID verification middleware
- **Middleware:** CORS, dotenv
- **Development Tool:** Nodemon

---

## 🛠️ Installation & Run Process

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas URI (provided in `.env`)
- Firebase project with Email/Password and Google Sign-In enabled

### 1. Setting up the Server (Backend)

```bash
cd server
npm install
```

**Seed the database** (first time only):
```bash
node seed.js
```

**Start the server:**
```bash
npx nodemon index.js
```

### 2. Setting up the Client (Frontend)

```bash
cd client
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Authentication → Sign-in method**
3. Enable **Email/Password** and **Google** providers
4. Create the 3 demo accounts manually under **Authentication → Users**:
   - `student@cuet.ac.bd` / `Student@123`
   - `librarian@cuet.ac.bd` / `Librarian@123`
   - `admin@cuet.ac.bd` / `Admin@123`

---

## 📂 Project Structure

```
Main/
├── client/                 # React frontend
│   └── src/
│       ├── api/            # Axios instance
│       ├── components/     # Reusable components (Navbar, Modal, Toast, etc.)
│       ├── context/        # AuthContext, ThemeContext
│       ├── pages/          # All page components
│       │   ├── librarian/  # Librarian dashboard pages
│       │   └── admin/      # Admin dashboard pages
│       ├── firebase.js     # Firebase configuration
│       └── App.jsx         # Main router
└── server/                 # Express backend
    ├── middleware/          # Auth middleware
    ├── models/             # Mongoose schemas
    ├── routes/             # API routes
    ├── seed.js             # Database seeder
    └── index.js            # Server entry
```

---

## 🌟 Key Features

- 🌙 **Dark/Light Mode** — Persistent toggle with localStorage (default: light)
- 🔐 **Firebase Auth** — Email/Password + Google Sign-In
- 📚 **Book Catalog** — Search, filter by department/category, sort, paginate
- 📖 **E-Books** — Online reading with search and category filters
- 🔄 **Book Renewal** — Time slot selection with meeting-based approval
- 🎥 **Video Consultations** — Schedule sessions with librarians
- 👤 **User Profiles** — Edit info, view borrows, history, notifications
- ⭐ **Book Reviews** — Star ratings and text reviews
- 📢 **Announcements** — Admin-managed site-wide banners
- 📊 **Analytics** — Popular books, borrow stats, fines tracking
- 🔔 **Notifications** — In-app alerts for borrow approvals, renewals, overdue
- 📱 **Fully Responsive** — Mobile-first design with hamburger menu
- ✨ **Animated UI** — Page transitions, counter animations, floating shapes

---

## 🏫 Important Information & Policies

- **Library Rules & Borrow Limit:**
  - 1st, 2nd, and 3rd-year students can borrow up to **3 books**.
  - 4th-year students can borrow up to **4 books**.
  - Faculty members can borrow up to **6 books**.
- **Renewal window:** Within 30 days of the borrow date.
- **Fines:** 1 Tk per day per book will be applied past the due date.
- **Support Email:** library@cuet.ac.bd
- **Library Hours:** Sat–Thu: 8:00 AM – 8:00 PM | Fri: Closed

---

*Built with ❤️ for CUET students — Group A1-06 | CSE-326 Internet Programming (Sessional)*
