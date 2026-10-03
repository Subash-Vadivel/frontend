import { ChartNoAxesCombined, LayoutGrid, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReport, deleteReport, listReports, updateReport } from '../api/reportApi';
import PageShell from '../components/layout/PageShell.jsx';
import ConfirmDialog from '../components/modals/ConfirmDialog.jsx';
import ReportFormModal from '../components/reports/ReportFormModal.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card } from '../components/ui/card.jsx';
import { Loader } from '../components/ui/loader.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';
import { getErrorMessage } from '../lib/utils.js';

const formatUpdated = (value) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(`${value}Z`));

export default function ReportsPage() {
  const { canWriteFinance, selectedBusinessId } = useBusiness();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formTarget, setFormTarget] = useState(null); // null | 'new' | report
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setReports(await listReports()); }
    catch (err) { setError(getErrorMessage(err, 'Unable to load reports')); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load, selectedBusinessId]);

  const submitForm = async (payload) => {
    if (formTarget === 'new') {
      const report = await createReport(payload);
      navigate(`/reports/${report.id}`);
      return;
    }
    await updateReport(formTarget.id, payload);
    setFormTarget(null);
    load();
  };
  const remove = async () => {
    setDeleting(true);
    try { await deleteReport(deleteTarget.id); setDeleteTarget(null); load(); }
    finally { setDeleting(false); }
  };

  return (
    <PageShell eyebrow="Workspace" title="Reports" description="Build custom charts from your income, expenses and category fields." actions={canWriteFinance && <Button type="button" onClick={() => setFormTarget('new')}><Plus /> New report</Button>}>
      {error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
      {loading ? <Loader className="min-h-72" /> : reports.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {reports.map((report) => (
            <Card key={report.id} className="group flex cursor-pointer flex-col gap-3 bg-background p-4 transition-colors hover:border-primary/40" onClick={() => navigate(`/reports/${report.id}`)}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border"><ChartNoAxesCombined className="h-4 w-4 text-primary" /></span><h3 className="truncate text-sm font-semibold">{report.name}</h3></div>
                {canWriteFinance && (
                  <div className="flex shrink-0" onClick={(event) => event.stopPropagation()}>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Rename" onClick={() => setFormTarget(report)}><Pencil /></Button>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" title="Delete" onClick={() => setDeleteTarget(report)}><Trash2 /></Button>
                  </div>
                )}
              </div>
              <p className="line-clamp-2 min-h-8 text-xs text-muted-foreground">{report.description || 'No description'}</p>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground"><span className="flex items-center gap-1"><LayoutGrid className="h-3 w-3" />{report.widgetCount} widget{report.widgetCount === 1 ? '' : 's'}</span><span>Updated {formatUpdated(report.updatedAt)}</span></div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid place-items-center gap-3 rounded-lg border border-dashed bg-muted/20 p-12 text-center">
          <ChartNoAxesCombined className="h-6 w-6 text-muted-foreground" />
          <div><p className="text-sm font-medium">No reports yet</p><p className="mt-1 text-xs text-muted-foreground">Create a report and add line, bar, area, pie or donut widgets.</p></div>
          {canWriteFinance && <Button type="button" onClick={() => setFormTarget('new')}><Plus /> New report</Button>}
        </div>
      )}
      {formTarget && <ReportFormModal report={formTarget === 'new' ? null : formTarget} onClose={() => setFormTarget(null)} onSubmit={submitForm} />}
      {deleteTarget && <ConfirmDialog title="Delete report?" message={`"${deleteTarget.name}" and all of its widgets will be deleted. Your ledger data is not affected.`} confirmLabel="Delete report" loading={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={remove} />}
    </PageShell>
  );
}
