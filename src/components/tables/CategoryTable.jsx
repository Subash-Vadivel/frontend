const formatDate = (value) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

const typeLabel = {
  income: 'Income',
  expense: 'Expense',
};

export default function CategoryTable({ categories }) {
  if (!categories.length) {
    return <div className="empty-state">No categories yet.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Type</th>
            <th className="numeric">Custom fields</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td><strong>{category.name}</strong></td>
              <td>
                <span className={`type-badge ${category.type}`}>{typeLabel[category.type] || category.type}</span>
              </td>
              <td className="numeric">{category.customFields?.length || 0}</td>
              <td>{formatDate(category.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
