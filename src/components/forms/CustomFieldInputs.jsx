export default function CustomFieldInputs({ fields = [], values, onChange }) {
  if (!fields.length) return null;

  return (
    <div className="custom-field-section span-2">
      <h3>Category details</h3>
      <div className="form-grid nested-grid">
        {fields.map((field) => {
          if (field.type === 'BOOLEAN') {
            return (
              <label className="checkbox-label" key={field.id}>
                <input
                  type="checkbox"
                  checked={Boolean(values[field.id])}
                  onChange={(event) => onChange(field.id, event.target.checked)}
                />
                <span>{field.name}{field.required ? ' *' : ''}</span>
              </label>
            );
          }

          return (
            <label key={field.id}>
              {field.name}{field.required ? ' *' : ''}
              <input
                type={field.type === 'NUMBER' ? 'number' : 'text'}
                step={field.type === 'NUMBER' ? 'any' : undefined}
                value={values[field.id] ?? ''}
                onChange={(event) => onChange(field.id, event.target.value)}
                required={field.required}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
