import { CheckCircle2, Mail, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { acceptInvitation, inspectInvitation } from '../api/businessApi';
import ThemeToggle from '../components/theme/ThemeToggle.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';

export default function InvitationAcceptPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
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

  return <main className="grid min-h-screen place-items-center bg-muted/20 px-4 py-6 text-foreground"><div className="absolute right-4 top-4"><ThemeToggle compact /></div><Card className="w-full max-w-lg rounded-lg">{loading ? <CardContent className="p-6"><Skeleton className="h-44" /></CardContent> : invitation ? <><CardHeader><div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md border"><Mail className="h-4 w-4 text-primary" /></div><CardTitle>Join {invitation.businessName}</CardTitle><CardDescription>You have been invited as <span className="font-medium text-foreground">{invitation.role}</span>.</CardDescription></CardHeader><CardContent className="grid gap-4"><div className="flex items-center justify-between rounded-md border bg-muted/20 p-3"><div><p className="text-xs text-muted-foreground">Invited email</p><p className="text-sm font-medium">{invitation.email}</p></div><Badge>{invitation.status}</Badge></div>{isAuthenticated ? <><p className="text-xs text-muted-foreground">Signed in as {user?.email}. The email must match this invitation.</p><Button type="button" onClick={accept} disabled={accepting || invitation.status !== 'pending'}><CheckCircle2 /> {accepting ? 'Accepting...' : 'Accept invitation'}</Button></> : <div className="grid gap-2"><Button type="button" onClick={() => navigate('/login', { state: { from: { pathname: `/invitations/${token}` } } })}>Log in to accept</Button><Button type="button" variant="outline" onClick={() => navigate('/signup', { state: { from: { pathname: `/invitations/${token}` } } })}>Create account</Button></div>}{error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}</CardContent></> : <><CardHeader><div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md border"><XCircle className="h-4 w-4 text-destructive" /></div><CardTitle>Invitation unavailable</CardTitle><CardDescription>{error || 'This invitation could not be found.'}</CardDescription></CardHeader><CardContent><Button type="button" variant="outline" onClick={() => navigate('/')}>Back to home</Button></CardContent></>}</Card></main>;
}
