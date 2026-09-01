# TaskFlow — REST API Reference

TaskFlow provides a RESTful API built on Express.js for managing todo items. All API payloads and responses use standard JSON format.

**Base URL:** `http://localhost:5000/api`

---

## 1. Data Models & Schemas

### Todo Entity Schema

| Field | Type | Required | Description | Example |
|---|---|---|---|---|
| `id` | `string (UUID v4)` | Generated | Unique identifier generated via `crypto.randomUUID()` | `"98fb296e-e67e-4db6-9776-4333d57308fc"` |
| `title` | `string` | Yes | Task title (1 to 150 characters, trimmed) | `"Prepare project documentation"` |
| `description` | `string` | No | Additional task details (max 1000 characters, trimmed) | `"Write setup instructions in markdown."` |
| `completed` | `boolean` | No (Default: `false`) | Completion state | `false` |
| `priority` | `string` | No (Default: `"medium"`) | Priority level: `"low"`, `"medium"`, or `"high"` | `"high"` |
| `dueDate` | `string \| null` | No (Default: `null`) | Due date formatted as `YYYY-MM-DD` | `"2026-09-15"` |
| `createdAt` | `string (ISO 8601)` | Generated | Timestamp when created | `"2026-09-01T07:15:24.003Z"` |
| `updatedAt` | `string (ISO 8601)` | Generated | Timestamp when last modified | `"2026-09-01T07:15:24.003Z"` |

---

## 2. Standard Response Envelopes

### Success Envelope
```json
{
  "success": true,
  "data": { ... } // or array of items
}
```

### Error Envelope
```json
{
  "success": false,
  "message": "Error description message."
}
```

---

## 3. Endpoints

### 3.1 Health Check
Checks if the backend API service is running.

- **Method:** `GET`
- **URL:** `/api/health`
- **Success Status:** `200 OK`

#### Response Example
```json
{
  "success": true,
  "message": "TaskFlow API is running."
}
```

---

### 3.2 List All Todos
Retrieves all stored todos in reverse chronological order (newest first).

- **Method:** `GET`
- **URL:** `/api/todos`
- **Success Status:** `200 OK`

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

### 3.3 Get Todo By ID
Fetches a specific todo using its unique UUID identifier.

- **Method:** `GET`
- **URL:** `/api/todos/:id`
- **Parameters:** `id` (string, UUID)
- **Success Status:** `200 OK`

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

### 3.4 Create Todo
Creates a new todo item and writes it directly to storage.

- **Method:** `POST`
- **URL:** `/api/todos`
- **Success Status:** `201 Created`
- **Headers:** `Content-Type: application/json`

#### Request Body
```json
{
  "title": "Implement authentication",
  "description": "Integrate JWT-based auth with refresh token rotation.",
  "priority": "high",
  "dueDate": "2026-09-10"
}
```

#### Validation Rules on Creation:
- `title` is **required**, must be a string between 1 and 150 characters (trimmed).
- `description` is optional, max 1000 characters.
- `priority` must be one of: `"low"`, `"medium"`, `"high"`.
- `dueDate` must be a valid date string and **cannot be in the past** (must be today or future).

#### Success Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "3fe0779d-583c-4d1e-9302-6ca1acac090b",
    "title": "Implement authentication",
    "description": "Integrate JWT-based auth with refresh token rotation.",
    "completed": false,
    "priority": "high",
    "dueDate": "2026-09-10",
    "createdAt": "2026-09-01T07:23:43.579Z",
    "updatedAt": "2026-09-01T07:23:43.579Z"
  }
}
```

#### Validation Error Responses (400 Bad Request)
- Missing title:
  ```json
  { "success": false, "message": "Title is required." }
  ```
- Past due date:
  ```json
  { "success": false, "message": "Due date cannot be in the past for new tasks." }
  ```
- Invalid priority:
  ```json
  { "success": false, "message": "Priority must be one of: low, medium, high." }
  ```

---

### 3.5 Update Todo
Updates specified fields of an existing todo. Fields omitted in the body remain unchanged.

- **Method:** `PUT`
- **URL:** `/api/todos/:id`
- **Parameters:** `id` (string, UUID)
- **Success Status:** `200 OK`
- **Headers:** `Content-Type: application/json`

#### Request Body Examples

**Partial update (Completion toggle):**
```json
{
  "completed": true
}
```

**Full update:**
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

#### Error Responses
- Not found (404):
  ```json
  { "success": false, "message": "Todo not found." }
  ```
- Invalid type (400):
  ```json
  { "success": false, "message": "Completed must be a boolean." }
  ```

---

### 3.6 Delete Todo
Permanently removes a todo item by ID.

- **Method:** `DELETE`
- **URL:** `/api/todos/:id`
- **Parameters:** `id` (string, UUID)
- **Success Status:** `200 OK`

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Todo deleted successfully.",
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

#### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Todo not found."
}
```

---

## 4. Error Handling & Status Codes

| Code | Meaning | Occurs When |
|---|---|---|
| `200 OK` | Success | GET, PUT, DELETE operations succeed |
| `201 Created` | Created | POST `/api/todos` creates a record |
| `400 Bad Request` | Validation Failure | Invalid/missing title, invalid priority, invalid date, past date on create |
| `404 Not Found` | Resource Missing | Non-existent UUID provided or invalid endpoint route |
| `500 Internal Server Error` | Server Error | File system I/O or unhandled internal exception (sanitized in production) |

---

## 5. Storage & Persistence Implementation

- **Location:** `backend/data/todos.json`
- **Atomic Writes:** To prevent write collisions and file corruption, the backend writes to a temporary file (`todos.json.tmp`) and executes `fs.renameSync()` atomically.
- **Initialization:** Automatically initializes the `data/` folder and `todos.json` with an empty array `[]` on startup if missing.
