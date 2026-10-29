import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  DataGridPro,
  GRID_REORDER_COL_DEF,
  gridClasses,
  gridExpandedSortedRowIdsSelector,
  gridSortModelSelector,
  gridVisibleColumnFieldsSelector,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import type { GridEventListener, GridRowId } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

// Prototype of the "highlight" level: a row or column level object that is neither focus nor selection.
// Built on the public API only, so the interaction can be explored before it moves into the packages.

type Highlight =
  | { axis: 'row'; anchor: GridRowId; ids: GridRowId[] }
  | { axis: 'column'; anchor: string; ids: string[] }
  | null;

const HANDLE_FIELD = GRID_REORDER_COL_DEF.field;

const INSTRUCTIONS =
  'Shift plus arrow keys extend, Alt plus arrow keys move, Escape clears.';

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

export default function KeyboardReordering() {
  const apiRef = useGridApiRef();
  const theme = useTheme();
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 30,
    maxColumns: 8,
  });

  const [highlight, setHighlight] = React.useState<Highlight>(null);
  const highlightRef = React.useRef<Highlight>(null);
  // Set by the Shift+Arrow handlers: the focus change they trigger must extend, not replace
  const skipNextFocusRef = React.useRef(false);
  const movingRef = React.useRef(false);
  const [announcement, setAnnouncement] = React.useState({ key: 0, text: '' });

  const updateHighlight = React.useCallback((next: Highlight) => {
    highlightRef.current = next;
    setHighlight(next);
  }, []);

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
        announce('Highlighted rows must be contiguous to move.');
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
    [apiRef, announce, getRowLabel],
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
        announce('Highlighted columns must be contiguous to move.');
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
    [apiRef, announce, getColumnLabel],
  );

  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      const api = apiRef.current;
      if (!api || params.cellMode === 'edit') {
        return;
      }
      const current = highlightRef.current;

      // Escape toggles the highlight of the focused row, and clears any highlight
      if (event.key === 'Escape') {
        event.preventDefault();
        event.defaultMuiPrevented = true;
        event.stopPropagation();
        if (current) {
          updateHighlight(null);
          announce('Highlight cleared.');
          return;
        }
        const visible = gridExpandedSortedRowIdsSelector(apiRef);
        updateHighlight({ axis: 'row', anchor: params.id, ids: [params.id] });
        announce(
          `Row ${getRowLabel(params.id)} highlighted, ${visible.indexOf(params.id) + 1} of ${
            visible.length
          }. ${INSTRUCTIONS}`,
        );
        return;
      }

      const isVertical = event.key === 'ArrowUp' || event.key === 'ArrowDown';

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

      if (
        event.altKey &&
        (isVertical || event.key === 'Home' || event.key === 'End')
      ) {
        // Swallowed on every cell: Alt+Arrow must neither move the focus like a plain arrow
        // nor reach the browser. A body cell is not a handle for its row, so only the handle moves.
        event.preventDefault();
        event.defaultMuiPrevented = true;
        let rowIds: GridRowId[] | null = null;
        if (current?.axis === 'row') {
          rowIds = current.ids;
        } else if (params.field === HANDLE_FIELD) {
          rowIds = [params.id];
        }
        if (!rowIds) {
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
      } else if (
        event.altKey &&
        (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
      ) {
        // Alt+Left/Right is browser history navigation
        event.preventDefault();
        event.defaultMuiPrevented = true;
      }
    },
    [apiRef, announce, getRowLabel, moveRows, updateHighlight],
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

      // Escape toggles the highlight of the focused column, and clears any highlight
      if (event.key === 'Escape') {
        event.preventDefault();
        event.defaultMuiPrevented = true;
        event.stopPropagation();
        if (current) {
          updateHighlight(null);
          announce('Highlight cleared.');
          return;
        }
        const visible = gridVisibleColumnFieldsSelector(apiRef);
        updateHighlight({
          axis: 'column',
          anchor: params.field,
          ids: [params.field],
        });
        announce(
          `Column ${getColumnLabel(params.field)} highlighted, ${
            visible.indexOf(params.field) + 1
          } of ${visible.length}. ${INSTRUCTIONS}`,
        );
        return;
      }

      const isHorizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';

      if (
        event.shiftKey &&
        !event.altKey &&
        isHorizontal &&
        current?.axis === 'column'
      ) {
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

      if (
        event.altKey &&
        (isHorizontal || event.key === 'Home' || event.key === 'End')
      ) {
        // Alt+Left/Right is browser history navigation: always prevent it from a header
        event.preventDefault();
        event.defaultMuiPrevented = true;
        const fields = current?.axis === 'column' ? current.ids : [params.field];
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
  }, [apiRef, announce, getColumnLabel, moveColumns, updateHighlight]);

  const highlightSx = React.useMemo(() => {
    if (!highlight) {
      return undefined;
    }
    const tint = alpha(theme.palette.primary.main, 0.12);
    const edge = theme.palette.primary.main;
    if (highlight.axis === 'row') {
      const rows = highlight.ids
        .map((id) => `&& .${gridClasses.row}[data-id="${id}"]`)
        .join(', ');
      return {
        [rows]: {
          backgroundColor: tint,
          boxShadow: `inset 3px 0 0 ${edge}`,
          '&:hover, &.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
          },
        },
      };
    }
    const headers = highlight.ids
      .map((field) => `&& .${gridClasses.columnHeader}[data-field="${field}"]`)
      .join(', ');
    const cells = highlight.ids
      .map((field) => `&& .${gridClasses.cell}[data-field="${field}"]`)
      .join(', ');
    return {
      [headers]: { backgroundColor: tint, boxShadow: `inset 0 3px 0 ${edge}` },
      [cells]: { backgroundColor: tint },
    };
  }, [highlight, theme]);

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
        <DataGridPro
          {...data}
          apiRef={apiRef}
          rowReordering
          checkboxSelection
          disableRowSelectionOnClick
          onCellKeyDown={handleCellKeyDown}
          sx={highlightSx}
        />
      </div>
    </Box>
  );
}
