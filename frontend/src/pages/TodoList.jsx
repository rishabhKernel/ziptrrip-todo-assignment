import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from '../components/Header.jsx';
import TodoStats from '../components/TodoStats.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterBar from '../components/FilterBar.jsx';
import TodoCard from '../components/TodoCard.jsx';
import TodoForm from '../components/TodoForm.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Toast, { useToast } from '../components/Toast.jsx';
import {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleComplete,
} from '../services/todoApi.js';
import { PRIORITY_ORDER } from '../utils/dateUtils.js';

// ── Filter & Sort ─────────────────────────────────────────────────────────────
function filterTodos(todos, search, filter) {
  const q = search.toLowerCase().trim();
  return todos.filter((t) => {
    if (q && !t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) {
      return false;
    }
    if (filter === 'pending')   return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'high')      return t.priority === 'high';
    if (filter === 'medium')    return t.priority === 'medium';
    if (filter === 'low')       return t.priority === 'low';
    return true; // 'all'
  });
}

function sortTodos(todos, sortBy) {
  return [...todos].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'priority':
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      case 'dueDate': {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      case 'title':
        return a.title.localeCompare(b.title);
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TodoList() {
  const [todos, setTodos]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [fetchError, setFetchError]   = useState(null);
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState('all');
  const [sortBy, setSortBy]           = useState('newest');
  const [updatingIds, setUpdatingIds] = useState(new Set());

  // Form modal state
  const [formOpen, setFormOpen]       = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting]     = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getAllTodos();
      setTodos(data);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  // ── Derived data ────────────────────────────────────────────────────────────
  const displayed = useMemo(
    () => sortTodos(filterTodos(todos, search, filter), sortBy),
    [todos, search, filter, sortBy]
  );

  // ── Handlers ────────────────────────────────────────────────────────────────
  function openCreate() { setEditTarget(null); setFormOpen(true); }
  function openEdit(todo) { setEditTarget(todo); setFormOpen(true); }
  function closeForm() { if (!isSubmitting) setFormOpen(false); }

  async function handleSubmit(payload) {
    setIsSubmitting(true);
    try {
      if (editTarget) {
        const updated = await updateTodo(editTarget.id, payload);
        setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        addToast({ type: 'success', title: 'Task updated', message: updated.title });
      } else {
        const created = await createTodo(payload);
        setTodos((prev) => [created, ...prev]);
        addToast({ type: 'success', title: 'Task created', message: created.title });
      }
      setFormOpen(false);
    } catch (err) {
      addToast({ type: 'error', title: editTarget ? 'Update failed' : 'Create failed', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggle(todo) {
    if (updatingIds.has(todo.id)) return;
    setUpdatingIds((prev) => new Set(prev).add(todo.id));
    try {
      const updated = await toggleComplete(todo.id, !todo.completed);
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      addToast({
        type: 'success',
        title: updated.completed ? 'Task completed!' : 'Marked as pending',
        message: updated.title,
        duration: 2000,
      });
    } catch (err) {
      addToast({ type: 'error', title: 'Update failed', message: err.message });
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(todo.id);
        return next;
      });
    }
  }

  function handleDeleteRequest(todo) { setDeleteTarget(todo); }
  function cancelDelete() { if (!isDeleting) setDeleteTarget(null); }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteTodo(deleteTarget.id);
      setTodos((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      addToast({ type: 'success', title: 'Task deleted', message: deleteTarget.title });
      setDeleteTarget(null);
    } catch (err) {
      addToast({ type: 'error', title: 'Delete failed', message: err.message });
    } finally {
      setIsDeleting(false);
    }
  }

  const isFiltered = search.trim() !== '' || filter !== 'all';

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="page">
      <Header onNewTask={openCreate} />

      <main className="page-content" id="main-content">

        {/* Hero */}
        <div className="todolist-hero">
          <div>
            <h1 className="todolist-hero__title">My Tasks</h1>
            <p className="todolist-hero__sub">Organize, prioritize, and conquer your work.</p>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={openCreate}
            id="hero-new-task-btn"
            aria-label="Create a new task"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Task
          </button>
        </div>

        {/* Stats */}
        {!loading && !fetchError && <TodoStats todos={todos} />}

        {/* Controls */}
        <div className="controls-bar">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar
            activeFilter={filter}
            onFilter={setFilter}
            sortBy={sortBy}
            onSort={setSortBy}
          />
        </div>

        {/* Content */}
        {loading && (
          <div className="loading-state" role="status" aria-label="Loading tasks">
            <div className="spinner spinner-lg" aria-hidden="true" />
            <span>Loading your tasks…</span>
          </div>
        )}

        {!loading && fetchError && (
          <div className="error-state" role="alert">
            <div className="error-state__icon">⚠️</div>
            <div className="error-state__title">Could not load tasks</div>
            <p className="error-state__message">{fetchError}</p>
            <button className="btn btn-primary" onClick={fetchTodos}>Try Again</button>
          </div>
        )}

        {!loading && !fetchError && (
          <>
            {displayed.length > 0 && (
              <p className="todo-list__count" aria-live="polite">
                Showing {displayed.length} of {todos.length} task{todos.length !== 1 ? 's' : ''}
              </p>
            )}

            {todos.length === 0 ? (
              /* Truly empty — no tasks at all */
              <div className="empty-state">
                <div className="empty-state__icon">📝</div>
                <h2 className="empty-state__title">No tasks yet</h2>
                <p className="empty-state__message">
                  Create your first task to start organizing your work and staying productive.
                </p>
                <button className="btn btn-primary btn-lg" onClick={openCreate} id="empty-state-cta">
                  Create your first task
                </button>
              </div>
            ) : displayed.length === 0 ? (
              /* Has tasks but none match current filter/search */
              <div className="empty-state">
                <div className="empty-state__icon">🔍</div>
                <h2 className="empty-state__title">No matching tasks</h2>
                <p className="empty-state__message">
                  {search
                    ? `No tasks found for "${search}". Try a different search term.`
                    : 'No tasks match the current filter. Try selecting a different filter.'}
                </p>
                <button
                  className="btn btn-secondary"
                  onClick={() => { setSearch(''); setFilter('all'); }}
                  id="clear-filters-btn"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              /* Todo list */
              <div className="todo-list" role="list" aria-label="Task list">
                {displayed.map((todo) => (
                  <div key={todo.id} role="listitem">
                    <TodoCard
                      todo={todo}
                      onToggle={handleToggle}
                      onEdit={openEdit}
                      onDelete={handleDeleteRequest}
                      isUpdating={updatingIds.has(todo.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <TodoForm
        isOpen={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        initialData={editTarget}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={isDeleting}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
