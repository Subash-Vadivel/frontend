import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import { Button } from '../ui/button.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';

export default function DateRangeModal({ initialRange, onApply, onClose }) {
  const [startDate, setStartDate] = useState(initialRange?.startDate || '');
  const [endDate, setEndDate] = useState(initialRange?.endDate || '');
  const [error, setError] = useState('');
  const submit = (event) => {
    event.preventDefault();
    if (!startDate || !endDate) { setError('Start date and end date are required'); return; }
    if (startDate > endDate) { setError('Start date cannot be after end date'); return; }
    onApply({ startDate, endDate });
  };
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogDescription>Date filter</DialogDescription><DialogTitle>Custom date range</DialogTitle></DialogHeader>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
          <div className="grid gap-2"><Label>Start date</Label><Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required /></div>
          <div className="grid gap-2"><Label>End date</Label><Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required /></div>
          {error && <p className="col-span-full rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <Button className="col-span-full" type="submit"><CalendarCheck /> Apply range</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
