import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  DataGridPremium,
  GRID_CHECKBOX_SELECTION_FIELD,
  GRID_REORDER_COL_DEF,
  gridClasses,
  gridColumnPositionsSelector,
  gridExpandedSortedRowIdsSelector,
  gridFocusCellSelector,
  gridFocusColumnHeaderSelector,
  gridSortModelSelector,
  gridVisibleColumnFieldsSelector,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

// Prototype of the current favorite keyboard reordering solution. Built on the public API only, so the
// interaction can be explored before it moves into the packages.

const SPECIAL_FIELDS = [GRID_REORDER_COL_DEF.field, GRID_CHECKBOX_SELECTION_FIELD];
// Motion values mirror the tokens of the motion skill. Rows and columns move while on screen, so
// they use --ease-in-out, and a keyboard action repeated this often gets --duration-fast.
const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)';
const DURATION_FAST = 120;
const DURATION_BASE = 200;
const MOVE_ANIMATION_ID = 'keyboard-reorder-move';
// Relative to the hover opacity of the theme, so the row highlight stays well below hover
const ROW_OPACITY = 0.4;
// Relative to the selected opacity of the theme, applied to the primary color
const HEADER_OPACITY = 1.5;

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

function isContiguous(indexes) {
  return indexes.every((index, i) => i === 0 || index === indexes[i - 1] + 1);
}

function isTextEntryTarget(target) {
  return (
    target?.closest?.(
      'input:not([type="checkbox"]), textarea, select, [contenteditable="true"]',
    ) != null
  );
}

// Quotes a value for an attribute selector
function attr(value) {
  return JSON.stringify(String(value));
}

// The offset a running move animation currently adds to the element
function getAnimatedOffset(element, axis) {
  const transform = element ? getComputedStyle(element).transform : 'none';
  if (transform === 'none') {
    return 0;
  }
  const matrix = new DOMMatrixReadOnly(transform);
  return axis === 'row' ? matrix.m42 : matrix.m41;
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

function getSelectedRange(model) {
  const rows = [];
  const columns = new Set();
  Object.entries(model).forEach(([id, fields]) => {
    const selectedFields = Object.keys(fields).filter(
      (field) => fields[field] && !SPECIAL_FIELDS.includes(field),
    );
    if (selectedFields.length > 0) {
      rows.push(id);
      selectedFields.forEach((field) => columns.add(field));
    }
  });
  return { rows, columns: [...columns] };
}

// What Alt+Arrow moves, which is also what the highlight shows
function getTargets(focus, model) {
  if (!focus) {
    return { rows: [], columns: [] };
  }
  const range = getSelectedRange(model);
  const isDataField = !SPECIAL_FIELDS.includes(focus.field);
  if (focus.kind === 'header') {
    if (!isDataField) {
      return { rows: [], columns: [] };
    }
    return {
      rows: [],
      columns: range.columns.includes(focus.field) ? range.columns : [focus.field],
    };
  }
  if (model[focus.id]?.[focus.field]) {
    return range;
  }
  return { rows: [focus.id], columns: isDataField ? [focus.field] : [] };
}

export default function KeyboardReorderCurrent(props) {
  const { mode } = props;
  const apiRef = useGridApiRef();
  const theme = useTheme();
  const scope = React.useId();
  const rootRef = React.useRef(null);
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 30,
    maxColumns: 8,
  });

  const [focus, setFocus] = React.useState(null);
  const [hasFocus, setHasFocus] = React.useState(false);
  const [cellSelectionModel, setCellSelectionModel] = React.useState({});
  const [announcement, setAnnouncement] = React.useState({ key: 0, text: '' });

  const announce = React.useCallback((text) => {
    setAnnouncement((prev) => ({ key: prev.key + 1, text }));
  }, []);

  const getRowLabel = React.useCallback(
    (id) => String(apiRef.current?.getRow(id)?.commodity ?? id),
    [apiRef],
  );

  const getColumnLabel = React.useCallback(
    (field) => apiRef.current?.getColumn(field)?.headerName ?? field,
    [apiRef],
  );

  React.useEffect(() => {
    const api = apiRef.current;
    if (!api) {
      return undefined;
    }
    const unsubscribeCell = api.subscribeEvent('cellFocusIn', (params) => {
      setFocus({ kind: 'cell', id: params.id, field: params.field });
    });
    const unsubscribeHeader = api.subscribeEvent('columnHeaderFocus', (params) => {
      setFocus({ kind: 'header', field: params.field });
    });
    return () => {
      unsubscribeCell();
      unsubscribeHeader();
    };
  }, [apiRef]);

  // --- Animation ----------------------------------------------------------------------------------

  // Row offsets from the top of the scrollable content, so a scroll after the move doesn't count.
  // `visual` keeps the offset of a running animation, to start the next one from where the row is.
  const readRowOffsets = React.useCallback((visual) => {
    const offsets = new Map();
    const scroller = rootRef.current?.querySelector(
      `.${gridClasses.virtualScroller}`,
    );
    if (!scroller) {
      return offsets;
    }
    const contentTop = scroller.getBoundingClientRect().top - scroller.scrollTop;
    scroller.querySelectorAll(`.${gridClasses.row}[data-id]`).forEach((row) => {
      const animated = visual ? 0 : getAnimatedOffset(row, 'row');
      offsets.set(
        row.dataset.id,
        row.getBoundingClientRect().top - contentTop - animated,
      );
    });
    return offsets;
  }, []);

  const readColumnOffsets = React.useCallback(
    (visual) => {
      const positions = gridColumnPositionsSelector(apiRef);
      return new Map(
        gridVisibleColumnFieldsSelector(apiRef).map((field, index) => {
          const header = visual
            ? (apiRef.current?.getColumnHeaderElement(field) ?? null)
            : null;
          return [field, positions[index] + getAnimatedOffset(header, 'column')];
        }),
      );
    },
    [apiRef],
  );

  // Moving a row re-inserts its element, which drops the DOM focus
  const restoreFocus = React.useCallback(() => {
    const api = apiRef.current;
    const root = rootRef.current;
    if (!api || !root) {
      return;
    }
    const cell = gridFocusCellSelector(apiRef);
    const header = gridFocusColumnHeaderSelector(apiRef);
    let element = null;
    if (cell) {
      element = api.getCellElement(cell.id, cell.field);
    } else if (header) {
      element = api.getColumnHeaderElement(header.field);
    }
    if (!element || element.contains(document.activeElement)) {
      return;
    }
    (element.querySelector('[tabindex="0"]') ?? element).focus({
      preventScroll: true,
    });
  }, [apiRef]);

  // FLIP: once the grid has rendered the new order, start every moved element from where it was.
  // A press during a running move retargets from the current position instead of jumping back.
  const animateMove = React.useCallback(
    (axis, before) => {
      requestAnimationFrame(() => {
        restoreFocus();
        const root = rootRef.current;
        if (!root) {
          return;
        }
        const reduceMotion = prefersReducedMotion();
        const after =
          axis === 'row' ? readRowOffsets(false) : readColumnOffsets(false);
        after.forEach((offset, key) => {
          const previous = before.get(key);
          if (previous === undefined || Math.abs(previous - offset) < 0.5) {
            return;
          }
          const delta = previous - offset;
          const elements =
            axis === 'row'
              ? root.querySelectorAll(`.${gridClasses.row}[data-id=${attr(key)}]`)
              : root.querySelectorAll(
                  `.${gridClasses.columnHeader}[data-field=${attr(key)}], .${gridClasses.cell}[data-field=${attr(key)}]`,
                );
          const from =
            axis === 'row' ? `translateY(${delta}px)` : `translateX(${delta}px)`;
          elements.forEach((element) => {
            element
              .getAnimations()
              .filter((animation) => animation.id === MOVE_ANIMATION_ID)
              .forEach((animation) => animation.cancel());
            const animation = reduceMotion
              ? // No movement: a short fade still shows what changed place
                element.animate([{ opacity: 0.4 }, { opacity: 1 }], {
                  duration: DURATION_BASE,
                  easing: 'ease',
                })
              : element.animate([{ transform: from }, { transform: 'none' }], {
                  duration: DURATION_FAST,
                  easing: EASE_IN_OUT,
                });
            animation.id = MOVE_ANIMATION_ID;
          });
        });
      });
    },
    [readColumnOffsets, readRowOffsets, restoreFocus],
  );

  // --- Moves --------------------------------------------------------------------------------------

  // Moves the block by one position, or to the edge of the grid with `toEdge`
  const moveRows = React.useCallback(
    async (rowIds, direction, toEdge) => {
      const api = apiRef.current;
      if (!api || rowIds.length === 0) {
        return;
      }
      if (gridSortModelSelector(apiRef).length > 0) {
        announce("Rows can't be reordered while the grid is sorted.");
        return;
      }
      const visible = gridExpandedSortedRowIdsSelector(apiRef);
      const indexes = rowIds
        .map((id) => visible.findIndex((rowId) => String(rowId) === String(id)))
        .sort((a, b) => a - b);
      if (indexes[0] < 0 || !isContiguous(indexes)) {
        announce('The rows to move must be contiguous.');
        return;
      }
      const ordered = indexes.map((index) => visible[index]);
      const first = indexes[0];
      const count = indexes.length;
      let targetFirst;
      if (direction === 'up') {
        targetFirst = toEdge ? 0 : first - 1;
      } else {
        targetFirst = toEdge ? visible.length - count : first + 1;
      }
      if (
        targetFirst < 0 ||
        targetFirst + count > visible.length ||
        targetFirst === first
      ) {
        announce(
          `Can't move the ${count > 1 ? 'rows' : 'row'} further ${direction}.`,
        );
        return;
      }

      const before = readRowOffsets(true);
      // The rows of the block are placed one after the other, each one next to the previous one
      const sequence = direction === 'up' ? ordered : [...ordered].reverse();
      const [lead, ...rest] = sequence;
      const targetLast = targetFirst + count - 1;
      await api.setRowPosition(
        lead,
        visible[direction === 'up' ? targetFirst : targetLast],
        direction === 'up' ? 'above' : 'below',
      );
      await rest.reduce(
        (previous, rowId, i) =>
          previous.then(() =>
            api.setRowPosition(
              rowId,
              sequence[i],
              direction === 'up' ? 'below' : 'above',
            ),
          ),
        Promise.resolve(),
      );
      animateMove('row', before);

      api.scrollToIndexes({
        rowIndex: direction === 'up' ? targetFirst : targetLast,
      });
      if (count === 1) {
        announce(
          `Row ${getRowLabel(ordered[0])} moved to position ${targetFirst + 1} of ${
            visible.length
          }.`,
        );
      } else {
        announce(
          `${count} rows moved to positions ${targetFirst + 1} to ${targetLast + 1} of ${
            visible.length
          }.`,
        );
      }
    },
    [animateMove, apiRef, announce, getRowLabel, readRowOffsets],
  );

  // Moves the block by one position, or as far as allowed with `toEdge`
  const moveColumns = React.useCallback(
    (fields, direction, toEdge) => {
      const api = apiRef.current;
      if (!api || fields.length === 0) {
        return;
      }
      const getIndexes = () => {
        const visible = gridVisibleColumnFieldsSelector(apiRef);
        return fields.map((field) => visible.indexOf(field)).sort((a, b) => a - b);
      };
      const indexes = getIndexes();
      if (indexes[0] < 0 || !isContiguous(indexes)) {
        announce('The columns to move must be contiguous.');
        return;
      }
      const blocked = fields.find((field) => api.getColumn(field)?.disableReorder);
      if (blocked) {
        announce(`Column ${getColumnLabel(blocked)} can't be reordered.`);
        return;
      }
      const count = indexes.length;

      const before = readColumnOffsets(true);
      let moved = 0;
      // Each step moves the neighbour to the other side of the block, which moves the block by one
      do {
        const visible = gridVisibleColumnFieldsSelector(apiRef);
        const current = getIndexes();
        const first = current[0];
        const last = current[current.length - 1];
        const neighbour = visible[direction === 'left' ? first - 1 : last + 1];
        if (neighbour === undefined || api.getColumn(neighbour)?.disableReorder) {
          break;
        }
        api.setColumnIndex(
          neighbour,
          api.getColumnIndex(visible[direction === 'left' ? last : first], false),
        );
        moved += 1;
      } while (toEdge);

      if (moved === 0) {
        announce(
          `Can't move the ${count > 1 ? 'columns' : 'column'} further ${direction}.`,
        );
        return;
      }
      animateMove('column', before);

      const total = gridVisibleColumnFieldsSelector(apiRef).length;
      const [newFirst] = getIndexes();
      const newLast = newFirst + count - 1;
      api.scrollToIndexes({ colIndex: direction === 'left' ? newFirst : newLast });
      if (count === 1) {
        announce(
          `Column ${getColumnLabel(fields[0])} moved to position ${newFirst + 1} of ${total}.`,
        );
      } else {
        announce(
          `${count} columns moved to positions ${newFirst + 1} to ${newLast + 1} of ${total}.`,
        );
      }
    },
    [animateMove, apiRef, announce, getColumnLabel, readColumnOffsets],
  );

  // --- Keys ---------------------------------------------------------------------------------------

  // Captured before the grid sees the key: cell selection clears the range on any navigation key
  // without Shift, and Alt+Left/Right must not reach the browser as history navigation.
  const handleKeyDownCapture = React.useCallback(
    (event) => {
      const api = apiRef.current;
      const isVertical = event.key === 'ArrowUp' || event.key === 'ArrowDown';
      const isHorizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
      const isEdge = event.key === 'Home' || event.key === 'End';
      if (
        !api ||
        !(isVertical || isHorizontal || isEdge) ||
        !event.altKey ||
        event.shiftKey ||
        event.ctrlKey ||
        event.metaKey ||
        isTextEntryTarget(event.target)
      ) {
        return;
      }
      const cell = gridFocusCellSelector(apiRef);
      const header = gridFocusColumnHeaderSelector(apiRef);
      if (cell && api.getCellMode(cell.id, cell.field) === 'edit') {
        return;
      }
      let current = null;
      if (cell) {
        current = { kind: 'cell', ...cell };
      } else if (header) {
        current = { kind: 'header', field: header.field };
      }
      if (!current) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      const targets = getTargets(current, api.getCellSelectionModel());
      const towardsStart =
        event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'Home';
      // Alt+Home/End move rows from a cell, and columns from a column header
      const movesRows = isVertical || (isEdge && current.kind === 'cell');
      if (movesRows) {
        if (current.kind === 'cell') {
          moveRows(targets.rows, towardsStart ? 'up' : 'down', isEdge);
        }
      } else if (targets.columns.length === 0) {
        announce(`Column ${getColumnLabel(current.field)} can't be reordered.`);
      } else {
        moveColumns(targets.columns, towardsStart ? 'left' : 'right', isEdge);
      }
    },
    [announce, apiRef, getColumnLabel, moveColumns, moveRows],
  );

  const handleBlur = React.useCallback((event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setHasFocus(false);
    }
  }, []);

  // --- Highlight ----------------------------------------------------------------------------------

  const targets = React.useMemo(
    () =>
      hasFocus ? getTargets(focus, cellSelectionModel) : { rows: [], columns: [] },
    [cellSelectionModel, focus, hasFocus],
  );

  // A <style> element instead of `sx`, so a focus change doesn't re-render the grid.
  // Background images stack on top of the hover and selection backgrounds instead of replacing them.
  const highlightCss = React.useMemo(() => {
    const { hoverOpacity, selectedOpacity } = theme.palette.action;
    const layer = (tint) => `background-image: linear-gradient(${tint}, ${tint});`;
    const root = `[data-keyboard-reorder=${attr(scope)}]`;
    const rules = [];
    if (targets.rows.length > 0) {
      const rows = targets.rows
        .map((id) => `${root} .${gridClasses.row}[data-id=${attr(id)}]`)
        .join(', ');
      const tint = alpha(theme.palette.text.primary, hoverOpacity * ROW_OPACITY);
      rules.push(`${rows} { ${layer(tint)} }`);
    }
    // Columns are marked on the header only
    if (targets.columns.length > 0) {
      const headers = targets.columns
        .map(
          (field) =>
            `${root} .${gridClasses.columnHeader}[data-field=${attr(field)}]`,
        )
        .join(', ');
      const tint = alpha(
        theme.palette.primary.main,
        selectedOpacity * HEADER_OPACITY,
      );
      rules.push(`${headers} { ${layer(tint)} }`);
    }
    return rules.join('\n');
  }, [scope, targets, theme]);

  const describeTargets = () => {
    if (targets.rows.length === 0 && targets.columns.length === 0) {
      return 'none';
    }
    const parts = [];
    if (targets.rows.length > 0) {
      parts.push(
        `${targets.rows.length === 1 ? 'row' : 'rows'} ${targets.rows
          .map(getRowLabel)
          .join(', ')}`,
      );
    }
    if (targets.columns.length > 0) {
      parts.push(
        `${targets.columns.length === 1 ? 'column' : 'columns'} ${targets.columns
          .map(getColumnLabel)
          .join(', ')}`,
      );
    }
    return parts.join('; ');
  };

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
          <strong>Moves:</strong> {describeTargets()}
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
      <style>{highlightCss}</style>
      <div
        ref={rootRef}
        data-keyboard-reorder={scope}
        onKeyDownCapture={handleKeyDownCapture}
        onFocus={() => setHasFocus(true)}
        onBlur={handleBlur}
        style={{ height: 520, width: '100%' }}
      >
        <DataGridPremium
          {...data}
          apiRef={apiRef}
          rowReordering
          rowSelection={false}
          cellSelection={mode === 'multi'}
          onCellSelectionModelChange={setCellSelectionModel}
        />
      </div>
    </Box>
  );
}
