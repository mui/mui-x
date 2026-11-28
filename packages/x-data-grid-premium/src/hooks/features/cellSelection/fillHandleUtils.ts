import type { RefObject } from '@mui/x-internals/types';
import {
  getVisibleRows,
  isElementInGrid,
  serializeCellValue,
} from '@mui/x-data-grid-pro/internals';
import { gridClasses, gridFocusCellSelector } from '@mui/x-data-grid-pro';
import type { GridCellCoordinates, GridRowId } from '@mui/x-data-grid-pro';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { CellValueUpdater } from '../clipboard/useGridClipboardImport';

// Shared by the mouse path of `useGridCellSelection` and the touch and pen path of `useGridFillHandlePointer`.

const FILL_HANDLE_HIT_AREA = 16; // px — size of the interactive hit area for the fill handle

export interface FillSourceState {
  cells: { id: GridRowId; field: string }[];
  fields: string[];
  rowIndexRange: { start: number; end: number };
  columnIndexRange: { start: number; end: number };
  rowIdMap: Map<string, GridRowId>;
}

export interface FillTargets {
  direction: 'vertical' | 'horizontal' | null;
  targetRowIds: GridRowId[];
  targetFields: string[];
}

export type FillProps = Pick<
  DataGridPremiumProcessedProps,
  | 'processRowUpdate'
  | 'onProcessRowUpdateError'
  | 'getRowId'
  | 'ignoreValueFormatterDuringExport'
  | 'clipboardCopyCellDelimiter'
>;

const FILL_PREVIEW_CLASSES = [
  gridClasses['cell--fillPreview'],
  gridClasses['cell--fillPreviewTop'],
  gridClasses['cell--fillPreviewBottom'],
  gridClasses['cell--fillPreviewLeft'],
  gridClasses['cell--fillPreviewRight'],
];

/**
 * `true` when the pointer is on the fill handle of the cell: the cell shows
 * the handle (`::after` pseudo-element) and the pointer is near its inline-end
 * bottom corner, within the hit area.
 * With `touchHitArea`, the hit area is a square of that size centered on the
 * corner, so it also covers the neighbor cells.
 */
export function isPointerOnFillHandle(
  cellElement: Element | null,
  event: { clientX: number; clientY: number },
  isRtl: boolean,
  touchHitArea?: number,
): boolean {
  if (!cellElement || !cellElement.classList.contains(gridClasses['cell--withFillHandle'])) {
    return false;
  }
  const rect = cellElement.getBoundingClientRect();
  if (touchHitArea !== undefined) {
    const cornerX = isRtl ? rect.left : rect.right;
    return (
      Math.abs(event.clientX - cornerX) <= touchHitArea / 2 &&
      Math.abs(event.clientY - rect.bottom) <= touchHitArea / 2
    );
  }
  return (
    (isRtl
      ? event.clientX <= rect.left + FILL_HANDLE_HIT_AREA
      : event.clientX >= rect.right - FILL_HANDLE_HIT_AREA) &&
    event.clientY >= rect.bottom - FILL_HANDLE_HIT_AREA &&
    event.clientY >= rect.top // Ensure the pointer is within the cell bounds
  );
}

export function getSelectedOrFocusedCells(
  apiRef: RefObject<GridPrivateApiPremium>,
): GridCellCoordinates[] {
  let selectedCells = apiRef.current.getSelectedCellsAsArray();
  if (selectedCells.length === 0) {
    const focusedCell = gridFocusCellSelector(apiRef);
    if (focusedCell) {
      selectedCells = [{ id: focusedCell.id, field: focusedCell.field }];
    }
  }
  return selectedCells;
}

export function serializeCellForClipboard(
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<FillProps, 'ignoreValueFormatterDuringExport' | 'clipboardCopyCellDelimiter'>,
  id: GridRowId,
  field: string,
): string {
  const ignoreValueFormatterProp = props.ignoreValueFormatterDuringExport;
  const ignoreValueFormatter =
    (typeof ignoreValueFormatterProp === 'object'
      ? ignoreValueFormatterProp?.clipboardExport
      : ignoreValueFormatterProp) || false;
  const cellParams = apiRef.current.getCellParams(id, field);

  return serializeCellValue(cellParams, {
    csvOptions: {
      delimiter: props.clipboardCopyCellDelimiter,
      shouldAppendQuotes: false,
      escapeFormulas: false,
    },
    ignoreValueFormatter,
  });
}

/**
 * Returns the source of a fill: the selected cells, or the focused cell when nothing is selected.
 * @param {RefObject<GridPrivateApiPremium>} apiRef The grid API.
 * @returns {FillSourceState | null} The source, or `null` when there's no cell to fill from.
 */
export function createFillSource(apiRef: RefObject<GridPrivateApiPremium>): FillSourceState | null {
  const selectedCells = getSelectedOrFocusedCells(apiRef);
  if (selectedCells.length === 0) {
    return null;
  }

  // Compute all source fields in visible column order
  const visibleColumns = apiRef.current.getVisibleColumns();
  const columnFieldToIndex = new Map(visibleColumns.map((col, i) => [col.field, i]));
  const sourceFields = [...new Set(selectedCells.map((c) => c.field))];
  sourceFields.sort((a, b) => (columnFieldToIndex.get(a) ?? 0) - (columnFieldToIndex.get(b) ?? 0));

  // Pre-compute source column index range
  const sourceColIndices = sourceFields.map((f) => columnFieldToIndex.get(f) ?? 0);

  // Pre-compute source row range (doesn't change during drag)
  const sourceRowIds = [...new Set(selectedCells.map((c) => c.id))];
  const sourceRowIndices = sourceRowIds.map((id) =>
    apiRef.current.getRowIndexRelativeToVisibleRows(id),
  );

  // Build row ID lookup map for O(1) resolution during the drag
  const visibleRows = getVisibleRows(apiRef);
  const idMap = new Map<string, GridRowId>();
  for (const row of visibleRows.rows) {
    idMap.set(String(row.id), row.id);
  }

  return {
    cells: selectedCells,
    fields: sourceFields,
    columnIndexRange: {
      start: Math.min(...sourceColIndices),
      end: Math.max(...sourceColIndices),
    },
    rowIndexRange: {
      start: Math.min(...sourceRowIndices),
      end: Math.max(...sourceRowIndices),
    },
    rowIdMap: idMap,
  };
}

/**
 * Returns the cell under the pointer: the first element that is in a cell of a row, with the id of a visible row.
 * @param {Iterable<Element>} elements The elements under the pointer, topmost first.
 * @param {Map<string, GridRowId>} rowIdMap The row ids of the visible rows, by their `data-id`.
 * @returns {GridCellCoordinates | null} The cell under the pointer, or `null`.
 */
export function getFillTargetCell(
  elements: Iterable<Element>,
  rowIdMap: Map<string, GridRowId>,
): GridCellCoordinates | null {
  let targetRowId: GridRowId | null = null;
  let targetField: string | null = null;

  for (const el of elements) {
    const cellEl = (el as HTMLElement).closest('[data-field]');
    if (cellEl) {
      targetField = cellEl.getAttribute('data-field');
      const rowEl = cellEl.closest('[data-id]');
      if (rowEl) {
        const idStr = rowEl.getAttribute('data-id');
        if (idStr != null) {
          // O(1) lookup via pre-built map
          const resolved = rowIdMap.get(idStr);
          if (resolved != null) {
            targetRowId = resolved;
          }
        }
        break;
      }
    }
  }

  if (targetRowId == null || targetField == null) {
    return null;
  }
  return { id: targetRowId, field: targetField };
}

/**
 * Returns the cells a fill to the target cell writes to.
 * The fill is vertical when the target is outside of the source rows, horizontal when it's only
 * outside of the source columns, and empty inside the source.
 */
export function getFillTargets(
  apiRef: RefObject<GridPrivateApiPremium>,
  source: FillSourceState,
  targetCell: GridCellCoordinates,
): FillTargets {
  const { start: minSourceRowIdx, end: maxSourceRowIdx } = source.rowIndexRange;
  const { start: minSourceColIdx, end: maxSourceColIdx } = source.columnIndexRange;
  const currentVisibleRows = getVisibleRows(apiRef);
  const currentVisibleColumns = apiRef.current.getVisibleColumns();
  const targetRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(targetCell.id);
  const targetColIndex = apiRef.current.getColumnIndex(targetCell.field);

  const isOutsideRowRange = targetRowIndex > maxSourceRowIdx || targetRowIndex < minSourceRowIdx;
  const isOutsideColRange = targetColIndex > maxSourceColIdx || targetColIndex < minSourceColIdx;

  // Determine fill direction and target cells
  let direction: FillTargets['direction'];
  const newTargetRowIds: GridRowId[] = [];
  let newTargetFields: string[] = [];

  if (isOutsideRowRange) {
    // Vertical fill: extend rows, keep all source columns
    direction = 'vertical';
    newTargetFields = source.fields;

    if (targetRowIndex > maxSourceRowIdx) {
      // Filling down
      for (let i = maxSourceRowIdx + 1; i <= targetRowIndex; i += 1) {
        if (i < currentVisibleRows.rows.length) {
          newTargetRowIds.push(currentVisibleRows.rows[i].id);
        }
      }
    } else {
      // Filling up
      for (let i = targetRowIndex; i < minSourceRowIdx; i += 1) {
        if (i >= 0) {
          newTargetRowIds.push(currentVisibleRows.rows[i].id);
        }
      }
    }
  } else if (isOutsideColRange) {
    // Horizontal fill: extend columns, keep source rows
    direction = 'horizontal';

    const sourceRowIdSet = new Set(source.cells.map((c) => String(c.id)));
    for (let i = minSourceRowIdx; i <= maxSourceRowIdx; i += 1) {
      if (i < currentVisibleRows.rows.length) {
        const rowId = currentVisibleRows.rows[i].id;
        if (sourceRowIdSet.has(String(rowId))) {
          newTargetRowIds.push(rowId);
        }
      }
    }

    if (targetColIndex > maxSourceColIdx) {
      // Filling right
      for (let i = maxSourceColIdx + 1; i <= targetColIndex; i += 1) {
        if (i < currentVisibleColumns.length) {
          newTargetFields.push(currentVisibleColumns[i].field);
        }
      }
    } else {
      // Filling left
      for (let i = targetColIndex; i < minSourceColIdx; i += 1) {
        if (i >= 0) {
          newTargetFields.push(currentVisibleColumns[i].field);
        }
      }
    }
  } else {
    // Pointer is within source range — no fill
    direction = null;
  }

  return { direction, targetRowIds: newTargetRowIds, targetFields: newTargetFields };
}

/**
 * Adds the fill preview classes to the rendered target cells, with no React render.
 * @param {HTMLElement} root The grid root element.
 * @param {FillTargets} targets The cells to preview.
 * @param {Set<Element>} decoratedElements The cells decorated by the previous call.
 * @returns {Set<Element>} The cells decorated by this call, to pass to the next one.
 */
export function decorateFillPreview(
  root: HTMLElement,
  targets: FillTargets,
  decoratedElements: Set<Element>,
): Set<Element> {
  const { targetRowIds, targetFields } = targets;
  const nextDecorated = new Set<Element>();
  if (targetRowIds.length === 0 || targetFields.length === 0) {
    clearFillPreview(decoratedElements);
    return nextDecorated;
  }

  // The touch drag calls this on every frame: one query of the rendered rows keeps the cost
  // to what is rendered, instead of one query per target cell, which grows with the fill.
  const renderedRows = new Map<string, Element>();
  for (const rowEl of root.querySelectorAll(`.${gridClasses.row}[data-id]`)) {
    const rowKey = rowEl.getAttribute('data-id')!;
    // The rows of a nested grid, for example in a detail panel, can have the same ids
    if (!renderedRows.has(rowKey) && isElementInGrid(root, rowEl)) {
      renderedRows.set(rowKey, rowEl);
    }
  }

  targetRowIds.forEach((rowId, rowIdx) => {
    const rowEl = renderedRows.get(String(rowId));
    if (!rowEl) {
      return;
    }
    const cellsByField = new Map<string, Element>();
    for (const cellEl of rowEl.querySelectorAll(`.${gridClasses.cell}[data-field]`)) {
      const cellField = cellEl.getAttribute('data-field')!;
      if (!cellsByField.has(cellField)) {
        cellsByField.set(cellField, cellEl);
      }
    }
    targetFields.forEach((field, colIdx) => {
      const cellEl = cellsByField.get(field);
      if (cellEl) {
        nextDecorated.add(cellEl);
        cellEl.classList.add(gridClasses['cell--fillPreview']);
        if (rowIdx === 0) {
          cellEl.classList.add(gridClasses['cell--fillPreviewTop']);
        }
        if (rowIdx === targetRowIds.length - 1) {
          cellEl.classList.add(gridClasses['cell--fillPreviewBottom']);
        }
        if (colIdx === 0) {
          cellEl.classList.add(gridClasses['cell--fillPreviewLeft']);
        }
        if (colIdx === targetFields.length - 1) {
          cellEl.classList.add(gridClasses['cell--fillPreviewRight']);
        }
      }
    });
  });

  // Remove classes only from elements no longer in the target set
  for (const el of decoratedElements) {
    if (!nextDecorated.has(el)) {
      el.classList.remove(...FILL_PREVIEW_CLASSES);
    }
  }
  return nextDecorated;
}

export function clearFillPreview(decoratedElements: Set<Element>) {
  for (const el of decoratedElements) {
    el.classList.remove(...FILL_PREVIEW_CLASSES);
  }
  decoratedElements.clear();
}

type SerializeCell = (id: GridRowId, field: string) => string;

// Source values for a specific field from stored source cells
function getSourceValuesForField(
  source: FillSourceState,
  field: string,
  serializeCell: SerializeCell,
): string[] {
  const sourceValues: string[] = [];
  for (const cell of source.cells) {
    if (cell.field === field) {
      sourceValues.push(serializeCell(cell.id, cell.field));
    }
  }
  return sourceValues;
}

// The source cells for a field, in the same order as getSourceValuesForField — so
// sourceCells[i] is the origin of sourceValues[i] when adjusting a dragged formula's
// references for its target cell.
function getSourceCellsForField(
  source: FillSourceState,
  field: string,
): { id: GridRowId; field: string }[] {
  const sourceCells: { id: GridRowId; field: string }[] = [];
  for (const cell of source.cells) {
    if (cell.field === field) {
      sourceCells.push({ id: cell.id, field: cell.field });
    }
  }
  return sourceCells;
}

function getFillSourceData(
  apiRef: RefObject<GridPrivateApiPremium>,
  source: FillSourceState,
  serializeCell: SerializeCell,
): string[][] {
  const selectedCells = source.cells;
  if (selectedCells.length === 0) {
    return [];
  }

  const visibleRows = getVisibleRows(apiRef).rows;
  const visibleColumns = apiRef.current.getVisibleColumns();
  const rowIndexLookup = new Map(visibleRows.map((row, index) => [String(row.id), index]));
  const columnIndexLookup = new Map(visibleColumns.map((column, index) => [column.field, index]));
  const orderedRowIds = [...new Set(selectedCells.map((cell) => cell.id))].sort(
    (a, b) => (rowIndexLookup.get(String(a)) ?? 0) - (rowIndexLookup.get(String(b)) ?? 0),
  );
  const orderedFields = [...new Set(selectedCells.map((cell) => cell.field))].sort(
    (a, b) => (columnIndexLookup.get(a) ?? 0) - (columnIndexLookup.get(b) ?? 0),
  );
  const valueLookup = new Map<string, Map<string, string>>();

  selectedCells.forEach((cell) => {
    const rowKey = String(cell.id);
    let rowValues = valueLookup.get(rowKey);
    if (!rowValues) {
      rowValues = new Map<string, string>();
      valueLookup.set(rowKey, rowValues);
    }
    rowValues.set(cell.field, serializeCell(cell.id, cell.field));
  });

  return orderedRowIds.map((rowId) => {
    const rowValues = valueLookup.get(String(rowId));
    return orderedFields.map((field) => rowValues?.get(field) ?? '');
  });
}

/**
 * Writes the source values to the target cells, like a paste, and adds the targets to the selection.
 */
export function applyFill(
  apiRef: RefObject<GridPrivateApiPremium>,
  source: FillSourceState,
  targets: FillTargets,
  props: FillProps,
) {
  const { targetRowIds, targetFields, direction } = targets;

  if (targetRowIds.length === 0 || targetFields.length === 0 || !direction) {
    return;
  }

  const serializeCell: SerializeCell = (id, field) =>
    serializeCellForClipboard(apiRef, props, id, field);

  apiRef.current.publishEvent('clipboardPasteStart', {
    data: getFillSourceData(apiRef, source, serializeCell),
  });

  const cellUpdater = new CellValueUpdater({
    apiRef,
    processRowUpdate: props.processRowUpdate,
    onProcessRowUpdateError: props.onProcessRowUpdateError,
    getRowId: props.getRowId,
  });

  if (direction === 'vertical') {
    // Each source column fills its own target rows independently
    for (const field of targetFields) {
      const sourceValues = getSourceValuesForField(source, field, serializeCell);
      if (sourceValues.length === 0) {
        continue;
      }
      const sourceCells = getSourceCellsForField(source, field);
      targetRowIds.forEach((rowId, i) => {
        const sourceCell = sourceCells[i % sourceCells.length];
        // A dragged formula is copied with its references adjusted for the
        // target cell; otherwise (plain cell, or non-formula target column)
        // the source's evaluated value is copied as before.
        const filledFormula = apiRef.current.getFilledFormulaSource?.(sourceCell, {
          id: rowId,
          field,
        });
        const pastedCellValue = filledFormula ?? sourceValues[i % sourceValues.length];
        cellUpdater.updateCell({ rowId, field, pastedCellValue });
      });
    }
  } else if (direction === 'horizontal') {
    // Map source columns to target columns by position offset
    const sourceFields = source.fields;
    targetFields.forEach((targetField, colOffset) => {
      const sourceField = sourceFields[colOffset % sourceFields.length];
      if (!sourceField) {
        return;
      }
      const sourceValues = getSourceValuesForField(source, sourceField, serializeCell);
      if (sourceValues.length === 0) {
        return;
      }
      const sourceCells = getSourceCellsForField(source, sourceField);
      targetRowIds.forEach((rowId, rowIdx) => {
        const sourceCell = sourceCells[rowIdx % sourceCells.length];
        const filledFormula = apiRef.current.getFilledFormulaSource?.(sourceCell, {
          id: rowId,
          field: targetField,
        });
        const pastedCellValue = filledFormula ?? sourceValues[rowIdx % sourceValues.length];
        cellUpdater.updateCell({ rowId, field: targetField, pastedCellValue });
      });
    });
  }

  cellUpdater.applyUpdates();

  // Extend cell selection to include filled cells
  const currentModel = apiRef.current.getCellSelectionModel();
  const newModel = { ...currentModel };
  targetRowIds.forEach((rowId) => {
    if (!newModel[rowId]) {
      newModel[rowId] = {};
    }
    targetFields.forEach((field) => {
      newModel[rowId][field] = true;
    });
  });
  apiRef.current.setCellSelectionModel(newModel);
}
