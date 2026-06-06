import { X } from 'lucide-react';
import TransactionForm from '../forms/TransactionForm.jsx';

export default function TransactionCreateModal({ type, categories, onClose, onSubmit }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-panel" role="dialog" aria-modal="true" aria-label={`Add ${type} entry`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="muted">New entry</span>
            <h2>Add {type}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>
        <TransactionForm
          type={type}
          categories={categories}
          onSubmit={onSubmit}
          className="form-grid modal-form"
          heading={null}
        />
      </section>
    </div>
  );
}
