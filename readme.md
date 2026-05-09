# TaskFlow – Modern SaaS Team Task Manager

TaskFlow is a comprehensive, full-stack MERN application designed to help teams collaborate, track projects, and manage daily task queues. Built with a sleek, responsive, modern SaaS aesthetic, it features robust role-based access control (RBAC), real-time task board updates, and an intuitive dashboard.

---

## 🚀 Features

* **Role-Based Access Control (RBAC):**
    * **Admin Access:** Create projects, manage team members, assign tasks, and monitor global workspace delivery.
    * **Member Access:** View assigned projects, track personal task queues, and update task statuses.
* **Project Management:** Isolated project workspaces with dedicated member lists and task boards.
* **Task Tracking:** Create, edit, delete, and filter tasks by priority, due date, and status (To Do, In Progress, Completed).
* **Modern SaaS Dashboard:** High-level metrics, overdue task alerts, and active project summaries.
* **Responsive Design:** Fully responsive layout with a collapsible mobile sidebar and fluid grid system.
* **Secure Authentication:** JWT-based authentication using secure, HTTP-only cookies.

---

## 🛠️ Tech Stack

**Frontend**
* React 18 (via Vite)
* React Router DOM (Routing)
* Axios (API Client with interceptors)
* Modern CSS (Custom UI Variables & Flexbox/Grid Layouts)

**Backend**
* Node.js & Express.js
* MongoDB & Mongoose (Database & ORM)
* Redis (`ioredis`) (Caching & Session management)
* JSON Web Tokens (JWT) & bcryptjs (Security)

---

## 📂 Project Structure

```text
TaskFlow/
├── backend/                  # Express/Node.js Server
│   ├── src/
│   │   ├── controllers/      # Route logic
│   │   ├── db/               # Database & Redis connections
│   │   ├── middlewares/      # Auth, Roles, Validations
│   │   ├── models/           # Mongoose schemas
│   │   ├── router/           # API routes
│   │   └── app.js            # Express app configuration
│   ├── .env                  # Backend environment variables
│   └── server.js             # Entry point
│
└── frontend/                 # React/Vite Application
    ├── src/
    │   ├── api/              # Axios services
    │   ├── components/       # Reusable UI components
    │   ├── context/          # React contexts (Auth)
    │   ├── hooks/            # Custom hooks
    │   ├── layouts/          # Shell layouts (Sidebar/Topbar)
    │   └── pages/            # Main application views
    ├── .env.local            # Frontend environment variables
    └── vercel.json           # Vercel deployment routing
````

---

## 💻 Getting Started (Local Development)

### Prerequisites

- Node.js (v18 or higher)
    
- MongoDB (Local instance or MongoDB Atlas)
    
- Redis (Local instance)
    

### 1. Backend Setup

Navigate to the backend directory, install dependencies, and setup your environment variables.

Bash

```
cd backend
npm install
```

Create a `.env` file in the `backend/` root:

Code snippet

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow_db
JWT_SECRET=your_super_secret_jwt_key
REDIS_URL=redis://127.0.0.1:6379
CLIENT_URL=http://localhost:5173
```

Start the backend server:

Bash

```
npm run dev
```

### 2. Frontend Setup

Open a new terminal, navigate to the frontend directory, install dependencies, and setup your environment variables.

Bash

```
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` root:

Code snippet

```
VITE_API_URL=http://localhost:3000/api
```

Start the frontend development server:

Bash

```
npm run dev
```

---

## 🌐 Deployment Guide

This project is configured to be deployed with the Frontend on **Vercel** and the Backend on **Render**.

### Backend (Render)

1. Push your code to GitHub.
    
2. Create a new **Web Service** on Render.com and connect your repository.
    
3. Set the Root Directory to `backend`.
    
4. Build Command: `npm install`
    
5. Start Command: `npm start`
    
6. Add all Environment Variables (including the production MongoDB URI, Redis URL, and set `NODE_ENV=production`).
    

### Frontend (Vercel)

1. Import your repository into Vercel.
    
2. Set the Root Directory to `frontend`.
    
3. Vercel will auto-detect **Vite**.
    
4. Add the Environment Variable: `VITE_API_URL=https://your-render-backend-url.onrender.com/api`
    
5. Deploy.
    
6. **Crucial:** Once Vercel gives you a live URL, go back to your Render backend Environment Variables and set `CLIENT_URL` to your new Vercel URL.
    

---

## 🔑 Key API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new Admin or Member
    
- `POST /api/auth/login` - Authenticate and receive HTTP-only cookie
    
- `POST /api/auth/logout` - Clear authentication session
    

### Projects (Protected & RBAC)

- `GET /api/projects` - Get user's active projects
    
- `POST /api/projects` - Create a new project (Admin only)
    
- `POST /api/projects/:id/members` - Add a member to a project (Admin only)
    

### Tasks (Protected)

- `GET /api/tasks/my-tasks` - Get tasks assigned to the current user
    
- `POST /api/tasks` - Create a new task in a project (Admin only)
    
- `PUT /api/tasks/:id/status` - Update task status (Assignee or Admin)