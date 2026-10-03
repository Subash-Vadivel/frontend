import { AlertTriangle, CheckCircle2, LogIn, Mail, UserPlus, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { acceptInvitation, inspectInvitation } from '../api/businessApi';
import ThemeToggle from '../components/theme/ThemeToggle.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Loader } from '../components/ui/loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';

export default function InvitationAcceptPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { selectBusiness, refreshBusinesses } = useBusiness();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true); setError('');
      try { const data = await inspectInvitation(token); if (!ignore) setInvitation(data); }
      catch (err) { if (!ignore) setError(err.response?.data?.detail || 'Invitation could not be loaded'); }
      finally { if (!ignore) setLoading(false); }
    };
    load();
    return () => { ignore = true; };
  }, [token]);

  const emailMismatch = Boolean(isAuthenticated && user && invitation && user.email.toLowerCase() !== invitation.email.toLowerCase());
  const goToAuth = (mode) => navigate(`/${mode}`, { state: { from: { pathname: `/invitations/${token}` }, email: invitation?.email } });
  const switchAccount = (mode) => { logout(); goToAuth(mode); };

  const accept = async () => {
    setAccepting(true); setError('');
    try {
      const response = await acceptInvitation(token);
      await refreshBusinesses();
      selectBusiness(response.business.id);
      navigate('/dashboard', { replace: true });
    } catch (err) { setError(err.response?.data?.detail || 'Unable to accept invitation'); }
    finally { setAccepting(false); }
  };

  return <main className="grid min-h-screen place-items-center bg-muted/20 px-4 py-6 text-foreground"><div className="absolute right-4 top-4"><ThemeToggle compact /></div><Card className="w-full max-w-lg rounded-lg">{loading ? <CardContent className="p-6"><Loader className="min-h-44" /></CardContent> : invitation ? <><CardHeader><div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md border"><Mail className="h-4 w-4 text-primary" /></div><CardTitle>Join {invitation.businessName}</CardTitle><CardDescription>You have been invited as <span className="font-medium text-foreground">{invitation.role}</span>.</CardDescription></CardHeader><CardContent className="grid gap-4"><div className="flex items-center justify-between rounded-md border bg-muted/20 p-3"><div><p className="text-xs text-muted-foreground">Invited email</p><p className="text-sm font-medium">{invitation.email}</p></div><Badge>{invitation.status}</Badge></div>{emailMismatch ? <div className="grid gap-3"><div className="flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-3"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" /><div className="grid gap-1 text-sm"><p className="font-medium">You're signed in with a different account</p><p className="text-muted-foreground">You're signed in as <span className="font-medium text-foreground break-all">{user.email}</span>, but this invitation was sent to <span className="font-medium text-foreground break-all">{invitation.email}</span>. Log out and continue with the invited email to accept it.</p></div></div><Button type="button" onClick={() => switchAccount('login')}><LogIn /> Log out and log in as {invitation.email}</Button><Button type="button" variant="outline" onClick={() => switchAccount('signup')}><UserPlus /> Log out and create an account for {invitation.email}</Button></div> : isAuthenticated ? <><p className="text-xs text-muted-foreground">Signed in as {user?.email}.</p><Button type="button" onClick={accept} disabled={accepting || invitation.status !== 'pending'}><CheckCircle2 /> {accepting ? 'Accepting...' : 'Accept invitation'}</Button></> : <div className="grid gap-2"><p className="text-xs text-muted-foreground">Log in or create an account with <span className="font-medium text-foreground">{invitation.email}</span> to accept.</p><Button type="button" onClick={() => goToAuth('login')}><LogIn /> Log in to accept</Button><Button type="button" variant="outline" onClick={() => goToAuth('signup')}><UserPlus /> Create account</Button></div>}{error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}</CardContent></> : <><CardHeader><div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md border"><XCircle className="h-4 w-4 text-destructive" /></div><CardTitle>Invitation unavailable</CardTitle><CardDescription>{error || 'This invitation could not be found.'}</CardDescription></CardHeader><CardContent><Button type="button" variant="outline" onClick={() => navigate('/')}>Back to home</Button></CardContent></>}</Card></main>;
}
