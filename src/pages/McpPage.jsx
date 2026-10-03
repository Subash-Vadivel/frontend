import { CheckCircle2, Copy, KeyRound, Plus, Search, Trash2, Wrench } from 'lucide-react';
import { copyToClipboard } from '../lib/clipboard.js';
import { useEffect, useMemo, useState } from 'react';
import { createMcpApiKey, deleteMcpApiKey, listMcpApiKeys, revealMcpApiKey, updateMcpApiKey } from '../api/mcpApi';
import { useBusiness } from '../context/BusinessContext.jsx';
import DataPanel from '../components/layout/DataPanel.jsx';
import McpToolsCatalog, { MCP_TOOL_COUNT } from '../components/mcp/McpToolsCatalog.jsx';
import MetricCard from '../components/layout/MetricCard.jsx';
import PageShell from '../components/layout/PageShell.jsx';
import ConfirmDialog from '../components/modals/ConfirmDialog.jsx';
import CreateApiKeyModal from '../components/modals/CreateApiKeyModal.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Loader } from '../components/ui/loader.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';

const TabCount = ({ value }) => <span className="ml-1.5 rounded-full bg-muted px-1.5 text-[10px] tabular-nums text-muted-foreground">{value}</span>;
const formatDateTime = (value) => { if (!value) return '-'; return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); };
export default function McpPage() {
  const { canManageMcp } = useBusiness();
  const [apiKeys, setApiKeys] = useState([]); const [createOpen, setCreateOpen] = useState(false); const [loading, setLoading] = useState(true); const [deleteTarget, setDeleteTarget] = useState(null); const [deleting, setDeleting] = useState(false); const [error, setError] = useState(''); const [query, setQuery] = useState(''); const [tab, setTab] = useState('keys');
  const mcpEndpoint = useMemo(() => { const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'; return apiBase.replace(/\/api\/?$/, '/mcp'); }, []);
  const loadKeys = async () => { setLoading(true); setError(''); try { setApiKeys(await listMcpApiKeys()); } catch (err) { setError(err.response?.data?.detail || 'Unable to load MCP API keys'); } finally { setLoading(false); } };
  useEffect(() => { loadKeys(); }, []);
  const createKey = async (payload) => { const apiKey = await createMcpApiKey(payload); loadKeys(); return apiKey; };
  const toggleKey = async (apiKey) => { await updateMcpApiKey(apiKey.id, { enabled: !apiKey.enabled }); await loadKeys(); };
  const removeKey = async () => { if (!deleteTarget) return; setDeleting(true); try { await deleteMcpApiKey(deleteTarget.id); await loadKeys(); setDeleteTarget(null); } finally { setDeleting(false); } };
  const copyMcpEndpoint = () => copyToClipboard(mcpEndpoint, 'Endpoint copied');
  const copyApiKey = (apiKey) => copyToClipboard(revealMcpApiKey(apiKey.id), `API key "${apiKey.name}" copied`);
  const filtered = apiKeys.filter((apiKey) => !query.trim() || `${apiKey.name} ${apiKey.keyPrefix} ${apiKey.enabled ? 'enabled' : 'disabled'}`.toLowerCase().includes(query.toLowerCase())); const enabledCount = apiKeys.filter((key) => key.enabled).length;
  return <PageShell eyebrow="Developer settings" title="MCP access" description="Manage the streamable HTTP endpoint and API keys for connected clients." actions={canManageMcp && <Button type="button" onClick={() => setCreateOpen(true)}><Plus /> Create API key</Button>}>
    <div className="grid gap-3 md:grid-cols-3"><MetricCard icon={KeyRound} label="API keys" value={apiKeys.length} detail="Total credentials" /><MetricCard icon={CheckCircle2} label="Enabled" value={enabledCount} detail="Active client access" tone="income" /><MetricCard icon={Wrench} label="Tools" value={MCP_TOOL_COUNT} detail="Available to connected clients" tone="balance" /></div>
    <DataPanel eyebrow="Endpoint" title="Streamable HTTP" description="Use this endpoint when configuring an MCP-compatible client."><div className="grid grid-cols-[1fr_32px] gap-2"><code className="overflow-wrap-anywhere rounded-md border bg-muted/30 px-2.5 py-2 font-mono text-xs text-foreground">{mcpEndpoint}</code><Button type="button" variant="outline" size="icon" onClick={copyMcpEndpoint} title="Copy endpoint"><Copy /></Button></div></DataPanel>
    {error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
    <Tabs value={tab} onValueChange={setTab}>
      <Card className="overflow-hidden bg-background">
        <div className="flex flex-col gap-3 border-b bg-muted/15 p-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-9 w-fit"><TabsTrigger value="keys" className="text-xs">API keys<TabCount value={apiKeys.length} /></TabsTrigger><TabsTrigger value="tools" className="text-xs">Tools<TabCount value={MCP_TOOL_COUNT} /></TabsTrigger></TabsList>
          {tab === 'keys' && <div className="relative w-full sm:w-64"><Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><Input className="pl-8" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search keys..." /></div>}
        </div>
        <TabsContent value="keys" className="mt-0 p-4">
          {loading ? <Loader className="min-h-72" /> : filtered.length ? <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Prefix</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead>Last used</TableHead><TableHead className="w-24 text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{filtered.map((apiKey) => <TableRow key={apiKey.id}><TableCell className="font-medium text-foreground">{apiKey.name}</TableCell><TableCell><div className="flex items-center gap-1"><code className="rounded-md border bg-muted/30 px-1.5 py-1 font-mono text-[11px]">{apiKey.keyPrefix}...</code>{canManageMcp && <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyApiKey(apiKey)} disabled={!apiKey.canReveal} title={apiKey.canReveal ? 'Copy API key' : "Created before keys were stored, so it can't be copied. Create a new key."}><Copy /></Button>}</div></TableCell><TableCell><Badge variant={apiKey.enabled ? 'income' : 'expense'}>{apiKey.enabled ? 'Enabled' : 'Disabled'}</Badge></TableCell><TableCell className="font-mono text-xs">{formatDateTime(apiKey.createdAt)}</TableCell><TableCell className="font-mono text-xs">{formatDateTime(apiKey.lastUsedAt)}</TableCell><TableCell><div className="flex justify-end gap-1">{canManageMcp && <Button type="button" variant="ghost" size="icon" onClick={() => toggleKey(apiKey)} title={apiKey.enabled ? 'Disable key' : 'Enable key'}><KeyRound /></Button>}{canManageMcp && <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(apiKey)} title="Delete key"><Trash2 /></Button>}</div></TableCell></TableRow>)}</TableBody></Table> : <div className="rounded-lg border border-dashed bg-muted/20 p-10 text-center text-xs text-muted-foreground">No MCP API keys match this view.</div>}
        </TabsContent>
        <TabsContent value="tools" className="mt-0 p-4"><McpToolsCatalog /></TabsContent>
      </Card>
    </Tabs>
    {canManageMcp && deleteTarget && <ConfirmDialog confirmLabel="Delete key" loading={deleting} message={`API key "${deleteTarget.name}" will be permanently deleted. Connected clients using this key will lose access.`} onCancel={() => setDeleteTarget(null)} onConfirm={removeKey} title="Delete API key?" />}{createOpen && <CreateApiKeyModal endpoint={mcpEndpoint} onClose={() => setCreateOpen(false)} onSubmit={createKey} />}</PageShell>;
}
