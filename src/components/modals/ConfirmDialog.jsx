export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  loading = false,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <section
        aria-label={title}
        aria-modal="true"
        className="modal-panel compact-modal confirm-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div>
          <span className="muted">Confirmation</span>
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
        <div className="confirm-actions">
          <button className="ghost-button" disabled={loading} onClick={onCancel} type="button">
            {cancelLabel}
          </button>
          <button className={`primary-button ${tone === 'danger' ? 'danger-button' : ''}`} disabled={loading} onClick={onConfirm} type="button">
            {loading ? 'Working...' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
