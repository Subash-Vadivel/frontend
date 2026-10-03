import { ArrowLeft, ChartNoAxesCombined, Pencil, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { listAllCategories } from '../api/categoryApi';
import { createWidget, deleteWidget, getReport, saveReportLayout, updateReport, updateWidget } from '../api/reportApi';
import DateRangeFilter from '../components/filters/DateRangeFilter.jsx';
import PageShell from '../components/layout/PageShell.jsx';
import ConfirmDialog from '../components/modals/ConfirmDialog.jsx';
import DateRangeModal from '../components/modals/DateRangeModal.jsx';
import ReportFormModal from '../components/reports/ReportFormModal.jsx';
import WidgetBuilderModal from '../components/reports/WidgetBuilderModal.jsx';
import ReportGrid from '../components/reports/ReportGrid.jsx';
import WidgetCard from '../components/reports/WidgetCard.jsx';
import { Button } from '../components/ui/button.jsx';
import { Loader } from '../components/ui/loader.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';
import { getErrorMessage } from '../lib/utils.js';
import { rangeForMode } from '../utils/dateRanges';

const rangeStorageKey = (reportId) => `ledgerline_report_range_${reportId}`;


// The report-level filter is a per-viewer preference, remembered per report in this browser.
const loadSavedRange = (reportId) => {
  try {
    const saved = JSON.parse(localStorage.getItem(rangeStorageKey(reportId)));
    if (saved?.mode === 'custom' && saved.range?.startDate) return saved;
    if (saved?.mode) return { mode: saved.mode, range: rangeForMode(saved.mode) };
  } catch { /* ignore unreadable storage */ }
  return { mode: 'all', range: {} };
};

export default function ReportDetailPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { canWriteFinance, wsPath } = useBusiness();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [{ mode: rangeMode, range: reportRange }, setRangeState] = useState(() => loadSavedRange(reportId));
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [builderTarget, setBuilderTarget] = useState(null); // null | 'new' | widget
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setReport(await getReport(reportId)); }
    catch (err) { setError(getErrorMessage(err, 'Unable to load report')); setReport(null); }
    finally { setLoading(false); }
  }, [reportId]);
  useEffect(() => { load(); }, [load]);

  const setRange = (mode, range) => {
    setRangeState({ mode, range });
    try { localStorage.setItem(rangeStorageKey(reportId), JSON.stringify({ mode, range })); } catch { /* storage unavailable */ }
  };
  const changeRange = (value) => { if (value === 'custom') { setCustomModalOpen(true); return; } setRange(value, rangeForMode(value)); };

  const openBuilder = async (target) => {
    setBuilderTarget(target);
    if (categories.length || categoriesLoading) return;
    setCategoriesLoading(true);
    try {
      const [income, expense] = await Promise.all([listAllCategories('income'), listAllCategories('expense')]);
      setCategories([...income, ...expense]);
    } finally { setCategoriesLoading(false); }
  };

  const widgets = useMemo(() => report?.widgets || [], [report]);
  const saveWidget = async (payload) => {
    if (builderTarget === 'new') {
      const created = await createWidget(reportId, payload);
      setReport((current) => ({ ...current, widgets: [...current.widgets, created] }));
    } else {
      const updated = await updateWidget(reportId, builderTarget.id, payload);
      setReport((current) => ({ ...current, widgets: current.widgets.map((w) => (w.id === updated.id ? updated : w)) }));
    }
    setBuilderTarget(null);
  };
  // changed: [{ id, x, y, w, h }] from ReportGrid; applied right away, reverted if the save fails.
  const saveLayout = async (changed) => {
    const previous = report;
    const next = Object.fromEntries(changed.map(({ id, ...rest }) => [id, rest]));
    setReport((r) => ({ ...r, widgets: r.widgets.map((w) => (next[w.id] ? { ...w, layout: next[w.id] } : w)) }));
    try { await saveReportLayout(reportId, changed); }
    catch (err) { setReport(previous); toast.error(getErrorMessage(err, 'Could not save the layout')); }
  };
  const clone = async (widget) => {
    try {
      const created = await createWidget(reportId, { title: `${widget.title} (copy)`.slice(0, 120), chartType: widget.chartType, config: widget.config });
      setReport((current) => ({ ...current, widgets: [...current.widgets, created] }));
      toast.success('Widget cloned');
    } catch (err) { toast.error(getErrorMessage(err, 'Unable to clone widget')); }
  };
  const removeWidget = async () => {
    setDeleting(true);
    try {
      await deleteWidget(reportId, deleteTarget.id);
      setReport((current) => ({ ...current, widgets: current.widgets.filter((w) => w.id !== deleteTarget.id) }));
      setDeleteTarget(null);
    } finally { setDeleting(false); }
  };
  const rename = async (payload) => {
    const updated = await updateReport(reportId, payload);
    setReport((current) => ({ ...current, ...updated }));
    setRenameOpen(false);
  };

  if (loading) return <Loader label="Loading report" className="min-h-[60vh]" />;
  if (!report) {
    return (
      <div className="grid place-items-center gap-3 rounded-lg border border-dashed bg-muted/20 p-12 text-center">
        <p className="text-sm font-medium">{error || 'Report not found'}</p>
        <Button type="button" variant="outline" onClick={() => navigate(wsPath('/reports'))}><ArrowLeft /> Back to reports</Button>
      </div>
    );
  }

  return (
    <PageShell
      eyebrow={<button type="button" className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => navigate(wsPath('/reports'))}><ArrowLeft className="h-3 w-3" /> Reports</button>}
      title={<span className="inline-flex items-center gap-2">{report.name}{canWriteFinance && <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Rename report" onClick={() => setRenameOpen(true)}><Pencil /></Button>}</span>}
      description={report.description}
      actions={<><DateRangeFilter label="Report date range" rangeMode={rangeMode} dateRange={reportRange} onChange={changeRange} />{canWriteFinance && <Button type="button" onClick={() => openBuilder('new')}><Plus /> New widget</Button>}</>}
    >
      {widgets.length ? (
        <ReportGrid
          widgets={widgets}
          canEdit={canWriteFinance}
          onLayoutSave={saveLayout}
          renderWidget={(widget, canDrag) => (
            <WidgetCard
              widget={widget}
              reportRange={reportRange}
              canEdit={canWriteFinance}
              canDrag={canDrag}
              onEdit={() => openBuilder(widget)}
              onClone={() => clone(widget)}
              onDelete={() => setDeleteTarget(widget)}
            />
          )}
        />
      ) : (
        <div className="grid place-items-center gap-3 rounded-lg border border-dashed bg-muted/20 p-12 text-center">
          <ChartNoAxesCombined className="h-6 w-6 text-muted-foreground" />
          <div><p className="text-sm font-medium">No widgets yet</p><p className="mt-1 text-xs text-muted-foreground">Add a chart of category amounts or custom field values over time.</p></div>
          {canWriteFinance && <Button type="button" onClick={() => openBuilder('new')}><Plus /> New widget</Button>}
        </div>
      )}
      {customModalOpen && <DateRangeModal initialRange={reportRange} onApply={(range) => { setRange('custom', range); setCustomModalOpen(false); }} onClose={() => setCustomModalOpen(false)} />}
      {builderTarget && <WidgetBuilderModal widget={builderTarget === 'new' ? null : builderTarget} categories={categories} categoriesLoading={categoriesLoading} reportRange={reportRange} onClose={() => setBuilderTarget(null)} onSave={saveWidget} />}
      {renameOpen && <ReportFormModal report={report} onClose={() => setRenameOpen(false)} onSubmit={rename} />}
      {deleteTarget && <ConfirmDialog title="Delete widget?" message={`"${deleteTarget.title}" will be removed from this report.`} confirmLabel="Delete widget" loading={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={removeWidget} />}
    </PageShell>
  );
}
