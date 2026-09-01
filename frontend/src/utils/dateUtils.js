/**
 * Returns metadata about a due date for display purposes.
 * Does not mark completed tasks as overdue.
 */
export function getDueDateInfo(dueDate, completed = false) {
  if (!dueDate) return null;

  const due = new Date(dueDate);
  // Set to start of day for fair comparison
  due.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

  if (completed) {
    return {
      key: 'completed',
      label: `Due ${formatShortDate(dueDate)}`,
      badgeClass: 'badge-completed',
      icon: '✓',
    };
  }

  if (due < today) {
    return {
      key: 'overdue',
      label: `Overdue · ${formatShortDate(dueDate)}`,
      badgeClass: 'badge-overdue',
      icon: '⚠',
    };
  }

  if (diffDays === 0) {
    return {
      key: 'today',
      label: 'Due today',
      badgeClass: 'badge-due-today',
      icon: '📅',
    };
  }

  if (diffDays === 1) {
    return {
      key: 'tomorrow',
      label: 'Due tomorrow',
      badgeClass: 'badge-upcoming',
      icon: '📅',
    };
  }

  if (diffDays <= 7) {
    return {
      key: 'upcoming',
      label: `Due in ${diffDays} days`,
      badgeClass: 'badge-upcoming',
      icon: '📅',
    };
  }

  return {
    key: 'future',
    label: `Due ${formatShortDate(dueDate)}`,
    badgeClass: 'badge-upcoming',
    icon: '📅',
  };
}

/**
 * Formats a date string as "Jan 15, 2025"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

/**
 * Formats a date string as "Jan 15"
 */
export function formatShortDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

/**
 * Formats a full ISO timestamp as "Jan 15, 2025 at 3:45 PM"
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '—';
  }
}

/**
 * Priority sort order mapping (high → lowest number → sorts first)
 */
export const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
