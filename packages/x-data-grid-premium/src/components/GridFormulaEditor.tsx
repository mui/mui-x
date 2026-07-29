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
import type { GridEventListener, GridRenderEditCellParams } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid/internals';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { getFormulaReferencePaletteStyles } from '../hooks/features/formula/gridFormulaReferenceHighlights';
import { formulaBarOwnsFocus } from '../hooks/features/formula/gridFormulaBarElements';
import { captureFormulaLiveResizeSession } from '../hooks/features/formula/gridFormulaLiveGeometry';
import type { GridFormulaLiveResizeSession } from '../hooks/features/formula/gridFormulaLiveGeometry';
import { GridFormulaEditable, valueToText } from './GridFormulaEditable';
import type { GridFormulaEditableHandle } from './GridFormulaEditable';

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
  // Centres the single line in the row box. Once the formula wraps, `applyWrapStyles`
  // switches this to `stretch` and moves the centring into the editable's block
  // padding, so the first line keeps the exact position it had here.
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
 * How many visual lines a wrapped formula may occupy before the editor stops
 * growing and scrolls internally. Five lines hold roughly 400–600 characters at
 * the widths the surface reaches, which covers any realistic formula, while the
 * box stays around two rows taller than the one it started from — past that an
 * editor stops reading as a cell and starts hiding the data it references.
 */
const FORMULA_EDITOR_MAX_WRAPPED_LINES = 5;

/** Fallback line height for environments without layout (jsdom). */
const FORMULA_EDITOR_FALLBACK_LINE_HEIGHT = 20;

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
 * The floating editing surface hosting the shared formula editable
 * (`GridFormulaEditable`: colored tokens, caret handling, IME/paste guards and
 * the autocomplete popup). This component owns everything cell-specific: the
 * surface's static geometry and grow-only width, the edit-state adapter (value
 * in, `setEditCellValue` out through the column's `valueParser`), and the
 * `editorSession` mirror that lets a virtualization remount resume the edit.
 *
 * The surface's width is a grow-only ratchet: it starts at the cell's width (or
 * the seeded formula's width), steps to the next column gridline whenever the
 * content overflows, and never shrinks during the edit — deletions leave the box
 * in place, so its edges never wobble. Growth is clamped at the viewport's visible
 * inline-end edge (measured once at open).
 *
 * At that clamp the editor switches to wrapping and the same ratchet takes over
 * the block axis: the formula wraps and the box grows by whole lines, up to
 * `FORMULA_EDITOR_MAX_WRAPPED_LINES` or the room the row has, whichever is
 * smaller (also measured once). The first line never moves — growth is strictly
 * away from it — and past the vertical bound the wrapped text scrolls internally,
 * with the caret kept in view. A row with no room below grows upward instead,
 * decided at the same single measurement point.
 */
function GridFormulaEditorFloating(props: GridFormulaEditorFloatingProps) {
  const { id, field, hasFocus, colDef, a1Notation, suggestionsEnabled, surfaceId, inScroller } =
    props;
  const apiRef = useGridPrivateApiContext();
  const isRtl = useRtl();

  const surfaceRef = React.useRef<HTMLDivElement | null>(null);
  const coreRef = React.useRef<GridFormulaEditableHandle | null>(null);
  // The ratcheted surface width (grow-only for the life of the edit) and the
  // measured growth bound. `null` until first measured/grown.
  const ratchetRef = React.useRef<number | null>(null);
  const clampRef = React.useRef<number | null>(null);
  // The block axis, engaged only once the width ratchet reaches its clamp and the
  // formula still does not fit on one line. `wrappedRef` is monotonic for the life
  // of the session; `flippedRef` (grow upward instead of downward) and
  // `heightClampRef` are decided at that same single moment; `heightRatchetRef` is
  // the grow-only height, `null` while the surface is still welded to the row box.
  const wrappedRef = React.useRef(false);
  const flippedRef = React.useRef(false);
  const heightRatchetRef = React.useRef<number | null>(null);
  const heightClampRef = React.useRef<number | null>(null);
  // The content-policy ceiling, kept separate from the available-space clamp so
  // increasing the grid height can never expand the editor beyond five lines.
  const heightMaxRef = React.useRef<number | null>(null);
  // The largest box the content ever asked for, before clamping. A grid resized
  // smaller pulls the box in (below), and this is what lets a grid resized larger
  // again put it back exactly where it was, without waiting for the next keystroke.
  const widthHighWaterRef = React.useRef<number | null>(null);
  const heightHighWaterRef = React.useRef<number | null>(null);
  // The viewport size the clamps above were last valid for.
  const clampBasisRef = React.useRef<{ width: number; height: number } | null>(null);

  const editState = useGridSelector(apiRef, gridEditCellStateSelector, { rowId: id, field });
  const text = valueToText(editState?.value);
  const ownerCell = React.useMemo(() => ({ id, field }), [id, field]);

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
  // The size of the box both growth bounds are bounds ON. It changes when the grid
  // is resized (and when a scrollbar or a pinned section appears), never when the
  // grid is scrolled — which is what makes it safe to follow: see the resize effect
  // below.
  const viewportWidth = dimensions.viewportInnerSize.width;
  const viewportHeight = dimensions.viewportInnerSize.height;
  const rowIndexInPage = apiRef.current.getRowIndexRelativeToVisibleRows(id) as number | undefined;
  const rowPosition = rowsMeta.positions[rowIndexInPage ?? 0] ?? 0;
  const nextRowPosition = rowsMeta.positions[(rowIndexInPage ?? 0) + 1];
  const rowTop = (dimensions.topContainerHeight ?? 0) + rowPosition;
  // The row box including the 1px border seam, i.e. the surface's height before it
  // ever wraps (and its permanent minimum).
  const rowBoxHeight =
    (nextRowPosition !== undefined ? nextRowPosition : rowsMeta.currentPageTotalHeight) -
    rowPosition +
    1;

  // The ratcheted height, floored at the row box. Reading the refs here mirrors
  // `appliedWidth`: the imperative growth below writes the same values to the DOM,
  // so a later re-render (a sort, a row-height change) re-derives an identical box
  // instead of resetting it.
  const appliedHeight = React.useCallback(
    () => Math.max(heightRatchetRef.current ?? 0, inScroller ? rowBoxHeight : 0),
    [inScroller, rowBoxHeight],
  );

  let surfaceBlockStyles: React.CSSProperties;
  if (inScroller) {
    const height = appliedHeight();
    // Flipped: the block-END is welded to the row, so the box extends upward as it
    // grows; unflipped (the normal case) the block-START is, and it extends down.
    // At one line the two are pixel-identical, which is what makes the choice safe
    // to make once and never revisit.
    surfaceBlockStyles = {
      top: flippedRef.current ? rowTop + rowBoxHeight - height : rowTop,
      height,
    };
  } else if (heightRatchetRef.current === null) {
    // Pinned rows: welded to the row box until the editor wraps.
    surfaceBlockStyles = { top: 0, bottom: 0 };
  } else {
    surfaceBlockStyles = flippedRef.current
      ? { bottom: 0, height: heightRatchetRef.current }
      : { top: 0, height: heightRatchetRef.current };
  }

  // Writes the block box imperatively, alongside the height ratchet, for the same
  // reason the width is written imperatively: it happens inside a layout effect,
  // pre-paint, so the growth and the text that caused it land in the same frame.
  const applyBlockGeometry = React.useCallback(
    (surface: HTMLDivElement) => {
      const height = appliedHeight();
      if (inScroller) {
        surface.style.height = `${height}px`;
        surface.style.top = `${flippedRef.current ? rowTop + rowBoxHeight - height : rowTop}px`;
        return;
      }
      surface.style.height = `${height}px`;
      if (flippedRef.current) {
        surface.style.top = 'auto';
        surface.style.bottom = '0px';
      } else {
        surface.style.bottom = 'auto';
      }
    },
    [appliedHeight, inScroller, rowBoxHeight, rowTop],
  );

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
    clampBasisRef.current = { width: viewportWidth, height: viewportHeight };
    return clampRef.current;
  }, [apiRef, field, id, isRtl, minWidth, viewportHeight, viewportWidth]);

  // Turns the single scrolling line into wrapped, multi-line text. Idempotent, and
  // deliberately free of any measurement that decides geometry — a remount replays
  // it to restore the session's look without re-deciding anything.
  // Returns the metrics measured BEFORE the switch: at one line the editable's
  // scroll height is exactly the line height, and the surface is exactly the row
  // box.
  const applyWrapStyles = React.useCallback((surface: HTMLDivElement, editable: HTMLDivElement) => {
    const lineHeight = editable.scrollHeight || FORMULA_EDITOR_FALLBACK_LINE_HEIGHT;
    const boxHeight = surface.offsetHeight;
    const chrome = boxHeight - surface.clientHeight;

    wrappedRef.current = true;
    // Stretch the editable over the whole surface and reproduce, as block padding,
    // the centring `align-items: center` gave it at one line. The first line then
    // stays exactly where it was — every new line extends the box away from it and
    // never nudges the text already on screen.
    surface.style.alignItems = 'stretch';
    editable.style.whiteSpace = 'pre-wrap';
    // Most formula text carries no spaces to break at, so wrapping has to be
    // allowed mid-token. Reference tokens restrict this to natural break
    // opportunities (see `GridFormulaEditable`).
    editable.style.overflowWrap = 'anywhere';
    // Vertical scrolling takes over past the bound. Horizontal stays reachable for
    // content with no natural break opportunity that is wider than the box.
    editable.style.overflowY = 'auto';
    editable.style.paddingBlock = `${Math.max(0, (boxHeight - chrome - lineHeight) / 2)}px`;

    return { boxHeight, lineHeight };
  }, []);

  // The block-axis counterpart of `ensureClamp`, and it runs at the same kind of
  // single, natural moment: the first time the formula needs a second line. Both
  // the growth direction and the bound are decided here and never revisited — the
  // surface lives in content space, so any later measurement is skewed by the
  // scroll position and could shrink the box, the wobble the ratchets forbid.
  const enterWrapMode = React.useCallback(
    (surface: HTMLDivElement, editable: HTMLDivElement) => {
      const { boxHeight, lineHeight } = applyWrapStyles(surface, editable);
      const maxWanted = boxHeight + (FORMULA_EDITOR_MAX_WRAPPED_LINES - 1) * lineHeight;
      heightMaxRef.current = maxWanted;

      const scroller = apiRef.current.virtualScrollerRef?.current;
      let available = maxWanted;
      if (scroller) {
        const dim = gridDimensionsSelector(apiRef);
        const scrollerRect = scroller.getBoundingClientRect();
        const surfaceRect = surface.getBoundingClientRect();
        const scrollbar = dim.hasScrollX ? dim.scrollbarSize : 0;
        // The sticky containers (z 40) cover the surface (z 30), so the band the
        // box may occupy stops at their inner edges.
        const below = scrollerRect.bottom - dim.bottomContainerHeight - scrollbar - surfaceRect.top;
        const above = surfaceRect.bottom - (scrollerRect.top + dim.topContainerHeight);
        // Grow upward only for a row that genuinely cannot gain a second line
        // below it — the last rows of the grid, where growing down would put the
        // text under the clipped edge of the scroller and show nothing.
        flippedRef.current = below < boxHeight + 2 * lineHeight && above > below;
        available = flippedRef.current ? above : below;
      }
      heightClampRef.current = Math.max(boxHeight, Math.floor(Math.min(maxWanted, available)));
      clampBasisRef.current = { width: viewportWidth, height: viewportHeight };
    },
    [apiRef, applyWrapStyles, viewportHeight, viewportWidth],
  );

  // Grow-only on the block axis, by whole lines, bounded by `heightClampRef`.
  const growHeightToFit = React.useCallback(
    (surface: HTMLDivElement, editable: HTMLDivElement) => {
      const chrome = surface.offsetHeight - surface.clientHeight;
      const wanted = editable.scrollHeight + chrome;
      heightHighWaterRef.current = Math.max(heightHighWaterRef.current ?? 0, wanted);
      const needed = Math.min(wanted, heightClampRef.current ?? 0);
      if (needed > appliedHeight()) {
        heightRatchetRef.current = needed;
        applyBlockGeometry(surface);
      }
    },
    [appliedHeight, applyBlockGeometry],
  );

  // Grow-only: widen the surface when the single-line content overflows the
  // editable, snapping the inline-end border to the next column gridline; once
  // there is no width left to take, wrap and grow by lines instead. Never shrinks
  // on either axis — deletions leave the box as is, so its edges never move
  // backwards. Runs from the editable's rebuild layout effect (the single funnel
  // all text changes flow through: typing, paste, suggestion accept, seeding),
  // pre-paint, so the growth and the new text land together.
  const growToFit = React.useCallback(
    (editable: HTMLDivElement) => {
      const surface = surfaceRef.current;
      if (!surface) {
        return;
      }
      if (!wrappedRef.current) {
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
          widthHighWaterRef.current = Math.max(widthHighWaterRef.current ?? 0, next);
          surface.style.width = `${next}px`;
        }
        // Re-measured against the width just applied (reading it back forces the
        // pending layout): still overflowing at the clamp means there is no
        // horizontal room left, so from here the formula wraps rather than
        // scrolling out of sight.
        if (appliedWidth() < clamp || editable.scrollWidth <= editable.clientWidth) {
          return;
        }
        enterWrapMode(surface, editable);
      }
      growHeightToFit(surface, editable);
    },
    [appliedWidth, enterWrapMode, ensureClamp, growHeightToFit, snapWidths],
  );

  // The edit-state adapter: run the column's value parser exactly like the plain
  // edit input — a formula source passes through (the formula wrapper protects
  // `=` strings), a plain value is parsed to its typed form (e.g. a number on a
  // number column) so the commit stores the right type. Writes are NOT debounced:
  // a debounced keystroke timer firing after an accepted-suggestion immediate
  // write would clobber it. Per-keystroke writes are negligible for one editing
  // cell.
  const handleValueChange = React.useCallback(
    (nextText: string, caret: number | null, event: React.SyntheticEvent) => {
      const column = apiRef.current.getColumn(field);
      const parsedValue = column.valueParser
        ? column.valueParser(nextText, apiRef.current.getRow(id), column, apiRef)
        : nextText;
      apiRef.current.setEditCellValue(
        { id, field, value: parsedValue, unstable_skipValueParser: true },
        event,
      );
    },
    [apiRef, field, id],
  );

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
      const core = coreRef.current;
      const root = core?.getRoot();
      if (!core || !root || root.ownerDocument.activeElement !== root) {
        return;
      }
      apiRef.current.caches.formula.editorSession = {
        id,
        field,
        engaged: core.isEngaged(),
        caret: caretOverride !== undefined ? caretOverride : core.getCaret(),
        surfaceWidth: ratchetRef.current,
        surfaceClamp: clampRef.current,
        surfaceWrapped: wrappedRef.current,
        surfaceHeight: heightRatchetRef.current,
        surfaceHeightClamp: heightClampRef.current,
        surfaceFlipped: flippedRef.current,
        surfaceWidthHighWater: widthHighWaterRef.current,
        surfaceHeightHighWater: heightHighWaterRef.current,
        surfaceClampBasis: clampBasisRef.current,
      };
    },
    [apiRef, field, id],
  );

  // Reproduces the grown box after a virtualization remount. Everything is
  // restored verbatim from the mirror — the values were already bounded by the
  // session's own clamps, and re-measuring at the current scroll position could
  // shrink the box mid-edit. `applyWrapStyles` is replayed rather than
  // `enterWrapMode`, so the direction and the bound are not decided a second time.
  const restoreSessionGeometry = React.useCallback(() => {
    const surface = surfaceRef.current;
    const editable = coreRef.current?.getRoot();
    const session = apiRef.current.caches.formula.editorSession;
    if (!surface || session === null || session.id !== id || session.field !== field) {
      return;
    }
    clampRef.current = session.surfaceClamp;
    widthHighWaterRef.current = session.surfaceWidthHighWater;
    heightHighWaterRef.current = session.surfaceHeightHighWater;
    // Restored, not reset to the current viewport: a resize that happened across
    // the remount then still registers as a delta on the next render.
    clampBasisRef.current = session.surfaceClampBasis;
    if (session.surfaceWidth !== null && session.surfaceWidth > appliedWidth()) {
      ratchetRef.current = session.surfaceWidth;
      surface.style.width = `${session.surfaceWidth}px`;
    }
    if (!session.surfaceWrapped || !editable) {
      return;
    }
    const { boxHeight, lineHeight } = applyWrapStyles(surface, editable);
    heightMaxRef.current = boxHeight + (FORMULA_EDITOR_MAX_WRAPPED_LINES - 1) * lineHeight;
    flippedRef.current = session.surfaceFlipped;
    heightClampRef.current = session.surfaceHeightClamp;
    heightRatchetRef.current = session.surfaceHeight;
    applyBlockGeometry(surface);
  }, [apiRef, appliedWidth, applyBlockGeometry, applyWrapStyles, field, id]);

  // Follow the grid when it is RESIZED. Both growth bounds are bounds on the
  // grid's visible box, so a grid that shrinks has to pull the box back in with
  // it: otherwise a grown editor stays wider than the grid it lives in, spills
  // past its edge, and inflates the scroller's scrollable width — the grid itself
  // looks like it got wider.
  //
  // What must NOT happen here is a re-measure. The surface sits in content space,
  // so measuring the available room again would fold in however far the user has
  // scrolled since the box was measured, and could move the bound for a reason
  // that has nothing to do with the resize — the shrink-wobble that had the
  // original re-clamp effect removed. So the bounds are shifted by the DELTA of
  // the viewport's own size instead, which no amount of scrolling changes (the
  // same technique the live column-resize sync uses for positions).
  //
  // Shrinking here is not a violation of the grow-only ratchets: those keep the
  // box from wobbling as the CONTENT changes. The container is a different matter
  // — and it is symmetric, so a grid widened back to its old size puts the box
  // back at the high-water mark it had reached, rather than leaving it cramped
  // until the next keystroke.
  useEnhancedEffect(() => {
    const basis = clampBasisRef.current;
    const surface = surfaceRef.current;
    if (basis === null || surface === null) {
      // Nothing measured yet: `ensureClamp` will read live values when it runs.
      return;
    }
    const widthDelta = viewportWidth - basis.width;
    const heightDelta = viewportHeight - basis.height;
    if (widthDelta === 0 && heightDelta === 0) {
      return;
    }
    clampBasisRef.current = { width: viewportWidth, height: viewportHeight };

    let widthChanged = false;
    if (clampRef.current !== null && widthDelta !== 0) {
      clampRef.current = Math.max(minWidth, clampRef.current + widthDelta);
      const target = Math.min(widthHighWaterRef.current ?? 0, clampRef.current);
      if (target >= minWidth && target !== ratchetRef.current) {
        ratchetRef.current = target;
        surface.style.width = `${target}px`;
        widthChanged = true;
      }
    }
    // Pinned rows sit in the sticky containers, whose block box does not follow
    // the viewport the way a scrolling row's does — leave their height alone.
    if (inScroller && heightClampRef.current !== null) {
      if (heightDelta !== 0) {
        heightClampRef.current = Math.max(
          rowBoxHeight,
          Math.min(
            heightMaxRef.current ?? Number.POSITIVE_INFINITY,
            heightClampRef.current + heightDelta,
          ),
        );
      }
      if (widthChanged) {
        // How many lines a formula needs is a function of how wide the box is, so
        // a box that just changed width re-derives its height from scratch instead
        // of holding the ratchet it reached at the old width — otherwise a grid
        // widened back to its old size would keep the extra lines it needed while
        // it was narrow. Collapsing it first is what makes the measurement in
        // `growToFit` below read the content's height rather than the box's own.
        heightRatchetRef.current = null;
        heightHighWaterRef.current = null;
        applyBlockGeometry(surface);
      } else if (heightDelta !== 0) {
        const target = Math.min(heightHighWaterRef.current ?? 0, heightClampRef.current);
        if (target >= rowBoxHeight && target !== heightRatchetRef.current) {
          heightRatchetRef.current = target;
          applyBlockGeometry(surface);
        }
      }
    }

    // The box changed shape, so the formula has to be re-fitted to it: a narrower
    // single line may now need to wrap, and a re-wrap may need more lines.
    const editable = coreRef.current?.getRoot();
    if (editable) {
      growToFit(editable);
    }
    updateEditorSession();
  }, [
    applyBlockGeometry,
    growToFit,
    inScroller,
    minWidth,
    rowBoxHeight,
    updateEditorSession,
    viewportHeight,
    viewportWidth,
  ]);

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
    coreRef.current?.closeSuggestions();
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

  // The editable's rebuild effect is a CHILD layout effect and can therefore run
  // before this component's own refs are attached (child effects run before the
  // parent's host refs) — on mount, a formula seeded before this render misses
  // its `onAfterRebuild` growth because `surfaceRef` is still null. Re-run the
  // growth once on mount, with the surface in place.
  useEnhancedEffect(() => {
    // Restore first: a remount must reproduce the session's box before any fresh
    // growth is measured against it. Both ratchets are grow-only, so the growth
    // that follows can only confirm the restored box, never change it.
    restoreSessionGeometry();
    const root = coreRef.current?.getRoot();
    if (root) {
      growToFit(root);
    }
    // Mount-only: later growth flows through `onAfterRebuild`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // True after the entry sequence below has run. The floating editor mounts
  // focused and unmounts when it loses focus, so entry is a strictly
  // once-per-mount affair — the guard keeps dependency churn (a column resize
  // changes `minWidth` and with it the callback identities below) from re-running
  // the session resume on a LIVE editor, which would collapse the user's
  // selection, snap the caret to the last-mirrored offset, and abort an in-flight
  // IME composition.
  const enteredRef = React.useRef(false);

  // Focus on entry and place the caret at the end (the editable's rebuild effect
  // handles the caret on a later source seed). Runs once per mount — at edit
  // start, but also whenever virtualization remounts the editing cell. Declared
  // AFTER the editable renders its content: the editable is a child component,
  // and child layout effects run before the parent's, so the seeded text is in
  // the DOM by the time the caret is placed.
  useEnhancedEffect(() => {
    const core = coreRef.current;
    const root = core?.getRoot();
    if (!core || !root || !hasFocus || enteredRef.current) {
      return;
    }
    enteredRef.current = true;
    // While the user types in the FORMULA BAR (which mirrors this edit), the
    // bar owns the DOM focus and the document selection — a virtualization
    // remount of the editing cell must not grab either back. The visual state
    // (session width below) is still restored.
    const barOwnsFocus = formulaBarOwnsFocus(apiRef, root.ownerDocument);
    if (!barOwnsFocus && root.ownerDocument.activeElement !== root) {
      // preventScroll: when the edited row leaves the render window mid-scroll,
      // the grid remounts it (as the zero-size virtual-focus row) and this
      // effect re-focuses the editable — the browser's default scroll-into-view
      // on focus() would then yank the viewport back to the edited cell on
      // every scroll tick. Same defense as GridEditLongTextCell.
      core.focus({ preventScroll: true });
    }
    const session = apiRef.current.caches.formula.editorSession;
    if (session !== null && session.id === id && session.field === field) {
      // The editing cell remounted mid-edit: resume the live session — restore
      // the engaged flag and put the caret back where it was, not at the end. The
      // mirror stays in place for any further remount. (The surface box itself was
      // already restored by `restoreSessionGeometry`, in the effect above.)
      core.setEngaged(session.engaged);
      if (!barOwnsFocus) {
        core.placeCaret(session.caret ?? null);
      }
      return;
    }
    // On entry (before the first edit), collapse any stray selection to the end —
    // a fresh edit starts with the caret at the end of the seeded formula, not a
    // select-all left over from the double-click/open gesture.
    if (!barOwnsFocus && !core.isEngaged()) {
      core.placeCaret(null);
    }
  }, [apiRef, field, hasFocus, id]);

  // Clicking the surface's own chrome (border/padding, not the editable) must not
  // move DOM focus out of the editable — the caret would be lost mid-edit.
  const handleSurfaceMouseDown = React.useCallback((event: React.MouseEvent) => {
    const editable = coreRef.current?.getRoot();
    if (editable && !editable.contains(event.target as Node)) {
      event.preventDefault();
    }
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
      <GridFormulaEditable
        ref={coreRef}
        value={text}
        ownerCell={ownerCell}
        a1Notation={a1Notation}
        suggestionsEnabled={suggestionsEnabled}
        popupDisabled={!hasFocus || surfaceHidden}
        popupId={`${id}-${field}-formula-autocomplete`}
        ariaLabel={colDef.headerName || field}
        onValueChange={handleValueChange}
        onAfterRebuild={growToFit}
        onInteraction={updateEditorSession}
      />
    </GridFormulaEditorSurface>
  );
}

export { GridFormulaEditor };
