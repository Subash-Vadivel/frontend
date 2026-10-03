import { AlertTriangle, Check, Copy, KeyRound } from 'lucide-react';
import { copyToClipboard } from '../../lib/clipboard.js';
import { useState } from 'react';
import { Button } from '../ui/button.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';

export default function CreateApiKeyModal({ endpoint, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [createdKey, setCreatedKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try { setCreatedKey(await onSubmit({ name: name.trim() })); }
    catch (err) { setError(err.response?.data?.detail || 'Unable to create MCP API key'); }
    finally { setSaving(false); }
  };
  const copyKey = async () => {
    if (!createdKey?.apiKey) return;
    if (!(await copyToClipboard(createdKey.apiKey, 'API key copied'))) return;
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogDescription>MCP access</DialogDescription>
          <DialogTitle>{createdKey ? 'API key created' : 'Create API key'}</DialogTitle>
        </DialogHeader>
        {createdKey ? (
          <div className="grid gap-4">
            <div className="flex gap-2 rounded-md border border-amber-500/20 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-300">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>Copy this key into your MCP client. You can copy it again later from the API keys list; treat it like a password.</span>
            </div>
            <div className="grid gap-1.5">
              <Label>{createdKey.name}</Label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <code className="overflow-wrap-anywhere rounded-md border bg-muted/30 px-2.5 py-2 font-mono text-xs text-foreground">{createdKey.apiKey}</code>
                <Button type="button" variant="outline" onClick={copyKey}>{copied ? <><Check /> Copied</> : <><Copy /> Copy</>}</Button>
              </div>
            </div>
            <div className="grid gap-1 rounded-md border bg-muted/20 p-2.5 text-xs text-muted-foreground">
              <span>Point your MCP client at <code className="font-mono text-foreground">{endpoint}</code> and send the key as:</span>
              <code className="font-mono text-foreground">Authorization: Bearer &lt;key&gt;</code>
            </div>
            <DialogFooter><Button type="button" onClick={onClose}>Done</Button></DialogFooter>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-1.5">
              <Label>Key name</Label>
              <Input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Claude Desktop" required />
              <p className="text-xs text-muted-foreground">Name it after the client that will use it, so you can tell keys apart later.</p>
            </div>
            {error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={saving}><KeyRound /> {saving ? 'Creating...' : 'Create key'}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
