# TaskFlow — Todo Management Application

A full-stack, production-ready Todo Management web application built with React and Node.js. Built as a developer assignment demonstrating clean multi-page architecture, complete CRUD operations, data persistence, and modern responsive UI/UX.

---

## 🚀 Live Demo

| Service | Deployment Platform | Live URL |
|---|---|---|
| **Frontend Application** | Render (Static Site) | **[https://taskflow-todo-vpxd.onrender.com](https://taskflow-todo-vpxd.onrender.com)** |
| **Backend REST API** | Render (Web Service) | **[https://taskflow-backend-dyzg.onrender.com/api](https://taskflow-backend-dyzg.onrender.com/api)** |
| **API Health Check** | Render (Web Service) | **[https://taskflow-backend-dyzg.onrender.com/api/health](https://taskflow-backend-dyzg.onrender.com/api/health)** |

---

## Overview

TaskFlow is a focused personal task-management application. Users can create, update, organize, prioritize, and track tasks with smart due dates and status tracking.

- **Frontend:** Multi-page React application with dedicated task list and query-parameter based detail view (`/todo?id=<uuid>`).
- **Backend:** Modular Express.js REST API with input validation and atomic file-based persistence.

---

## Key Features

- **Full CRUD API & UI:** Create, read, update, complete, and delete tasks.
- **Multi-Page Architecture:** Distinct list dashboard (`/todos`) and task detail page (`/todo?id=UUID`).
- **Query Parameter Routing:** Detail page dynamically retrieves tasks via `?id=` query parameter.
- **Productivity Dashboard:** Real-time metrics for total tasks, completed, pending, high-priority, and completion percentage progress bar.
- **Search & Filtering:** Real-time search across titles and descriptions; filter by status and priority.
- **Sorting Options:** Sort by Newest, Oldest, Priority, Due Date, or Alphabetical (A–Z).
- **Priority System:** 3-tier color-coded badges (`Low`, `Medium`, `High`).
- **Smart Due Dates:** Relative status indicators (`Overdue`, `Due today`, `Due tomorrow`, `Due in N days`).
- **Past-Date Validation:** Prevents selecting past dates for new tasks in both UI and backend.
- **Feedback & Modals:** Toast notification system and confirmation dialogs before task deletion.
- **Responsive Design:** Fluid layouts optimized for desktop, tablet, and mobile screens.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 | Declarative component UI |
| **Build Tool** | Vite 5 | Fast development and optimized production bundling |
| **Client Routing** | React Router DOM v6 | Multi-page routing and query parameter parsing |
| **HTTP Client** | Axios | API communication with normalized error interceptors |
| **Styling** | Vanilla CSS | Custom design token system (CSS custom properties) |
| **Backend Runtime** | Node.js (v18+) | Server execution environment |
| **Web Framework** | Express.js 4 | RESTful routing and middleware pipeline |
| **Data Persistence** | File Store (JSON) | Atomic file persistence (`backend/data/todos.json`) |
| **ID Generation** | Node.js `crypto` | Native UUID v4 generation |
| **Deployment** | Render | Managed hosting for Web Service and Static Site |

---

## Architecture & Data Flow

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (React/Vite)                │
│   • Dashboard: /todos                                  │
│   • Detail Page: /todo?id=<uuid>                       │
│   • UI State: Controlled Forms, Toast, Modals          │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP REST (JSON)
                           ▼
┌────────────────────────────────────────────────────────┐
│               Backend API (Node.js/Express)            │
│   • Router (/api/todos, /api/health)                   │
│   • Validation Middleware (validateCreate / Update)    │
│   • Controller (CRUD logic)                            │
│   • Model & Atomic File Store (fs.renameSync)          │
└──────────────────────────┬─────────────────────────────┘
                           │ File I/O
                           ▼
┌────────────────────────────────────────────────────────┐
│             Persistent Storage (todos.json)            │
└────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
ZIPTRRIP_ASSIGNMENT/
├── .env.example              # Root environment template
├── .gitignore                # Git exclusions (node_modules, .env, data)
├── render.yaml               # Render Blueprint (Infrastructure as Code)
├── README.md                 # Main overview & setup documentation
├── FEATURES.md               # User-facing feature specifications
├── API.md                    # REST API documentation & JSON schemas
│
├── backend/
│   ├── .env.example          # Backend environment template
│   ├── package.json          # Express, Cors, Nodemon dependencies
│   ├── server.js             # Express app setup, CORS, and port listener
│   ├── routes/
│   │   └── todoRoutes.js     # API route definitions
│   ├── controllers/
│   │   └── todoController.js # Request handlers for CRUD operations
│   ├── models/
│   │   └── todoModel.js      # Data entity factories and updates
│   ├── middleware/
│   │   ├── validateTodo.js   # Input validation (creation & updates)
│   │   └── errorHandler.js   # Centralized 404 & 500 error handlers
│   ├── utils/
│   │   └── fileStore.js      # Atomic read/write operations for JSON
│   └── data/
│       └── todos.json        # Persisted task records (git-ignored)
│
└── frontend/
    ├── .env.example          # Frontend environment template
    ├── index.html            # Single page entry HTML
    ├── vite.config.js        # Vite config & dev proxy setup
    ├── package.json          # React, Router, Axios dependencies
    └── src/
        ├── main.jsx          # React DOM entry point
        ├── App.jsx           # Client-side route declarations
        ├── pages/
        │   ├── TodoList.jsx  # /todos dashboard page
        │   └── TodoDetails.jsx # /todo?id= detail page
        ├── components/
        │   ├── Header.jsx       # Navigation bar
        │   ├── TodoCard.jsx     # Individual task card
        │   ├── TodoForm.jsx     # Create & edit modal form
        │   ├── TodoStats.jsx    # Metric cards & progress bar
        │   ├── SearchBar.jsx    # Search input with clear button
        │   ├── FilterBar.jsx    # Filter tabs & sort dropdown
        │   ├── ConfirmModal.jsx # Delete confirmation dialog
        │   └── Toast.jsx        # Notification banner system
        ├── services/
        │   └── todoApi.js       # Axios client & API methods
        ├── utils/
        │   └── dateUtils.js     # Date formatting & relative due date calculations
        └── styles/
            ├── global.css       # Design tokens, reset, typography
            ├── components.css   # Component styles (buttons, cards, modals)
            └── pages.css        # Layouts for dashboard and detail view
```

---

## Local Installation & Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 1. Clone Repository
```bash
git clone https://github.com/rishabhKernel/ziptrrip-todo-assignment.git
cd ziptrrip-todo-assignment
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Run Locally

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev        # Runs on http://localhost:5000 with nodemon
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev        # Runs on http://localhost:5173 with Vite
```

Visit **`http://localhost:5173`** in your browser. The frontend dev server proxies API calls from `/api` to `http://localhost:5000` automatically.

---

## Environment Variables

| Variable | Scope | Required | Default (Local) | Production Example | Description |
|---|---|---|---|---|---|
| `PORT` | Backend | Optional | `5000` | Provided by Render | Server listener port |
| `CLIENT_ORIGIN` | Backend | Optional | Allowed dynamically | `https://taskflow-todo-vpxd.onrender.com` | Allowed CORS origin |
| `VITE_API_BASE_URL` | Frontend | Production | `/api` (proxy) | `https://taskflow-backend-dyzg.onrender.com/api` | Base URL of deployed backend API |

*Reference templates are available in `.env.example`, `backend/.env.example`, and `frontend/.env.example`.*

---

## Data Persistence Strategy

- **Location:** `backend/data/todos.json`
- **Atomic File Writing:** Write operations output to a temporary file (`todos.json.tmp`) before executing an atomic rename (`fs.renameSync`). This prevents data corruption during unexpected process shutdowns.
- **Auto-Initialization:** If the data directory or JSON file is missing, the backend automatically initializes an empty storage array `[]`.
- **Git Safety:** The data file is included in `.gitignore` to prevent committing runtime task data to version control.

---

## Deployment Configuration (Render)

The project includes a `render.yaml` blueprint defining:
1. **Backend Web Service (`taskflow-backend`):** Node.js runtime executing `npm install` and `node server.js`.
2. **Frontend Static Site (`taskflow-todo`):** Static runtime executing `npm install && npm run build` with publish path `dist` and rewrite rule `/* -> /index.html` to support deep linking and browser page refreshes on subroutes.

---

## Additional Documentation

- **[`FEATURES.md`](./FEATURES.md)** — Detailed specification of all user-facing features and behavioral logic.
- **[`API.md`](./API.md)** — REST API specifications, endpoint parameters, and request/response JSON schemas.
