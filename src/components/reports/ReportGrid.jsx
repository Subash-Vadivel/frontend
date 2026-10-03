import { useMemo } from 'react';
import { Responsive, useContainerWidth } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { DRAG_HANDLE_CLASS } from './WidgetCard.jsx';

// 12 columns on wide screens; narrow screens stack widgets in one column and never save.
const BREAKPOINTS = { lg: 768, sm: 0 };
const COLS = { lg: 12, sm: 1 };
const ROW_HEIGHT = 40;
const MARGIN = [12, 12];
// minH 4 matches the backend minimum (WidgetLayout.h >= 4): about 195px, header plus a compact chart.
const MIN_SIZE = { minW: 3, minH: 4 };
const sameLayout = (a, b) => a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;

// Mounted only once there are widgets: useContainerWidth measures its container on mount.
export default function ReportGrid({ widgets, canEdit, onLayoutSave, renderWidget }) {
  const { width, containerRef, mounted } = useContainerWidth();
  // Arranging happens on the 12-column grid only; the stacked phone view is read-only.
  const canArrange = canEdit && width >= BREAKPOINTS.lg;
  const layouts = useMemo(() => ({ lg: widgets.map((w) => ({ i: w.id, ...w.layout, ...MIN_SIZE })) }), [widgets]);

  // Drag/resize stop hands over the final layout, including widgets the grid pushed aside.
  const handleStop = (layout) => {
    if (!canArrange) return;
    const current = Object.fromEntries(widgets.map((w) => [w.id, w.layout]));
    const changed = layout
      .filter((item) => current[item.i] && !sameLayout(current[item.i], item))
      .map(({ i, x, y, w, h }) => ({ id: i, x, y, w, h }));
    if (changed.length) onLayoutSave(changed);
  };

  return (
    <div ref={containerRef} className="-mx-3">
      {mounted && (
        <Responsive
          width={width}
          layouts={layouts}
          breakpoints={BREAKPOINTS}
          cols={COLS}
          gridConfig={{ rowHeight: ROW_HEIGHT, margin: MARGIN }}
          dragConfig={{ enabled: canArrange, handle: `.${DRAG_HANDLE_CLASS}` }}
          resizeConfig={{ enabled: canArrange, handles: ['se'] }}
          onDragStop={handleStop}
          onResizeStop={handleStop}
        >
          {widgets.map((widget) => <div key={widget.id}>{renderWidget(widget, canArrange)}</div>)}
        </Responsive>
      )}
    </div>
  );
}
