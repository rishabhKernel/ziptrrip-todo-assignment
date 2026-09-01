# TaskFlow — Features & Behavioral Specifications

This document details all implemented user-facing features, business logic, and behavioral rules in the TaskFlow application.

---

## 1. Multi-Page Navigation & Routing

TaskFlow implements a multi-page structure via React Router DOM with explicit page lifecycles:

- **Task Dashboard (`/todos`):** Main view containing task statistics, search, filtering, sorting, and the card list.
- **Root Redirect (`/`):** Automatically navigates root visitors to `/todos`.
- **Dedicated Detail View (`/todo?id=<uuid>`):** Dedicated single-task view reading the task identifier from URL query parameters.
- **Direct Refresh Support:** Static site rewrite rules (`/* -> /index.html`) ensure reloading `/todos` or `/todo?id=UUID` renders seamlessly without 404 errors.

---

## 2. Task Dashboard (`/todos`)

### 2.1 Productivity Metrics
- **Total Tasks:** Cumulative count of all stored tasks.
- **Completed:** Total finished tasks (`completed: true`).
- **Pending:** Total active unfinished tasks (`completed: false`).
- **High Priority:** Unfinished tasks with `High` priority flag.
- **Progress Bar:** Real-time completion percentage calculation (`(completed / total) * 100`).

### 2.2 Task Creation
- **Trigger:** "New Task" buttons in header and hero section, or "Create your first task" button on empty state.
- **Form Controls:**
  - **Title (Required):** 1 to 150 characters with live character counter.
  - **Description (Optional):** Multi-line textarea up to 1000 characters with live counter.
  - **Priority:** Dropdown selector (`Low`, `Medium`, `High` - default: `Medium`).
  - **Due Date:** Date picker with past-date prevention.
- **Validation Rules:**
  - Past dates are disabled in the calendar picker (`min` attribute set to local today).
  - Backend independently rejects past dates on creation with HTTP 400.
  - Auto-focuses title field upon opening modal.

### 2.3 Task Card Display
- Displays title, 2-line truncated description, priority badge, and formatted due date.
- **Checkbox:** Clickable to toggle task completion immediately without opening details.
- **Completed Style:** Strike-through title, green status badge, and subdued opacity.
- **Overdue Accent:** Red left-border indicator on incomplete overdue tasks.
- **Hover Actions:** Edit and Delete buttons revealed on card hover (always visible on mobile).
- **Navigation:** Clicking card title or body navigates to `/todo?id=<uuid>`.

---

## 3. Search, Filter & Sort

### 3.1 Search
- Real-time search across both **Title** and **Description** fields (case-insensitive).
- Includes clear button (`×`) to reset search input instantly.

### 3.2 Filtering
Tab-based filter pills to segment views:
- **All:** Displays all tasks.
- **Pending:** Only incomplete tasks.
- **Completed:** Only finished tasks.
- **🔥 High:** High-priority items only.
- **Medium:** Medium-priority items only.
- **Low:** Low-priority items only.

### 3.3 Sorting
Dropdown selector supporting 5 sorting strategies:
- **Newest first:** By `createdAt` descending (default).
- **Oldest first:** By `createdAt` ascending.
- **Priority:** High → Medium → Low order.
- **Due date:** Closest upcoming deadline first (tasks without due dates sorted to end).
- **Title A–Z:** Alphabetical ascending by title.

---

## 4. Due Date & Overdue Logic

Relative deadline calculations based on the user's current calendar date:

| Status | Condition | Badge Label |
|---|---|---|
| **Overdue** | Incomplete & due date < today | `⚠ Overdue · [Date]` (Red badge) |
| **Due Today** | Incomplete & due date = today | `📅 Due today` (Amber badge) |
| **Due Tomorrow** | Incomplete & due date = tomorrow | `📅 Due tomorrow` (Blue badge) |
| **Upcoming** | Incomplete & due within 7 days | `📅 Due in N days` (Blue badge) |
| **Future** | Incomplete & due > 7 days | `📅 Due [Date]` (Blue badge) |
| **Completed** | `completed: true` | `✓ Due [Date]` (Green badge, never marked overdue) |

---

## 5. Task Detail Page (`/todo?id=<uuid>`)

- **Query Parameter Lookup:** Reads `id` via `useSearchParams()`.
- **Main Display:** Full title, complete multi-line description, and status/priority/due-date badges.
- **Metadata Sidebar:**
  - Status (`Completed` / `Pending`)
  - Priority (`🔥 High`, `⚡ Medium`, `🌿 Low`)
  - Due Date with relative status formatting
  - Creation timestamp (date and time)
  - Last updated timestamp
  - Full unique UUID string
- **Page Actions:**
  - **Mark as Complete / Pending:** Live status toggle.
  - **Edit Task:** Opens edit modal pre-filled with current task data.
  - **Delete Task:** Triggers delete confirmation modal.
  - **Back to Tasks:** Returns user to `/todos`.

---

## 6. Feedback, Modals & Edge Cases

### 6.1 Delete Confirmation Modal
- Intercepts delete actions on both the list and detail pages.
- Focuses "Cancel" button by default for safety.
- Supports `Escape` key dismissal and backdrop click.

### 6.2 Toast Notifications
- Temporary popups in the bottom-right notifying users of task creation, updates, completion toggles, and deletions.
- Auto-dismisses after 2.0 to 3.5 seconds with optional manual close (`×`).

### 6.3 Empty & Error States
- **Empty List State:** Graphic and "Create your first task" button when database has 0 items.
- **Filter Empty State:** "No matching tasks" with a "Clear filters" action button.
- **Invalid ID State:** Clear warning when visiting `/todo` without an `?id=` parameter.
- **Not Found State (404):** Error screen when task UUID does not exist.
- **Network Error State:** Displays human-friendly connection message with a "Try Again" retry button.
