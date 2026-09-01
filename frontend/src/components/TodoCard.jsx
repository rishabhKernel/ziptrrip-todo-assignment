import { Link } from 'react-router-dom';
import { getDueDateInfo, formatDate } from '../utils/dateUtils.js';

const PRIORITY_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };
const PRIORITY_CLASS  = { high: 'badge-high', medium: 'badge-medium', low: 'badge-low' };

export default function TodoCard({ todo, onToggle, onEdit, onDelete, isUpdating }) {
  const dueDateInfo = getDueDateInfo(todo.dueDate, todo.completed);

  // Stop card click from firing when clicking on actions
  function stopProp(e) { e.stopPropagation(); e.preventDefault(); }

  return (
    <article
      className={`card todo-card${todo.completed ? ' todo-card--completed card-completed' : ''}${dueDateInfo?.key === 'overdue' ? ' card-overdue' : ''}`}
      aria-label={`Task: ${todo.title}`}
    >
      {/* Checkbox */}
      <div className="todo-card__checkbox-wrap" onClick={stopProp}>
        <input
          id={`todo-check-${todo.id}`}
          type="checkbox"
          className="todo-card__checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          disabled={isUpdating}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        />
      </div>

      {/* Body — clicking navigates to detail */}
      <Link
        to={`/todo?id=${todo.id}`}
        className="todo-card__body"
        style={{ textDecoration: 'none', color: 'inherit' }}
        aria-label={`View details for ${todo.title}`}
      >
        <h3 className="todo-card__title truncate">{todo.title}</h3>

        {todo.description && (
          <p className="todo-card__description">{todo.description}</p>
        )}

        <div className="todo-card__meta">
          {/* Priority badge */}
          <span className={`badge ${PRIORITY_CLASS[todo.priority]}`} aria-label={`Priority: ${PRIORITY_LABEL[todo.priority]}`}>
            {todo.priority === 'high' && <span aria-hidden="true">●</span>}
            {PRIORITY_LABEL[todo.priority]}
          </span>

          {/* Due date badge */}
          {dueDateInfo && (
            <span className={`badge ${dueDateInfo.badgeClass}`} aria-label={`Due: ${dueDateInfo.label}`}>
              {dueDateInfo.icon} {dueDateInfo.label}
            </span>
          )}

          {/* Created date */}
          <span className="text-faint" style={{ fontSize: 'var(--font-size-xs)' }}>
            Created {formatDate(todo.createdAt)}
          </span>
        </div>
      </Link>

      {/* Actions */}
      <div className="todo-card__actions" onClick={stopProp}>
        {/* Edit */}
        <button
          className="btn-icon"
          onClick={() => onEdit(todo)}
          aria-label={`Edit task: ${todo.title}`}
          title="Edit"
          type="button"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d="M11.5 1.5a1.414 1.414 0 012 2L4.5 12.5l-3 1 1-3L11.5 1.5z"
              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Delete */}
        <button
          className="btn-icon danger"
          onClick={() => onDelete(todo)}
          aria-label={`Delete task: ${todo.title}`}
          title="Delete"
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 3.5h10M5.5 3.5V2.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75V3.5M5.5 6.5v4M8.5 6.5v4M3 3.5l.5 8a.75.75 0 00.75.75h5.5a.75.75 0 00.75-.75l.5-8"
              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </article>
  );
}
