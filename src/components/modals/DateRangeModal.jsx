import { useState } from 'react';
import { CalendarCheck, X } from 'lucide-react';

export default function DateRangeModal({ initialRange, onApply, onClose }) {
  const [startDate, setStartDate] = useState(initialRange?.startDate || '');
  const [endDate, setEndDate] = useState(initialRange?.endDate || '');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!startDate || !endDate) {
      setError('Start date and end date are required');
      return;
    }
    if (startDate > endDate) {
      setError('Start date cannot be after end date');
      return;
    }
    onApply({ startDate, endDate });
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-panel compact-modal" role="dialog" aria-modal="true" aria-label="Custom date range" onMouseDown={(event) => event.stopPropagation()}>
        <form className="form-grid" onSubmit={submit}>
          <div className="modal-header span-2">
            <div>
              <span className="muted">Date filter</span>
              <h2>Custom date range</h2>
            </div>
            <button className="icon-button" type="button" onClick={onClose} title="Close">
              <X size={18} />
            </button>
          </div>
          <label>
            Start date
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
          </label>
          <label>
            End date
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required />
          </label>
          {error && <p className="error-message span-2">{error}</p>}
          <button className="primary-button span-2" type="submit">
            <CalendarCheck size={17} /> Apply range
          </button>
        </form>
      </section>
    </div>
  );
}
