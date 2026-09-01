# TaskFlow — Todo Management Application

A full-stack todo management application built with React and Node.js. Designed as a developer internship assignment demonstrating clean architecture, professional UI, and complete CRUD functionality.

---

## Overview

TaskFlow lets users create, organize, and track tasks with priorities, due dates, and completion status. The frontend is a multi-page React application; the backend is a REST API built with Express that persists data to a JSON file.

---

## Key Features

- **Full CRUD** — create, read, update, and delete todos
- **Two-page app** — a task list dashboard and a dedicated task detail page
- **Detail page via query parameter** — `/todo?id=<uuid>`
- **Statistics dashboard** — total, completed, pending, high-priority count, and completion percentage
- **Search** — searches both title and description
- **Filter** — All / Pending / Completed / High / Medium / Low priority
- **Sort** — Newest, Oldest, Priority, Due Date, Title A–Z
- **Priority system** — High, Medium, Low with color-coded badges
- **Due date awareness** — smart labels: Overdue, Due Today, Due Tomorrow, Due in N days
- **Past-date prevention** — new todos cannot be assigned a past due date (enforced in both UI and API)
- **Toast notifications** — success and error feedback for every action
- **Delete confirmation** — modal dialog before permanent deletion
- **Responsive layout** — works across desktop, tablet, and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 |
| Frontend build tool | Vite |
| Frontend routing | React Router DOM v6 |
| HTTP client | Axios |
| Styling | Vanilla CSS with a custom design-token system |
| Backend runtime | Node.js |
| Backend framework | Express.js |
| Data persistence | JSON file (`backend/data/todos.json`) |
| ID generation | Node.js built-in `crypto.randomUUID()` |

---

## Architecture

```
┌─────────────────────────────────────┐
│           Browser (React)           │
│  /todos          /todo?id=<uuid>    │
│  TodoList page   TodoDetails page   │
│         ↕ Axios (/api proxy)        │
└─────────────────────────────────────┘
                  ↕ HTTP
┌─────────────────────────────────────┐
│        Express API (:5000)          │
│  routes → middleware → controller   │
│              ↕ fs                   │
│        backend/data/todos.json      │
└─────────────────────────────────────┘
```

- The React frontend proxies all `/api` requests to `http://localhost:5000` via Vite's dev server proxy.
- The backend follows an MVC structure: routes → validation middleware → controller → model → file store.
- The frontend never holds authoritative state — every mutation is confirmed by the API response before updating the UI.

---

## Project Structure

```
ZIPTRRIP_ASSIGNMENT/
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx          # App entry point
│       ├── App.jsx           # Route definitions
│       ├── pages/
│       │   ├── TodoList.jsx  # /todos — task dashboard
│       │   └── TodoDetails.jsx # /todo?id= — task detail
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── TodoCard.jsx
│       │   ├── TodoForm.jsx  # Create + Edit modal
│       │   ├── TodoStats.jsx
│       │   ├── SearchBar.jsx
│       │   ├── FilterBar.jsx
│       │   ├── ConfirmModal.jsx
│       │   └── Toast.jsx
│       ├── services/
│       │   └── todoApi.js    # All Axios API calls
│       ├── styles/
│       │   ├── global.css    # Design tokens + reset
│       │   ├── components.css
│       │   └── pages.css
│       └── utils/
│           └── dateUtils.js  # Date formatting + due-date logic
│
├── backend/
│   ├── server.js             # Express setup + startup
│   ├── package.json
│   ├── routes/
│   │   └── todoRoutes.js
│   ├── controllers/
│   │   └── todoController.js
│   ├── models/
│   │   └── todoModel.js      # createTodo / updateTodo
│   ├── middleware/
│   │   ├── validateTodo.js   # Request validation
│   │   └── errorHandler.js   # Central error + 404 handler
│   ├── utils/
│   │   └── fileStore.js      # Atomic JSON read/write
│   └── data/
│       └── todos.json        # Persisted data (git-ignored)
│
├── .gitignore
├── README.md
├── FEATURES.md
└── API.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (included with Node.js)

---

## Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd ZIPTRRIP_ASSIGNMENT

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install
```

---

## Running the Application

### Backend

```bash
cd backend
npm start          # production
npm run dev        # development (nodemon — auto-restarts on file changes)
```

The API will be available at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm run dev
```

The application will open at `http://localhost:5173`.

> Both servers must be running simultaneously. Open two terminal windows.

---

## Environment Variables

The backend reads one optional environment variable:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port the Express server listens on |

No `.env` file is required for local development. To override the port:

```bash
PORT=8080 npm start
```

The frontend has no environment variables — the API base URL is configured in `vite.config.js` via the dev-server proxy.

---

## How to Use

1. Open `http://localhost:5173` — you are redirected to `/todos`.
2. Click **New Task** (header or hero button) to create a todo.
3. Fill in title (required), description, priority, and due date, then click **Create Task**.
4. Click a task card's title/body area to open its **detail page**.
5. Use the checkbox on a card to toggle completion directly from the list.
6. Use the **edit** (pencil) or **delete** (trash) icon buttons on each card.
7. Use the **search bar**, **filter tabs**, and **sort dropdown** to narrow the list.
8. On the detail page, use the action buttons to toggle, edit, or delete the task.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/todos` | Fetch all todos |
| GET | `/api/todos/:id` | Fetch a single todo |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update an existing todo |
| DELETE | `/api/todos/:id` | Delete a todo |
| GET | `/api/health` | Health check |

See [API.md](./API.md) for full request/response documentation.

---

## Data Persistence

- Todos are stored in `backend/data/todos.json`.
- On every write, the file is written atomically: data is first written to a `.tmp` file, then renamed over the target — preventing corruption if the process is interrupted.
- If the data file or directory is missing on startup, it is created automatically with an empty array.
- The data file is listed in `.gitignore` and is not committed to the repository.

---

## Key Technical Decisions

| Decision | Rationale |
|---|---|
| Multi-page React (not SPA) | Each page has its own URL, fetch lifecycle, and loading state — `/todos` and `/todo?id=` are independent |
| Query parameters for detail page | `/todo?id=<uuid>` — required by the assignment spec |
| File-based persistence | Keeps the project self-contained; no database setup required |
| Atomic file writes | Prevents JSON corruption on write failures |
| CSS design tokens | All colors, spacing, and typography defined as CSS custom properties — consistent theming without a framework |
| No external ID library | `crypto.randomUUID()` is built into Node.js v14.17+ — no dependency needed |
| Axios interceptor | Normalizes all API errors into human-readable messages before they reach UI components |
| `validateUpdate` does not block past dates | Existing todos can legitimately become overdue — only creation is restricted |

---

## Responsive Design

The UI adapts across four breakpoints:

| Breakpoint | Layout changes |
|---|---|
| ≥ 1024px | 5-column stats grid; 2-column detail layout (main + sidebar) |
| ≤ 1023px | 3-column stats; sidebar moves below main card |
| ≤ 767px | 2-column stats; controls stack vertically |
| ≤ 479px | Single-column stats (last card full-width); action buttons always visible; filter tabs scroll horizontally |

---

## Future Improvements

- Add a `completedAt` timestamp field to accurately record when a task was completed
- Add `AbortController` cleanup to fetch calls to prevent state updates on unmounted components
- User authentication and per-user task lists
- Drag-and-drop reordering
- Recurring tasks
- Export to CSV or PDF
