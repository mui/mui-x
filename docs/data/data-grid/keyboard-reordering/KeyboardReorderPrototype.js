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
import { useDemoData } from '@mui/x-data-grid-generator';

// Prototype of keyboard reordering with a row or column level object that is neither focus nor,
// depending on the variant, selection. Built on the public API only, so the interaction can be
// explored before it moves into the packages. Shared by the demos of the page.

const HANDLE_FIELD = GRID_REORDER_COL_DEF.field;
const SPECIAL_FIELDS = [HANDLE_FIELD, GRID_CHECKBOX_SELECTION_FIELD];
const FLASH_DURATION = 1500;

const ROW_INSTRUCTIONS = {
  escape: 'Shift plus arrow keys extend, Alt plus arrow keys move, Escape clears.',
  edgeArrows:
    'Shift plus Up and Down extend, Alt plus Up and Down move, Arrow Right or Escape clears.',
  none: '',
};

const COLUMN_INSTRUCTIONS = {
  escape: 'Shift plus arrow keys extend, Alt plus arrow keys move, Escape clears.',
  edgeArrows:
    'Shift plus Left and Right extend, Alt plus Left and Right move, Arrow Down or Escape clears.',
  none: '',
};

const visuallyHidden = {
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

function hasModifier(event) {
  return event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
}

function sliceBetween(ordered, a, b) {
  const start = ordered.indexOf(a);
  const end = ordered.indexOf(b);
  if (start < 0 || end < 0) {
    return [a];
  }
  return ordered.slice(Math.min(start, end), Math.max(start, end) + 1);
}

function isContiguous(indexes) {
  return indexes.every((index, i) => i === 0 || index === indexes[i - 1] + 1);
}

function isInteractiveTarget(target) {
  return target?.closest?.('button, a, input, select, textarea') != null;
}

function rowSelector(id) {
  return `.${gridClasses.row}[data-id="${id}"]`;
}

export default function KeyboardReorderPrototype(props) {
  const {
    highlightTrigger,
    moveFromAnyCell = false,
    moveSelectedRows = false,
    selectionIsHighlight = false,
  } = props;
  const apiRef = useGridApiRef();
  const theme = useTheme();
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 30,
    maxColumns: 8,
  });

  const [rowSelection, setRowSelection] = React.useState(true);
  const [checkboxSelection, setCheckboxSelection] = React.useState(true);
  const [cellSelection, setCellSelection] = React.useState(selectionIsHighlight);

  // In the "selection is the highlight" variant, the persistent highlight only exists without selection
  const hasSelection = rowSelection || cellSelection;
  const highlightEnabled = selectionIsHighlight
    ? !hasSelection
    : highlightTrigger !== 'none';
  const effectiveTrigger = highlightEnabled ? highlightTrigger : 'none';
  const highlightStyle = selectionIsHighlight ? 'outline' : 'fill';
  const cellRangesAreSelection = selectionIsHighlight && cellSelection;

  const [highlight, setHighlight] = React.useState(null);
  const highlightRef = React.useRef(null);
  // Set by the Shift+Arrow handlers: the focus change they trigger must extend, not replace
  const skipNextFocusRef = React.useRef(false);
  const movingRef = React.useRef(false);
  const [announcement, setAnnouncement] = React.useState({ key: 0, text: '' });
  // Temporary mark on what just moved, for moves that start from an element without a highlight
  const [flash, setFlash] = React.useState(null);
  const flashTimeoutRef = React.useRef(undefined);

  const updateHighlight = React.useCallback((next) => {
    highlightRef.current = next;
    setHighlight(next);
  }, []);

  // A highlight can't outlive the configuration that allows it
  React.useEffect(() => {
    if (!highlightEnabled && highlightRef.current) {
      updateHighlight(null);
    }
  }, [highlightEnabled, updateHighlight]);

  const announce = React.useCallback((text) => {
    setAnnouncement((prev) => ({ key: prev.key + 1, text }));
  }, []);

  const getRowLabel = React.useCallback(
    (id) => {
      const row = apiRef.current?.getRow(id);
      return String(row?.commodity ?? id);
    },
    [apiRef],
  );

  const getColumnLabel = React.useCallback(
    (field) => apiRef.current?.getColumn(field)?.headerName ?? field,
    [apiRef],
  );

  // --- Selection as the row/column level object -------------------------------------------------

  const getDataFields = React.useCallback(
    () =>
      gridVisibleColumnFieldsSelector(apiRef).filter(
        (field) => !SPECIAL_FIELDS.includes(field),
      ),
    [apiRef],
  );

  // Fields whose cells are all selected: the "selected columns" of the cell selection
  const getFullySelectedColumns = React.useCallback(() => {
    const api = apiRef.current;
    if (!api || !cellRangesAreSelection) {
      return [];
    }
    const model = api.getCellSelectionModel();
    const rows = gridExpandedSortedRowIdsSelector(apiRef);
    return getDataFields().filter((field) => rows.every((id) => model[id]?.[field]));
  }, [apiRef, cellRangesAreSelection, getDataFields]);

  // Rows whose data cells are all selected: the "selected rows" of the cell selection
  const getFullySelectedRowsFromCells = React.useCallback(() => {
    const api = apiRef.current;
    if (!api || !cellRangesAreSelection) {
      return [];
    }
    const model = api.getCellSelectionModel();
    const fields = getDataFields();
    return gridExpandedSortedRowIdsSelector(apiRef).filter((id) =>
      fields.every((field) => model[id]?.[field]),
    );
  }, [apiRef, cellRangesAreSelection, getDataFields]);

  const getSelectedRowIds = React.useCallback(() => {
    if (rowSelection) {
      return new Set(gridRowSelectionIdsSelector(apiRef).keys());
    }
    return new Set(getFullySelectedRowsFromCells());
  }, [apiRef, getFullySelectedRowsFromCells, rowSelection]);

  const selectColumns = React.useCallback(
    (fields) => {
      const api = apiRef.current;
      const rows = gridExpandedSortedRowIdsSelector(apiRef);
      if (!api || fields.length === 0 || rows.length === 0) {
        return;
      }
      const visible = gridVisibleColumnFieldsSelector(apiRef);
      const ordered = [...fields].sort(
        (a, b) => visible.indexOf(a) - visible.indexOf(b),
      );
      api.selectCellRange(
        { id: rows[0], field: ordered[0] },
        { id: rows[rows.length - 1], field: ordered[ordered.length - 1] },
      );
      const count = getDataFields().length;
      if (ordered.length === 1) {
        announce(
          `Column ${getColumnLabel(ordered[0])} selected, ${
            getDataFields().indexOf(ordered[0]) + 1
          } of ${
            count
          }. Shift plus Left and Right extend, Alt plus Left and Right move.`,
        );
      } else {
        announce(`${ordered.length} columns selected.`);
      }
    },
    [apiRef, announce, getColumnLabel, getDataFields],
  );

  const selectRowsAsCells = React.useCallback(
    (ids) => {
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

  // --- Persistent highlight (only without selection in the "selection is the highlight" variant) --

  const flashMoved = React.useCallback(
    (axis, ids) => {
      const current = highlightRef.current;
      if (
        current &&
        current.axis === axis &&
        ids.every((id) => current.ids.includes(id))
      ) {
        return;
      }
      if (axis === 'row') {
        const selected = getSelectedRowIds();
        if (ids.every((id) => selected.has(id))) {
          return;
        }
      } else {
        const selected = getFullySelectedColumns();
        if (ids.every((id) => selected.includes(id))) {
          return;
        }
      }
      clearTimeout(flashTimeoutRef.current);
      setFlash({ axis, ids });
      flashTimeoutRef.current = setTimeout(() => setFlash(null), FLASH_DURATION);
    },
    [getFullySelectedColumns, getSelectedRowIds],
  );

  React.useEffect(() => () => clearTimeout(flashTimeoutRef.current), []);

  const clearHighlight = React.useCallback(() => {
    updateHighlight(null);
    announce('Highlight cleared.');
  }, [announce, updateHighlight]);

  const highlightRow = React.useCallback(
    (id) => {
      const visible = gridExpandedSortedRowIdsSelector(apiRef);
      updateHighlight({ axis: 'row', anchor: id, ids: [id] });
      announce(
        `Row ${getRowLabel(id)} highlighted, ${visible.indexOf(id) + 1} of ${visible.length}. ${
          ROW_INSTRUCTIONS[effectiveTrigger]
        }`,
      );
    },
    [apiRef, announce, effectiveTrigger, getRowLabel, updateHighlight],
  );

  const highlightColumn = React.useCallback(
    (field) => {
      const visible = gridVisibleColumnFieldsSelector(apiRef);
      updateHighlight({ axis: 'column', anchor: field, ids: [field] });
      announce(
        `Column ${getColumnLabel(field)} highlighted, ${visible.indexOf(field) + 1} of ${
          visible.length
        }. ${COLUMN_INSTRUCTIONS[effectiveTrigger]}`,
      );
    },
    [apiRef, announce, effectiveTrigger, getColumnLabel, updateHighlight],
  );

  // Level 2 follows level 1: the highlight follows the focus and switches axis with the area.
  // Focus moving inside the highlighted block keeps the block; moving outside collapses it.
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
      updateHighlight({ axis: 'row', anchor: params.id, ids: [params.id] });
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
      updateHighlight({ axis: 'column', anchor: params.field, ids: [params.field] });
    });
    return () => {
      unsubscribeCell();
      unsubscribeHeader();
    };
  }, [apiRef, updateHighlight]);

  // --- Moves --------------------------------------------------------------------------------------

  const moveRows = React.useCallback(
    async (rowIds, direction, toEdge, focusField) => {
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
      let targetFirst;
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
    (fields, direction, toEdge, focusField) => {
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

  // The rows an Alt+Up/Down press moves from a body cell, or `null` with the reason it moves nothing
  const getRowsToMove = React.useCallback(
    (id, field) => {
      const current = highlightRef.current;
      if (current?.axis === 'row') {
        return current.ids;
      }
      if (moveSelectedRows || selectionIsHighlight) {
        const selected = getSelectedRowIds();
        if (selected.has(id)) {
          const visible = gridExpandedSortedRowIdsSelector(apiRef);
          return visible.filter((rowId) => selected.has(rowId));
        }
      }
      if (moveFromAnyCell || field === HANDLE_FIELD) {
        return [id];
      }
      return hasSelection
        ? 'Select the row to move it, or focus its drag handle.'
        : 'Highlight the row to move it, or focus its drag handle.';
    },
    [
      apiRef,
      getSelectedRowIds,
      hasSelection,
      moveFromAnyCell,
      moveSelectedRows,
      selectionIsHighlight,
    ],
  );

  // The columns an Alt+Left/Right press moves, or `null` with the reason it moves nothing
  const getColumnsToMove = React.useCallback(
    (field, fromHeader) => {
      const current = highlightRef.current;
      if (current?.axis === 'column') {
        return current.ids;
      }
      const selectedColumns = getFullySelectedColumns();
      if (selectedColumns.includes(field)) {
        return selectedColumns;
      }
      if (fromHeader || moveFromAnyCell) {
        return [field];
      }
      return cellRangesAreSelection
        ? 'Select the column to move it, or focus its header.'
        : 'Focus the column header to move the column.';
    },
    [cellRangesAreSelection, getFullySelectedColumns, moveFromAnyCell],
  );

  // --- Key handlers -------------------------------------------------------------------------------

  const handleCellKeyDown = React.useCallback(
    (params, event) => {
      const api = apiRef.current;
      if (!api || params.cellMode === 'edit') {
        return;
      }
      const current = highlightRef.current;
      const isRowHighlighted =
        current?.axis === 'row' && current.ids.includes(params.id);

      // Escape always clears. With the `escape` trigger it also highlights;
      // otherwise an Escape with nothing to clear is left to the page, for example to close a dialog.
      if (event.key === 'Escape' && (current || effectiveTrigger === 'escape')) {
        event.defaultMuiPrevented = true;
        event.stopPropagation();
        if (current) {
          clearHighlight();
        } else {
          highlightRow(params.id);
        }
        return;
      }

      if (effectiveTrigger === 'edgeArrows' && !hasModifier(event)) {
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

      // Selection as the level object: Ctrl+Space selects the column (APG grid pattern),
      // Shift+Space the row when row selection is off and cell selection is on
      if (
        cellRangesAreSelection &&
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
      if (
        cellRangesAreSelection &&
        !rowSelection &&
        event.key === ' ' &&
        event.shiftKey
      ) {
        event.preventDefault();
        event.defaultMuiPrevented = true;
        selectRowsAsCells([params.id]);
        return;
      }

      if (event.shiftKey && !event.altKey && isVertical && current?.axis === 'row') {
        event.preventDefault();
        event.defaultMuiPrevented = true;
        const visible = gridExpandedSortedRowIdsSelector(apiRef);
        const nextIndex =
          visible.indexOf(params.id) + (event.key === 'ArrowDown' ? 1 : -1);
        if (nextIndex < 0 || nextIndex >= visible.length) {
          return;
        }
        const ids = sliceBetween(visible, current.anchor, visible[nextIndex]);
        updateHighlight({ axis: 'row', anchor: current.anchor, ids });
        skipNextFocusRef.current = true;
        api.setCellFocus(visible[nextIndex], params.field);
        api.scrollToIndexes({
          rowIndex: nextIndex,
          colIndex: api.getColumnIndex(params.field),
        });
        announce(`${ids.length} ${ids.length === 1 ? 'row' : 'rows'} highlighted.`);
        return;
      }

      // A full-column cell range grows by whole columns, a full-row range by whole rows
      if (
        cellRangesAreSelection &&
        event.shiftKey &&
        !event.altKey &&
        (isHorizontal || isVertical)
      ) {
        if (isHorizontal) {
          const selectedColumns = getFullySelectedColumns();
          if (selectedColumns.includes(params.field)) {
            event.preventDefault();
            event.defaultMuiPrevented = true;
            const fields = getDataFields();
            const indexes = selectedColumns.map((field) => fields.indexOf(field));
            const edge =
              event.key === 'ArrowRight'
                ? Math.max(...indexes) + 1
                : Math.min(...indexes) - 1;
            if (edge >= 0 && edge < fields.length) {
              selectColumns([...selectedColumns, fields[edge]]);
              skipNextFocusRef.current = true;
              api.setCellFocus(params.id, fields[edge]);
            }
            return;
          }
        } else if (!rowSelection) {
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
              skipNextFocusRef.current = true;
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
      } else if (event.altKey && isHorizontal) {
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
      cellRangesAreSelection,
      clearHighlight,
      effectiveTrigger,
      getColumnsToMove,
      getDataFields,
      getFullySelectedColumns,
      getFullySelectedRowsFromCells,
      getRowsToMove,
      highlightRow,
      moveColumns,
      moveRows,
      rowSelection,
      selectColumns,
      selectRowsAsCells,
      updateHighlight,
    ],
  );

  // There is no `onColumnHeaderKeyDown` prop: subscribe with priority so the handler runs
  // before the built-in navigation and can stop it with `defaultMuiPrevented`.
  React.useEffect(() => {
    const handler = (params, event) => {
      const api = apiRef.current;
      if (!api || isInteractiveTarget(event.target)) {
        return;
      }
      const current = highlightRef.current;
      const isColumnHighlighted =
        current?.axis === 'column' && current.ids.includes(params.field);

      if (event.key === 'Escape' && (current || effectiveTrigger === 'escape')) {
        event.defaultMuiPrevented = true;
        event.stopPropagation();
        if (current) {
          clearHighlight();
        } else {
          highlightColumn(params.field);
        }
        return;
      }

      if (effectiveTrigger === 'edgeArrows' && !hasModifier(event)) {
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
        cellRangesAreSelection &&
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

      if (event.shiftKey && !event.altKey && isHorizontal) {
        if (current?.axis === 'column') {
          event.preventDefault();
          event.defaultMuiPrevented = true;
          const visible = gridVisibleColumnFieldsSelector(apiRef);
          const nextIndex =
            visible.indexOf(params.field) + (event.key === 'ArrowRight' ? 1 : -1);
          if (nextIndex < 0 || nextIndex >= visible.length) {
            return;
          }
          const ids = sliceBetween(visible, current.anchor, visible[nextIndex]);
          updateHighlight({ axis: 'column', anchor: current.anchor, ids });
          skipNextFocusRef.current = true;
          api.scrollToIndexes({ colIndex: nextIndex });
          api.setColumnHeaderFocus(visible[nextIndex], event);
          announce(
            `${ids.length} ${ids.length === 1 ? 'column' : 'columns'} highlighted.`,
          );
          return;
        }
        const selectedColumns = getFullySelectedColumns();
        if (selectedColumns.includes(params.field)) {
          event.preventDefault();
          event.defaultMuiPrevented = true;
          const fields = getDataFields();
          const indexes = selectedColumns.map((field) => fields.indexOf(field));
          const edge =
            event.key === 'ArrowRight'
              ? Math.max(...indexes) + 1
              : Math.min(...indexes) - 1;
          if (edge >= 0 && edge < fields.length) {
            selectColumns([...selectedColumns, fields[edge]]);
            api.scrollToIndexes({ colIndex: api.getColumnIndex(fields[edge]) });
            api.setColumnHeaderFocus(fields[edge], event);
          }
          return;
        }
      }

      if (
        event.altKey &&
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
    cellRangesAreSelection,
    clearHighlight,
    effectiveTrigger,
    getColumnsToMove,
    getDataFields,
    getFullySelectedColumns,
    highlightColumn,
    moveColumns,
    selectColumns,
    updateHighlight,
  ]);

  // --- Styles -------------------------------------------------------------------------------------

  const gridSx = React.useMemo(() => {
    const tint = alpha(theme.palette.primary.main, 0.12);
    const strongTint = alpha(theme.palette.primary.main, 0.2);
    const edge = theme.palette.primary.main;
    const styles = {
      // Lets the temporary mark of a move fade out
      [`& .${gridClasses.row}, & .${gridClasses.cell}, & .${gridClasses.columnHeader}`]:
        {
          transition: 'background-color 400ms, box-shadow 400ms',
        },
    };
    const markRows = (ids, color, outline) => {
      styles[ids.map((id) => `&& ${rowSelector(id)}`).join(', ')] = outline
        ? { boxShadow: `inset 0 0 0 2px ${color}` }
        : {
            backgroundColor: tint,
            boxShadow: `inset 3px 0 0 ${color}`,
            '&:hover, &.Mui-selected, &.Mui-selected:hover': {
              backgroundColor: strongTint,
            },
          };
    };
    const markColumns = (fields, color, outline) => {
      const headers = fields
        .map((field) => `&& .${gridClasses.columnHeader}[data-field="${field}"]`)
        .join(', ');
      const cells = fields
        .map((field) => `&& .${gridClasses.cell}[data-field="${field}"]`)
        .join(', ');
      if (outline) {
        styles[headers] = { boxShadow: `inset 0 0 0 2px ${color}` };
        styles[cells] = {
          boxShadow: `inset 2px 0 0 ${color}, inset -2px 0 0 ${color}`,
        };
      } else {
        styles[headers] = {
          backgroundColor: tint,
          boxShadow: `inset 0 3px 0 ${color}`,
        };
        styles[cells] = { backgroundColor: tint };
      }
    };
    if (flash) {
      // Lighter than a highlight: a temporary mark on what just moved
      if (flash.axis === 'row') {
        markRows(flash.ids, alpha(edge, 0.5), false);
      } else {
        markColumns(flash.ids, alpha(edge, 0.5), false);
      }
    }
    if (highlight?.axis === 'row') {
      markRows(highlight.ids, edge, highlightStyle === 'outline');
    } else if (highlight?.axis === 'column') {
      markColumns(highlight.ids, edge, highlightStyle === 'outline');
    }
    return styles;
  }, [flash, highlight, highlightStyle, theme]);

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
        {selectionIsHighlight && (
          <Typography variant="body2" color="text.secondary">
            {hasSelection
              ? 'Selection is the highlight.'
              : `No selection: the ${highlightTrigger === 'escape' ? 'Esc' : 'edge arrow'} highlight is on, drawn as an outline.`}
          </Typography>
        )}
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
        <Typography variant="body2">
          <strong>Highlight:</strong> {highlightDescription}
        </Typography>
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
          sx={gridSx}
        />
      </div>
    </Box>
  );
}
