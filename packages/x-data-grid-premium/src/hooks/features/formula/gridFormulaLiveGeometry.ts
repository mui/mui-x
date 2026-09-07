import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';

/**
 * A column drag-resize in flight, captured at `columnResizeStart` — the one
 * moment the committed grid state still agrees with the DOM. During the drag the
 * grid bypasses React entirely (it mutates cell widths and pinned offsets
 * imperatively and commits state only on pointer-up), so the memoized column
 * position selectors keep returning pre-drag geometry for the whole gesture.
 * The formula overlay and the floating editor surface own separate DOM that must
 * track the drag, so they re-derive live geometry per `columnResize` event from
 * this capture plus the event's width — the same event-delta approach the
 * skeleton loading overlay uses — never from mid-drag grid state.
 */
export interface GridFormulaLiveResizeSession {
  /**
   * The field of the column being resized.
   */
  field: string;
  /**
   * The resized column's index among visible columns (the index space of
   * `gridColumnPositionsSelector`).
   */
  columnIndex: number;
  /**
   * The column's committed width when the drag started. The per-move delta is
   * `event.width - startWidth`.
   */
  startWidth: number;
}

/**
 * Captures the resize session at `columnResizeStart`. The event fires before the
 * first width mutation, so `computedWidth` read here is the committed width.
 * Returns `null` when the column cannot be resolved (nothing to sync against).
 */
export function captureFormulaLiveResizeSession(
  apiRef: RefObject<GridPrivateApiPremium>,
  field: string,
): GridFormulaLiveResizeSession | null {
  const columnIndex = apiRef.current.getColumnIndex(field);
  if (columnIndex < 0) {
    return null;
  }
  const startWidth = apiRef.current.getColumn(field)?.computedWidth;
  if (typeof startWidth !== 'number') {
    return null;
  }
  return { field, columnIndex, startWidth };
}

/**
 * The committed column positions with a live resize delta applied: every column
 * after the resized one shifts by `delta`, matching where the grid's imperative
 * drag mutation actually put the cells. The resized column's own left edge (and
 * everything before it) is unaffected — only its width changes, which callers
 * take from the `columnResize` event instead of the (stale) committed state.
 */
export function applyResizeDeltaToPositions(
  positions: number[],
  resizedColumnIndex: number,
  delta: number,
): number[] {
  if (delta === 0) {
    return positions;
  }
  return positions.map((position, index) =>
    index > resizedColumnIndex ? position + delta : position,
  );
}
