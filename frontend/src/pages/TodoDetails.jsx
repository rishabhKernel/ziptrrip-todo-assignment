import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import TodoForm from '../components/TodoForm.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Toast, { useToast } from '../components/Toast.jsx';
import { getTodoById, updateTodo, deleteTodo, toggleComplete } from '../services/todoApi.js';
import { getDueDateInfo, formatDate, formatDateTime } from '../utils/dateUtils.js';

const PRIORITY_LABEL = { high: '🔥 High', medium: '⚡ Medium', low: '🌿 Low' };
const PRIORITY_CLASS  = { high: 'badge-high', medium: 'badge-medium', low: 'badge-low' };

export default function TodoDetails() {
  const [searchParams]  = useSearchParams();
  const navigate         = useNavigate();
  const id               = searchParams.get('id');

  const [todo, setTodo]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);  // 'not-found' | 'invalid-id' | 'network' | string

  // Edit modal
  const [editOpen, setEditOpen]       = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggle
  const [isToggling, setIsToggling] = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  // ── Validate id ─────────────────────────────────────────────────────────────
  const isValidId = Boolean(id && id.trim());

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchTodo = useCallback(async () => {
    if (!isValidId) {
      setError('invalid-id');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getTodoById(id);
      setTodo(data);
    } catch (err) {
      if (err.message.includes('not found') || err.message.includes('404')) {
        setError('not-found');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [id, isValidId]);

  useEffect(() => { fetchTodo(); }, [fetchTodo]);

  // ── Toggle complete ──────────────────────────────────────────────────────────
  async function handleToggle() {
    if (isToggling || !todo) return;
    setIsToggling(true);
    try {
      const updated = await toggleComplete(todo.id, !todo.completed);
      setTodo(updated);
      addToast({
        type: 'success',
        title: updated.completed ? 'Task completed!' : 'Marked as pending',
        duration: 2000,
      });
    } catch (err) {
      addToast({ type: 'error', title: 'Update failed', message: err.message });
    } finally {
      setIsToggling(false);
    }
  }

  // ── Edit ────────────────────────────────────────────────────────────────────
  async function handleEditSubmit(payload) {
    setIsSubmitting(true);
    try {
      const updated = await updateTodo(todo.id, payload);
      setTodo(updated);
      setEditOpen(false);
      addToast({ type: 'success', title: 'Task updated' });
    } catch (err) {
      addToast({ type: 'error', title: 'Update failed', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteTodo(todo.id);
      addToast({ type: 'success', title: 'Task deleted', message: todo.title });
      navigate('/todos');
    } catch (err) {
      addToast({ type: 'error', title: 'Delete failed', message: err.message });
      setIsDeleting(false);
    }
  }

  // ── Due date ─────────────────────────────────────────────────────────────────
  const dueDateInfo = todo ? getDueDateInfo(todo.dueDate, todo.completed) : null;

  // ── Render states ────────────────────────────────────────────────────────────
  function renderContent() {
    if (loading) {
      return (
        <div className="loading-state" role="status" aria-label="Loading task details">
          <div className="spinner spinner-lg" aria-hidden="true" />
          <span>Loading task details…</span>
        </div>
      );
    }

    if (error === 'invalid-id') {
      return (
        <div className="error-state" role="alert">
          <div className="error-state__icon">🚫</div>
          <h1 className="error-state__title">Invalid Task ID</h1>
          <p className="error-state__message">
            No task ID was provided in the URL. Please return to your task list.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/todos')}>
            Back to Tasks
          </button>
        </div>
      );
    }

    if (error === 'not-found') {
      return (
        <div className="error-state" role="alert">
          <div className="error-state__icon">🔍</div>
          <h1 className="error-state__title">Task not found</h1>
          <p className="error-state__message">
            The task with ID <code>{id}</code> does not exist or may have been deleted.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/todos')}>
            Back to Tasks
          </button>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state" role="alert">
          <div className="error-state__icon">⚠️</div>
          <h1 className="error-state__title">Something went wrong</h1>
          <p className="error-state__message">{error}</p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/todos')}>Back to Tasks</button>
            <button className="btn btn-primary" onClick={fetchTodo}>Try Again</button>
          </div>
        </div>
      );
    }

    if (!todo) return null;

    const isOverdue = dueDateInfo?.key === 'overdue';
    const cardClass = `details-card${todo.completed ? ' details-card--completed' : isOverdue ? ' details-card--overdue' : ''}`;

    return (
      <div className="details-layout">
        {/* Main content */}
        <div className="details-main">
          <div className={cardClass}>

            {/* Badges row */}
            <div className="details-header">
              <div className="details-badges">
                {/* Status */}
                <span className={`badge ${todo.completed ? 'badge-completed' : 'badge-pending'}`}>
                  {todo.completed ? '✓ Completed' : '◐ Pending'}
                </span>
                {/* Priority */}
                <span className={`badge ${PRIORITY_CLASS[todo.priority]}`} aria-label={`Priority: ${PRIORITY_LABEL[todo.priority]}`}>
                  {PRIORITY_LABEL[todo.priority]}
                </span>
                {/* Due date badge */}
                {dueDateInfo && (
                  <span className={`badge ${dueDateInfo.badgeClass}`}>
                    {dueDateInfo.icon} {dueDateInfo.label}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className={`details-title${todo.completed ? ' details-title--completed' : ''}`}>
                {todo.title}
              </h1>
            </div>

            <div className="details-divider" />

            {/* Description */}
            <section aria-label="Task description">
              <h2 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-3)' }}>
                Description
              </h2>
              {todo.description ? (
                <p className="details-description">{todo.description}</p>
              ) : (
                <p className="details-empty-desc">No description provided.</p>
              )}
            </section>

            <div className="details-divider" />

            {/* Actions */}
            <div className="details-actions">
              <button
                id="detail-toggle-btn"
                className={`btn ${todo.completed ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleToggle}
                disabled={isToggling}
                aria-busy={isToggling}
                aria-label={todo.completed ? 'Mark as pending' : 'Mark as complete'}
              >
                {isToggling ? (
                  <><span className="spinner" aria-hidden="true" /> Updating…</>
                ) : todo.completed ? (
                  <><CheckIcon aria-hidden="true" /> Mark as Pending</>
                ) : (
                  <><CheckIcon aria-hidden="true" /> Mark as Complete</>
                )}
              </button>

              <button
                id="detail-edit-btn"
                className="btn btn-secondary"
                onClick={() => setEditOpen(true)}
                aria-label="Edit this task"
              >
                <EditIcon aria-hidden="true" /> Edit Task
              </button>

              <button
                id="detail-delete-btn"
                className="btn btn-danger"
                onClick={() => setDeleteOpen(true)}
                aria-label="Delete this task"
              >
                <TrashIcon aria-hidden="true" /> Delete Task
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar — metadata */}
        <aside className="details-sidebar" aria-label="Task metadata">
          <div className="sidebar-card">
            <div className="sidebar-card__title">Details</div>
            <div className="meta-list">
              <MetaItem label="Status" value={todo.completed ? 'Completed' : 'Pending'} />
              <MetaItem label="Priority" value={PRIORITY_LABEL[todo.priority]} />
              <MetaItem
                label="Due Date"
                value={todo.dueDate ? formatDate(todo.dueDate) : 'No due date'}
                valueClass={
                  dueDateInfo?.key === 'overdue' ? 'meta-item__value--overdue' :
                  dueDateInfo?.key === 'today'   ? 'meta-item__value--today'   :
                  dueDateInfo?.key !== 'completed' && todo.dueDate ? 'meta-item__value--upcoming' : ''
                }
              />
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-card__title">Activity</div>
            <div className="meta-list">
              <MetaItem label="Created"    value={formatDateTime(todo.createdAt)} />
              <MetaItem label="Last updated" value={formatDateTime(todo.updatedAt)} />
              {todo.completed && todo.updatedAt && (
                <MetaItem label="Completed on" value={formatDateTime(todo.updatedAt)} />
              )}
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-card__title">Task ID</div>
            <div style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-3)', wordBreak: 'break-all' }}>
              {todo.id}
            </div>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="page">
      <Header />

      <main className="page-content" id="main-content">
        {/* Back button */}
        <button
          className="details-back"
          onClick={() => navigate('/todos')}
          aria-label="Back to task list"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Tasks
        </button>

        {renderContent()}
      </main>

      {/* Edit modal */}
      {todo && (
        <TodoForm
          isOpen={editOpen}
          onClose={() => { if (!isSubmitting) setEditOpen(false); }}
          onSubmit={handleEditSubmit}
          initialData={todo}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete confirm */}
      {todo && (
        <ConfirmModal
          isOpen={deleteOpen}
          title="Delete Task"
          message={`Are you sure you want to delete "${todo.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => { if (!isDeleting) setDeleteOpen(false); }}
          isDeleting={isDeleting}
        />
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

// ── Inline icon components ────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M10.5 1.5a1.414 1.414 0 012 2L4 12l-2.5.5.5-2.5L10.5 1.5z"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 3.5h10M5.5 3.5V2.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75V3.5M5.5 6.5v4M8.5 6.5v4M3 3.5l.5 8a.75.75 0 00.75.75h5.5a.75.75 0 00.75-.75l.5-8"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MetaItem({ label, value, valueClass = 'meta-item__value' }) {
  return (
    <div className="meta-item">
      <span className="meta-item__label">{label}</span>
      <span className={valueClass || 'meta-item__value'}>{value}</span>
    </div>
  );
}
