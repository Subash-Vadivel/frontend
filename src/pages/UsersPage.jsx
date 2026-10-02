import { Copy, MailPlus, Plus, Search, ShieldCheck, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createBusinessInvitation, listBusinessInvitations, listBusinessMembers } from '../api/businessApi';
import DataPanel from '../components/layout/DataPanel.jsx';
import MetricCard from '../components/layout/MetricCard.jsx';
import PageShell from '../components/layout/PageShell.jsx';
import InviteUserModal from '../components/modals/InviteUserModal.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Loader } from '../components/ui/loader.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';

const formatDate = (value) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));
const matches = (query, ...values) => !query.trim() || values.join(' ').toLowerCase().includes(query.trim().toLowerCase());
const EmptyState = ({ children }) => <div className="rounded-lg border border-dashed bg-muted/20 p-8 text-center text-xs text-muted-foreground">{children}</div>;
const TabCount = ({ value }) => <span className="ml-1.5 rounded-full bg-muted px-1.5 text-[10px] tabular-nums text-muted-foreground">{value}</span>;

export default function UsersPage() {
  const { selectedBusiness, canManageUsers, role } = useBusiness();
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [tab, setTab] = useState('members');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
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

  const createInvite = async (payload) => {
    const invite = await createBusinessInvitation(selectedBusiness.id, payload);
    setTab('invitations');
    load();
    return invite;
  };
  const copyInvite = async (url) => { if (url) await navigator.clipboard.writeText(url); };
  const filteredMembers = useMemo(() => members.filter((member) => matches(query, member.name, member.email, member.role)), [members, query]);
  const filteredInvitations = useMemo(() => invitations.filter((invite) => matches(query, invite.email, invite.role, invite.status)), [invitations, query]);
  const pendingInvites = invitations.filter((invite) => invite.status === 'pending').length;

  const search = <div className="relative w-full sm:w-72"><Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><Input className="pl-8" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tab === 'members' ? 'Search members...' : 'Search invitations...'} /></div>;

  const membersTable = filteredMembers.length ? <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Joined</TableHead></TableRow></TableHeader><TableBody>{filteredMembers.map((member) => <TableRow key={member.id}><TableCell className="font-medium text-foreground">{member.name}</TableCell><TableCell>{member.email}</TableCell><TableCell><Badge>{member.role}</Badge></TableCell><TableCell className="font-mono text-xs">{formatDate(member.createdAt)}</TableCell></TableRow>)}</TableBody></Table> : <EmptyState>No members match this search.</EmptyState>;

  const invitationsTable = filteredInvitations.length ? <Table><TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Expires</TableHead><TableHead className="text-right">Link</TableHead></TableRow></TableHeader><TableBody>{filteredInvitations.map((invite) => <TableRow key={invite.id}><TableCell>{invite.email}</TableCell><TableCell><Badge>{invite.role}</Badge></TableCell><TableCell><Badge variant={invite.status === 'pending' ? 'balance' : 'income'}>{invite.status}</Badge></TableCell><TableCell className="font-mono text-xs">{formatDate(invite.expiresAt)}</TableCell><TableCell className="text-right">{invite.inviteUrl ? <Button type="button" variant="ghost" size="icon" onClick={() => copyInvite(invite.inviteUrl)} title="Copy invite link"><Copy /></Button> : '-'}</TableCell></TableRow>)}</TableBody></Table> : <EmptyState>{invitations.length ? 'No invitations match this search.' : 'No invitations yet. Use "Add new user" to invite someone.'}</EmptyState>;

  return <PageShell eyebrow="Access control" title="Users" description="Invite people into the selected business and review active roles." actions={canManageUsers && <Button type="button" onClick={() => setInviteOpen(true)}><Plus /> Add new user</Button>}>
    <div className="grid gap-3 md:grid-cols-3"><MetricCard icon={Users} label="Members" value={members.length} detail="Active users" /><MetricCard icon={MailPlus} label="Pending invites" value={pendingInvites} detail="Awaiting acceptance" /><MetricCard icon={ShieldCheck} label="Your role" value={role || '-'} detail={selectedBusiness?.name || 'No business selected'} tone="balance" /></div>
    {!canManageUsers && <DataPanel title="Limited access" description="Only owners and admins can invite or manage users for this business."><p className="text-sm text-muted-foreground">You can view active members, but user administration is not available for your role.</p></DataPanel>}
    {error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
    <Tabs value={tab} onValueChange={setTab}>
      <Card className="overflow-hidden bg-background">
        <div className="flex flex-col gap-3 border-b bg-muted/15 p-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-9 w-fit"><TabsTrigger value="members" className="text-xs">Members<TabCount value={members.length} /></TabsTrigger>{canManageUsers && <TabsTrigger value="invitations" className="text-xs">Invitations<TabCount value={invitations.length} /></TabsTrigger>}</TabsList>
          {search}
        </div>
        <TabsContent value="members" className="mt-0 p-4">{loading ? <Loader className="min-h-64" /> : membersTable}</TabsContent>
        {canManageUsers && <TabsContent value="invitations" className="mt-0 p-4">{loading ? <Loader className="min-h-64" /> : invitationsTable}</TabsContent>}
      </Card>
    </Tabs>
    {inviteOpen && <InviteUserModal businessName={selectedBusiness?.name} onClose={() => setInviteOpen(false)} onSubmit={createInvite} />}
  </PageShell>;
}
