import { Check, Copy, MailPlus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { getErrorMessage } from '../../lib/utils.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx';

const roles = [
  ['admin', 'Admin', 'Full access, including users and integrations'],
  ['manager', 'Manager', 'Can add and edit income, expenses, and categories'],
  ['viewer', 'Viewer', 'Read-only access'],
];

export default function InviteUserModal({ businessName, onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [invite, setInvite] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try { setInvite(await onSubmit({ email, role })); }
    catch (err) { setError(getErrorMessage(err, 'Unable to create invitation')); }
    finally { setSaving(false); }
  };
  const copyLink = async () => {
    if (!invite?.inviteUrl) return;
    await navigator.clipboard.writeText(invite.inviteUrl);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };
  const inviteAnother = () => { setInvite(null); setEmail(''); setRole('viewer'); setCopied(false); };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogDescription>{businessName || 'New invitation'}</DialogDescription>
          <DialogTitle>{invite ? 'Invitation sent' : 'Add new user'}</DialogTitle>
        </DialogHeader>
        {invite ? (
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">Invitation email sent to <span className="font-medium text-foreground">{invite.email}</span>. They'll join as <span className="font-medium text-foreground">{invite.role}</span> once they accept. You can also share the link directly:</p>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <code className="overflow-wrap-anywhere rounded-md border bg-muted/30 px-2.5 py-2 font-mono text-xs text-foreground">{invite.inviteUrl}</code>
              <Button type="button" variant="outline" onClick={copyLink}>{copied ? <><Check /> Copied</> : <><Copy /> Copy</>}</Button>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={inviteAnother}>Invite another</Button>
              <Button type="button" onClick={onClose}>Done</Button>
            </DialogFooter>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-1.5"><Label>Email</Label><Input type="email" autoFocus value={email} onChange={(event) => setEmail(event.target.value)} placeholder="teammate@example.com" required /></div>
            <div className="grid gap-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{roles.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{roles.find(([value]) => value === role)?.[2]}</p>
            </div>
            <p className="text-xs text-muted-foreground">We'll email them an invitation link. It expires in 14 days.</p>
            {error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={saving}><MailPlus /> {saving ? 'Creating...' : 'Create invite'}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
