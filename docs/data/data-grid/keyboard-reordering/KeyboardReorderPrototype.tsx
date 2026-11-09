import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import {
  DataGridPremium,
  GRID_CHECKBOX_SELECTION_FIELD,
  GRID_REORDER_COL_DEF,
  gridClasses,
  gridExpandedSortedRowIdsSelector,
  gridRowSelectionIdsSelector,
  gridSortModelSelector,
  gridVisibleColumnFieldsSelector,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import type {
  GridCellSelectionModel,
  GridEventListener,
  GridRowId,
  GridRowSelectionModel,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

// Prototype of keyboard reordering, with one mode per solution under review. Built on the public
// API only, so the interaction can be explored before it moves into the packages.

export type KeyboardReorderSolution =
  'highlight' | 'selection' | 'selectionWithColumnHighlight';

export interface KeyboardReorderPrototypeProps {
  /**
   * What Alt+Arrow acts on.
   * - `highlight`: a highlight that coexists with selection. The arrow keys at the edge of the row or
   *   column turn it on, Alt+Shift+Arrow extends it, Esc clears it.
   * - `selection`: rows and columns are selected, and Alt+Arrow selects and moves from any cell.
   *   Without selection enabled, the row or column is highlighted instead, and Shift+Arrow extends it.
   * - `selectionWithColumnHighlight`: same as `selection` for rows. Columns are always highlighted.
   */
  solution: KeyboardReorderSolution;
}

type Axis = 'row' | 'column';

type Highlight =
  | { axis: 'row'; anchor: GridRowId; ids: GridRowId[] }
  | { axis: 'column'; anchor: string; ids: string[] }
  | null;

interface Flash {
  axis: Axis;
  ids: (GridRowId | string)[];
}

const HANDLE_FIELD = GRID_REORDER_COL_DEF.field;
const SPECIAL_FIELDS = [HANDLE_FIELD, GRID_CHECKBOX_SELECTION_FIELD];
const FLASH_DURATION = 1500;

const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

function hasModifier(event: {
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}) {
  return event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
}

function sliceBetween<T>(ordered: T[], a: T, b: T): T[] {
  const start = ordered.indexOf(a);
  const end = ordered.indexOf(b);
  if (start < 0 || end < 0) {
    return [a];
  }
  return ordered.slice(Math.min(start, end), Math.max(start, end) + 1);
}

function isContiguous(indexes: number[]) {
  return indexes.every((index, i) => i === 0 || index === indexes[i - 1] + 1);
}

function isInteractiveTarget(target: EventTarget | null) {
  return (
    (target as Element | null)?.closest?.('button, a, input, select, textarea') !=
    null
  );
}

function rowSelector(id: GridRowId) {
  return `.${gridClasses.row}[data-id="${id}"]`;
}

export default function KeyboardReorderPrototype(
  props: KeyboardReorderPrototypeProps,
) {
  const { solution } = props;
  const apiRef = useGridApiRef();
  const theme = useTheme();
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 30,
    maxColumns: 8,
  });

  const [rowSelection, setRowSelection] = React.useState(true);
  const [checkboxSelection, setCheckboxSelection] = React.useState(true);
  const [cellSelection, setCellSelection] = React.useState(false);

  const usesEdgeArrows = solution === 'highlight';
  const hasSelection = rowSelection || cellSelection;
  const rowsUseSelection = solution !== 'highlight' && hasSelection;
  const columnsUseSelection = solution === 'selection' && hasSelection;
  const rowsUseHighlight =
    solution === 'highlight' || (solution === 'selection' && !hasSelection);
  const columnsUseHighlight = solution !== 'selection' || !hasSelection;
  const rowsAreCellRanges = rowsUseSelection && cellSelection && !rowSelection;
  // The fallback highlight stands in for selection, so it uses the keys that extend a selection
  const extendsHighlightWithShift = solution === 'selection' && !hasSelection;
  const highlightEnabled = rowsUseHighlight || columnsUseHighlight;
  // The fallback of the `selection` solution never sits next to a selection, so an outline is enough
  const highlightVariant = solution === 'selection' ? 'outline' : 'muted';

  const [highlight, setHighlight] = React.useState<Highlight>(null);
  const highlightRef = React.useRef<Highlight>(null);
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>([]);
  const selectedColumnsRef = React.useRef<string[]>([]);
  // Set by the extend handlers: the focus change they trigger must extend, not replace
  const skipNextFocusRef = React.useRef(false);
  const movingRef = React.useRef(false);
  const [announcement, setAnnouncement] = React.useState({ key: 0, text: '' });
  // Temporary mark on what just moved, for moves that leave nothing selected or highlighted
  const [flash, setFlash] = React.useState<Flash | null>(null);
  const flashTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const updateHighlight = React.useCallback((next: Highlight) => {
    highlightRef.current = next;
    setHighlight(next);
  }, []);

  const updateSelectedColumns = React.useCallback((next: string[]) => {
    selectedColumnsRef.current = next;
    setSelectedColumns(next);
  }, []);

  // A highlight or a column selection can't outlive the configuration that allows it
  React.useEffect(() => {
    if (!highlightEnabled && highlightRef.current) {
      updateHighlight(null);
    }
    if (!columnsUseSelection && selectedColumnsRef.current.length > 0) {
      updateSelectedColumns([]);
    }
  }, [
    columnsUseSelection,
    highlightEnabled,
    updateHighlight,
    updateSelectedColumns,
  ]);

  const announce = React.useCallback((text: string) => {
    setAnnouncement((prev) => ({ key: prev.key + 1, text }));
  }, []);

  const getRowLabel = React.useCallback(
    (id: GridRowId) => {
      const row = apiRef.current?.getRow(id);
      return String(row?.commodity ?? id);
    },
    [apiRef],
  );

  const getColumnLabel = React.useCallback(
    (field: string) => apiRef.current?.getColumn(field)?.headerName ?? field,
    [apiRef],
  );

  // --- Selection as the row and column level object ------------------------------------------------

  const getDataFields = React.useCallback(
    () =>
      gridVisibleColumnFieldsSelector(apiRef).filter(
        (field) => !SPECIAL_FIELDS.includes(field),
      ),
    [apiRef],
  );

  // Rows whose data cells are all selected: the "selected rows" of the cell selection
  const getFullySelectedRowsFromCells = React.useCallback((): GridRowId[] => {
    const api = apiRef.current;
    if (!api || !rowsAreCellRanges) {
      return [];
    }
    const model = api.getCellSelectionModel();
    const fields = getDataFields();
    return gridExpandedSortedRowIdsSelector(apiRef).filter((id) =>
      fields.every((field) => model[id]?.[field]),
    );
  }, [apiRef, rowsAreCellRanges, getDataFields]);

  const getSelectedRowIds = React.useCallback((): Set<GridRowId> => {
    if (rowSelection) {
      return new Set(gridRowSelectionIdsSelector(apiRef).keys());
    }
    return new Set(getFullySelectedRowsFromCells());
  }, [apiRef, getFullySelectedRowsFromCells, rowSelection]);

  // Selecting columns replaces the selected rows and cells, like selecting a column in a spreadsheet
  const selectColumns = React.useCallback(
    (fields: string[]) => {
      const api = apiRef.current;
      if (!api || fields.length === 0) {
        return;
      }
      if (rowSelection) {
        api.setRowSelectionModel({ type: 'include', ids: new Set() });
      }
      if (cellSelection) {
        api.setCellSelectionModel({});
      }
      const dataFields = getDataFields();
      const ordered = [...fields].sort(
        (a, b) => dataFields.indexOf(a) - dataFields.indexOf(b),
      );
      updateSelectedColumns(ordered);
      if (ordered.length === 1) {
        announce(
          `Column ${getColumnLabel(ordered[0])} selected, ${
            dataFields.indexOf(ordered[0]) + 1
          } of ${dataFields.length}. Shift plus Left and Right extend, Alt plus Left and Right move.`,
        );
      } else {
        announce(`${ordered.length} columns selected.`);
      }
    },
    [
      apiRef,
      announce,
      cellSelection,
      getColumnLabel,
      getDataFields,
      rowSelection,
      updateSelectedColumns,
    ],
  );

  const selectRowsAsCells = React.useCallback(
    (ids: GridRowId[]) => {
      const api = apiRef.current;
      const fields = getDataFields();
      if (!api || ids.length === 0 || fields.length === 0) {
        return;
      }
      const rows = gridExpandedSortedRowIdsSelector(apiRef);
      const ordered = [...ids].sort((a, b) => rows.indexOf(a) - rows.indexOf(b));
      api.selectCellRange(
        { id: ordered[0], field: fields[0] },
        { id: ordered[ordered.length - 1], field: fields[fields.length - 1] },
      );
      if (ordered.length === 1) {
        announce(
          `Row ${getRowLabel(ordered[0])} selected, ${rows.indexOf(ordered[0]) + 1} of ${
            rows.length
          }. Shift plus Up and Down extend, Alt plus Up and Down move.`,
        );
      } else {
        announce(`${ordered.length} rows selected.`);
      }
    },
    [apiRef, announce, getDataFields, getRowLabel],
  );

  // Selecting rows or cells replaces the selected columns
  const handleRowSelectionChange = React.useCallback(
    (model: GridRowSelectionModel) => {
      if (model.type === 'exclude' || model.ids.size > 0) {
        updateSelectedColumns([]);
      }
    },
    [updateSelectedColumns],
  );

  const handleCellSelectionChange = React.useCallback(
    (model: GridCellSelectionModel) => {
      if (Object.keys(model).length > 0) {
        updateSelectedColumns([]);
      }
    },
    [updateSelectedColumns],
  );

  // --- Highlight -----------------------------------------------------------------------------------

  const flashMoved = React.useCallback(
    (axis: Axis, ids: (GridRowId | string)[]) => {
      const current = highlightRef.current;
      if (
        current &&
        current.axis === axis &&
        ids.every((id) => current.ids.includes(id as never))
      ) {
        return;
      }
      if (axis === 'row') {
        const selected = getSelectedRowIds();
        if (ids.every((id) => selected.has(id as GridRowId))) {
          return;
        }
      } else if (
        ids.every((id) => selectedColumnsRef.current.includes(id as string))
      ) {
        return;
      }
      clearTimeout(flashTimeoutRef.current);
      setFlash({ axis, ids });
      flashTimeoutRef.current = setTimeout(() => setFlash(null), FLASH_DURATION);
    },
    [getSelectedRowIds],
  );

  React.useEffect(() => () => clearTimeout(flashTimeoutRef.current), []);

  const clearHighlight = React.useCallback(() => {
    updateHighlight(null);
    announce('Highlight cleared.');
  }, [announce, updateHighlight]);

  const clearSelectedColumns = React.useCallback(() => {
    updateSelectedColumns([]);
    announce('Column selection cleared.');
  }, [announce, updateSelectedColumns]);

  const highlightRow = React.useCallback(
    (id: GridRowId) => {
      const visible = gridExpandedSortedRowIdsSelector(apiRef);
      updateHighlight({ axis: 'row', anchor: id, ids: [id] });
      announce(
        `Row ${getRowLabel(id)} highlighted, ${visible.indexOf(id) + 1} of ${visible.length}. Alt plus Shift plus Up and Down extend, Alt plus Up and Down move, Arrow Right or Escape clears.`,
      );
    },
    [apiRef, announce, getRowLabel, updateHighlight],
  );

  const highlightColumn = React.useCallback(
    (field: string) => {
      const visible = gridVisibleColumnFieldsSelector(apiRef);
      updateHighlight({ axis: 'column', anchor: field, ids: [field] });
      announce(
        `Column ${getColumnLabel(field)} highlighted, ${visible.indexOf(field) + 1} of ${
          visible.length
        }. Alt plus Shift plus Left and Right extend, Alt plus Left and Right move, Arrow Down or Escape clears.`,
      );
    },
    [apiRef, announce, getColumnLabel, updateHighlight],
  );

  // Returns the row that receives the focus, or `null` when the highlight didn't change.
  // Only the `highlight` solution needs a highlight to exist first; the others start one here.
  const extendRowHighlight = React.useCallback(
    (id: GridRowId, key: string): GridRowId | null => {
      const current = highlightRef.current;
      if (current?.axis !== 'row' && usesEdgeArrows) {
        announce('Highlight the row first, with Arrow Left on its first cell.');
        return null;
      }
      const anchor = current?.axis === 'row' ? current.anchor : id;
      const visible = gridExpandedSortedRowIdsSelector(apiRef);
      const nextIndex = visible.indexOf(id) + (key === 'ArrowDown' ? 1 : -1);
      if (nextIndex < 0 || nextIndex >= visible.length) {
        return null;
      }
      const ids = sliceBetween(visible, anchor, visible[nextIndex]);
      updateHighlight({ axis: 'row', anchor, ids });
      skipNextFocusRef.current = true;
      announce(`${ids.length} ${ids.length === 1 ? 'row' : 'rows'} highlighted.`);
      return visible[nextIndex];
    },
    [apiRef, announce, updateHighlight, usesEdgeArrows],
  );

  // Returns the column that receives the focus, or `null` when the highlight didn't change
  const extendColumnHighlight = React.useCallback(
    (field: string, key: string): string | null => {
      const current = highlightRef.current;
      if (current?.axis !== 'column' && usesEdgeArrows) {
        announce('Highlight the column first, with Arrow Up on its header.');
        return null;
      }
      const anchor = current?.axis === 'column' ? current.anchor : field;
      const fields = getDataFields();
      const index = fields.indexOf(field);
      const next = fields[index + (key === 'ArrowRight' ? 1 : -1)];
      if (index < 0 || next === undefined) {
        return null;
      }
      const ids = sliceBetween(fields, anchor, next);
      updateHighlight({ axis: 'column', anchor, ids });
      skipNextFocusRef.current = true;
      announce(
        `${ids.length} ${ids.length === 1 ? 'column' : 'columns'} highlighted.`,
      );
      return next;
    },
    [announce, getDataFields, updateHighlight, usesEdgeArrows],
  );

  // In the `highlight` solution the highlight follows the focus and switches axis with the area.
  // In the others it only marks what just moved, so moving the focus away clears it.
  React.useEffect(() => {
    const api = apiRef.current;
    if (!api) {
      return undefined;
    }
    const unsubscribeCell = api.subscribeEvent('cellFocusIn', (params) => {
      const current = highlightRef.current;
      if (!current) {
        return;
      }
      if (skipNextFocusRef.current) {
        skipNextFocusRef.current = false;
        return;
      }
      if (current.axis === 'row' && current.ids.includes(params.id)) {
        return;
      }
      if (usesEdgeArrows) {
        updateHighlight({ axis: 'row', anchor: params.id, ids: [params.id] });
      } else if (current.axis !== 'column' || !current.ids.includes(params.field)) {
        updateHighlight(null);
      }
    });
    const unsubscribeHeader = api.subscribeEvent('columnHeaderFocus', (params) => {
      const current = highlightRef.current;
      if (!current) {
        return;
      }
      if (skipNextFocusRef.current) {
        skipNextFocusRef.current = false;
        return;
      }
      if (current.axis === 'column' && current.ids.includes(params.field)) {
        return;
      }
      if (usesEdgeArrows) {
        updateHighlight({
          axis: 'column',
          anchor: params.field,
          ids: [params.field],
        });
      } else {
        updateHighlight(null);
      }
    });
    return () => {
      unsubscribeCell();
      unsubscribeHeader();
    };
  }, [apiRef, updateHighlight, usesEdgeArrows]);

  // --- Moves --------------------------------------------------------------------------------------

  const moveRows = React.useCallback(
    async (
      rowIds: GridRowId[],
      direction: 'up' | 'down',
      toEdge: boolean,
      focusField: string,
    ) => {
      const api = apiRef.current;
      if (!api || movingRef.current) {
        return;
      }
      if (gridSortModelSelector(apiRef).length > 0) {
        announce("Rows can't be reordered while the grid is sorted.");
        return;
      }
      const visible = gridExpandedSortedRowIdsSelector(apiRef);
      const indexes = rowIds.map((id) => visible.indexOf(id)).sort((a, b) => a - b);
      if (indexes[0] < 0 || !isContiguous(indexes)) {
        announce('The rows to move must be contiguous.');
        return;
      }
      const first = indexes[0];
      const ordered = indexes.map((index) => visible[index]);
      let targetFirst: number;
      if (direction === 'up') {
        targetFirst = toEdge ? 0 : first - 1;
      } else {
        targetFirst = toEdge ? visible.length - ordered.length : first + 1;
      }
      if (
        targetFirst < 0 ||
        targetFirst + ordered.length > visible.length ||
        targetFirst === first
      ) {
        announce(
          `Can't move the ${ordered.length > 1 ? 'rows' : 'row'} further ${direction}.`,
        );
        return;
      }

      movingRef.current = true;
      try {
        // The rows of a block are moved one after the other, each one next to the previous one
        if (direction === 'up') {
          await api.setRowPosition(ordered[0], visible[targetFirst], 'above');
          await ordered
            .slice(1)
            .reduce(
              (previous, rowId, i) =>
                previous.then(() => api.setRowPosition(rowId, ordered[i], 'below')),
              Promise.resolve(),
            );
        } else {
          const targetLast = targetFirst + ordered.length - 1;
          const reversed = [...ordered].reverse();
          await api.setRowPosition(reversed[0], visible[targetLast], 'below');
          await reversed
            .slice(1)
            .reduce(
              (previous, rowId, i) =>
                previous.then(() => api.setRowPosition(rowId, reversed[i], 'above')),
              Promise.resolve(),
            );
        }
      } finally {
        movingRef.current = false;
      }

      const rowIndex =
        direction === 'up' ? targetFirst : targetFirst + ordered.length - 1;
      api.scrollToIndexes({ rowIndex, colIndex: api.getColumnIndex(focusField) });
      flashMoved('row', ordered);
      if (ordered.length === 1) {
        announce(
          `Row ${getRowLabel(ordered[0])} moved to position ${targetFirst + 1} of ${visible.length}.`,
        );
      } else {
        announce(
          `${ordered.length} rows moved to positions ${targetFirst + 1} to ${
            targetFirst + ordered.length
          } of ${visible.length}.`,
        );
      }
    },
    [apiRef, announce, flashMoved, getRowLabel],
  );

  const moveColumns = React.useCallback(
    (
      fields: string[],
      direction: 'left' | 'right',
      toEdge: boolean,
      focusField: string,
    ) => {
      const api = apiRef.current;
      if (!api) {
        return;
      }
      // Copied: the selector returns a memoized array, and the loop below mutates its copy
      const visible = [...gridVisibleColumnFieldsSelector(apiRef)];
      const indexes = fields
        .map((field) => visible.indexOf(field))
        .sort((a, b) => a - b);
      if (indexes[0] < 0 || !isContiguous(indexes)) {
        announce('The columns to move must be contiguous.');
        return;
      }
      const blocked = fields.find((field) => api.getColumn(field)?.disableReorder);
      if (blocked) {
        announce(`Column ${getColumnLabel(blocked)} can't be reordered.`);
        return;
      }

      let first = indexes[0];
      let last = indexes[indexes.length - 1];
      let moved = 0;
      // Each step moves the neighbour to the other side of the block, so the block stays contiguous.
      // The real feature moves the block itself; the result is the same.
      do {
        const neighbourIndex = direction === 'right' ? last + 1 : first - 1;
        const neighbour = visible[neighbourIndex];
        if (neighbour === undefined || api.getColumn(neighbour)?.disableReorder) {
          break;
        }
        const edgeField = direction === 'right' ? visible[first] : visible[last];
        api.setColumnIndex(neighbour, api.getColumnIndex(edgeField, false));
        // Mirror the move in the local copy of the visible order
        visible.splice(neighbourIndex, 1);
        visible.splice(direction === 'right' ? first : last, 0, neighbour);
        first += direction === 'right' ? 1 : -1;
        last += direction === 'right' ? 1 : -1;
        moved += 1;
      } while (toEdge);

      if (moved === 0) {
        announce(
          `Can't move the ${fields.length > 1 ? 'columns' : 'column'} further ${direction}.`,
        );
        return;
      }
      api.scrollToIndexes({ colIndex: api.getColumnIndex(focusField) });
      flashMoved('column', fields);
      if (fields.length === 1) {
        announce(
          `Column ${getColumnLabel(fields[0])} moved to position ${first + 1} of ${visible.length}.`,
        );
      } else {
        announce(
          `${fields.length} columns moved to positions ${first + 1} to ${last + 1} of ${
            visible.length
          }.`,
        );
      }
    },
    [apiRef, announce, flashMoved, getColumnLabel],
  );

  // The rows an Alt+Up/Down press moves from a body cell, or the reason it moves nothing.
  // Where moves start from any cell, this also selects or highlights the row that is about to move.
  const getRowsToMove = React.useCallback(
    (id: GridRowId, field: string): GridRowId[] | string => {
      const current = highlightRef.current;
      if (current?.axis === 'row') {
        return current.ids;
      }
      if (solution === 'highlight') {
        return field === HANDLE_FIELD
          ? [id]
          : 'Highlight the row to move it, or focus its drag handle.';
      }
      if (current?.axis === 'column') {
        updateHighlight(null);
      }
      if (rowsUseSelection) {
        const selected = getSelectedRowIds();
        if (selected.has(id)) {
          return gridExpandedSortedRowIdsSelector(apiRef).filter((rowId) =>
            selected.has(rowId),
          );
        }
        if (rowSelection) {
          apiRef.current?.selectRow(id, true, true);
        } else {
          selectRowsAsCells([id]);
        }
      } else if (rowsUseHighlight) {
        updateHighlight({ axis: 'row', anchor: id, ids: [id] });
      }
      return [id];
    },
    [
      apiRef,
      getSelectedRowIds,
      rowSelection,
      rowsUseHighlight,
      rowsUseSelection,
      selectRowsAsCells,
      solution,
      updateHighlight,
    ],
  );

  // The columns an Alt+Left/Right press moves, or the reason it moves nothing.
  // Where moves start from any cell, this also selects or highlights the column that is about to move.
  const getColumnsToMove = React.useCallback(
    (field: string, fromHeader: boolean): string[] | string => {
      const current = highlightRef.current;
      if (current?.axis === 'column') {
        return current.ids;
      }
      if (solution === 'highlight') {
        return fromHeader
          ? [field]
          : 'Highlight the column to move it, or focus its header.';
      }
      // `moveColumns` refuses these and says why
      if (SPECIAL_FIELDS.includes(field)) {
        return [field];
      }
      if (columnsUseSelection) {
        if (selectedColumnsRef.current.includes(field)) {
          return selectedColumnsRef.current;
        }
        selectColumns([field]);
      } else if (columnsUseHighlight) {
        updateHighlight({ axis: 'column', anchor: field, ids: [field] });
      }
      return [field];
    },
    [
      columnsUseHighlight,
      columnsUseSelection,
      selectColumns,
      solution,
      updateHighlight,
    ],
  );

  // Inside a selection of columns, Shift+Left/Right grows it by whole columns.
  // Returns the column that receives the focus, or `null` when the selection didn't change.
  const growSelectedColumns = React.useCallback(
    (key: string): string | null => {
      const fields = getDataFields();
      const indexes = selectedColumnsRef.current.map((field) =>
        fields.indexOf(field),
      );
      const edge =
        key === 'ArrowRight' ? Math.max(...indexes) + 1 : Math.min(...indexes) - 1;
      if (edge < 0 || edge >= fields.length) {
        return null;
      }
      selectColumns([...selectedColumnsRef.current, fields[edge]]);
      return fields[edge];
    },
    [getDataFields, selectColumns],
  );

  // --- Key handlers -------------------------------------------------------------------------------

  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      const api = apiRef.current;
      if (!api || params.cellMode === 'edit') {
        return;
      }
      const current = highlightRef.current;
      const isRowHighlighted =
        current?.axis === 'row' && current.ids.includes(params.id);

      // With nothing to clear, Escape is left to the page, for example to close a dialog
      if (
        event.key === 'Escape' &&
        (current || selectedColumnsRef.current.length > 0)
      ) {
        event.defaultMuiPrevented = true;
        event.stopPropagation();
        if (current) {
          clearHighlight();
        } else {
          clearSelectedColumns();
        }
        return;
      }

      if (usesEdgeArrows && !hasModifier(event)) {
        const isFirstCell = api.getColumnIndex(params.field) === 0;
        if (isFirstCell && event.key === 'ArrowLeft') {
          // Arrow Left at the edge of the row highlights it; the focus stays on the cell
          event.preventDefault();
          event.defaultMuiPrevented = true;
          if (!isRowHighlighted) {
            highlightRow(params.id);
          }
          return;
        }
        if (isFirstCell && event.key === 'ArrowRight' && isRowHighlighted) {
          // Arrow Right clears the highlight first; the next one moves the focus
          event.preventDefault();
          event.defaultMuiPrevented = true;
          clearHighlight();
          return;
        }
      }

      const isVertical = event.key === 'ArrowUp' || event.key === 'ArrowDown';
      const isHorizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';

      // Ctrl+Space selects the column (APG grid pattern)
      if (
        columnsUseSelection &&
        event.key === ' ' &&
        (event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault();
        event.defaultMuiPrevented = true;
        if (!SPECIAL_FIELDS.includes(params.field)) {
          selectColumns([params.field]);
        }
        return;
      }
      // Shift+Space selects the row, as a range of cells when row selection is off
      if (rowsAreCellRanges && event.key === ' ' && event.shiftKey) {
        event.preventDefault();
        event.defaultMuiPrevented = true;
        selectRowsAsCells([params.id]);
        return;
      }

      const isArrow = isVertical || isHorizontal;
      const isAltShiftArrow = isArrow && event.altKey && event.shiftKey;
      const extendsHighlight = extendsHighlightWithShift
        ? isArrow && event.shiftKey && !event.altKey
        : isAltShiftArrow;

      if (isAltShiftArrow || extendsHighlight) {
        event.preventDefault();
        event.defaultMuiPrevented = true;
        if (extendsHighlight && isVertical && rowsUseHighlight) {
          const nextId = extendRowHighlight(params.id, event.key);
          if (nextId !== null) {
            api.setCellFocus(nextId, params.field);
            api.scrollToIndexes({
              rowIndex: gridExpandedSortedRowIdsSelector(apiRef).indexOf(nextId),
              colIndex: api.getColumnIndex(params.field),
            });
          }
        } else if (
          extendsHighlight &&
          isHorizontal &&
          columnsUseHighlight &&
          !usesEdgeArrows
        ) {
          const nextField = extendColumnHighlight(params.field, event.key);
          if (nextField !== null) {
            api.setCellFocus(params.id, nextField);
            api.scrollToIndexes({ colIndex: api.getColumnIndex(nextField) });
          }
        }
        return;
      }

      if (event.shiftKey && !event.altKey && (isHorizontal || isVertical)) {
        if (isHorizontal && selectedColumnsRef.current.includes(params.field)) {
          event.preventDefault();
          event.defaultMuiPrevented = true;
          const nextField = growSelectedColumns(event.key);
          if (nextField !== null) {
            api.setCellFocus(params.id, nextField);
          }
          return;
        }
        if (isVertical && rowsAreCellRanges) {
          const selectedRows = getFullySelectedRowsFromCells();
          if (selectedRows.includes(params.id)) {
            event.preventDefault();
            event.defaultMuiPrevented = true;
            const rows = gridExpandedSortedRowIdsSelector(apiRef);
            const indexes = selectedRows.map((id) => rows.indexOf(id));
            const edge =
              event.key === 'ArrowDown'
                ? Math.max(...indexes) + 1
                : Math.min(...indexes) - 1;
            if (edge >= 0 && edge < rows.length) {
              selectRowsAsCells([...selectedRows, rows[edge]]);
              api.setCellFocus(rows[edge], params.field);
              api.scrollToIndexes({
                rowIndex: edge,
                colIndex: api.getColumnIndex(params.field),
              });
            }
            return;
          }
        }
      }

      if (
        event.altKey &&
        !event.shiftKey &&
        (isVertical || event.key === 'Home' || event.key === 'End')
      ) {
        // Swallowed on every cell: Alt+Arrow must neither move the focus like a plain arrow
        // nor reach the browser
        event.preventDefault();
        event.defaultMuiPrevented = true;
        const rowIds = getRowsToMove(params.id, params.field);
        if (typeof rowIds === 'string') {
          announce(rowIds);
          return;
        }
        const direction =
          event.key === 'ArrowUp' || event.key === 'Home' ? 'up' : 'down';
        moveRows(
          rowIds,
          direction,
          event.key === 'Home' || event.key === 'End',
          params.field,
        );
      } else if (event.altKey && !event.shiftKey && isHorizontal) {
        // Alt+Left/Right is browser history navigation
        event.preventDefault();
        event.defaultMuiPrevented = true;
        if (SPECIAL_FIELDS.includes(params.field)) {
          return;
        }
        const fields = getColumnsToMove(params.field, false);
        if (typeof fields === 'string') {
          announce(fields);
          return;
        }
        moveColumns(
          fields,
          event.key === 'ArrowLeft' ? 'left' : 'right',
          false,
          params.field,
        );
      }
    },
    [
      apiRef,
      announce,
      clearHighlight,
      clearSelectedColumns,
      columnsUseHighlight,
      columnsUseSelection,
      extendColumnHighlight,
      extendRowHighlight,
      extendsHighlightWithShift,
      getColumnsToMove,
      getFullySelectedRowsFromCells,
      getRowsToMove,
      growSelectedColumns,
      highlightRow,
      moveColumns,
      moveRows,
      rowsAreCellRanges,
      rowsUseHighlight,
      selectColumns,
      selectRowsAsCells,
      usesEdgeArrows,
    ],
  );

  // There is no `onColumnHeaderKeyDown` prop: subscribe with priority so the handler runs
  // before the built-in navigation and can stop it with `defaultMuiPrevented`.
  React.useEffect(() => {
    const handler: GridEventListener<'columnHeaderKeyDown'> = (params, event) => {
      const api = apiRef.current;
      if (!api || isInteractiveTarget(event.target)) {
        return;
      }
      const current = highlightRef.current;
      const isColumnHighlighted =
        current?.axis === 'column' && current.ids.includes(params.field);

      if (
        event.key === 'Escape' &&
        (current || selectedColumnsRef.current.length > 0)
      ) {
        event.defaultMuiPrevented = true;
        event.stopPropagation();
        if (current) {
          clearHighlight();
        } else {
          clearSelectedColumns();
        }
        return;
      }

      if (usesEdgeArrows && !hasModifier(event)) {
        if (event.key === 'ArrowUp') {
          // Arrow Up at the edge of the column highlights it; the focus stays on the header
          event.preventDefault();
          event.defaultMuiPrevented = true;
          if (!isColumnHighlighted) {
            highlightColumn(params.field);
          }
          return;
        }
        if (event.key === 'ArrowDown' && isColumnHighlighted) {
          // Arrow Down clears the highlight first; the next one moves the focus into the body
          event.preventDefault();
          event.defaultMuiPrevented = true;
          clearHighlight();
          return;
        }
      }

      const isHorizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';

      if (
        columnsUseSelection &&
        event.key === ' ' &&
        (event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault();
        event.defaultMuiPrevented = true;
        if (!SPECIAL_FIELDS.includes(params.field)) {
          selectColumns([params.field]);
        }
        return;
      }

      const isAltShiftArrow = isHorizontal && event.altKey && event.shiftKey;
      const extendsHighlight = extendsHighlightWithShift
        ? isHorizontal && event.shiftKey && !event.altKey
        : isAltShiftArrow;

      if (isAltShiftArrow || extendsHighlight) {
        event.preventDefault();
        event.defaultMuiPrevented = true;
        if (extendsHighlight && columnsUseHighlight) {
          const nextField = extendColumnHighlight(params.field, event.key);
          if (nextField !== null) {
            api.scrollToIndexes({ colIndex: api.getColumnIndex(nextField) });
            api.setColumnHeaderFocus(nextField, event);
          }
        }
        return;
      }

      if (
        event.shiftKey &&
        !event.altKey &&
        isHorizontal &&
        selectedColumnsRef.current.includes(params.field)
      ) {
        event.preventDefault();
        event.defaultMuiPrevented = true;
        const nextField = growSelectedColumns(event.key);
        if (nextField !== null) {
          api.scrollToIndexes({ colIndex: api.getColumnIndex(nextField) });
          api.setColumnHeaderFocus(nextField, event);
        }
        return;
      }

      if (
        event.altKey &&
        !event.shiftKey &&
        (isHorizontal || event.key === 'Home' || event.key === 'End')
      ) {
        // Alt+Left/Right is browser history navigation: always prevent it from a header
        event.preventDefault();
        event.defaultMuiPrevented = true;
        const fields = getColumnsToMove(params.field, true);
        if (typeof fields === 'string') {
          announce(fields);
          return;
        }
        const direction =
          event.key === 'ArrowLeft' || event.key === 'Home' ? 'left' : 'right';
        moveColumns(
          fields,
          direction,
          event.key === 'Home' || event.key === 'End',
          params.field,
        );
      }
    };
    return apiRef.current?.subscribeEvent('columnHeaderKeyDown', handler, {
      isFirst: true,
    });
  }, [
    apiRef,
    announce,
    clearHighlight,
    clearSelectedColumns,
    columnsUseHighlight,
    columnsUseSelection,
    extendColumnHighlight,
    extendsHighlightWithShift,
    getColumnsToMove,
    growSelectedColumns,
    highlightColumn,
    moveColumns,
    selectColumns,
    usesEdgeArrows,
  ]);

  // --- Styles -------------------------------------------------------------------------------------

  const gridSx = React.useMemo(() => {
    const flashTint = alpha(theme.palette.primary.main, 0.12);
    const flashStrongTint = alpha(theme.palette.primary.main, 0.2);
    const flashEdge = alpha(theme.palette.primary.main, 0.5);
    const outlineEdge = theme.palette.primary.main;
    const selectedTint = alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity,
    );
    // Gray and lighter than the selection, so a row can be selected and highlighted at once
    const mutedTint = alpha(theme.palette.grey[500], 0.16);
    const mutedEdge = theme.palette.grey[500];

    const styles: Record<string, object> = {
      // Lets the temporary mark of a move fade out
      [`& .${gridClasses.row}, & .${gridClasses.cell}, & .${gridClasses.columnHeader}`]:
        {
          transition: 'background-color 400ms, box-shadow 400ms',
        },
    };
    const markRows = (
      ids: (GridRowId | string)[],
      variant: 'flash' | 'muted' | 'outline',
    ) => {
      const rowStyles = {
        flash: {
          backgroundColor: flashTint,
          boxShadow: `inset 3px 0 0 ${flashEdge}`,
          '&:hover, &.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: flashStrongTint,
          },
        },
        // A selected row keeps its own background and only gains the edge
        muted: {
          boxShadow: `inset 3px 0 0 ${mutedEdge}`,
          '&:not(.Mui-selected), &:not(.Mui-selected):hover': {
            backgroundColor: mutedTint,
          },
        },
        outline: { boxShadow: `inset 0 0 0 2px ${outlineEdge}` },
      };
      styles[ids.map((id) => `&& ${rowSelector(id)}`).join(', ')] =
        rowStyles[variant];
    };
    const markColumns = (
      fields: (GridRowId | string)[],
      variant: 'flash' | 'muted' | 'outline' | 'selected',
    ) => {
      const headers = fields
        .map((field) => `&& .${gridClasses.columnHeader}[data-field="${field}"]`)
        .join(', ');
      const cells = fields
        .map((field) => `&& .${gridClasses.cell}[data-field="${field}"]`)
        .join(', ');
      const columnStyles = {
        flash: {
          header: {
            backgroundColor: flashTint,
            boxShadow: `inset 0 3px 0 ${flashEdge}`,
          },
          cell: { backgroundColor: flashTint },
        },
        muted: {
          header: {
            backgroundColor: mutedTint,
            boxShadow: `inset 0 3px 0 ${mutedEdge}`,
          },
          cell: { backgroundColor: mutedTint },
        },
        outline: {
          header: { boxShadow: `inset 0 0 0 2px ${outlineEdge}` },
          cell: {
            boxShadow: `inset 2px 0 0 ${outlineEdge}, inset -2px 0 0 ${outlineEdge}`,
          },
        },
        selected: {
          header: { backgroundColor: selectedTint },
          cell: { backgroundColor: selectedTint },
        },
      };
      styles[headers] = columnStyles[variant].header;
      styles[cells] = columnStyles[variant].cell;
    };
    if (flash?.axis === 'row') {
      markRows(flash.ids, 'flash');
    } else if (flash?.axis === 'column') {
      markColumns(flash.ids, 'flash');
    }
    if (selectedColumns.length > 0) {
      markColumns(selectedColumns, 'selected');
    }
    if (highlight?.axis === 'row') {
      markRows(highlight.ids, highlightVariant);
    } else if (highlight?.axis === 'column') {
      markColumns(highlight.ids, highlightVariant);
    }
    return styles;
  }, [flash, highlight, highlightVariant, selectedColumns, theme]);

  const highlightDescription = React.useMemo(() => {
    if (!highlight) {
      return 'none';
    }
    if (highlight.axis === 'row') {
      return `rows ${highlight.ids.map(getRowLabel).join(', ')}`;
    }
    return `columns ${highlight.ids.map(getColumnLabel).join(', ')}`;
  }, [highlight, getRowLabel, getColumnLabel]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: 2,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={rowSelection}
              onChange={(event) => setRowSelection(event.target.checked)}
            />
          }
          label="Row selection"
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={checkboxSelection}
              disabled={!rowSelection}
              onChange={(event) => setCheckboxSelection(event.target.checked)}
            />
          }
          label="Checkbox column"
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={cellSelection}
              onChange={(event) => setCellSelection(event.target.checked)}
            />
          }
          label="Cell selection"
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 1,
          minHeight: 24,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {highlightEnabled && (
          <Typography variant="body2">
            <strong>Highlight:</strong> {highlightDescription}
          </Typography>
        )}
        {columnsUseSelection && (
          <Typography variant="body2">
            <strong>Selected columns:</strong>{' '}
            {selectedColumns.map(getColumnLabel).join(', ') || 'none'}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          <strong>Announced:</strong> {announcement.text || '—'}
        </Typography>
      </Box>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={visuallyHidden}
      >
        <span key={announcement.key}>{announcement.text}</span>
      </div>
      <div style={{ height: 520, width: '100%' }}>
        <DataGridPremium
          {...data}
          apiRef={apiRef}
          rowReordering
          rowSelection={rowSelection}
          checkboxSelection={rowSelection && checkboxSelection}
          cellSelection={cellSelection}
          onCellKeyDown={handleCellKeyDown}
          onRowSelectionModelChange={handleRowSelectionChange}
          onCellSelectionModelChange={handleCellSelectionChange}
          sx={gridSx}
        />
      </div>
    </Box>
  );
}
