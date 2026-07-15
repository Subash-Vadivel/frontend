import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';

export default function CustomFieldInputs({ fields = [], values, onChange }) {
  if (!fields.length) return null;
  return (
    <div className="col-span-full grid gap-3 rounded-lg border border-dashed bg-muted/30 p-4">
      <h3 className="text-sm font-medium">Category details</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => field.type === 'BOOLEAN' ? (
          <Label className="flex min-h-10 items-center gap-2" key={field.id}>
            <input className="h-4 w-4 accent-primary" type="checkbox" checked={Boolean(values[field.id])} onChange={(event) => onChange(field.id, event.target.checked)} />
            <span>{field.name}{field.required ? ' *' : ''}</span>
          </Label>
        ) : (
          <div className="grid gap-2" key={field.id}>
            <Label>{field.name}{field.required ? ' *' : ''}</Label>
            <Input type={field.type === 'NUMBER' ? 'number' : 'text'} step={field.type === 'NUMBER' ? 'any' : undefined} value={values[field.id] ?? ''} onChange={(event) => onChange(field.id, event.target.value)} required={field.required} />
          </div>
        ))}
      </div>
    </div>
  );
}
