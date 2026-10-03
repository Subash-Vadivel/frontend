import { AlertTriangle, MailCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteBusiness, sendBusinessDeleteCode } from '../../api/businessApi';
import { getErrorMessage } from '../../lib/utils.js';
import { Button } from '../ui/button.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';

export default function DeleteWorkspaceModal({ business, email, onClose, onDeleted }) {
  const [step, setStep] = useState('confirm');
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const sendCode = async () => {
    setSending(true); setError(''); setNotice('');
    try {
      const response = await sendBusinessDeleteCode(business.id);
      setNotice(`${response.message} It expires in ${response.expiresInMinutes} minutes.`);
      setCode(''); setStep('code');
    } catch (err) { setError(getErrorMessage(err, 'Unable to send code')); }
    finally { setSending(false); }
  };

  const confirmDelete = async (event) => {
    event.preventDefault(); setDeleting(true); setError('');
    try { await deleteBusiness(business.id, code); await onDeleted(); }
    catch (err) { setError(getErrorMessage(err, 'Unable to delete workspace')); setDeleting(false); }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !deleting) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogDescription>Danger zone</DialogDescription>
          <DialogTitle>Delete {business.name}?</DialogTitle>
        </DialogHeader>
        <div className="flex items-start gap-3 rounded-md border border-destructive/20 bg-destructive/10 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-muted-foreground">This permanently deletes the workspace and <span className="font-medium text-foreground">all of its income, expenses, categories, members, invitations and MCP API keys</span>. This can't be undone.</p>
        </div>
        {step === 'confirm' ? (
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">To confirm, we'll email a 6-digit code to <span className="font-medium text-foreground break-all">{email}</span>.</p>
            {error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={sendCode} disabled={sending}><MailCheck /> {sending ? 'Sending...' : 'Send code'}</Button>
            </DialogFooter>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={confirmDelete}>
            {notice && <p className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-2 text-xs text-emerald-700 dark:text-emerald-300">{notice}</p>}
            <div className="grid gap-1.5">
              <Label htmlFor="delete-code">Verification code</Label>
              <Input id="delete-code" className="text-center font-mono text-lg tracking-[0.5em]" inputMode="numeric" autoComplete="one-time-code" autoFocus maxLength={6} pattern="\d{6}" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" required />
            </div>
            {error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">Didn't get it? <button type="button" className="font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-50" onClick={sendCode} disabled={sending || deleting}>{sending ? 'Sending...' : 'Send a new code'}</button></p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={deleting}>Cancel</Button>
              <Button type="submit" variant="destructive" disabled={deleting || code.length !== 6}><Trash2 /> {deleting ? 'Deleting...' : 'Delete permanently'}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
