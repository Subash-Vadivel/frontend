import { Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { signup } from '../../api/authApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../ui/button.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { APP_NAME, BrandIcon } from '../../lib/brand.js';

function AuthField({ icon: Icon, label, children }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {children}
      </div>
    </div>
  );
}

export default function AuthModal({ mode, onClose, onModeChange, onSuccess }) {
  const { login } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const isSignup = mode === 'signup';
  const switchMode = (nextMode) => { setError(''); setNotice(''); onModeChange(nextMode); };
  const submitLogin = async (event) => { event.preventDefault(); setLoading(true); setError(''); try { await login(loginForm); onSuccess(); } catch (err) { setError(err.response?.data?.detail || 'Unable to login'); } finally { setLoading(false); } };
  const submitSignup = async (event) => { event.preventDefault(); setLoading(true); setError(''); try { await signup(signupForm); setLoginForm({ email: signupForm.email, password: '' }); setSignupForm({ name: '', email: '', password: '' }); setNotice('Account created. You can log in now.'); onModeChange('login'); } catch (err) { setError(err.response?.data?.detail || 'Unable to create account'); } finally { setLoading(false); } };
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><span className="flex h-8 w-8 items-center justify-center rounded-lg border"><BrandIcon className="h-4 w-4 text-primary" /></span> {APP_NAME}</div>
          <DialogDescription>{isSignup ? 'Create workspace' : 'Welcome back'}</DialogDescription>
          <DialogTitle>{isSignup ? 'Sign up' : 'Login'}</DialogTitle>
        </DialogHeader>
        {notice && <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">{notice}</p>}
        {isSignup ? (
          <form className="grid gap-4" onSubmit={submitSignup}>
            <AuthField icon={User} label="Name"><Input className="pl-9" value={signupForm.name} onChange={(event) => setSignupForm({ ...signupForm, name: event.target.value })} placeholder="Your name" required /></AuthField>
            <AuthField icon={Mail} label="Email"><Input className="pl-9" type="email" value={signupForm.email} onChange={(event) => setSignupForm({ ...signupForm, email: event.target.value })} placeholder="you@example.com" required /></AuthField>
            <AuthField icon={Lock} label="Password"><Input className="pl-9" type="password" minLength="8" value={signupForm.password} onChange={(event) => setSignupForm({ ...signupForm, password: event.target.value })} placeholder="Create an 8+ character password" required /></AuthField>
            {error && <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</Button>
            <p className="text-center text-sm text-muted-foreground">Already registered? <button className="font-medium text-foreground underline-offset-4 hover:underline" type="button" onClick={() => switchMode('login')}>Login</button></p>
          </form>
        ) : (
          <form className="grid gap-4" onSubmit={submitLogin}>
            <AuthField icon={Mail} label="Email"><Input className="pl-9" type="email" value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} placeholder="you@example.com" required /></AuthField>
            <AuthField icon={Lock} label="Password"><Input className="pl-9" type="password" value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} placeholder="Enter your password" required /></AuthField>
            {error && <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
            <p className="text-center text-sm text-muted-foreground">Need an account? <button className="font-medium text-foreground underline-offset-4 hover:underline" type="button" onClick={() => switchMode('signup')}>Sign up</button></p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
