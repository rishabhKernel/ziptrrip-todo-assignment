import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const baseURL = rawUrl.endsWith('/api')
  ? rawUrl
  : rawUrl === '/api'
    ? '/api'
    : `${rawUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Response Interceptor ──────────────────────────────────────────────────────
// Unwraps { success, data } envelope and normalizes errors.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Request timed out.' : null) ||
      (error.message === 'Network Error' ? 'Cannot connect to server. Is the backend running?' : null) ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ── API Functions ─────────────────────────────────────────────────────────────

export async function getAllTodos() {
  const res = await api.get('/todos');
  return res.data.data;
}

export async function getTodoById(id) {
  const res = await api.get(`/todos/${id}`);
  return res.data.data;
}

export async function createTodo(payload) {
  const res = await api.post('/todos', payload);
  return res.data.data;
}

export async function updateTodo(id, payload) {
  const res = await api.put(`/todos/${id}`, payload);
  return res.data.data;
}

export async function deleteTodo(id) {
  const res = await api.delete(`/todos/${id}`);
  return res.data;
}

export async function toggleComplete(id, completed) {
  const res = await api.put(`/todos/${id}`, { completed });
  return res.data.data;
}
