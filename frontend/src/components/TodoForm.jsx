import { useState, useEffect, useRef } from 'react';

const TITLE_MAX = 150;
const DESC_MAX  = 1000;
const PRIORITIES = [
  { value: 'high',   label: '🔥 High' },
  { value: 'medium', label: '⚡ Medium' },
  { value: 'low',    label: '🌿 Low' },
];

const EMPTY = { title: '', description: '', priority: 'medium', dueDate: '' };

/** Returns today's date as YYYY-MM-DD in local time (used for min-date enforcement). */
function getTodayStr() {
  const t = new Date();
  return [
    t.getFullYear(),
    String(t.getMonth() + 1).padStart(2, '0'),
    String(t.getDate()).padStart(2, '0'),
  ].join('-');
}

function validate(fields, isEditing) {
  const errs = {};
  if (!fields.title.trim()) {
    errs.title = 'Title is required.';
  } else if (fields.title.trim().length > TITLE_MAX) {
    errs.title = `Title must be ${TITLE_MAX} characters or fewer.`;
  }
  if (fields.description.length > DESC_MAX) {
    errs.description = `Description must be ${DESC_MAX} characters or fewer.`;
  }
  if (fields.dueDate) {
    const d = new Date(fields.dueDate);
    if (isNaN(d.getTime())) {
      errs.dueDate = 'Please enter a valid date.';
    } else if (!isEditing && fields.dueDate < getTodayStr()) {
      errs.dueDate = 'Due date cannot be in the past.';
    }
  }
  return errs;
}

export default function TodoForm({ isOpen, onClose, onSubmit, initialData, isSubmitting }) {
  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const titleRef = useRef(null);

  const isEditing = Boolean(initialData?.id);
  // min date for the date picker: today (local) when creating; undefined when editing
  const minDate   = isEditing ? undefined : getTodayStr();

  // Populate form when opened for editing
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFields({
          title:       initialData.title || '',
          description: initialData.description || '',
          priority:    initialData.priority || 'medium',
          dueDate:     initialData.dueDate ? initialData.dueDate.slice(0, 10) : '',
        });
      } else {
        setFields(EMPTY);
      }
      setErrors({});
      setTouched({});
      // Focus title after paint
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [isOpen, initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    const next = { ...fields, [name]: value };
    setFields(next);
    // Live-validate touched fields
    if (touched[name]) {
      const errs = validate(next, isEditing);
      setErrors((prev) => ({ ...prev, [name]: errs[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate(fields, isEditing);
    setErrors((prev) => ({ ...prev, [name]: errs[name] }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(fields).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validate(fields, isEditing);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      title:       fields.title.trim(),
      description: fields.description.trim(),
      priority:    fields.priority,
      dueDate:     fields.dueDate || null,
    };
    onSubmit(payload);
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose();
  }

  if (!isOpen) return null;

  const titleCount   = fields.title.length;
  const descCount    = fields.description.length;

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title" id="form-modal-title">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

              {/* Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-title">
                  Title <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  id="task-title"
                  ref={titleRef}
                  name="title"
                  type="text"
                  className={`form-control${errors.title ? ' error' : ''}`}
                  placeholder="What needs to be done?"
                  value={fields.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={TITLE_MAX + 10}
                  aria-required="true"
                  aria-describedby={errors.title ? 'title-error' : undefined}
                  aria-invalid={Boolean(errors.title)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {errors.title
                    ? <span id="title-error" className="form-error" role="alert">⚠ {errors.title}</span>
                    : <span />
                  }
                  <span className={`char-count${titleCount > TITLE_MAX * 0.9 ? titleCount >= TITLE_MAX ? ' at-limit' : ' near-limit' : ''}`}>
                    {titleCount}/{TITLE_MAX}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-description">Description</label>
                <textarea
                  id="task-description"
                  name="description"
                  className={`form-control${errors.description ? ' error' : ''}`}
                  placeholder="Add more details (optional)…"
                  value={fields.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                  maxLength={DESC_MAX + 10}
                  aria-describedby={errors.description ? 'desc-error' : undefined}
                  aria-invalid={Boolean(errors.description)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {errors.description
                    ? <span id="desc-error" className="form-error" role="alert">⚠ {errors.description}</span>
                    : <span />
                  }
                  <span className={`char-count${descCount > DESC_MAX * 0.9 ? descCount >= DESC_MAX ? ' at-limit' : ' near-limit' : ''}`}>
                    {descCount}/{DESC_MAX}
                  </span>
                </div>
              </div>

              {/* Priority + Due Date row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {/* Priority */}
                <div className="form-group">
                  <label className="form-label" htmlFor="task-priority">Priority</label>
                  <select
                    id="task-priority"
                    name="priority"
                    className="form-control sort-select"
                    value={fields.priority}
                    onChange={handleChange}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div className="form-group">
                  <label className="form-label" htmlFor="task-due-date">Due Date</label>
                  <input
                    id="task-due-date"
                    name="dueDate"
                    type="date"
                    className={`form-control${errors.dueDate ? ' error' : ''}`}
                    value={fields.dueDate}
                    min={minDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-describedby={errors.dueDate ? 'duedate-error' : undefined}
                    aria-invalid={Boolean(errors.dueDate)}
                  />
                  {errors.dueDate && (
                    <span id="duedate-error" className="form-error" role="alert">⚠ {errors.dueDate}</span>
                  )}
                </div>
              </div>

            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="form-submit-btn"
              className="btn btn-primary"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  {isEditing ? 'Saving…' : 'Creating…'}
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
