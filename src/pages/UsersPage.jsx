import { Copy, MailPlus, Search, ShieldCheck, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createBusinessInvitation, listBusinessInvitations, listBusinessMembers } from '../api/businessApi';
import DataPanel from '../components/layout/DataPanel.jsx';
import MetricCard from '../components/layout/MetricCard.jsx';
import PageShell from '../components/layout/PageShell.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';

const roles = ['admin', 'manager', 'viewer'];
const formatDate = (value) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));

export default function UsersPage() {
  const { selectedBusiness, canManageUsers, role } = useBusiness();
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [email, setEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [createdInvite, setCreatedInvite] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!selectedBusiness) return;
    setLoading(true); setError('');
    try {
      const [nextMembers, nextInvitations] = await Promise.all([
        listBusinessMembers(selectedBusiness.id),
        canManageUsers ? listBusinessInvitations(selectedBusiness.id).catch(() => []) : Promise.resolve([]),
      ]);
      setMembers(nextMembers); setInvitations(nextInvitations);
    } catch (err) { setError(err.response?.data?.detail || 'Unable to load users'); }
    finally { setLoading(false); }
  }, [canManageUsers, selectedBusiness]);

  useEffect(() => { load(); }, [load]);

  const submitInvite = async (event) => {
    event.preventDefault();
    setSaving(true); setError('');
    try {
      const invite = await createBusinessInvitation(selectedBusiness.id, { email, role: inviteRole });
      setCreatedInvite(invite); setEmail(''); setInviteRole('viewer'); await load();
    } catch (err) { setError(err.response?.data?.detail || 'Unable to create invitation'); }
    finally { setSaving(false); }
  };
  const copyInvite = async (url = createdInvite?.inviteUrl) => { if (url) await navigator.clipboard.writeText(url); };
  const filteredMembers = useMemo(() => members.filter((member) => !query.trim() || `${member.name} ${member.email} ${member.role}`.toLowerCase().includes(query.toLowerCase())), [members, query]);
  const pendingInvites = invitations.filter((invite) => invite.status === 'pending').length;

  return <PageShell eyebrow="Access control" title="Users" description="Invite people into the selected business and review active roles.">
    <div className="grid gap-3 md:grid-cols-3"><MetricCard icon={Users} label="Members" value={members.length} detail="Active users" /><MetricCard icon={MailPlus} label="Pending invites" value={pendingInvites} detail="Awaiting acceptance" /><MetricCard icon={ShieldCheck} label="Your role" value={role || '-'} detail={selectedBusiness?.name || 'No business selected'} tone="balance" /></div>
    {!canManageUsers && <DataPanel title="Limited access" description="Only owners and admins can invite or manage users for this business."><p className="text-sm text-muted-foreground">You can view active members, but user administration is not available for your role.</p></DataPanel>}
    {canManageUsers && <div className="grid gap-3 lg:grid-cols-[1fr_420px]"><DataPanel title="Invite user" description="Create an invitation link. Email delivery can be added later."><form className="grid gap-3" onSubmit={submitInvite}><div className="grid gap-1.5"><Label>Email</Label><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="teammate@example.com" required /></div><div className="grid gap-1.5"><Label>Role</Label><Select value={inviteRole} onValueChange={setInviteRole}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{roles.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>{error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}<Button type="submit" disabled={saving}><MailPlus /> {saving ? 'Creating...' : 'Create invite'}</Button></form></DataPanel>{createdInvite && <DataPanel title="Invitation link" description="Share this link with the invited user." action={<Button type="button" variant="outline" onClick={() => copyInvite()}><Copy /> Copy</Button>}><code className="block overflow-wrap-anywhere rounded-md border bg-muted/30 px-2.5 py-2 font-mono text-xs text-foreground">{createdInvite.inviteUrl}</code></DataPanel>}</div>}
    <DataPanel title="Members" description="Active users in this business." action={<div className="relative w-full sm:w-72"><Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><Input className="pl-8" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users..." /></div>}>
      {loading ? <Skeleton className="h-64" /> : <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Joined</TableHead></TableRow></TableHeader><TableBody>{filteredMembers.map((member) => <TableRow key={member.id}><TableCell className="font-medium text-foreground">{member.name}</TableCell><TableCell>{member.email}</TableCell><TableCell><Badge>{member.role}</Badge></TableCell><TableCell className="font-mono text-xs">{formatDate(member.createdAt)}</TableCell></TableRow>)}</TableBody></Table>}
    </DataPanel>
    {canManageUsers && <DataPanel title="Invitations" description="Pending and accepted invitation records.">{loading ? <Skeleton className="h-40" /> : invitations.length ? <Table><TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Expires</TableHead><TableHead className="text-right">Link</TableHead></TableRow></TableHeader><TableBody>{invitations.map((invite) => <TableRow key={invite.id}><TableCell>{invite.email}</TableCell><TableCell><Badge>{invite.role}</Badge></TableCell><TableCell><Badge variant={invite.status === 'pending' ? 'balance' : 'income'}>{invite.status}</Badge></TableCell><TableCell className="font-mono text-xs">{formatDate(invite.expiresAt)}</TableCell><TableCell className="text-right">{invite.inviteUrl ? <Button type="button" variant="ghost" size="icon" onClick={() => copyInvite(invite.inviteUrl)} title="Copy invite"><Copy /></Button> : '-'}</TableCell></TableRow>)}</TableBody></Table> : <div className="rounded-lg border border-dashed bg-muted/20 p-8 text-center text-xs text-muted-foreground">No invitation records yet.</div>}</DataPanel>}
  </PageShell>;
}
