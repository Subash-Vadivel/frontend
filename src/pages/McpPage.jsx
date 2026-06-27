import { Copy, KeyRound, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createMcpApiKey, deleteMcpApiKey, listMcpApiKeys, updateMcpApiKey } from '../api/mcpApi';
import DataPanel from '../components/layout/DataPanel.jsx';
import PageShell from '../components/layout/PageShell.jsx';
import ConfirmDialog from '../components/modals/ConfirmDialog.jsx';

const formatDateTime = (value) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export default function McpPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [name, setName] = useState('');
  const [createdKey, setCreatedKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const mcpEndpoint = useMemo(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    return apiBase.replace(/\/api\/?$/, '/mcp');
  }, []);

  const loadKeys = async () => {
    setLoading(true);
    setError('');
    try {
      setApiKeys(await listMcpApiKeys());
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to load MCP API keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const createKey = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const apiKey = await createMcpApiKey({ name });
      setCreatedKey(apiKey);
      setName('');
      await loadKeys();
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to create MCP API key');
    } finally {
      setSaving(false);
    }
  };

  const toggleKey = async (apiKey) => {
    await updateMcpApiKey(apiKey.id, { enabled: !apiKey.enabled });
    await loadKeys();
  };

  const removeKey = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMcpApiKey(deleteTarget.id);
      await loadKeys();
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const copyMcpEndpoint = async () => {
    await navigator.clipboard.writeText(mcpEndpoint);
  };

  const copyCreatedKey = async () => {
    if (!createdKey?.apiKey) return;
    await navigator.clipboard.writeText(createdKey.apiKey);
  };

  return (
    <PageShell
      eyebrow="Developer access"
      title="MCP"
      description="Manage Model Context Protocol endpoint details and API key access for connected clients."
    >
      <div className="settings-grid">
        <DataPanel
          className="mcp-endpoint-panel"
          eyebrow="Endpoint"
          title="Streamable HTTP"
          description="Use this endpoint when configuring an MCP-compatible client."
        >
          <div className="endpoint-copy-row">
            <code>{mcpEndpoint}</code>
            <button className="icon-button" type="button" onClick={copyMcpEndpoint} title="Copy endpoint">
              <Copy size={16} />
            </button>
          </div>
        </DataPanel>

        <DataPanel
          title="Create API key"
          description="Generate a named key for a trusted client. The full key is shown once."
        >
          <form className="form-grid compact-form" onSubmit={createKey}>
            <label>
              Key name
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Claude Desktop" required />
            </label>
            <button className="primary-button form-action" type="submit" disabled={saving}>
              <Plus size={17} /> {saving ? 'Creating...' : 'Create key'}
            </button>
            {error && <p className="error-message span-2">{error}</p>}
          </form>
        </DataPanel>
      </div>

      {createdKey && (
        <DataPanel
          className="mcp-created-key"
          title="Copy your new key"
          description="This full key is shown only once."
          action={(
            <button className="ghost-button" type="button" onClick={copyCreatedKey}>
              <Copy size={16} /> Copy
            </button>
          )}
        >
          <code>{createdKey.apiKey}</code>
        </DataPanel>
      )}

      <DataPanel title="API keys" description={`${apiKeys.length} ${apiKeys.length === 1 ? 'key' : 'keys'} configured for MCP access.`}>
        {loading ? <div className="page-loader">Loading...</div> : (
          apiKeys.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Prefix</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Last used</th>
                    <th className="actions-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((apiKey) => (
                    <tr key={apiKey.id}>
                      <td><strong>{apiKey.name}</strong></td>
                      <td><code>{apiKey.keyPrefix}...</code></td>
                      <td>
                        <span className={`type-badge ${apiKey.enabled ? 'income' : 'expense'}`}>
                          {apiKey.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td>{formatDateTime(apiKey.createdAt)}</td>
                      <td>{formatDateTime(apiKey.lastUsedAt)}</td>
                      <td className="actions-cell">
                        <button className="icon-button" type="button" onClick={() => toggleKey(apiKey)} title={apiKey.enabled ? 'Disable key' : 'Enable key'}>
                          <KeyRound size={16} />
                        </button>
                        <button className="icon-button danger" type="button" onClick={() => setDeleteTarget(apiKey)} title="Delete key">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="empty-state">No MCP API keys yet.</div>
        )}
      </DataPanel>
      {deleteTarget && (
        <ConfirmDialog
          confirmLabel="Delete key"
          loading={deleting}
          message={`API key "${deleteTarget.name}" will be permanently deleted. Connected clients using this key will lose access.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={removeKey}
          title="Delete API key?"
        />
      )}
    </PageShell>
  );
}
