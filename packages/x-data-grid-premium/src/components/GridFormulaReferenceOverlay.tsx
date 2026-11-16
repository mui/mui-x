'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import {
  gridClasses,
  gridColumnPositionsSelector,
  gridPinnedColumnsSelector,
  gridRowsMetaSelector,
  useGridEvent,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import type { GridEventListener, GridRowId } from '@mui/x-data-grid-pro';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { useStore } from '@base-ui/utils/store';
import type { RefObject } from '@mui/x-internals/types';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridFormulaActiveEditSelector } from '../hooks/features/formula/gridFormulaSelectors';
import {
  getFormulaReferenceColorVar,
  getFormulaReferencePaletteStyles,
  useGridFormulaReferenceModel,
} from '../hooks/features/formula/gridFormulaReferenceHighlights';
import type {
  FormulaReference,
  FormulaReferenceTarget,
} from '../hooks/features/formula/gridFormulaReferenceHighlights';
import {
  applyResizeDeltaToPositions,
  captureFormulaLiveResizeSession,
} from '../hooks/features/formula/gridFormulaLiveGeometry';
import type { GridFormulaLiveResizeSession } from '../hooks/features/formula/gridFormulaLiveGeometry';
import type { GridPrivateApiPremium } from '../models/gridApiPremium';

// Lives INSIDE the render zone of the rows (portaled into it) and positions its
// rectangles relative to the first rendered row, so native scrolling moves them
// in lockstep with the cells — no scroll listener, no lag. The render zone is a
// stacking context (it is translated to its first row): at z=1 in it, the overlay
// paints over the normal cells and under the pinned cells (z=30), which cover a
// rectangle scrolled underneath them. The sticky header and pinned rows (z=40,
// outside the render zone) cover it too. `pointer-events: none` keeps it inert.
const GridFormulaReferenceOverlayRoot = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  zIndex: 1,
  pointerEvents: 'none',
  ...getFormulaReferencePaletteStyles(theme),
  '@media (forced-colors: active)': { display: 'none' },
}));

const GridFormulaReferenceOverlayRect = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  boxSizing: 'border-box',
  border: '1px dashed',
});

const selectFirstRenderedRowTop = (
  state: GridPrivateApiPremium['virtualizer']['store']['state'],
  active: boolean,
) =>
  active ? (state.rowsMeta.positions[state.virtualization.renderContext.firstRowIndex] ?? 0) : 0;

interface OverlayRect {
  key: string;
  left: number;
  top: number;
  width: number;
  height: number;
  colorIndex: number;
}

interface ColumnSpan {
  left: number;
  width: number;
}

interface RowSpan {
  top: number;
  height: number;
}

/**
 * Resolves the visible colored references to rectangles in the render zone. Returns
 * one rect per distinct target (a cell referenced twice → one rectangle).
 * Pinned-column targets and references off the current page are skipped (no rect)
 * — graceful degradation matching the documented limitations.
 */
function computeOverlayRects(
  apiRef: RefObject<GridPrivateApiPremium>,
  references: FormulaReference[],
  columnPositions: number[],
  rowsMeta: { positions: number[]; currentPageTotalHeight: number },
  topOffset: number,
  pinnedFields: Set<string>,
  widthOverride: { field: string; width: number } | null,
): OverlayRect[] {
  const columnSpan = (field: string): ColumnSpan | null => {
    if (pinnedFields.has(field)) {
      return null;
    }
    const colIndex = apiRef.current.getColumnIndex(field);
    if (colIndex < 0) {
      return null;
    }
    const left = columnPositions[colIndex];
    if (left === undefined) {
      return null;
    }
    // The override carries the live width of a column mid drag-resize, when the
    // committed `computedWidth` is stale (state commits only on pointer-up).
    const width =
      widthOverride !== null && widthOverride.field === field
        ? widthOverride.width
        : (apiRef.current.getColumn(field)?.computedWidth ?? 0);
    return { left, width };
  };

  const rowSpan = (rowId: GridRowId): RowSpan | null => {
    const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(rowId);
    if (rowIndex === undefined || rowIndex < 0) {
      return null;
    }
    const top = rowsMeta.positions[rowIndex];
    if (top === undefined) {
      return null;
    }
    const nextTop = rowsMeta.positions[rowIndex + 1];
    const height = nextTop !== undefined ? nextTop - top : rowsMeta.currentPageTotalHeight - top;
    return { top: topOffset + top, height };
  };

  const toRect = (
    target: FormulaReferenceTarget,
  ): Omit<OverlayRect, 'key' | 'colorIndex'> | null => {
    if (target.kind === 'cell') {
      const column = columnSpan(target.field);
      const row = rowSpan(target.rowId);
      if (column === null || row === null) {
        return null;
      }
      return { left: column.left, top: row.top, width: column.width, height: row.height };
    }
    if (target.kind === 'range') {
      const startColumn = columnSpan(target.startField);
      const endColumn = columnSpan(target.endField);
      const startRow = rowSpan(target.startRowId);
      const endRow = rowSpan(target.endRowId);
      if (startColumn === null || endColumn === null || startRow === null || endRow === null) {
        return null;
      }
      const left = Math.min(startColumn.left, endColumn.left);
      const right = Math.max(
        startColumn.left + startColumn.width,
        endColumn.left + endColumn.width,
      );
      const top = Math.min(startRow.top, endRow.top);
      const bottom = Math.max(startRow.top + startRow.height, endRow.top + endRow.height);
      return { left, top, width: right - left, height: bottom - top };
    }
    if (target.kind === 'wholeColumn') {
      const column = columnSpan(target.field);
      if (column === null) {
        return null;
      }
      return {
        left: column.left,
        top: topOffset,
        width: column.width,
        height: rowsMeta.currentPageTotalHeight,
      };
    }
    return null;
  };

  const rects: OverlayRect[] = [];
  const seen = new Set<string>();
  for (const reference of references) {
    if (
      reference.colorIndex === null ||
      reference.targetKey === null ||
      seen.has(reference.targetKey)
    ) {
      continue;
    }
    seen.add(reference.targetKey);
    const rect = toRect(reference.target);
    if (rect !== null) {
      rects.push({ key: reference.targetKey, colorIndex: reference.colorIndex, ...rect });
    }
  }
  return rects;
}

/**
 * Half B of the reference highlighting: a `pointer-events: none` overlay drawing
 * one dashed rectangle per referenced cell/range/column, color-matched to the
 * editor tokens. Portaled into the render zone of the rows and positioned
 * relative to its first row, so it scrolls natively with the cells. Reads the
 * active edit and value from grid state (not the editor component), so it
 * survives the editing cell being virtualized out.
 */
function GridFormulaReferenceOverlay() {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const activeEdit = useGridSelector(apiRef, gridFormulaActiveEditSelector);
  const a1Notation =
    !!rootProps.formulaA1Notation && !rootProps.disableFormulas && !rootProps.dataSource;
  const model = useGridFormulaReferenceModel(apiRef, activeEdit, a1Notation);
  // These re-render the overlay when geometry changes (resize, reorder,
  // visibility, sort/filter, row heights) — never on scroll, which is native.
  const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const rowsMeta = useGridSelector(apiRef, gridRowsMetaSelector);
  const pinnedColumns = useGridSelector(apiRef, gridPinnedColumnsSelector);
  // The render zone is translated to the position of its first row, which a
  // vertical scroll can move. Read from the virtualizer store, like that
  // translation, so both change in the same render (only while an edit is active).
  const firstRenderedRowTop = useStore(
    apiRef.current.virtualizer.store,
    selectFirstRenderedRowTop,
    activeEdit !== null,
  );

  // Capture the render zone (the portal target) lazily, only once a formula edit
  // is active — so a grid that never edits a formula pays no extra render.
  const [renderZone, setRenderZone] = React.useState<HTMLElement | null>(null);
  useEnhancedEffect(() => {
    if (activeEdit !== null && renderZone === null) {
      setRenderZone(
        apiRef.current.virtualScrollerRef?.current?.querySelector<HTMLElement>(
          `.${gridClasses.virtualScrollerRenderZone}`,
        ) ?? null,
      );
    }
  }, [apiRef, activeEdit, renderZone]);

  // The overlay relies on the default (uncontrolled) layout, where
  // the scroller scrolls natively. The experimental 'controlled' layout moves
  // rows by JS transform instead, so the overlay is disabled there (the editor
  // backdrop still works). See virtualizerLayoutMode.
  const isControlledLayout = rootProps.experimentalFeatures?.virtualizerLayoutMode === 'controlled';

  // ----- Live drag-resize sync -----
  // During a column drag-resize the grid mutates cell widths imperatively and
  // commits state only on pointer-up, so the selectors above are stale for the
  // whole gesture. Mirror the mutation onto the rects per `columnResize` event
  // (the skeleton loading overlay's approach): re-run the same rect derivation
  // with the committed positions shifted by the drag delta and the resized
  // column's width taken from the event, then write the styles imperatively.
  // The pointer-up state commit re-renders the canonical styles.
  const rectElementsRef = React.useRef(new Map<string, HTMLDivElement>());
  const resizeSessionRef = React.useRef<GridFormulaLiveResizeSession | null>(null);
  // The latest `columnResize` width, so a mid-drag React render (e.g. a dynamic
  // row-height remeasure changing `rowsMeta`) derives the same live geometry the
  // event handler writes — otherwise it would paint the stale committed
  // positions over the imperative styles until the next mousemove.
  const liveResizeWidthRef = React.useRef<number | null>(null);

  const computeRects = React.useCallback(() => {
    if (activeEdit === null || isControlledLayout) {
      return [];
    }
    const pinnedFields = new Set<string>([
      ...(pinnedColumns.left ?? []),
      ...(pinnedColumns.right ?? []),
    ]);
    const session = resizeSessionRef.current;
    const liveWidth = liveResizeWidthRef.current;
    const liveResize = session !== null && liveWidth !== null;
    return computeOverlayRects(
      apiRef,
      model.references,
      liveResize
        ? applyResizeDeltaToPositions(
            columnPositions,
            session.columnIndex,
            liveWidth - session.startWidth,
          )
        : columnPositions,
      rowsMeta,
      -firstRenderedRowTop,
      pinnedFields,
      liveResize ? { field: session.field, width: liveWidth } : null,
    );
  }, [
    apiRef,
    activeEdit,
    isControlledLayout,
    model.references,
    columnPositions,
    rowsMeta,
    firstRenderedRowTop,
    pinnedColumns,
  ]);

  const rects = React.useMemo(() => computeRects(), [computeRects]);

  const handleColumnResizeStart: GridEventListener<'columnResizeStart'> = ({ field }) => {
    resizeSessionRef.current = captureFormulaLiveResizeSession(apiRef, field);
    liveResizeWidthRef.current = null;
  };

  const handleColumnResizeStop: GridEventListener<'columnResizeStop'> = () => {
    resizeSessionRef.current = null;
    liveResizeWidthRef.current = null;
  };

  // The pointer-up commit publishes `columnWidthChange` synchronously before the
  // committed re-render: drop the session then, so that render derives from pure
  // committed state (the captured start width is stale once the committed
  // positions include the new width — keeping it would double-shift).
  const handleColumnWidthChange: GridEventListener<'columnWidthChange'> = (params) => {
    if (
      resizeSessionRef.current !== null &&
      resizeSessionRef.current.field === params.colDef.field
    ) {
      resizeSessionRef.current = null;
      liveResizeWidthRef.current = null;
    }
  };

  const handleColumnResize: GridEventListener<'columnResize'> = (params) => {
    const session = resizeSessionRef.current;
    if (session === null || session.field !== params.colDef.field) {
      return;
    }
    liveResizeWidthRef.current = params.width;
    if (rectElementsRef.current.size === 0) {
      return;
    }
    for (const rect of computeRects()) {
      const element = rectElementsRef.current.get(rect.key);
      if (element === undefined) {
        continue;
      }
      element.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
      element.style.width = `${rect.width}px`;
      element.style.height = `${rect.height}px`;
    }
  };

  useGridEvent(apiRef, 'columnResizeStart', handleColumnResizeStart);
  useGridEvent(apiRef, 'columnResize', handleColumnResize);
  useGridEvent(apiRef, 'columnResizeStop', handleColumnResizeStop);
  useGridEvent(apiRef, 'columnWidthChange', handleColumnWidthChange);

  if (activeEdit === null || rects.length === 0 || renderZone === null) {
    return null;
  }

  return ReactDOM.createPortal(
    <GridFormulaReferenceOverlayRoot aria-hidden className="MuiDataGrid-formulaReferenceOverlay">
      {rects.map((rect) => (
        <GridFormulaReferenceOverlayRect
          key={rect.key}
          ref={(node) => {
            if (node === null) {
              rectElementsRef.current.delete(rect.key);
            } else {
              rectElementsRef.current.set(rect.key, node);
            }
          }}
          className="MuiDataGrid-formulaReferenceHighlight"
          style={{
            transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`,
            width: rect.width,
            height: rect.height,
            borderColor: getFormulaReferenceColorVar(rect.colorIndex),
            backgroundColor: `color-mix(in srgb, ${getFormulaReferenceColorVar(
              rect.colorIndex,
            )} 12%, transparent)`,
          }}
        />
      ))}
    </GridFormulaReferenceOverlayRoot>,
    renderZone,
  );
}

export { GridFormulaReferenceOverlay };
