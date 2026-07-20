'use client';
import * as React from 'react';
import type { CSSObject, Theme } from '@mui/material/styles';
import type { RefObject } from '@mui/x-internals/types';
import { gridEditCellStateSelector, useGridSelector } from '@mui/x-data-grid-pro';
import type { GridRowId } from '@mui/x-data-grid-pro';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  buildFormulaReferences,
  createFormulaCellKey,
  getFormulaExpression,
  isEscapedFormulaSource,
  isFormulaErrorValue,
  isFormulaSource,
  resolveFormulaRangeRectangle,
} from './engine';
import type {
  FormulaPositionContext,
  FormulaRawReference,
  FormulaReferenceNode,
  FormulaSourceSpan,
} from './engine';
import { gridFormulaA1PositionContextSelector } from './gridFormulaPositionContext';
import { gridFormulaActiveEditSelector } from './gridFormulaSelectors';

/**
 * A resolved highlight target. Identity-keyed: two references resolving to the
 * same target share a color. `unresolved` (`#REF!`, hidden column, filtered-out
 * row, self-reference) gets no color and no rectangle.
 */
export type FormulaReferenceTarget =
  | { kind: 'cell'; field: string; rowId: GridRowId }
  | {
      kind: 'range';
      startField: string;
      endField: string;
      startRowId: GridRowId;
      endRowId: GridRowId;
    }
  | { kind: 'wholeColumn'; field: string }
  | { kind: 'unresolved' };

export interface FormulaReference {
  /** Offsets into the EDITOR text (the shown dialect, including the leading `=`). */
  spans: FormulaSourceSpan[];
  target: FormulaReferenceTarget;
  /** Same target ⇒ same key ⇒ same color. `null` for unresolved references. */
  targetKey: string | null;
  /** Palette index, cycled over distinct targets in source order. `null` for unresolved. */
  colorIndex: number | null;
}

export interface FormulaReferenceModel {
  references: FormulaReference[];
  paletteSize: number;
}

/**
 * One run of editor text: a colored reference token (`colorIndex !== null`) or a
 * plain gap (`colorIndex === null`). Consumed by the editor to build its colored
 * `<span>`s and text nodes.
 */
export interface FormulaTextSegment {
  text: string;
  colorIndex: number | null;
}

/**
 * Shared reference palette: one hue per distinct target, cycled. Light/dark
 * variants keep ≥3:1 contrast against row backgrounds (the dashed rectangle's
 * color is the only thing tying it to its editor token). Both render halves read
 * this same constant, so a token's color and its rectangle's color can never
 * disagree. A typed override prop is a later addition.
 */
export const FORMULA_REFERENCE_PALETTE: readonly { light: string; dark: string }[] = [
  { light: '#1a73e8', dark: '#8ab4f8' }, // blue
  { light: '#188038', dark: '#81c995' }, // green
  { light: '#e8710a', dark: '#fcad70' }, // orange
  { light: '#9334e6', dark: '#d7aefb' }, // purple
  { light: '#d01884', dark: '#ff8bcb' }, // pink
  { light: '#00838f', dark: '#4dd0e1' }, // cyan
  { light: '#b06000', dark: '#fdd663' }, // amber
  { light: '#c5221f', dark: '#f28b82' }, // red
  { light: '#1565c0', dark: '#90caf9' }, // indigo
  { light: '#6a1b9a', dark: '#ce93d8' }, // violet
];

export const FORMULA_REFERENCE_PALETTE_SIZE = FORMULA_REFERENCE_PALETTE.length;

/**
 * The color for a reference, or `undefined` for an unresolved (`null`) index.
 */
export function getFormulaReferenceColor(
  colorIndex: number | null,
  mode: 'light' | 'dark',
): string | undefined {
  if (colorIndex === null) {
    return undefined;
  }
  return FORMULA_REFERENCE_PALETTE[colorIndex % FORMULA_REFERENCE_PALETTE_SIZE][mode];
}

const FORMULA_REFERENCE_COLOR_VAR_PREFIX = '--DataGrid-formulaRefColor-';

function paletteVars(variant: 'light' | 'dark'): Record<string, string> {
  const cssVars: Record<string, string> = {};
  for (let index = 0; index < FORMULA_REFERENCE_PALETTE_SIZE; index += 1) {
    cssVars[`${FORMULA_REFERENCE_COLOR_VAR_PREFIX}${index}`] =
      FORMULA_REFERENCE_PALETTE[index][variant];
  }
  return cssVars;
}

/**
 * The palette as CSS custom properties with a dark-mode variant (via the grid's
 * own `applyStyles('dark')`). Spread onto each render half's root so a shared
 * `colorIndex` maps to one hue without depending on the JS theme mode — and the
 * two halves can never disagree. Override the `--DataGrid-formulaRefColor-*`
 * variables in a theme to recolor.
 */
export function getFormulaReferencePaletteStyles(theme: Theme): CSSObject {
  return { ...paletteVars('light'), ...theme.applyStyles('dark', paletteVars('dark')) };
}

/**
 * The CSS `var(...)` for a resolved color index, cycled over the palette.
 */
export function getFormulaReferenceColorVar(colorIndex: number): string {
  return `var(${FORMULA_REFERENCE_COLOR_VAR_PREFIX}${colorIndex % FORMULA_REFERENCE_PALETTE_SIZE})`;
}

const UNRESOLVED: { target: FormulaReferenceTarget; targetKey: string | null } = {
  target: { kind: 'unresolved' },
  targetKey: null,
};

function resolveCellTarget(
  field: string,
  rowId: GridRowId,
  ownerCell: { id: GridRowId; field: string },
): { target: FormulaReferenceTarget; targetKey: string | null } {
  // Never outline the cell being edited (a self-reference is a cycle anyway).
  if (String(rowId) === String(ownerCell.id) && field === ownerCell.field) {
    return UNRESOLVED;
  }
  return {
    target: { kind: 'cell', field, rowId },
    targetKey: createFormulaCellKey(rowId, field),
  };
}

/**
 * Resolves one reference node to a concrete, currently-visible target. Anything
 * without a position in the current view (hidden column, filtered-out row,
 * out-of-bounds index) is `unresolved` — no color, no rectangle.
 */
function resolveFormulaReferenceTarget(
  node: FormulaReferenceNode,
  positionContext: FormulaPositionContext,
  ownerCell: { id: GridRowId; field: string },
): { target: FormulaReferenceTarget; targetKey: string | null } {
  switch (node.type) {
    case 'fieldRef': {
      if (positionContext.getPositionOfField(node.field) === undefined) {
        return UNRESOLVED;
      }
      return resolveCellTarget(node.field, ownerCell.id, ownerCell);
    }
    case 'cellRef': {
      let field: string | undefined;
      if (node.column.kind === 'field') {
        field = node.column.field;
        if (positionContext.getPositionOfField(field) === undefined) {
          return UNRESOLVED;
        }
      } else {
        field = positionContext.getFieldAtPosition(node.column.index);
        if (field === undefined) {
          return UNRESOLVED;
        }
      }
      let rowId: GridRowId | undefined;
      if (node.row.kind === 'id') {
        rowId = node.row.id;
        if (positionContext.getPositionOfRowId(rowId) === undefined) {
          return UNRESOLVED;
        }
      } else {
        rowId = positionContext.getRowIdAtPosition(node.row.index);
        if (rowId === undefined) {
          return UNRESOLVED;
        }
      }
      return resolveCellTarget(field, rowId, ownerCell);
    }
    case 'range': {
      const rectangle = resolveFormulaRangeRectangle(node, positionContext);
      if (isFormulaErrorValue(rectangle)) {
        return UNRESOLVED;
      }
      const startField = positionContext.getFieldAtPosition(rectangle.fromColumn);
      const endField = positionContext.getFieldAtPosition(rectangle.toColumn);
      const startRowId = positionContext.getRowIdAtPosition(rectangle.fromIndex);
      const endRowId = positionContext.getRowIdAtPosition(rectangle.toIndex);
      if (
        startField === undefined ||
        endField === undefined ||
        startRowId === undefined ||
        endRowId === undefined
      ) {
        return UNRESOLVED;
      }
      return {
        target: { kind: 'range', startField, endField, startRowId, endRowId },
        targetKey: `range ${createFormulaCellKey(startRowId, startField)} ${createFormulaCellKey(
          endRowId,
          endField,
        )}`,
      };
    }
    case 'columnValues': {
      if (positionContext.getPositionOfField(node.field) === undefined) {
        return UNRESOLVED;
      }
      return { target: { kind: 'wholeColumn', field: node.field }, targetKey: `col ${node.field}` };
    }
    default:
      return UNRESOLVED;
  }
}

const EMPTY_MODEL: FormulaReferenceModel = {
  references: [],
  paletteSize: FORMULA_REFERENCE_PALETTE_SIZE,
};

/**
 * Builds the shared reference model both render halves consume. Pure: it reads
 * only the edit value, the position context and the owner cell, so the editor
 * backdrop and the grid overlay derive identical colors. Spans are shifted into
 * editor coordinates (the leading `=` the expression was stripped of). Colors
 * cycle the palette over distinct resolved targets, in source order.
 */
export function buildFormulaReferenceModel(
  value: unknown,
  positionContext: FormulaPositionContext,
  ownerCell: { id: GridRowId; field: string },
  a1Notation: boolean,
): FormulaReferenceModel {
  if (!isFormulaSource(value) || isEscapedFormulaSource(value)) {
    return EMPTY_MODEL;
  }
  const expression = getFormulaExpression(value);
  let rawReferences: FormulaRawReference[];
  try {
    rawReferences = buildFormulaReferences(expression, { a1Notation, positionContext });
  } catch {
    // The producers never throw on valid input, but a half-typed canonical
    // formula must degrade to "no highlight", never crash the editor.
    return EMPTY_MODEL;
  }

  const references: FormulaReference[] = [];
  const keyToColor = new Map<string, number>();
  for (const rawReference of rawReferences) {
    const { target, targetKey } = resolveFormulaReferenceTarget(
      rawReference.node,
      positionContext,
      ownerCell,
    );
    let colorIndex: number | null = null;
    if (targetKey !== null) {
      const existing = keyToColor.get(targetKey);
      if (existing !== undefined) {
        colorIndex = existing;
      } else {
        colorIndex = keyToColor.size % FORMULA_REFERENCE_PALETTE_SIZE;
        keyToColor.set(targetKey, colorIndex);
      }
    }
    references.push({
      spans: rawReference.spans.map((span) => ({ start: span.start + 1, end: span.end + 1 })),
      target,
      targetKey,
      colorIndex,
    });
  }
  return { references, paletteSize: FORMULA_REFERENCE_PALETTE_SIZE };
}

// A stable dummy cell so the edit-state subscription has constant args when no
// cell is active (the selector simply returns `null` for it).
const NO_CELL = { rowId: '__formula_no_cell__', field: '__formula_no_cell__' };

/**
 * Rebuilds the shared reference model on every change of the highlighted text.
 * The text is resolved in order:
 *
 * 1. `valueOverride`, when provided — a controlled editor (the shared
 *    `GridFormulaEditable`) always colors exactly the text it displays.
 * 2. The active edit's `draft`, when `ownerCell` is the active-edit cell — text
 *    edited outside the cell edit state, e.g. typed into the formula bar while
 *    the cell stays in view mode.
 * 3. The cell's live edit-state value.
 *
 * The fallbacks read from grid *state*, not the editor component, so the grid
 * overlay keeps working when the editing cell is virtualized out. Returns the
 * empty model when no cell is given.
 */
export function useGridFormulaReferenceModel(
  apiRef: RefObject<GridPrivateApiPremium>,
  ownerCell: { id: GridRowId; field: string } | null,
  a1Notation: boolean,
  valueOverride?: unknown,
): FormulaReferenceModel {
  const editCellState = useGridSelector(
    apiRef,
    gridEditCellStateSelector,
    ownerCell ? { rowId: ownerCell.id, field: ownerCell.field } : NO_CELL,
  );
  const activeEdit = useGridSelector(apiRef, gridFormulaActiveEditSelector);
  const positionContext = useGridSelector(apiRef, gridFormulaA1PositionContextSelector);
  const ownerId = ownerCell?.id;
  const ownerField = ownerCell?.field;
  const draft =
    activeEdit !== null &&
    activeEdit.draft !== undefined &&
    activeEdit.id === ownerId &&
    activeEdit.field === ownerField
      ? activeEdit.draft
      : undefined;
  let value: unknown;
  if (valueOverride !== undefined) {
    value = valueOverride;
  } else if (draft !== undefined) {
    value = draft;
  } else {
    value = editCellState?.value;
  }

  return React.useMemo(() => {
    if (ownerId === undefined || ownerField === undefined) {
      return EMPTY_MODEL;
    }
    return buildFormulaReferenceModel(
      value,
      positionContext,
      { id: ownerId, field: ownerField },
      a1Notation,
    );
  }, [value, positionContext, ownerId, ownerField, a1Notation]);
}

/**
 * Splits the editor text into colored reference runs and plain gaps. References
 * are non-overlapping distinct tokens; an out-of-order or overlapping span is
 * skipped defensively so the segment text always reconstructs the value exactly.
 * Shared by the editor's imperative DOM rebuild (`renderSegments`).
 */
export function buildFormulaTextSegments(
  value: string,
  references: FormulaReference[],
): FormulaTextSegment[] {
  const colored = references
    .filter((reference) => reference.colorIndex !== null)
    .flatMap((reference) =>
      reference.spans.map((span) => ({
        start: span.start,
        end: span.end,
        colorIndex: reference.colorIndex,
      })),
    )
    .sort((a, b) => a.start - b.start);

  const segments: FormulaTextSegment[] = [];
  let cursor = 0;
  for (const span of colored) {
    if (span.start < cursor || span.end > value.length) {
      continue;
    }
    if (span.start > cursor) {
      segments.push({ text: value.slice(cursor, span.start), colorIndex: null });
    }
    segments.push({ text: value.slice(span.start, span.end), colorIndex: span.colorIndex });
    cursor = span.end;
  }
  if (cursor < value.length) {
    segments.push({ text: value.slice(cursor), colorIndex: null });
  }
  return segments;
}
