import { useEffect, useRef } from 'react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isDeleting }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus cancel by default (safer default for destructive action)
      setTimeout(() => cancelRef.current?.focus(), 50);
    }
  }, [isOpen]);

  function handleKeyDown(e) {
    if (e.key === 'Escape') onCancel();
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onCancel();
  }

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <div className="modal confirm-modal">
        <div className="modal-body">
          <div className="confirm-modal__icon" aria-hidden="true">🗑️</div>
          <h2 className="confirm-modal__title" id="confirm-modal-title">
            {title || 'Delete Task'}
          </h2>
          <p className="confirm-modal__message" id="confirm-modal-desc">
            {message || 'Are you sure you want to delete this task? This action cannot be undone.'}
          </p>
        </div>
        <div className="modal-footer">
          <button
            ref={cancelRef}
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
            aria-busy={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Deleting…
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
