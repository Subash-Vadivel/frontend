import { Edit2, Trash2 } from 'lucide-react';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0);

export default function TransactionTable({ entries, onEdit, onDelete }) {
  if (!entries.length) {
    return <div className="empty-state">No entries yet.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th className="numeric">Amount</th>
            <th className="actions-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.date}</td>
              <td>{entry.categoryName}</td>
              <td>{entry.description || '-'}</td>
              <td className="numeric">{formatCurrency(entry.amount)}</td>
              <td className="actions-cell">
                <button className="icon-button" type="button" onClick={() => onEdit(entry)} title="Edit entry">
                  <Edit2 size={16} />
                </button>
                <button className="icon-button danger" type="button" onClick={() => onDelete(entry.id)} title="Delete entry">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
