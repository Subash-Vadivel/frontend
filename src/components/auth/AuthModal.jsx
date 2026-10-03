import { ArrowLeft, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { forgotPassword, signup } from '../../api/authApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getErrorMessage } from '../../lib/utils.js';
import { Button } from '../ui/button.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { APP_NAME, BrandIcon } from '../../lib/brand.js';
import ResendVerification from './ResendVerification.jsx';

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

const inviteTokenFrom = (location) => location.state?.from?.pathname?.match(/^\/invitations\/([^/]+)$/)?.[1] || null;

export default function AuthModal({ mode, onClose, onModeChange, onSuccess }) {
  const { login } = useAuth();
  const location = useLocation();
  // The invite page passes the invited email so the user doesn't have to retype it.
  const [loginForm, setLoginForm] = useState({ email: location.state?.email || '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: location.state?.email || '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  // null | { kind: 'verify', email, remaining, fromLogin } | { kind: 'forgot' }
  const [screen, setScreen] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const isSignup = mode === 'signup';
  const reset = () => { setError(''); setNotice(''); setScreen(null); };
  const switchMode = (nextMode) => { reset(); onModeChange(nextMode); };
  const backToLogin = () => { reset(); onModeChange('login'); };

  const submitLogin = async (event) => {
    event.preventDefault(); setLoading(true); setError(''); setNotice('');
    try { await login(loginForm); onSuccess(); }
    catch (err) {
      const detail = err.response?.data?.detail;
      if (err.response?.status === 403 && detail?.code === 'email_not_verified') {
        setScreen({ kind: 'verify', email: detail.email || loginForm.email, remaining: detail.remainingAttempts, fromLogin: true });
      } else setError(getErrorMessage(err, 'Unable to login'));
    } finally { setLoading(false); }
  };

  const submitSignup = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const response = await signup({ ...signupForm, invite_token: inviteTokenFrom(location) });
      if (response.emailVerificationRequired) {
        setLoginForm({ email: signupForm.email, password: '' });
        setScreen({ kind: 'verify', email: response.email, fromLogin: false });
        onModeChange('login');
      } else {
        await login({ email: signupForm.email, password: signupForm.password });
        onSuccess();
      }
      setSignupForm({ name: '', email: '', password: '' });
    } catch (err) { setError(getErrorMessage(err, 'Unable to create account')); }
    finally { setLoading(false); }
  };

  const submitForgot = async (event) => {
    event.preventDefault(); setLoading(true); setError(''); setNotice('');
    try { const response = await forgotPassword(forgotEmail); setNotice(response.message); }
    catch (err) { setError(getErrorMessage(err, 'Unable to send reset link')); }
    finally { setLoading(false); }
  };

  const errorBox = error && <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>;
  const backLink = <button className="flex items-center justify-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" type="button" onClick={backToLogin}><ArrowLeft className="h-3.5 w-3.5" /> Back to login</button>;

  let description = isSignup ? 'Create workspace' : 'Welcome back';
  let title = isSignup ? 'Sign up' : 'Login';
  let body;
  if (screen?.kind === 'verify') {
    description = screen.fromLogin ? 'Email not verified' : 'Account created';
    title = screen.fromLogin ? 'Please verify your email first' : 'Check your inbox';
    body = <div className="grid gap-4"><ResendVerification key={screen.email} email={screen.email} initialRemaining={screen.remaining} />{backLink}</div>;
  } else if (screen?.kind === 'forgot') {
    description = 'Account recovery';
    title = 'Forgot password';
    body = (
      <form className="grid gap-4" onSubmit={submitForgot}>
        <p className="text-sm text-muted-foreground">Enter your account email and we'll send you a link to reset your password.</p>
        <AuthField icon={Mail} label="Email"><Input className="pl-9" type="email" value={forgotEmail} onChange={(event) => setForgotEmail(event.target.value)} placeholder="you@example.com" required /></AuthField>
        {errorBox}
        <Button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</Button>
        {backLink}
      </form>
    );
  } else if (isSignup) {
    body = (
      <form className="grid gap-4" onSubmit={submitSignup}>
        <AuthField icon={User} label="Name"><Input className="pl-9" value={signupForm.name} onChange={(event) => setSignupForm({ ...signupForm, name: event.target.value })} placeholder="Your name" required /></AuthField>
        <AuthField icon={Mail} label="Email"><Input className="pl-9" type="email" value={signupForm.email} onChange={(event) => setSignupForm({ ...signupForm, email: event.target.value })} placeholder="you@example.com" required /></AuthField>
        <AuthField icon={Lock} label="Password"><Input className="pl-9" type="password" minLength="8" value={signupForm.password} onChange={(event) => setSignupForm({ ...signupForm, password: event.target.value })} placeholder="Create an 8+ character password" required /></AuthField>
        {errorBox}
        <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</Button>
        <p className="text-center text-sm text-muted-foreground">Already registered? <button className="font-medium text-foreground underline-offset-4 hover:underline" type="button" onClick={() => switchMode('login')}>Login</button></p>
      </form>
    );
  } else {
    body = (
      <form className="grid gap-4" onSubmit={submitLogin}>
        <AuthField icon={Mail} label="Email"><Input className="pl-9" type="email" value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} placeholder="you@example.com" required /></AuthField>
        <AuthField icon={Lock} label="Password"><Input className="pl-9" type="password" value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} placeholder="Enter your password" required /></AuthField>
        <button className="-mt-2 justify-self-end text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" type="button" onClick={() => { reset(); setForgotEmail(loginForm.email); setScreen({ kind: 'forgot' }); }}>Forgot password?</button>
        {errorBox}
        <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
        <p className="text-center text-sm text-muted-foreground">Need an account? <button className="font-medium text-foreground underline-offset-4 hover:underline" type="button" onClick={() => switchMode('signup')}>Sign up</button></p>
      </form>
    );
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><span className="flex h-8 w-8 items-center justify-center rounded-lg border"><BrandIcon className="h-4 w-4 text-primary" /></span> {APP_NAME}</div>
          <DialogDescription>{description}</DialogDescription>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {notice && <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">{notice}</p>}
        {body}
      </DialogContent>
    </Dialog>
  );
}
