# TaskFlow — Features & Functionality Guide

This document outlines all implemented user-facing features and behavioral specifications for the TaskFlow application.

---

## 1. Task Dashboard (`/todos`)

The primary landing dashboard displaying high-level productivity metrics, controls for searching/sorting/filtering, and the task list.

- **URL:** `http://localhost:5173/todos`
- Redirects from root `/` automatically.
- Fetches all active tasks on initial load with spinner feedback.

---

## 2. Todo Creation

Users can create new tasks via the modal dialog accessed from the header or hero button.

- **Fields:**
  - **Title:** Required, text input, max 150 characters.
  - **Description:** Optional, multi-line textarea, max 1000 characters.
  - **Priority:** Selection dropdown (`Low`, `Medium`, `High` - default: `Medium`).
  - **Due Date:** Optional HTML5 date picker.
- **Rules & Behavior:**
  - Past dates cannot be selected for new tasks (visually disabled in calendar via `min` attribute).
  - Backend independently rejects past dates with HTTP 400.
  - Character counters provide visual feedback approaching or reaching limits.
  - Auto-focuses on the title field upon opening.
  - Shows loading spinner on submit button while processing.
  - Closes on successful creation and appends task to the top of the list with a success toast.

---

## 3. Todo Editing

Existing tasks can be modified either directly from the list card action buttons or from the detail page.

- **Behavior:**
  - Pre-populates all existing task attributes in the modal form.
  - Allows modification of title, description, priority, and due date.
  - Overdue tasks retain their existing past dates without validation errors during edits.
  - Updates local state and UI immediately upon API confirmation.

---

## 4. Todo Deletion & Confirmation

Destructive deletion requires explicit confirmation to prevent accidental loss.

- **Flow:**
  - User triggers delete via trash icon on task card or "Delete Task" button on detail page.
  - Displays a modal warning dialog describing the permanent action.
  - Focus is automatically placed on the "Cancel" button as a safe default.
  - Supports `Escape` key to dismiss and backdrop click.
  - Shows "Deleting..." spinner during API execution.
  - If deleted from detail page, user is redirected back to `/todos`.

---

## 5. Completion Toggle

Tasks can be toggled between pending and completed states at any time.

- **Card Checkbox:** Directly clickable from the task card without opening details.
- **Detail Page Button:** Explicit toggle button showing status and updating dynamically.
- **Visual Feedback:** Completed tasks receive strike-through text, subdued card opacity, and a green status badge.
- **Due Date Impact:** Completed tasks are never marked as "Overdue", even if their due date is in the past.

---

## 6. Productivity Statistics Dashboard

Summary metrics automatically calculate from the active task collection:

- **Total Tasks:** Count of all stored tasks.
- **Completed:** Count of tasks with `completed: true`.
- **Pending:** Count of active unfinished tasks.
- **High Priority:** Count of pending tasks marked with `High` priority.
- **Progress Bar:** Real-time completion percentage calculation (`(completed / total) * 100`).

---

## 7. Search Functionality

Interactive search bar with debounced/instant client-side filtering.

- Matches against both **Title** and **Description** fields (case-insensitive).
- Includes clear button (`×`) when text is entered.
- Shows empty state ("No matching tasks") with search term highlight when zero items match.

---

## 8. Filtering System

Tab-based filter pills allowing users to segment task views:

- **All:** Full task list.
- **Pending:** Tasks awaiting completion.
- **Completed:** Finished tasks.
- **🔥 High:** High-priority items only.
- **Medium:** Medium-priority items only.
- **Low:** Low-priority items only.

---

## 9. Sorting System

Dropdown sort control offering 5 sorting strategies:

- **Newest first:** By `createdAt` descending (default).
- **Oldest first:** By `createdAt` ascending.
- **Priority:** High → Medium → Low ordering.
- **Due date:** Closest upcoming due date first (tasks without due date sorted to end).
- **Title A–Z:** Alphabetical sort by title string.

---

## 10. Due Date Management & Overdue Detection

Smart date formatting and contextual badges based on current local calendar date:

- **Overdue:** Due date is prior to today and task is incomplete. Highlights with red left border on card and badge `⚠ Overdue · [Date]`.
- **Due Today:** Due date equals current date (`📅 Due today`).
- **Due Tomorrow:** Due date is tomorrow (`📅 Due tomorrow`).
- **Upcoming:** Due date within 7 days (`📅 Due in X days`).
- **Future:** Due date further out (`📅 Due [Date]`).
- **Completed:** Displays green check badge regardless of date.

---

## 11. Dedicated Detail Page (`/todo?id=<uuid>`)

Multi-page route dedicated to in-depth task inspection and metadata review.

- **Routing:** Uses query parameter format `/todo?id=<uuid>`.
- **Main View:** Displays full title, formatted long-form description (preserving line breaks), status badge, priority badge, and due date badge.
- **Metadata Sidebar:**
  - Status (Completed / Pending)
  - Priority
  - Formatted Due Date
  - Created timestamp (date and time)
  - Last updated timestamp
  - Full unique UUID
- **Header & Navigation:** Includes dedicated "Back to Tasks" button.

---

## 12. State Handling & Edge Cases

- **Loading State:** Dedicated spinner and status text for asynchronous data fetching.
- **Empty State (No Tasks):** Welcoming graphic and call-to-action button when the store contains zero items.
- **Empty State (Filter Mismatch):** Contextual message explaining no tasks match criteria with a "Clear filters" button.
- **Invalid ID State:** Catches missing `?id=` query parameter before calling API and presents a navigation button.
- **Not Found State (404):** Handles deleted or non-existent IDs with an error screen.
- **Network Error State:** Displays human-friendly connection error with "Try Again" retry button.

---

## 13. Toast Notifications

Ephemeral status banners notify users of asynchronous action outcomes.

- Types: **Success** (green icon) and **Error** (red icon).
- Auto-dismisses after 3.5 seconds (2.0s for toggle).
- Manual close button (`×`).
- Positioned fixed at bottom-right (bottom-center on mobile).

---

## 14. Responsive Layout

- **Desktop (≥1024px):** 5-column stat cards, 2-column detail page with sticky metadata sidebar.
- **Tablet (768px - 1023px):** 3-column stats, stacked detail layout.
- **Mobile (<768px):** 2-column stats, full-width search and controls, horizontal scrolling filter tabs, persistent action buttons.
