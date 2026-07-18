'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import { useRtl } from '@mui/system/RtlProvider';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  gridColumnPositionsSelector,
  gridColumnsTotalWidthSelector,
  gridDimensionsSelector,
  gridEditCellStateSelector,
  gridPinnedColumnsSelector,
  gridRenderContextSelector,
  gridRowsMetaSelector,
  gridVisibleColumnFieldsSelector,
  useGridEvent,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import type {
  GridEventListener,
  GridRenderEditCellParams,
  GridSlotProps,
} from '@mui/x-data-grid-pro';
import { NotRendered, vars } from '@mui/x-data-grid/internals';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import type { FormulaCompletionToken } from '../hooks/features/formula/engine';
import { useGridFormulaAutocomplete } from '../hooks/features/formula/gridFormulaAutocomplete';
import type { GridFormulaSuggestionState } from '../hooks/features/formula/gridFormulaAutocomplete';
import {
  buildFormulaTextSegments,
  getFormulaReferencePaletteStyles,
  useGridFormulaReferenceModel,
} from '../hooks/features/formula/gridFormulaReferenceHighlights';
import { captureFormulaLiveResizeSession } from '../hooks/features/formula/gridFormulaLiveGeometry';
import type { GridFormulaLiveResizeSession } from '../hooks/features/formula/gridFormulaLiveGeometry';
import {
  getCaretOffset,
  getSelectionOffsets,
  normalizeSingleLine,
  renderSegments,
  scrollCaretIntoView,
  setCaretOffset,
  setSelectionOffsets,
} from './formulaEditorCaret';
import type { FormulaTextSegment } from '../hooks/features/formula/gridFormulaReferenceHighlights';

// The in-cell anchor. It replaces `GridEditInputCell` in the cell itself, but the
// real editor lives in the floating surface portaled into the row: the anchor only
// shows the live (ellipsized) draft — visible when the surface is closed, e.g. the
// unfocused cells of a row in row edit mode — and carries the aria relationship to
// the surface.
const GridFormulaEditorRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FormulaEditor',
})({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  font: vars.typography.font.body,
});

const GridFormulaEditorAnchorValue = styled('div')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
  paddingInline: 10,
  textAlign: 'start',
});

// The floating editing surface. It overlays the cell and grows inline-end with the
// formula. Its geometry is deliberately STATIC — derived from grid state and
// applied as first-paint CSS, with no positioning engine (no Popper): nothing
// repositions asynchronously, which is what makes it impossible for the surface to
// flash or drift. It is normally portaled into the virtual SCROLLER and positioned
// in content-space coordinates (the reference overlay's own coordinate space), so
// native scrolling moves it in lockstep with the rows; a pinned row's surface is
// portaled into the row element instead (block edges welded to the row box).
// z-index: 30 — at scroller level this paints above the render zone and the
// reference-highlight overlay (both `z: auto`; the render zone's `translate3d`
// makes it a stacking context, which is why a row-portaled surface could NOT
// out-z the overlay) while staying below the sticky header and pinned-row
// containers (z 40), which must keep covering content scrolled beneath them.
const GridFormulaEditorSurface = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FormulaEditorSurface',
})(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  zIndex: 30,
  font: vars.typography.font.body,
  color: (theme.vars || theme).palette.text.primary,
  // Opaque: the surface grows over neighboring cells and the in-grid reference
  // rectangles, which must not bleed through.
  background: vars.colors.background.base,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  boxShadow: (theme.vars || theme).shadows[4],
  overflow: 'hidden',
  ...getFormulaReferencePaletteStyles(theme),
}));

// The `contenteditable` itself. Its children are the colored token `<span>`s and
// plain text nodes, managed imperatively (`renderSegments`) — never by React — so
// the caret is never clobbered by reconciliation. `white-space: pre` keeps the
// single line intact; the browser auto-scrolls it to the caret, so there is no
// scroll-sync to maintain. It must NOT be `display: flex` (that would turn the
// inline text/spans into anonymous flex items and break `white-space: pre`).
const GridFormulaEditorEditable = styled('div')({
  flex: 1,
  minWidth: 0,
  padding: '0 10px',
  whiteSpace: 'pre',
  overflowX: 'auto',
  outline: 'none',
  cursor: 'text',
  // Formulas always read from the start edge (left in LTR, right in RTL): align to
  // `start` even in a right-aligned (`type: 'number'`) column, which would
  // otherwise push the text to the far edge away from where it is typed.
  textAlign: 'start',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
});

const GridFormulaEditorPopper = styled(NotRendered<GridSlotProps['basePopper']>, {
  name: 'MuiDataGrid',
  slot: 'FormulaAutocompletePopper',
})({
  zIndex: vars.zIndex.menu,
});

const GridFormulaEditorPanel = styled('div')(({ theme }) => ({
  minWidth: 220,
  maxWidth: 360,
  background: (theme.vars || theme).palette.background.paper,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: (theme.vars || theme).shape.borderRadius,
  boxShadow: (theme.vars || theme).shadows[4],
  boxSizing: 'border-box',
  overflow: 'hidden',
}));

const GridFormulaEditorSignature = styled('div')(({ theme }) => ({
  ...theme.typography.caption,
  padding: '6px 10px',
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  color: (theme.vars || theme).palette.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const GridFormulaEditorList = styled('ul')({
  listStyle: 'none',
  margin: 0,
  padding: 4,
  maxHeight: 240,
  overflowY: 'auto',
});

const GridFormulaEditorOption = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 8,
  padding: '4px 8px',
  borderRadius: (theme.vars || theme).shape.borderRadius,
  cursor: 'pointer',
  ...theme.typography.body2,
  '&[data-focused="true"]': {
    background: (theme.vars || theme).palette.action.hover,
  },
}));

const GridFormulaEditorOptionLabel = styled('span')({
  fontVariantLigatures: 'none',
  whiteSpace: 'nowrap',
});

const GridFormulaEditorOptionDetail = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

/**
 * Class of the floating editing surface. Also consumed by the formula feature's
 * `canUpdateFocus` pipe processor: the surface is row-portaled, so the grid's
 * DOM-containment checks do not recognize it as part of the editing cell — the
 * processor uses this class to keep pointer events inside it from clearing the
 * cell focus (which would stop the edit).
 */
export const GRID_FORMULA_EDITOR_SURFACE_CLASS = 'MuiDataGrid-formulaEditorSurface';

export interface GridFormulaEditorProps extends GridRenderEditCellParams {
  /**
   * Whether references are shown in A1 notation (column letters / 1-based rows)
   * rather than the canonical `REF(...)` dialect.
   */
  a1Notation: boolean;
  /**
   * Whether the autocomplete suggestion popup is enabled. When `false`
   * (`disableFormulaAutocomplete`/`dataSource`) the same editor still colors
   * references — only the popup is suppressed.
   */
  suggestionsEnabled: boolean;
}

/**
 * The edit-state value as the string the editor displays. Non-string values
 * (e.g. a number parsed from a plain edit) render through their string form; the
 * reference model treats them as non-formulas (no coloring).
 */
function valueToText(value: unknown): string {
  if (value == null) {
    return '';
  }
  return typeof value === 'string' ? value : String(value);
}

/**
 * Whether two segment runs render identical content. A model change that produces
 * the same text and colors (a no-op recolor) can then skip the DOM rebuild
 * entirely, leaving the caret and any selection untouched.
 */
function segmentsEqual(a: FormulaTextSegment[], b: FormulaTextSegment[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let index = 0; index < a.length; index += 1) {
    if (a[index].text !== b[index].text || a[index].colorIndex !== b[index].colorIndex) {
      return false;
    }
  }
  return true;
}

/**
 * The smallest surface width that fits `needed` pixels, preferring widths whose
 * inline-end border lands on a column gridline (so a grown surface reads as
 * "covering whole cells" and the border moves rarely, never per keystroke).
 * `snapWidths` is ascending; `clamp` is the hard bound at the viewport's visible
 * inline-end edge.
 */
function computeSnappedWidth(needed: number, snapWidths: number[], clamp: number): number {
  if (needed >= clamp) {
    return clamp;
  }
  for (let index = 0; index < snapWidths.length; index += 1) {
    if (snapWidths[index] >= needed) {
      return Math.min(snapWidths[index], clamp);
    }
  }
  // Past the last gridline (the grid's content is narrower than the clamp):
  // exact fit — there is no boundary left to snap to.
  return needed;
}

/**
 * Formula edit component: an in-cell anchor plus a floating surface that overlays
 * the cell and grows inline-end with the formula (the long-text editing pattern,
 * with content-driven growth). The anchor mirrors the live draft for the unfocused
 * cells of row edit mode; only the focused cell opens its surface.
 */
function GridFormulaEditor(props: GridFormulaEditorProps) {
  const { id, field, hasFocus, cellMode, rowNode } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const [rootEl, setRootEl] = React.useState<HTMLDivElement | null>(null);

  const editState = useGridSelector(apiRef, gridEditCellStateSelector, { rowId: id, field });
  const text = valueToText(editState?.value);

  const surfaceId = `${id}-${field}-formula-editor-surface`;
  // Only the focused cell opens the surface — row edit mode puts every cell of the
  // row in edit mode at once, and only one floating editor may show (the same gate
  // as GridEditLongTextCell).
  const surfaceOpen = hasFocus && rootEl !== null;
  const rowElement =
    rootEl !== null ? (rootEl.closest('[role="row"]') as HTMLElement | null) : null;
  // Portal target. Normal rows: the virtual SCROLLER — the render zone (which
  // contains the rows) carries a `translate3d` and is therefore a stacking
  // context, so a surface inside a row can never paint above the reference
  // overlay (a later scroller child); at scroller level the surface's own
  // z-index wins. The scroller is a positioned scroll container, so a child
  // absolutely positioned in content coordinates scrolls natively with the
  // rows — the static-geometry invariant is unchanged. Pinned rows live in the
  // sticky top/bottom containers (z 40, above the overlay already) and have no
  // content-space position, so they keep the row portal.
  const isPinnedRow = rowNode.type === 'pinnedRow';
  const scrollerElement = apiRef.current.virtualScrollerRef?.current ?? null;
  const inScroller = !isPinnedRow && scrollerElement !== null;
  const portalTarget = inScroller ? scrollerElement : rowElement;

  return (
    <GridFormulaEditorRoot
      ref={setRootEl}
      className="MuiDataGrid-formulaEditor"
      tabIndex={cellMode === 'edit' && rootProps.editMode === 'row' ? 0 : undefined}
      aria-controls={surfaceOpen ? surfaceId : undefined}
      aria-expanded={surfaceOpen}
    >
      <GridFormulaEditorAnchorValue>{text}</GridFormulaEditorAnchorValue>
      {surfaceOpen && portalTarget !== null
        ? // The portal keeps the React tree, so events raised inside the surface
          // still bubble through the cell (outside-click commit protection,
          // Enter/Tab/Escape handling) exactly as from an inline editor.
          ReactDOM.createPortal(
            <GridFormulaEditorFloating {...props} surfaceId={surfaceId} inScroller={inScroller} />,
            portalTarget,
          )
        : null}
    </GridFormulaEditorRoot>
  );
}

interface GridFormulaEditorFloatingProps extends GridFormulaEditorProps {
  surfaceId: string;
  /**
   * Whether the surface is portaled into the virtual scroller (content-space
   * coordinates) rather than the row element (pinned rows).
   */
  inScroller: boolean;
}

/**
 * The floating editing surface and the single-layer formula editor inside it: a
 * `contenteditable` whose children are the colored reference token `<span>`s
 * themselves, so the caret, the native selection, and the colors share one element
 * (nothing to keep aligned). It derives its DOM from the edit-state value, syncs
 * typed text back with no debounce, and layers the autocomplete popup (suggestions
 * from `useGridFormulaAutocomplete`, the highlight colors from
 * `useGridFormulaReferenceModel`). Caret save/restore around each rebuild,
 * IME-composition guarding and explicit paste/newline handling are the cost of
 * `contenteditable`; each is handled below.
 *
 * The surface's width is a grow-only ratchet: it starts at the cell's width (or
 * the seeded formula's width), steps to the next column gridline whenever the
 * content overflows, and never shrinks during the edit — deletions leave the box
 * in place, so its edges never wobble. Growth is clamped at the viewport's visible
 * inline-end edge (measured once at open); past the clamp the single line scrolls
 * internally, with the browser keeping the caret in view.
 */
function GridFormulaEditorFloating(props: GridFormulaEditorFloatingProps) {
  const { id, field, hasFocus, colDef, a1Notation, suggestionsEnabled, surfaceId, inScroller } =
    props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const isRtl = useRtl();

  const surfaceRef = React.useRef<HTMLDivElement | null>(null);
  const editableRef = React.useRef<HTMLDivElement | null>(null);
  // The caret to restore on the next rebuild (set by typing/accepting); `null`
  // means "no explicit caret — place at the end on entry, otherwise preserve".
  const pendingCaretRef = React.useRef<number | null>(null);
  // True while an IME composition is in flight: skip rebuilds so the DOM mutation
  // does not abort the composition.
  const composingRef = React.useRef(false);
  // Flips true on the first real edit. Before that, every rebuild (entry + the
  // source seeding) parks the caret at the end; after it, the caret is preserved.
  const engagedRef = React.useRef(false);
  // Set by an accepted suggestion so the rebuild that follows recomputes the popup
  // (e.g. shows the arguments right after `SUM(`).
  const refreshAfterRebuildRef = React.useRef(false);
  // The segments currently rendered into the DOM and the text they were built from.
  // Used to skip no-op recolors (identical content) and to tell a source seeding (a
  // text change) apart from a pure recolor (text unchanged) for caret placement.
  const renderedSegmentsRef = React.useRef<FormulaTextSegment[]>([]);
  const renderedTextRef = React.useRef('');
  // The ratcheted surface width (grow-only for the life of the edit) and the
  // measured growth bound. `null` until first measured/grown.
  const ratchetRef = React.useRef<number | null>(null);
  const clampRef = React.useRef<number | null>(null);

  const editState = useGridSelector(apiRef, gridEditCellStateSelector, { rowId: id, field });
  const text = valueToText(editState?.value);

  const model = useGridFormulaReferenceModel(apiRef, { id, field }, a1Notation);
  const segments = React.useMemo(
    () => buildFormulaTextSegments(text, model.references),
    [text, model.references],
  );

  const getSuggestions = useGridFormulaAutocomplete(apiRef, a1Notation);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [suggestion, setSuggestion] = React.useState<GridFormulaSuggestionState | null>(null);

  // Whether the edited row is currently rendered as the zero-size virtual-focus
  // row (it left the vertical render window). The grid hides that row with
  // `opacity: 0`, taking the surface with it; the surface additionally drops
  // pointer-events so the invisible box cannot intercept clicks, and the
  // (body-portaled) suggestion popup — which inherits neither — closes. This
  // mirrors the virtualizer's own out-of-range condition for the focused row.
  const surfaceHidden = useGridSelector(apiRef, () => {
    const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id) as number | undefined;
    if (rowIndex === undefined) {
      return false;
    }
    const renderContext = gridRenderContextSelector(apiRef);
    return rowIndex < renderContext.firstRowIndex || rowIndex > renderContext.lastRowIndex;
  });

  const options = React.useMemo(() => suggestion?.options ?? [], [suggestion]);
  const signatureHelp = suggestion?.signatureHelp ?? null;
  // The list only opens for a non-empty partial token (the user is actively typing
  // an identifier). An empty prefix — right after `=`, `(`, `,` or an operator —
  // shows at most signature help and never traps Enter/Tab, so a completed formula
  // commits on Enter instead of accepting a stray suggestion.
  const hasList = (suggestion?.token ?? '') !== '' && options.length > 0;
  const showPopup =
    suggestionsEnabled && hasFocus && open && !surfaceHidden && (hasList || signatureHelp !== null);
  const popupId = `${id}-${field}-formula-autocomplete`;
  const activeDescendant =
    showPopup && hasList
      ? `${popupId}-option-${Math.min(activeIndex, options.length - 1)}`
      : undefined;

  // ----- Static geometry (grid state, applied as CSS in the render) -----

  const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const visibleFields = useGridSelector(apiRef, gridVisibleColumnFieldsSelector);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const pinnedColumns = useGridSelector(apiRef, gridPinnedColumnsSelector);
  const isPinnedColumn =
    (pinnedColumns.left ?? []).includes(field) || (pinnedColumns.right ?? []).includes(field);

  const columnIndex = visibleFields.indexOf(field);
  // The column's content-space inline offset — the exact coordinate the row lays
  // its cells out with, so the surface lands on the cell by construction.
  const cellStart = columnPositions[columnIndex] ?? 0;
  // +1: the surface's inline borders sit ON the gridlines (start border on the
  // line before the cell, end border on the line after), keeping the interior —
  // and the text origin, via the matching 10px padding — flush with the cell's.
  const minWidth = colDef.computedWidth + 1;

  // The row's content-space block position — `rowsMeta.positions` below the sticky
  // top container, the same recipe the reference overlay uses (both live in the
  // scroller's content space, so they can never disagree). Reactive: sorting or a
  // row-height change mid-edit re-derives it in the same commit. In row-portal
  // mode (pinned rows) the block edges weld to the row box instead.
  const rowsMeta = useGridSelector(apiRef, gridRowsMetaSelector);
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  let surfaceBlockStyles: React.CSSProperties = { top: 0, bottom: 0 };
  if (inScroller) {
    const rowIndexInPage = apiRef.current.getRowIndexRelativeToVisibleRows(id) as
      | number
      | undefined;
    const rowPosition = rowsMeta.positions[rowIndexInPage ?? 0] ?? 0;
    const nextRowPosition = rowsMeta.positions[(rowIndexInPage ?? 0) + 1];
    const rowHeight =
      (nextRowPosition !== undefined ? nextRowPosition : rowsMeta.currentPageTotalHeight) -
      rowPosition;
    surfaceBlockStyles = {
      top: (dimensions.topContainerHeight ?? 0) + rowPosition,
      height: rowHeight + 1,
    };
  }

  // Candidate widths whose inline-end border lands on a column gridline, ascending,
  // ending at the grid's content edge.
  const snapWidths = React.useMemo(() => {
    const widths: number[] = [];
    if (columnIndex === -1) {
      return widths;
    }
    for (let index = columnIndex + 1; index < columnPositions.length; index += 1) {
      widths.push(columnPositions[index] - cellStart + 1);
    }
    widths.push(columnsTotalWidth - cellStart + 1);
    return widths;
  }, [columnPositions, columnIndex, cellStart, columnsTotalWidth]);

  const appliedWidth = React.useCallback(
    () => Math.max(ratchetRef.current ?? 0, minWidth),
    [minWidth],
  );

  // The growth bound: from the surface's start edge to the visible inline-end edge
  // of the viewport, stopping at the right-pinned seam and the vertical scrollbar.
  // Measured ONCE per edit session, when growth first needs it, and never again —
  // not on scroll and not on grid resize: the surface lives in content space, so
  // any later measurement is skewed by the scroll position and could shrink the
  // box (the wobble the ratchet forbids). The value rides in the session mirror,
  // so a remounted editor resumes the session's bound instead of re-measuring.
  // (A grid resized smaller mid-edit keeps the grown box; it simply extends out of
  // view like any wide content while the editable keeps scrolling internally.)
  const ensureClamp = React.useCallback(() => {
    if (clampRef.current !== null) {
      return clampRef.current;
    }
    const session = apiRef.current.caches.formula.editorSession;
    if (
      session !== null &&
      session.id === id &&
      session.field === field &&
      session.surfaceClamp !== null
    ) {
      clampRef.current = session.surfaceClamp;
      return clampRef.current;
    }
    const surface = surfaceRef.current;
    const scroller = apiRef.current.virtualScrollerRef?.current;
    let available = 0;
    if (surface && scroller) {
      const dim = gridDimensionsSelector(apiRef);
      const scrollerRect = scroller.getBoundingClientRect();
      const surfaceRect = surface.getBoundingClientRect();
      const scrollbar = dim.hasScrollY ? dim.scrollbarSize : 0;
      available = isRtl
        ? surfaceRect.right - scrollerRect.left - dim.rightPinnedWidth - scrollbar
        : scrollerRect.right - surfaceRect.left - dim.rightPinnedWidth - scrollbar;
    }
    clampRef.current = Math.max(minWidth, Math.floor(available));
    return clampRef.current;
  }, [apiRef, field, id, isRtl, minWidth]);

  // Grow-only: widen the surface when the single-line content overflows the
  // editable, snapping the inline-end border to the next column gridline. Never
  // shrinks — deletions leave the box as is, so its edges never move backwards.
  const growToFit = React.useCallback(() => {
    const surface = surfaceRef.current;
    const editable = editableRef.current;
    if (!surface || !editable) {
      return;
    }
    // +2: a small gutter so the caret at the end of the line is not glued to the
    // border when the growth lands past the last gridline (exact-fit tail).
    const overflow = editable.scrollWidth - editable.clientWidth + 2;
    if (overflow <= 2) {
      return;
    }
    const clamp = ensureClamp();
    const needed = surface.offsetWidth + overflow;
    const next = computeSnappedWidth(needed, snapWidths, clamp);
    if (next > appliedWidth()) {
      ratchetRef.current = next;
      surface.style.width = `${next}px`;
    }
  }, [appliedWidth, ensureClamp, snapWidths]);

  const commit = React.useCallback(
    (nextValue: unknown, event?: React.SyntheticEvent) => {
      // Writes are NOT debounced: a debounced keystroke timer firing after an
      // accepted-suggestion immediate write would clobber it. Per-keystroke writes
      // are negligible for one editing cell.
      apiRef.current.setEditCellValue(
        { id, field, value: nextValue, unstable_skipValueParser: true },
        event,
      );
    },
    [apiRef, field, id],
  );

  /**
   * Recomputes the suggestions from the editor's current text and caret, opening
   * the popup when there is something to show. Only called from user actions
   * (typing, caret moves, accepting) — never on mount/focus.
   */
  const refresh = React.useCallback(
    (caretOverride?: number | null) => {
      if (!suggestionsEnabled) {
        return;
      }
      const root = editableRef.current;
      if (!root) {
        return;
      }
      const source = root.textContent ?? '';
      const caret = caretOverride ?? getCaretOffset(root) ?? source.length;
      const next = getSuggestions(source, caret);
      setSuggestion(next);
      setActiveIndex(0);
      const nextHasList = next !== null && next.token !== '' && next.options.length > 0;
      setOpen(next !== null && (nextHasList || next.signatureHelp !== null));
    },
    [getSuggestions, suggestionsEnabled],
  );

  // A pinned column's cell is `position: sticky` — its visual position is
  // viewport-anchored and diverges from its content-space layout slot once the
  // grid is scrolled, so for a pinned anchor the surface takes its inline start
  // from the cell's real position instead of `columnPositions`. Measured once
  // pre-paint per relevant change (still no async repositioning); afterwards the
  // accepted pinned trade-off applies — a mid-edit horizontal scroll lets the
  // surface glide away from the stuck cell until scrolled back. The measurement is
  // converted to the portal target's coordinate space: content space (viewport
  // offset + scroll) in scroller mode, the row box in row mode. Also re-run per
  // `columnResize` event below — the cell rect is live mid-drag.
  const placePinnedSurface = React.useCallback(() => {
    const surface = surfaceRef.current;
    const cell = apiRef.current.getCellElement(id, field);
    const scroller = apiRef.current.virtualScrollerRef?.current;
    if (!surface || !cell) {
      return;
    }
    const cellRect = cell.getBoundingClientRect();
    let inlineStart: number;
    if (inScroller && scroller) {
      const scrollerRect = scroller.getBoundingClientRect();
      // RTL: `scrollLeft` runs 0 → negative, so subtracting it adds the scrolled
      // distance in both directions.
      inlineStart = isRtl
        ? scrollerRect.right - cellRect.right - scroller.scrollLeft
        : cellRect.left - scrollerRect.left + scroller.scrollLeft;
    } else {
      const row = surface.closest('[role="row"]') as HTMLElement | null;
      if (!row) {
        return;
      }
      const rowRect = row.getBoundingClientRect();
      inlineStart = isRtl ? rowRect.right - cellRect.right : cellRect.left - rowRect.left;
    }
    surface.style.insetInlineStart = `${inlineStart - 1}px`;
  }, [apiRef, inScroller, field, id, isRtl]);

  useEnhancedEffect(() => {
    if (isPinnedColumn) {
      placePinnedSurface();
    }
  }, [isPinnedColumn, placePinnedSurface, cellStart]);

  // ----- Live drag-resize sync -----
  // During a column drag-resize the grid mutates cell widths imperatively and
  // commits state only on pointer-up, so the static geometry above (columns
  // positions, `colDef.computedWidth`) is stale for the whole gesture and the
  // surface would detach from its moving cell. Mirror the mutation per
  // `columnResize` event (the skeleton loading overlay's approach): shift the
  // inline start by the drag delta when a column before the anchor is resized,
  // track the live width when the anchor column itself is resized. The pointer-up
  // state commit re-renders the canonical styles. No re-render happens mid-drag,
  // so the committed values captured by these closures stay valid all gesture.
  const resizeSessionRef = React.useRef<GridFormulaLiveResizeSession | null>(null);

  const handleColumnResizeStart: GridEventListener<'columnResizeStart'> = (params) => {
    resizeSessionRef.current = captureFormulaLiveResizeSession(apiRef, params.field);
    // The body-portaled suggestion popup cannot track an anchor moved by the
    // imperative drag mutation — close it (the column menu does the same).
    setOpen(false);
  };

  const handleColumnResizeStop: GridEventListener<'columnResizeStop'> = () => {
    resizeSessionRef.current = null;
  };

  const handleColumnResize: GridEventListener<'columnResize'> = (params) => {
    const session = resizeSessionRef.current;
    const surface = surfaceRef.current;
    if (session === null || session.field !== params.colDef.field || surface === null) {
      return;
    }
    if (isPinnedColumn) {
      placePinnedSurface();
    } else if (columnIndex !== -1 && session.columnIndex < columnIndex) {
      surface.style.insetInlineStart = `${cellStart + (params.width - session.startWidth)}px`;
    }
    if (session.field === field) {
      // Mirrors `appliedWidth` with the live width: a grown surface never
      // shrinks, an ungrown one tracks the cell in both directions.
      surface.style.width = `${Math.max(ratchetRef.current ?? 0, params.width + 1)}px`;
    }
  };

  useGridEvent(apiRef, 'columnResizeStart', handleColumnResizeStart);
  useGridEvent(apiRef, 'columnResize', handleColumnResize);
  useGridEvent(apiRef, 'columnResizeStop', handleColumnResizeStop);

  // The core: rebuild the colored children and restore the caret/selection on every
  // value or model change, inside a layout effect (before paint, no flicker).
  // Skipped while an IME composition is active.
  useEnhancedEffect(() => {
    const root = editableRef.current;
    if (!root || composingRef.current) {
      return;
    }
    // A no-op recolor (identical text and colors) leaves the DOM, caret and any
    // selection untouched — nothing to rebuild.
    if (segmentsEqual(renderedSegmentsRef.current, segments)) {
      renderedSegmentsRef.current = segments;
      return;
    }

    const isActive = root.ownerDocument.activeElement === root;
    // Capture the whole selection (both edges) before the rebuild wipes the DOM, so
    // a recolor that does change the spans preserves a range, not just the caret.
    const selection = isActive ? getSelectionOffsets(root) : null;
    const textChanged = text !== renderedTextRef.current;

    renderSegments(root, segments);
    renderedSegmentsRef.current = segments;
    renderedTextRef.current = text;

    // The content changed — widen the surface if the single line no longer fits
    // (typing, paste, an accepted suggestion, and the source seeding all pass
    // through here). Pre-paint, so the growth and the new text land together.
    growToFit();

    if (!isActive) {
      pendingCaretRef.current = null;
      return;
    }
    if (pendingCaretRef.current !== null) {
      // An edit (typing/accept) queued an explicit caret.
      setCaretOffset(root, pendingCaretRef.current);
      pendingCaretRef.current = null;
    } else if (textChanged && !engagedRef.current) {
      // Entry / source seeding before the first edit: caret to the end.
      setCaretOffset(root, (root.textContent ?? '').length);
    } else if (selection) {
      // A recolor (or external value change) while the user is mid-edit: keep the
      // caret/selection where it was, do not snap it to the end.
      setSelectionOffsets(root, selection);
    } else {
      setCaretOffset(root, (root.textContent ?? '').length);
    }
    // The browser reveals the caret only for native typing; a programmatically
    // placed caret (entry seed, accepted suggestion) on a formula longer than the
    // box would otherwise sit out of view past the internal scroll.
    scrollCaretIntoView(root);

    if (refreshAfterRebuildRef.current) {
      refreshAfterRebuildRef.current = false;
      refresh(getCaretOffset(root));
    }
  }, [segments, text, refresh, growToFit]);

  // Live mirror of the editing session (engaged flag + caret offset + the grown
  // surface width), kept in the formula cache and written on every user
  // interaction. When virtualization remounts the editing cell (the edited row
  // left the render window), the fresh instance resumes from the mirror instead of
  // restarting the entry sequence — including reproducing the exact same surface
  // box, so a remount never changes what the user sees. It must be a
  // continuously-written mirror rather than an unmount-time capture: the
  // replacement instance can mount BEFORE the old one unmounts, and StrictMode
  // runs synthetic cleanups with nothing unmounted. Only the focused editor writes
  // (row edit mode mounts one editor per cell). `cellEditStop` clears it.
  const updateEditorSession = React.useCallback(
    (caretOverride?: number | null) => {
      const root = editableRef.current;
      if (!root || root.ownerDocument.activeElement !== root) {
        return;
      }
      apiRef.current.caches.formula.editorSession = {
        id,
        field,
        engaged: engagedRef.current,
        caret: caretOverride !== undefined ? caretOverride : getCaretOffset(root),
        surfaceWidth: ratchetRef.current,
        surfaceClamp: clampRef.current,
      };
    },
    [apiRef, field, id],
  );

  // True after the entry sequence below has run. The floating editor mounts
  // focused and unmounts when it loses focus, so entry is a strictly
  // once-per-mount affair — the guard keeps dependency churn (a column resize
  // changes `minWidth` and with it the callback identities below) from re-running
  // the session resume on a LIVE editor, which would collapse the user's
  // selection, snap the caret to the last-mirrored offset, and abort an in-flight
  // IME composition.
  const enteredRef = React.useRef(false);

  // Focus on entry and place the caret at the end (the rebuild effect handles the
  // caret on a later source seed). Runs once per mount — at edit start, but also
  // whenever virtualization remounts the editing cell.
  useEnhancedEffect(() => {
    const root = editableRef.current;
    if (!root || !hasFocus || enteredRef.current) {
      return;
    }
    enteredRef.current = true;
    if (root.ownerDocument.activeElement !== root) {
      // preventScroll: when the edited row leaves the render window mid-scroll,
      // the grid remounts it (as the zero-size virtual-focus row) and this
      // effect re-focuses the editable — the browser's default scroll-into-view
      // on focus() would then yank the viewport back to the edited cell on
      // every scroll tick. Same defense as GridEditLongTextCell.
      root.focus({ preventScroll: true });
    }
    const session = apiRef.current.caches.formula.editorSession;
    if (session !== null && session.id === id && session.field === field) {
      // The editing cell remounted mid-edit: resume the live session — restore
      // the engaged flag, the grown surface box, and put the caret back where
      // it was, not at the end. The mirror stays in place for any further
      // remount. The width is restored verbatim (it was already bounded by the
      // session's own clamp, which `ensureClamp` also resumes): re-clamping with
      // a freshly measured, scroll-skewed bound could shrink the box mid-edit.
      engagedRef.current = session.engaged;
      const surface = surfaceRef.current;
      if (surface && session.surfaceWidth !== null && session.surfaceWidth > appliedWidth()) {
        ratchetRef.current = session.surfaceWidth;
        surface.style.width = `${session.surfaceWidth}px`;
      }
      setCaretOffset(root, session.caret ?? (root.textContent ?? '').length);
      scrollCaretIntoView(root);
      return;
    }
    // On entry (before the first edit), collapse any stray selection to the end —
    // a fresh edit starts with the caret at the end of the seeded formula, not a
    // select-all left over from the double-click/open gesture.
    if (!engagedRef.current) {
      setCaretOffset(root, (root.textContent ?? '').length);
      scrollCaretIntoView(root);
    }
  }, [apiRef, appliedWidth, field, hasFocus, id]);

  // Keep the highlighted option scrolled into view.
  useEnhancedEffect(() => {
    if (!showPopup || !hasList) {
      return;
    }
    const node = document.getElementById(`${popupId}-option-${activeIndex}`);
    node?.scrollIntoView?.({ block: 'nearest' });
  }, [showPopup, hasList, activeIndex, popupId]);

  const runInput = React.useCallback(
    (event?: React.SyntheticEvent) => {
      const root = editableRef.current;
      if (!root) {
        return;
      }
      engagedRef.current = true;
      const rawText = normalizeSingleLine(root.textContent ?? '');
      const column = apiRef.current.getColumn(field);
      // Run the column's value parser exactly like the plain edit input: a formula
      // source passes through (the formula wrapper protects `=` strings), a plain
      // value is parsed to its typed form (e.g. a number on a number column) so the
      // commit stores the right type.
      const parsedValue = column.valueParser
        ? column.valueParser(rawText, apiRef.current.getRow(id), column, apiRef)
        : rawText;
      pendingCaretRef.current = getCaretOffset(root);
      commit(parsedValue, event);
      refresh(pendingCaretRef.current);
      updateEditorSession(pendingCaretRef.current);
    },
    [apiRef, commit, field, id, refresh, updateEditorSession],
  );

  const handleInput = React.useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      if (composingRef.current) {
        return;
      }
      runInput(event);
    },
    [runInput],
  );

  const handleCompositionStart = React.useCallback(() => {
    composingRef.current = true;
  }, []);

  const handleCompositionEnd = React.useCallback(
    (event: React.CompositionEvent<HTMLDivElement>) => {
      composingRef.current = false;
      runInput(event);
    },
    [runInput],
  );

  const handlePaste = React.useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      event.preventDefault();
      const root = editableRef.current;
      if (!root) {
        return;
      }
      const pasted = normalizeSingleLine(event.clipboardData.getData('text/plain'));
      // `contenteditable="plaintext-only"` is unavailable below the Firefox floor,
      // so insert the plain text explicitly. `insertText` fires its own `input`
      // event (which runs the input pipeline); the manual fallback does not, so it
      // runs it itself.
      if (root.ownerDocument.execCommand('insertText', false, pasted)) {
        return;
      }
      const caret = getCaretOffset(root) ?? (root.textContent ?? '').length;
      const current = root.textContent ?? '';
      root.textContent = current.slice(0, caret) + pasted + current.slice(caret);
      setCaretOffset(root, caret + pasted.length);
      runInput(event);
    },
    [runInput],
  );

  const acceptOption = React.useCallback(
    (option: FormulaCompletionToken, event: React.SyntheticEvent) => {
      const current = suggestion;
      const root = editableRef.current;
      if (!current || !root) {
        return;
      }
      const source = root.textContent ?? '';
      const insertText = option.insertText + (option.callable ? '(' : '');
      const nextValue =
        source.slice(0, current.replaceStart) + insertText + source.slice(current.replaceEnd);
      // Accepting an already-fully-typed token is a no-op — bail before touching the
      // pending-caret / refresh-after-rebuild flags (which would otherwise stay set
      // with no commit to consume them), mirroring the keydown accept's guard.
      if (nextValue === source) {
        return;
      }
      engagedRef.current = true;
      pendingCaretRef.current = current.replaceStart + insertText.length;
      refreshAfterRebuildRef.current = true;
      commit(nextValue, event);
      updateEditorSession(pendingCaretRef.current);
    },
    [commit, suggestion, updateEditorSession],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (open && hasList) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            event.stopPropagation();
            setActiveIndex((index) => (index + 1) % options.length);
            return;
          case 'ArrowUp':
            event.preventDefault();
            event.stopPropagation();
            setActiveIndex((index) => (index - 1 + options.length) % options.length);
            return;
          case 'Enter':
          case 'Tab': {
            const option = options[Math.min(activeIndex, options.length - 1)];
            const root = editableRef.current;
            if (option && root && suggestion) {
              const source = root.textContent ?? '';
              const insertText = option.insertText + (option.callable ? '(' : '');
              const nextValue =
                source.slice(0, suggestion.replaceStart) +
                insertText +
                source.slice(suggestion.replaceEnd);
              // Accepting a token that is already fully typed is a no-op — let the
              // key reach the grid so a completed formula commits / Tab navigates.
              if (nextValue !== source) {
                event.preventDefault();
                event.stopPropagation();
                acceptOption(option, event);
                return;
              }
            }
            // No-op accept: fall through to the grid. Enter must still not insert a
            // newline, but must keep propagating so the grid commits.
            if (event.key === 'Enter') {
              event.preventDefault();
            }
            return;
          }
          case 'Escape':
            // First Escape closes the list; a second (list closed) propagates to
            // the grid and cancels the edit.
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
            return;
          default:
            return;
        }
      }
      // Popup closed: keep the editor single-line. Enter must not insert a newline
      // but must propagate so the grid commits the edit.
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    },
    [acceptOption, activeIndex, hasList, open, options, suggestion],
  );

  const handleKeyUp = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Any key may have moved the caret.
      updateEditorSession();
      // A caret move without a value change can still change the suggestion
      // context.
      if (
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'Home' ||
        event.key === 'End'
      ) {
        refresh();
      }
    },
    [refresh, updateEditorSession],
  );

  // A click (or a drag-selection ending inside the editable) places the caret.
  const handleMouseUp = React.useCallback(() => updateEditorSession(), [updateEditorSession]);

  const handleBlur = React.useCallback(() => setOpen(false), []);

  // Clicking the surface's own chrome (border/padding, not the editable) must not
  // move DOM focus out of the editable — the caret would be lost mid-edit.
  const handleSurfaceMouseDown = React.useCallback((event: React.MouseEvent) => {
    if (editableRef.current && !editableRef.current.contains(event.target as Node)) {
      event.preventDefault();
    }
  }, []);

  const handleEditableRef = React.useCallback((node: HTMLDivElement | null) => {
    editableRef.current = node;
    setAnchorEl(node);
  }, []);

  return (
    <GridFormulaEditorSurface
      ref={surfaceRef}
      id={surfaceId}
      role="dialog"
      aria-label={colDef.headerName || field}
      className={GRID_FORMULA_EDITOR_SURFACE_CLASS}
      onMouseDown={handleSurfaceMouseDown}
      style={{
        // Pinned anchors get their inline start measured from the sticky cell in
        // the effect above (pre-paint); everything else is pure grid state.
        insetInlineStart: isPinnedColumn ? undefined : cellStart,
        ...surfaceBlockStyles,
        width: appliedWidth(),
        // The scroller-portaled surface no longer inherits the zero-size
        // virtual-focus row's `opacity: 0`, so it hides itself while the edited
        // row is out of the render window (opacity, not visibility, to preserve
        // focus — the GridEditLongTextCell precedent) and drops pointer events so
        // the invisible box cannot swallow clicks.
        opacity: surfaceHidden ? 0 : undefined,
        pointerEvents: surfaceHidden ? 'none' : undefined,
      }}
    >
      <GridFormulaEditorEditable
        ref={handleEditableRef}
        contentEditable
        suppressContentEditableWarning
        role={suggestionsEnabled ? 'combobox' : 'textbox'}
        aria-label={colDef.headerName || field}
        aria-multiline={false}
        aria-autocomplete={suggestionsEnabled ? 'list' : undefined}
        aria-haspopup={suggestionsEnabled ? 'listbox' : undefined}
        aria-expanded={suggestionsEnabled ? showPopup && hasList : undefined}
        aria-controls={showPopup && hasList ? `${popupId}-listbox` : undefined}
        aria-activedescendant={activeDescendant}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
        onPaste={handlePaste}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onBlur={handleBlur}
        /* No React children — managed imperatively by the rebuild effect. */
      />
      {suggestionsEnabled && (
        <GridFormulaEditorPopper
          as={rootProps.slots.basePopper}
          open={showPopup}
          target={anchorEl}
          placement="bottom-start"
          flip
        >
          <GridFormulaEditorPanel
            // Keep the editor focused when the panel is clicked, so clicking an
            // option does not blur the cell and commit the edit.
            onMouseDown={(event) => event.preventDefault()}
          >
            {signatureHelp !== null && (
              <GridFormulaEditorSignature>{signatureHelp.signature}</GridFormulaEditorSignature>
            )}
            {hasList && (
              <GridFormulaEditorList role="listbox" id={`${popupId}-listbox`}>
                {options.map((option, index) => (
                  <GridFormulaEditorOption
                    key={`${option.label}-${index}`}
                    id={`${popupId}-option-${index}`}
                    role="option"
                    data-focused={index === activeIndex}
                    aria-selected={index === activeIndex}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={(event) => acceptOption(option, event)}
                  >
                    <GridFormulaEditorOptionLabel>{option.label}</GridFormulaEditorOptionLabel>
                    {(option.detail || option.signature || option.category) && (
                      <GridFormulaEditorOptionDetail>
                        {option.detail || option.signature || option.category}
                      </GridFormulaEditorOptionDetail>
                    )}
                  </GridFormulaEditorOption>
                ))}
              </GridFormulaEditorList>
            )}
          </GridFormulaEditorPanel>
        </GridFormulaEditorPopper>
      )}
    </GridFormulaEditorSurface>
  );
}

export { GridFormulaEditor };
