# 🛠️ Memeriaw Adugnaw Full-Stack Portfolio — Backend & Database Guide

This guide details the **Node.js, Express, and MongoDB REST API backend** built for your portfolio.

---

## 🏗️ Architecture Overview

The backend is built with **Node.js + Express + Mongoose** and implements:
- **RESTful API**: Structured endpoints for profile, showcase projects, contact submissions, and administrative CRUD.
- **Dual-Engine Persistence**:
  1. **MongoDB Atlas / Local MongoDB**: When connected via `MONGODB_URI`, all data is stored and validated with Mongoose schemas.
  2. **Smart Local JSON Fallback**: If MongoDB is not yet running or offline, the server automatically uses persistent local storage (`backend/data/local-database.json`) without crashing.
- **JWT Authentication & Bcrypt**: Password hashing and token-based protection for all administrative routes.
- **Security & Protection**:
  - `helmet`: Security HTTP headers.
  - `cors`: Configured for Vite development server (`http://localhost:5173`) and production domains.
  - `express-rate-limit`: Protects against brute-force logins and contact form spam.
  - Anti-spam **honeypot** detection on contact submissions.

---

## 📁 Directory Structure

```
PF/
├── package.json                 # Monorepo scripts (dev, backend, frontend, seed)
├── BACKEND_GUIDE.md             # This comprehensive guide
├── frontend/                    # Vite + React 19 Frontend
│   ├── .env                     # VITE_API_URL=http://localhost:5000/api
│   └── src/
└── backend/                     # Node.js + Express REST API
    ├── server.js                # Server entry point
    ├── test-api.js              # Automated endpoint test suite
    ├── package.json             # Express, Mongoose, JWT, Bcrypt dependencies
    ├── .env                     # Environment variables (PORT, MONGODB_URI, JWT_SECRET)
    ├── .env.example             # Configuration template
    ├── data/                    # Local persistent storage (when MongoDB is offline)
    │   └── local-database.json
    └── src/
        ├── config/
        │   ├── db.js            # MongoDB connection & auto-seed manager
        │   └── jsonStore.js     # Fallback storage engine
        ├── models/
        │   ├── Admin.js         # Admin account schema with bcrypt
        │   ├── Project.js       # Portfolio projects schema
        │   ├── Message.js       # Contact inbox message schema
        │   └── Profile.js       # Bio, skills, experience, testimonials schema
        ├── controllers/
        │   ├── authController.js    # Login, logout, token verification
        │   ├── projectController.js # Public & Admin CRUD
        │   ├── contactController.js # Contact submission & inbox
        │   └── profileController.js # Profile data endpoints
        ├── routes/
        │   ├── authRoutes.js        # /api/auth
        │   ├── projectRoutes.js     # /api/projects
        │   ├── contactRoutes.js     # /api/contact
        │   ├── profileRoutes.js     # /api/profile
        │   └── adminRoutes.js       # /api/admin/* (Protected)
        ├── middleware/
        │   ├── authMiddleware.js    # JWT verification
        │   ├── rateLimiter.js       # Anti-spam & brute force protection
        │   └── errorMiddleware.js   # 404 & error handlers
        └── utils/
            ├── initialData.js       # Preloaded portfolio dataset
            └── seed.js              # Standalone database seed script
```

---

## 🔑 Default Credentials

- **Admin Email**: `admin@example.com`
- **Admin Password**: `admin123`
*(Configurable inside `backend/.env` via `ADMIN_EMAIL` and `ADMIN_PASSWORD`)*

---

## 📡 REST API Endpoints

### 1. Public Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server status and database health check |
| `GET` | `/api/profile` | Returns profile, skills, experiences & testimonials |
| `GET` | `/api/projects` | List published projects (supports `?category=...`) |
| `GET` | `/api/projects/:slug` | Project details by slug or ID |
| `POST` | `/api/contact` | Submit contact form (rate-limited, anti-spam honeypot) |

### Contact form email notifications

Contact submissions are saved to the admin inbox and can also trigger an email notification through Gmail. Configure these values in `backend/.env`:

```env
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-google-app-password
# Optional; defaults to GMAIL_USER
CONTACT_NOTIFICATION_EMAIL=your-gmail-address@gmail.com
```

Create a Google App Password from your Google Account's **Security > 2-Step Verification > App passwords** page. App Passwords require 2-Step Verification. Store the generated password only in `backend/.env`; never put it in frontend code or commit it. Restart the backend after setting the values. Each new contact submission will then send an email with the sender's address as the reply-to.

If Gmail is not configured or delivery fails, the contact message is still saved in the admin inbox, and the API logs the email-delivery error.

### 2. Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Log in and receive JWT token (`admin@example.com` / `admin123`) |
| `POST` | `/api/auth/logout` | Log out |
| `GET` | `/api/auth/me` | Verify current JWT token and get admin details |

### 3. Admin Endpoints *(Requires Header: `Authorization: Bearer <token>`)*
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/projects` | View all projects (including drafts/unpublished) |
| `POST` | `/api/admin/projects` | Create a new project |
| `PATCH` | `/api/admin/projects/:id` | Update project details, publish status, or featured flag |
| `DELETE` | `/api/admin/projects/:id` | Permanently delete a project |
| `GET` | `/api/admin/messages` | View all incoming contact messages |
| `PATCH` | `/api/admin/messages/:id` | Mark message as read / unread |
| `DELETE` | `/api/admin/messages/:id` | Delete contact message |

---

## 🍃 Connecting to MongoDB Atlas (Step-by-Step)

When you are ready to use cloud MongoDB Atlas instead of local storage:

1. **Sign up / Log in**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Create a Free Cluster**: Choose **M0 Free Tier** (AWS / Frankfurt or closest region).
3. **Database Access (User)**:
   - Go to **Security > Database Access**.
   - Click **Add New Database User**.
   - Create a user (e.g. `memeriaw_admin`) with a secure password.
4. **Network Access (IP Whitelist)**:
   - Go to **Security > Network Access**.
   - Click **Add IP Address**.
   - Select **Allow Access From Anywhere (`0.0.0.0/0`)** or add your current IP.
5. **Get Connection String**:
   - Go to **Deployment > Databases**.
   - Click **Connect** on your cluster.
   - Choose **Drivers (Node.js)**.
   - Copy the connection URI:
     ```
     mongodb+srv://memeriaw_admin:<password>@cluster0.xxxx.mongodb.net/memeriaw_portfolio?retryWrites=true&w=majority
     ```
6. **Update `.env`**:
   - Open `backend/.env`.
   - Paste your connection string into `MONGODB_URI`:
     ```env
     MONGODB_URI=mongodb+srv://memeriaw_admin:your_password@cluster0.xxxx.mongodb.net/memeriaw_portfolio?retryWrites=true&w=majority
     ```
7. **Seed Database**:
   - In PowerShell, run:
     ```powershell
     cd C:\Users\HP\Documents\PF\backend
     npm run seed
     ```
   - The script will automatically connect to Atlas, create the collections, and populate them with your showcase projects and admin user.

---

## 🚀 How to Run the Application

### Option A: Run Full Stack Together
From the root directory (`C:\Users\HP\Documents\PF`):
```powershell
npm run dev
```
*(Starts the backend at `http://localhost:5000` and frontend at `http://localhost:5173` simultaneously)*

### Option B: Run in Separate Terminals
**Terminal 1 (Backend)**:
```powershell
cd C:\Users\HP\Documents\PF\backend
npm run dev
```

**Terminal 2 (Frontend)**:
```powershell
cd C:\Users\HP\Documents\PF\frontend
npm run dev
```

### Run Automated API Tests
```powershell
cd C:\Users\HP\Documents\PF\backend
npm test
```
