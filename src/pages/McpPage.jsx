import { Copy, KeyRound, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createMcpApiKey, deleteMcpApiKey, listMcpApiKeys, updateMcpApiKey } from '../api/mcpApi';

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

  const removeKey = async (apiKey) => {
    if (!window.confirm(`Delete API key "${apiKey.name}"?`)) return;
    await deleteMcpApiKey(apiKey.id);
    await loadKeys();
  };

  const copyCreatedKey = async () => {
    if (!createdKey?.apiKey) return;
    await navigator.clipboard.writeText(createdKey.apiKey);
  };

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h1>MCP</h1>
          <p className="muted no-margin">Manage API keys for Model Context Protocol access.</p>
        </div>
      </header>

      <div className="panel mcp-endpoint-panel">
        <h2>Streamable HTTP endpoint</h2>
        <code>{mcpEndpoint}</code>
      </div>

      <form className="panel form-grid compact-form" onSubmit={createKey}>
        <div className="form-header span-2">
          <h2>Create MCP API key</h2>
        </div>
        <label>
          Key name
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Claude Desktop" required />
        </label>
        <button className="primary-button form-action" type="submit" disabled={saving}>
          <Plus size={17} /> {saving ? 'Creating...' : 'Create key'}
        </button>
        {error && <p className="error-message span-2">{error}</p>}
      </form>

      {createdKey && (
        <div className="panel mcp-created-key">
          <div className="section-title-row">
            <div>
              <h2>Copy your new key</h2>
              <p className="muted no-margin">This full key is shown only once.</p>
            </div>
            <button className="ghost-button" type="button" onClick={copyCreatedKey}>
              <Copy size={16} /> Copy
            </button>
          </div>
          <code>{createdKey.apiKey}</code>
        </div>
      )}

      <div className="panel">
        <h2>API keys</h2>
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
                        <button className="icon-button danger" type="button" onClick={() => removeKey(apiKey)} title="Delete key">
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
      </div>
    </section>
  );
}
