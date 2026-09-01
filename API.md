# TaskFlow — REST API Reference

TaskFlow provides a RESTful API built on Express.js for full task management. All endpoints accept and return JSON payloads.

---

## 1. Base URLs

| Environment | Base URL |
|---|---|
| **Production (Render)** | `https://taskflow-backend-dyzg.onrender.com/api` |
| **Local Development** | `http://localhost:5000/api` |

---

## 2. Data Models & Schemas

### Todo Entity

| Field | Type | Required | Description | Example |
|---|---|---|---|---|
| `id` | `string (UUID v4)` | Auto | Unique identifier generated via `crypto.randomUUID()` | `"98fb296e-e67e-4db6-9776-4333d57308fc"` |
| `title` | `string` | Yes | Task title (1 to 150 characters, trimmed) | `"Design database schema"` |
| `description` | `string` | No | Task details (max 1000 characters, trimmed) | `"Draft ER diagram with 3NF normalization."` |
| `completed` | `boolean` | No (Default: `false`) | Completion state | `false` |
| `priority` | `string` | No (Default: `"medium"`) | Priority: `"low"`, `"medium"`, or `"high"` | `"high"` |
| `dueDate` | `string \| null` | No (Default: `null`) | Due date formatted as `YYYY-MM-DD` | `"2026-09-15"` |
| `createdAt` | `string (ISO 8601)` | Auto | Creation timestamp | `"2026-09-01T07:15:24.003Z"` |
| `updatedAt` | `string (ISO 8601)` | Auto | Last updated timestamp | `"2026-09-01T07:15:24.003Z"` |

---

## 3. Standard Response Envelopes

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Human-readable error explanation."
}
```

---

## 4. API Endpoints

### 4.1 Health Check
Verifies backend operational status.

- **Method:** `GET`
- **URL:** `/api/health`
- **Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "TaskFlow API is running."
}
```

---

### 4.2 List All Todos
Retrieves all stored tasks (ordered newest first).

- **Method:** `GET`
- **URL:** `/api/todos`
- **Status Code:** `200 OK`

#### Response Example
```json
{
  "success": true,
  "data": [
    {
      "id": "98fb296e-e67e-4db6-9776-4333d57308fc",
      "title": "Team standup preparation",
      "description": "Prepare bullet points for tomorrow's standup meeting.",
      "completed": false,
      "priority": "low",
      "dueDate": null,
      "createdAt": "2026-09-01T07:15:24.003Z",
      "updatedAt": "2026-09-01T07:15:24.003Z"
    }
  ]
}
```

---

### 4.3 Get Todo By ID
Retrieves a single task by its UUID.

- **Method:** `GET`
- **URL:** `/api/todos/:id`
- **Parameters:** `id` (string, UUID)
- **Status Code:** `200 OK` / `404 Not Found`

#### Response Example (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "98fb296e-e67e-4db6-9776-4333d57308fc",
    "title": "Team standup preparation",
    "description": "Prepare bullet points for tomorrow's standup meeting.",
    "completed": false,
    "priority": "low",
    "dueDate": null,
    "createdAt": "2026-09-01T07:15:24.003Z",
    "updatedAt": "2026-09-01T07:15:24.003Z"
  }
}
```

#### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Todo not found."
}
```

---

### 4.4 Create Todo
Creates a new task record.

- **Method:** `POST`
- **URL:** `/api/todos`
- **Status Code:** `201 Created` / `400 Bad Request`
- **Headers:** `Content-Type: application/json`

#### Request Body
```json
{
  "title": "Implement authentication",
  "description": "Integrate JWT-based auth with refresh tokens.",
  "priority": "high",
  "dueDate": "2026-09-10"
}
```

#### Validation Rules:
- `title` is **required** (string, 1 to 150 characters, trimmed).
- `description` is optional (string, max 1000 characters).
- `priority` must be `"low"`, `"medium"`, or `"high"`.
- `dueDate` must be a valid date and **cannot be in the past** (must be today or future).

#### Success Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "3fe0779d-583c-4d1e-9302-6ca1acac090b",
    "title": "Implement authentication",
    "description": "Integrate JWT-based auth with refresh tokens.",
    "completed": false,
    "priority": "high",
    "dueDate": "2026-09-10",
    "createdAt": "2026-09-01T07:23:43.579Z",
    "updatedAt": "2026-09-01T07:23:43.579Z"
  }
}
```

#### Validation Errors (400 Bad Request)
```json
{ "success": false, "message": "Title is required." }
{ "success": false, "message": "Due date cannot be in the past for new tasks." }
{ "success": false, "message": "Priority must be one of: low, medium, high." }
```

---

### 4.5 Update Todo
Updates specified attributes of an existing task.

- **Method:** `PUT`
- **URL:** `/api/todos/:id`
- **Status Code:** `200 OK` / `400 Bad Request` / `404 Not Found`
- **Headers:** `Content-Type: application/json`

#### Request Body Examples

**Toggle Completion:**
```json
{
  "completed": true
}
```

**Full Update:**
```json
{
  "title": "Implement authentication & authorization",
  "description": "Added role-based access control.",
  "priority": "high",
  "dueDate": "2026-09-12",
  "completed": false
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "3fe0779d-583c-4d1e-9302-6ca1acac090b",
    "title": "Implement authentication & authorization",
    "description": "Added role-based access control.",
    "completed": false,
    "priority": "high",
    "dueDate": "2026-09-12",
    "createdAt": "2026-09-01T07:23:43.579Z",
    "updatedAt": "2026-09-01T07:35:10.120Z"
  }
}
```

---

### 4.6 Delete Todo
Permanently deletes a task by ID.

- **Method:** `DELETE`
- **URL:** `/api/todos/:id`
- **Status Code:** `200 OK` / `404 Not Found`

#### Response Example (200 OK)
```json
{
  "success": true,
  "message": "Todo deleted successfully.",
  "data": {
    "id": "3fe0779d-583c-4d1e-9302-6ca1acac090b",
    "title": "Implement authentication & authorization"
  }
}
```

---

## 5. HTTP Status Code Summary

| Status Code | Reason |
|---|---|
| `200 OK` | Request succeeded (GET, PUT, DELETE) |
| `201 Created` | Task successfully created (POST) |
| `400 Bad Request` | Validation failure on payload |
| `404 Not Found` | Unmatched route or non-existent task ID |
| `500 Internal Server Error` | Unexpected server failure (sanitized error message) |

---

## 6. Persistence Details

- **File Location:** `backend/data/todos.json`
- **Atomic File I/O:** Serialized writes target `todos.json.tmp` before performing `fs.renameSync` to ensure data integrity.
- **Auto-Initialization:** The data folder and an empty array `[]` are created automatically if uninitialized.
