import { CheckCircle2, KeyRound, Lock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api/authApi';
import ThemeToggle from '../components/theme/ThemeToggle.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { getErrorMessage } from '../lib/utils.js';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(token ? '' : 'This reset link is missing its token. Request a new one from the login screen.');

  const submit = async (event) => {
    event.preventDefault(); setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setSaving(true);
    try { await resetPassword({ token, password: form.password }); setDone(true); }
    catch (err) { setError(getErrorMessage(err, 'Unable to reset password')); }
    finally { setSaving(false); }
  };

  return <main className="grid min-h-screen place-items-center bg-muted/20 px-4 py-6 text-foreground"><div className="absolute right-4 top-4"><ThemeToggle compact /></div><Card className="w-full max-w-md rounded-lg">{done ? <><CardHeader><div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md border"><CheckCircle2 className="h-4 w-4 text-primary" /></div><CardTitle>Password updated</CardTitle><CardDescription>You can now log in with your new password.</CardDescription></CardHeader><CardContent><Button type="button" onClick={() => navigate('/login', { replace: true })}>Go to login</Button></CardContent></> : <><CardHeader><div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md border"><KeyRound className="h-4 w-4 text-primary" /></div><CardTitle>Set a new password</CardTitle><CardDescription>Choose a password with at least 8 characters.</CardDescription></CardHeader><CardContent><form className="grid gap-4" onSubmit={submit}><div className="grid gap-2"><Label>New password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" type="password" minLength="8" maxLength="128" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required disabled={!token} /></div></div><div className="grid gap-2"><Label>Confirm password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" type="password" minLength="8" maxLength="128" value={form.confirm} onChange={(event) => setForm({ ...form, confirm: event.target.value })} required disabled={!token} /></div></div>{error && <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<Button type="submit" disabled={saving || !token}>{saving ? 'Saving...' : 'Reset password'}</Button><Button type="button" variant="ghost" onClick={() => navigate('/login')}>Back to login</Button></form></CardContent></>}</Card></main>;
}
