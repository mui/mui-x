'use client';
import * as React from 'react';
import { platform } from '@base-ui/utils/platform';
import { useRtl } from '@mui/system/RtlProvider';
import type { RefObject } from '@mui/x-internals/types';
import ownerDocument from '@mui/utils/ownerDocument';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  getGridCellElement,
  getRowIndexRelativeToAllRows,
  getTotalHeaderHeight,
  getVisibleRows,
  GRID_TREE_DATA_GROUPING_FIELD,
  isEventForCellContent,
  isEventFromPreMountedEditor,
  isFillDownShortcut,
  isFillRightShortcut,
  isNavigationKey,
  isSelectAllShortcut,
  serializeCellValue,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid-pro/internals';
import type { GridPipeProcessor, GridStateInitializer } from '@mui/x-data-grid-pro/internals';
import {
  useGridEvent,
  useGridApiMethod,
  GRID_ACTIONS_COLUMN_TYPE,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
  gridClasses,
  gridFocusCellSelector,
  GRID_REORDER_COL_DEF,
  gridRowNodeSelector,
  gridSortedRowIdsSelector,
  gridDimensionsSelector,
  GridCellModes,
} from '@mui/x-data-grid-pro';
import type {
  GridEventListener,
  GridEventLookup,
  GridCellCoordinates,
  GridRowId,
  GridCellParams,
  MuiEvent,
} from '@mui/x-data-grid-pro';
import { gridCellSelectionStateSelector } from './gridCellSelectionSelector';
import type { GridCellSelectionApi, GridCellSelectionModel } from './gridCellSelectionInterfaces';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { CellValueUpdater } from '../clipboard/useGridClipboardImport';
import { GRID_FORMULA_ROW_NUMBER_FIELD } from '../formula/gridFormulaPositionContext';
import { isGroupingColumn } from '../rowGrouping/gridRowGroupingUtils';

export const cellSelectionStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'cellSelectionModel' | 'initialState'>
> = (state, props) => ({
  ...state,
  cellSelection: { ...(props.cellSelectionModel ?? props.initialState?.cellSelection) },
});

function isKeyboardEvent(event: any): event is React.KeyboardEvent {
  return !!event.key;
}

/**
 * A cell at one end of a range, with its row index and visible column index when the range was extended.
 */
interface CellRangeEnd extends GridCellCoordinates {
  rowIndex: number | undefined;
  columnIndex: number;
}

function isSameCell(a: GridCellCoordinates, b: GridCellCoordinates) {
  return a.id === b.id && a.field === b.field;
}

const ROW_RANGE_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

/**
 * Ctrl/Cmd + Shift + vertical navigation keys or Space act on whole rows.
 * With the row selection, they select rows. Otherwise, they select all the cells of the rows.
 */
function isRowRangeShortcut(event: React.KeyboardEvent) {
  return event.shiftKey && (event.ctrlKey || event.metaKey) && ROW_RANGE_KEYS.has(event.key);
}

// The first index from `startIndex`, moving by `step`, for which `isSelectable` is true.
// `null` if there is none, so the keyboard does not move the range into cells that cannot be selected.
function findSelectableIndex(
  startIndex: number,
  step: 1 | -1,
  length: number,
  isSelectable: (index: number) => boolean,
): number | null {
  for (let index = startIndex; index >= 0 && index < length; index += step) {
    if (isSelectable(index)) {
      return index;
    }
  }
  return null;
}

const AUTO_SCROLL_SENSITIVITY = 50; // The distance from the edge to start scrolling
const AUTO_SCROLL_SPEED = 20; // The speed to scroll once the mouse enters the sensitivity area
const FILL_HANDLE_HIT_AREA = 16; // px — size of the interactive hit area for the fill handle

function getSelectedOrFocusedCells(
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

// Answers "is more than one cell selected" without the cost of
// `getSelectedCellsAsArray`, which allocates one object per selected cell
function hasMultipleSelectedCells(apiRef: RefObject<GridPrivateApiPremium>): boolean {
  const cellSelectionModel = apiRef.current.getCellSelectionModel();
  const visibleRows = getVisibleRows(apiRef);
  let selectedCellCount = 0;
  for (let i = 0; i < visibleRows.rows.length && selectedCellCount < 2; i += 1) {
    const fieldsMap = cellSelectionModel[visibleRows.rows[i].id];
    if (fieldsMap !== undefined) {
      const fields = Object.keys(fieldsMap);
      for (let j = 0; j < fields.length && selectedCellCount < 2; j += 1) {
        if (fieldsMap[fields[j]]) {
          selectedCellCount += 1;
        }
      }
    }
  }
  return selectedCellCount >= 2;
}

interface FillSourceState {
  cells: { id: GridRowId; field: string }[];
  fields: string[];
  rowIndexRange: { start: number; end: number };
  columnIndexRange: { start: number; end: number };
  rowIdMap: Map<string, GridRowId>;
}

interface FillDragState {
  isDragging: boolean;
  direction: 'vertical' | 'horizontal' | null;
  targetRowIds: GridRowId[];
  targetFields: string[];
  decoratedElements: Set<Element>;
  moveRAF: number | null;
  doc: Document | null;
  moveHandler: ((event: MouseEvent) => void) | null;
  upHandler: (() => void) | null;
}

function createInitialFillDragState(): FillDragState {
  return {
    isDragging: false,
    direction: null,
    targetRowIds: [],
    targetFields: [],
    decoratedElements: new Set(),
    moveRAF: null,
    doc: null,
    moveHandler: null,
    upHandler: null,
  };
}

export const useGridCellSelection = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'cellSelection'
    | 'rowSelection'
    | 'cellSelectionModel'
    | 'onCellSelectionModelChange'
    | 'pagination'
    | 'paginationMode'
    | 'ignoreValueFormatterDuringExport'
    | 'clipboardCopyCellDelimiter'
    | 'columnHeaderHeight'
    | 'cellSelectionFillHandle'
    | 'processRowUpdate'
    | 'onProcessRowUpdateError'
    | 'getRowId'
  >,
) => {
  const hasRootReference = apiRef.current.rootElementRef.current !== null;
  const isRtl = useRtl();
  const cellWithVirtualFocus = React.useRef<GridCellCoordinates>(null);
  const lastMouseDownCell = React.useRef<GridCellCoordinates>(null);
  const lastDrag = React.useRef<{ start: GridCellCoordinates; end: GridCellCoordinates }>(null);
  // The ends of the range the last time it was extended.
  // If one of them moved since then, for example, after a row or a column was moved, sorted, or filtered,
  // the cells between them are not the ones the user went over.
  const rangeEnds = React.useRef<{ anchor: CellRangeEnd; end: CellRangeEnd }>(null);
  const mousePosition = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const autoScrollRAF = React.useRef<number>(null);
  const totalHeaderHeight = getTotalHeaderHeight(apiRef, props);

  // Fill handle state — grouped by lifecycle:
  // fillSource: set on mousedown, read-only during drag, cleared on mouseup
  // fillDrag: managed during active drag, reset on mouseup
  const fillSource = React.useRef<FillSourceState | null>(null);
  const fillDrag = React.useRef<FillDragState>(createInitialFillDragState());
  const skipNextCellClick = React.useRef(false);

  const ignoreValueFormatterProp = props.ignoreValueFormatterDuringExport;
  const ignoreValueFormatter =
    (typeof ignoreValueFormatterProp === 'object'
      ? ignoreValueFormatterProp?.clipboardExport
      : ignoreValueFormatterProp) || false;
  const clipboardCopyCellDelimiter = props.clipboardCopyCellDelimiter;

  apiRef.current.registerControlState({
    stateId: 'cellSelection',
    propModel: props.cellSelectionModel,
    propOnChange: props.onCellSelectionModelChange,
    stateSelector: gridCellSelectionStateSelector,
    changeEvent: 'cellSelectionChange',
  });

  const runIfCellSelectionIsEnabled =
    <Args extends any[]>(callback: (...args: Args) => void) =>
    (...args: Args) => {
      if (props.cellSelection) {
        callback(...args);
      }
    };

  const isCellSelected = React.useCallback<GridCellSelectionApi['isCellSelected']>(
    (id, field) => {
      if (!props.cellSelection) {
        return false;
      }
      const cellSelectionModel = gridCellSelectionStateSelector(apiRef);
      return cellSelectionModel[id] ? !!cellSelectionModel[id][field] : false;
    },
    [apiRef, props.cellSelection],
  );

  const getCellSelectionModel = React.useCallback(() => {
    return gridCellSelectionStateSelector(apiRef);
  }, [apiRef]);

  const setCellSelectionModel = React.useCallback<GridCellSelectionApi['setCellSelectionModel']>(
    (newModel) => {
      if (!props.cellSelection) {
        return;
      }
      apiRef.current.setState((prevState) => ({ ...prevState, cellSelection: newModel }));
    },
    [apiRef, props.cellSelection],
  );

  const isSelectableField = React.useCallback(
    (field: string) => {
      if (field === GRID_CHECKBOX_SELECTION_COL_DEF.field) {
        return false;
      }

      if (field === GRID_DETAIL_PANEL_TOGGLE_FIELD) {
        return false;
      }

      if (field === GRID_REORDER_COL_DEF.field) {
        return false;
      }

      if (field === GRID_FORMULA_ROW_NUMBER_FIELD) {
        return false;
      }

      const column = apiRef.current.getColumn(field);
      return column?.type !== GRID_ACTIONS_COLUMN_TYPE;
    },
    [apiRef],
  );

  const isSelectableRow = React.useCallback(
    (id: GridRowId) => {
      const rowNode = gridRowNodeSelector(apiRef, id);
      // Skeleton rows have no data and footer rows only contain aggregated values
      return !!rowNode && rowNode.type !== 'skeletonRow' && rowNode.type !== 'footer';
    },
    [apiRef],
  );

  const selectCellRange = React.useCallback<GridCellSelectionApi['selectCellRange']>(
    (start, end, keepOtherSelected = false) => {
      const startRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(start.id);
      const startColumnIndex = apiRef.current.getColumnIndex(start.field);
      const endRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(end.id);
      const endColumnIndex = apiRef.current.getColumnIndex(end.field);

      let finalStartRowIndex = startRowIndex;
      let finalStartColumnIndex = startColumnIndex;
      let finalEndRowIndex = endRowIndex;
      let finalEndColumnIndex = endColumnIndex;

      if (finalStartRowIndex > finalEndRowIndex) {
        finalStartRowIndex = endRowIndex;
        finalEndRowIndex = startRowIndex;
      }

      if (finalStartColumnIndex > finalEndColumnIndex) {
        finalStartColumnIndex = endColumnIndex;
        finalEndColumnIndex = startColumnIndex;
      }

      const visibleColumns = apiRef.current.getVisibleColumns();
      const visibleRows = getVisibleRows(apiRef);
      const rowsInRange = visibleRows.rows
        .slice(finalStartRowIndex, finalEndRowIndex + 1)
        .filter((row) => isSelectableRow(row.id));
      const columnsInRange = visibleColumns
        .slice(finalStartColumnIndex, finalEndColumnIndex + 1)
        .filter((column) => isSelectableField(column.field));

      const newModel = keepOtherSelected ? { ...apiRef.current.getCellSelectionModel() } : {};

      // Without this check, a range with only non-selectable columns would add
      // empty row entries to the model
      if (columnsInRange.length > 0) {
        rowsInRange.forEach((row) => {
          if (!newModel[row.id]) {
            newModel[row.id] = {};
          }
          columnsInRange.forEach((column) => {
            newModel[row.id][column.field] = true;
          });
        });
      }

      apiRef.current.setCellSelectionModel(newModel);
    },
    [apiRef, isSelectableField, isSelectableRow],
  );

  const getSelectedCellsAsArray = React.useCallback<
    GridCellSelectionApi['getSelectedCellsAsArray']
  >(() => {
    const selectionModel = apiRef.current.getCellSelectionModel();
    const currentVisibleRows = getVisibleRows(apiRef, props);
    const sortedEntries = currentVisibleRows.rows.reduce(
      (result, row) => {
        if (row.id in selectionModel) {
          result.push([row.id, selectionModel[row.id]]);
        }
        return result;
      },
      [] as [GridRowId, Record<string, boolean>][],
    );

    return sortedEntries.reduce<{ id: GridRowId; field: string }[]>(
      (selectedCells, [id, fields]) => {
        selectedCells.push(
          ...Object.entries(fields).reduce<{ id: GridRowId; field: string }[]>(
            (selectedFields, [field, isSelected]) => {
              if (isSelected) {
                selectedFields.push({ id, field });
              }
              return selectedFields;
            },
            [],
          ),
        );
        return selectedCells;
      },
      [],
    );
  }, [apiRef, props]);

  const cellSelectionApi: GridCellSelectionApi = {
    isCellSelected,
    getCellSelectionModel,
    setCellSelectionModel,
    selectCellRange,
    getSelectedCellsAsArray,
  };

  useGridApiMethod(apiRef, cellSelectionApi, 'public');

  const hasClickedValidCellForRangeSelection = React.useCallback(
    (params: GridCellParams) => {
      if (!isSelectableField(params.field)) {
        return false;
      }

      return params.rowNode.type !== 'pinnedRow';
    },
    [isSelectableField],
  );

  const handleMouseUp = useEventCallback(() => {
    lastMouseDownCell.current = null;
    apiRef.current.rootElementRef?.current?.classList.remove(
      gridClasses['root--disableUserSelection'],
    );

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    stopAutoScroll();
  });

  const handleCellMouseDown = React.useCallback<GridEventListener<'cellMouseDown'>>(
    (params, event) => {
      // Skip if the click comes from the right-button or, only on macOS, Ctrl is pressed
      // Fix for https://github.com/mui/mui-x/pull/6567#issuecomment-1329155578
      if (event.button !== 0 || (event.ctrlKey && platform.os.mac)) {
        return;
      }

      if (params.field === GRID_REORDER_COL_DEF.field) {
        return;
      }

      const focusedCell = gridFocusCellSelector(apiRef);
      if (hasClickedValidCellForRangeSelection(params) && event.shiftKey && focusedCell) {
        event.preventDefault();
      }

      lastMouseDownCell.current = { id: params.id, field: params.field };
      lastDrag.current = null;
      apiRef.current.rootElementRef?.current?.classList.add(
        gridClasses['root--disableUserSelection'],
      );

      const document = ownerDocument(apiRef.current.rootElementRef?.current);
      document.addEventListener('mouseup', handleMouseUp, { once: true });
    },
    [apiRef, handleMouseUp, hasClickedValidCellForRangeSelection],
  );

  const stopAutoScroll = React.useCallback(() => {
    if (autoScrollRAF.current) {
      cancelAnimationFrame(autoScrollRAF.current);
      autoScrollRAF.current = null;
    }
  }, []);

  const getCellRangeEnd = useEventCallback((cell: GridCellCoordinates): CellRangeEnd => ({
    id: cell.id,
    field: cell.field,
    rowIndex: getVisibleRows(apiRef).rowIdToIndexMap.get(cell.id),
    columnIndex: apiRef.current.getColumnIndex(cell.field),
  }));

  const saveRangeEnds = useEventCallback(
    (anchor: GridCellCoordinates, end: GridCellCoordinates) => {
      rangeEnds.current = { anchor: getCellRangeEnd(anchor), end: getCellRangeEnd(end) };
    },
  );

  const hasRangeEndMoved = useEventCallback(
    (anchor: GridCellCoordinates, end: GridCellCoordinates) => {
      const saved = rangeEnds.current;
      // The range was not extended from these cells
      if (!saved || !isSameCell(saved.anchor, anchor) || !isSameCell(saved.end, end)) {
        return false;
      }
      const hasMoved = (savedEnd: CellRangeEnd) => {
        const currentEnd = getCellRangeEnd(savedEnd);
        return (
          currentEnd.rowIndex !== savedEnd.rowIndex ||
          currentEnd.columnIndex !== savedEnd.columnIndex
        );
      };
      return hasMoved(saved.anchor) || hasMoved(saved.end);
    },
  );

  const handleCellFocusIn = React.useCallback<GridEventListener<'cellFocusIn'>>((params) => {
    const drag = lastDrag.current;
    lastDrag.current = null;
    // The cell where the drag started gets the focus once the mouse is released,
    // the range keeps extending from the cell where the drag ended
    if (drag && drag.start.id === params.id && drag.start.field === params.field) {
      cellWithVirtualFocus.current = drag.end;
      return;
    }
    cellWithVirtualFocus.current = { id: params.id, field: params.field };
  }, []);

  const startAutoScroll = React.useCallback(() => {
    if (autoScrollRAF.current) {
      return;
    }

    if (!apiRef.current.virtualScrollerRef?.current) {
      return;
    }

    function autoScroll() {
      if (!mousePosition.current || !apiRef.current.virtualScrollerRef?.current) {
        return;
      }

      const dimensions = gridDimensionsSelector(apiRef);

      const { x: mouseX, y: mouseY } = mousePosition.current;
      const { width, height: viewportOuterHeight } = dimensions.viewportOuterSize;
      const height = viewportOuterHeight - totalHeaderHeight;

      let deltaX = 0;
      let deltaY = 0;
      let factor = 0;

      if (mouseY <= AUTO_SCROLL_SENSITIVITY && dimensions.hasScrollY) {
        // When scrolling up, the multiplier increases going closer to the top edge
        factor = (AUTO_SCROLL_SENSITIVITY - mouseY) / -AUTO_SCROLL_SENSITIVITY;
        deltaY = AUTO_SCROLL_SPEED;
      } else if (mouseY >= height - AUTO_SCROLL_SENSITIVITY && dimensions.hasScrollY) {
        // When scrolling down, the multiplier increases going closer to the bottom edge
        factor = (mouseY - (height - AUTO_SCROLL_SENSITIVITY)) / AUTO_SCROLL_SENSITIVITY;
        deltaY = AUTO_SCROLL_SPEED;
      } else if (mouseX <= AUTO_SCROLL_SENSITIVITY && dimensions.hasScrollX) {
        // When scrolling left, the multiplier increases going closer to the left edge
        factor = (AUTO_SCROLL_SENSITIVITY - mouseX) / -AUTO_SCROLL_SENSITIVITY;
        deltaX = AUTO_SCROLL_SPEED;
      } else if (mouseX >= width - AUTO_SCROLL_SENSITIVITY && dimensions.hasScrollX) {
        // When scrolling right, the multiplier increases going closer to the right edge
        factor = (mouseX - (width - AUTO_SCROLL_SENSITIVITY)) / AUTO_SCROLL_SENSITIVITY;
        deltaX = AUTO_SCROLL_SPEED;
      }

      if (deltaX !== 0 || deltaY !== 0) {
        const { scrollLeft, scrollTop } = apiRef.current.virtualScrollerRef.current;

        apiRef.current.scroll({
          top: scrollTop + deltaY * factor,
          left: scrollLeft + deltaX * factor,
        });
      }

      autoScrollRAF.current = requestAnimationFrame(autoScroll);
    }

    autoScroll();
  }, [apiRef, totalHeaderHeight]);

  const handleCellMouseOver = React.useCallback<GridEventListener<'cellMouseOver'>>(
    (params, event) => {
      if (!lastMouseDownCell.current) {
        return;
      }

      const { id, field } = params;

      // Shift + navigation keys keep extending the range from the cell where the drag ends
      lastDrag.current = { start: lastMouseDownCell.current, end: { id, field } };
      cellWithVirtualFocus.current = { id, field };
      apiRef.current.selectCellRange(
        lastMouseDownCell.current,
        { id, field },
        event.ctrlKey || event.metaKey,
      );
      saveRangeEnds(lastMouseDownCell.current, { id, field });

      const virtualScrollerRect =
        apiRef.current.virtualScrollerRef?.current?.getBoundingClientRect();

      if (!virtualScrollerRect) {
        return;
      }

      const dimensions = gridDimensionsSelector(apiRef);
      const { x, y } = virtualScrollerRect;
      const { width, height: viewportOuterHeight } = dimensions.viewportOuterSize;
      const height = viewportOuterHeight - totalHeaderHeight;
      const mouseX = event.clientX - x;
      const mouseY = event.clientY - y - totalHeaderHeight;
      mousePosition.current = { x: mouseX, y: mouseY };

      const hasEnteredVerticalSensitivityArea =
        mouseY <= AUTO_SCROLL_SENSITIVITY || mouseY >= height - AUTO_SCROLL_SENSITIVITY;

      const hasEnteredHorizontalSensitivityArea =
        mouseX <= AUTO_SCROLL_SENSITIVITY || mouseX >= width - AUTO_SCROLL_SENSITIVITY;

      const hasEnteredSensitivityArea =
        hasEnteredVerticalSensitivityArea || hasEnteredHorizontalSensitivityArea;

      if (hasEnteredSensitivityArea) {
        // Mouse has entered the sensitity area for the first time
        startAutoScroll();
      } else {
        // Mouse has left the sensitivity area while auto scroll is on
        stopAutoScroll();
      }
    },
    [apiRef, saveRangeEnds, startAutoScroll, stopAutoScroll, totalHeaderHeight],
  );

  const handleCellClick = useEventCallback<
    [GridEventLookup['cellClick']['params'], GridEventLookup['cellClick']['event']],
    void
  >((params, event) => {
    // After a fill handle mousedown+mouseup (click without drag), skip the
    // subsequent cell click so it doesn't replace the multi-cell selection.
    if (skipNextCellClick.current) {
      skipNextCellClick.current = false;
      return;
    }

    const { id, field } = params;

    if (!hasClickedValidCellForRangeSelection(params)) {
      return;
    }

    const focusedCell = gridFocusCellSelector(apiRef);
    if (event.shiftKey && focusedCell) {
      // Before the state update, the cell classes read it
      cellWithVirtualFocus.current = { id, field };
      apiRef.current.selectCellRange(focusedCell, { id, field });
      saveRangeEnds(focusedCell, { id, field });
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      // Add the clicked cell to the selection
      const prevModel = apiRef.current.getCellSelectionModel();
      apiRef.current.setCellSelectionModel({
        ...prevModel,
        [id]: { ...prevModel[id], [field]: !apiRef.current.isCellSelected(id, field) },
      });
    } else {
      // Clear the selection and keep only the clicked cell selected
      apiRef.current.setCellSelectionModel({ [id]: { [field]: true } });
    }
  });

  const selectAllCells = useEventCallback<
    [GridEventLookup['cellKeyDown']['params'], MuiEvent<GridEventLookup['cellKeyDown']['event']>],
    void
  >((params, event) => {
    // Get the most recent cell mode because it may have been changed by another listener
    if (apiRef.current.getCellMode(params.id, params.field) === GridCellModes.Edit) {
      return;
    }

    // The shortcut belongs to the content of the cell, for example, to select the text of a text field
    if (isEventForCellContent(event)) {
      return;
    }

    // Prevent the native select-all of the text on the page
    event.preventDefault();
    // Block the `cellKeyDown` listener of the row selection feature, which is subscribed
    // after this one and would select all rows instead
    event.defaultMuiPrevented = true;

    const visibleRows = getVisibleRows(apiRef);
    const selectableColumns = apiRef.current
      .getVisibleColumns()
      .filter((column) => isSelectableField(column.field));

    if (visibleRows.rows.length === 0 || selectableColumns.length === 0) {
      return;
    }

    const newModel: GridCellSelectionModel = {};
    visibleRows.rows.forEach((row) => {
      if (!isSelectableRow(row.id)) {
        return;
      }
      const rowModel: GridCellSelectionModel[GridRowId] = {};
      selectableColumns.forEach((column) => {
        rowModel[column.field] = true;
      });
      newModel[row.id] = rowModel;
    });

    apiRef.current.setCellSelectionModel(newModel);
  });

  const canSelectCellWithSpace = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent) => {
      if (event.key !== ' ' || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) {
        return false;
      }
      // Space expands and collapses the groups
      if (params.field === GRID_TREE_DATA_GROUPING_FIELD || isGroupingColumn(params.field)) {
        return false;
      }
      if (!hasClickedValidCellForRangeSelection(params) || !isSelectableRow(params.id)) {
        return false;
      }
      // Keep the native behavior of the elements rendered in the cell, for example, a button.
      // The pre-mounted editor (`imeFastEdit`) stands in for the cell.
      return (
        event.target === apiRef.current.getCellElement(params.id, params.field) ||
        isEventFromPreMountedEditor(event)
      );
    },
    [apiRef, hasClickedValidCellForRangeSelection, isSelectableRow],
  );

  const selectCellsOfRows = useEventCallback(
    (
      params: GridEventLookup['cellKeyDown']['params'],
      event: React.KeyboardEvent,
      otherCell: GridCellCoordinates,
    ) => {
      const visibleRows = getVisibleRows(apiRef);
      const visibleColumns = apiRef.current.getVisibleColumns();
      const rowCount = visibleRows.rows.length;
      const lastRowIndex = rowCount - 1;
      const currentRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(otherCell.id);
      const pageSize = apiRef.current.getViewportPageSize();
      const isRowIndexSelectable = (index: number) => isSelectableRow(visibleRows.rows[index].id);
      let endRowIndex: number | null;
      let endField = otherCell.field;

      switch (event.key) {
        case 'ArrowDown':
          endRowIndex = findSelectableIndex(currentRowIndex + 1, 1, rowCount, isRowIndexSelectable);
          break;
        case 'ArrowUp':
          endRowIndex = findSelectableIndex(
            currentRowIndex - 1,
            -1,
            rowCount,
            isRowIndexSelectable,
          );
          break;
        case 'PageDown':
          endRowIndex = findSelectableIndex(
            Math.min(currentRowIndex + pageSize, lastRowIndex),
            -1,
            rowCount,
            isRowIndexSelectable,
          );
          break;
        case 'PageUp':
          endRowIndex = findSelectableIndex(
            Math.max(currentRowIndex - pageSize, 0),
            1,
            rowCount,
            isRowIndexSelectable,
          );
          break;
        case 'Home':
          endRowIndex = findSelectableIndex(0, 1, rowCount, isRowIndexSelectable);
          break;
        case 'End':
          endRowIndex = findSelectableIndex(lastRowIndex, -1, rowCount, isRowIndexSelectable);
          break;
        default:
          // Space selects the row of the focused cell
          endRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(params.id);
          endField = params.field;
      }

      if (endRowIndex === null || visibleColumns.length === 0) {
        return;
      }

      const endRowId = visibleRows.rows[endRowIndex].id;
      cellWithVirtualFocus.current = { id: endRowId, field: endField };

      apiRef.current.scrollToIndexes({
        rowIndex: getRowIndexRelativeToAllRows(apiRef, endRowId),
        colIndex: apiRef.current.getColumnIndex(endField),
      });

      apiRef.current.selectCellRange(
        { id: params.id, field: visibleColumns[0].field },
        { id: endRowId, field: visibleColumns[visibleColumns.length - 1].field },
      );
      saveRangeEnds(params, cellWithVirtualFocus.current);
    },
  );

  const handleCellKeyDown = useEventCallback<
    [GridEventLookup['cellKeyDown']['params'], MuiEvent<GridEventLookup['cellKeyDown']['event']>],
    void
  >((params, event) => {
    if (isSelectAllShortcut(event)) {
      selectAllCells(params, event);
      return;
    }

    if (!isNavigationKey(event.key)) {
      return;
    }

    // Get the most recent cell mode because it may have been changed by another listener.
    // While editing, these keys belong to the edit component, for example, to move the caret.
    if (apiRef.current.getCellMode(params.id, params.field) === GridCellModes.Edit) {
      return;
    }

    // The keys belong to the content of the cell, for example, to select the text of a text field
    if (isEventForCellContent(event)) {
      return;
    }

    if (canSelectCellWithSpace(params, event)) {
      // Prevent the page from scrolling
      event.preventDefault();
      cellWithVirtualFocus.current = { id: params.id, field: params.field };
      apiRef.current.setCellSelectionModel({ [params.id]: { [params.field]: true } });
      return;
    }

    if (!cellWithVirtualFocus.current) {
      // The cell got the DOM focus without `cellFocusIn` being published, for example, with `element.focus()`
      cellWithVirtualFocus.current = { id: params.id, field: params.field };
    }

    if (!event.shiftKey) {
      apiRef.current.setCellSelectionModel({});
      return;
    }

    if (isRowRangeShortcut(event) && props.rowSelection) {
      // The focus moves and the row selection handles the shortcut
      return;
    }

    // The focus does not move, the browser should not scroll
    event.preventDefault();

    if (hasRangeEndMoved(params, cellWithVirtualFocus.current)) {
      // Restart the range from the focused cell
      cellWithVirtualFocus.current = { id: params.id, field: params.field };
    }

    const { current: otherCell } = cellWithVirtualFocus;
    const visibleRows = getVisibleRows(apiRef);
    // For example, pinned rows are not part of the cell selection
    if (
      !visibleRows.rowIdToIndexMap.has(params.id) ||
      !visibleRows.rowIdToIndexMap.has(otherCell.id)
    ) {
      return;
    }

    if (isRowRangeShortcut(event)) {
      selectCellsOfRows(params, event, otherCell);
      return;
    }

    const visibleColumns = apiRef.current.getVisibleColumns();
    const rowCount = visibleRows.rows.length;
    const columnCount = visibleColumns.length;
    const currentRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(otherCell.id);
    const currentColumnIndex = apiRef.current.getColumnIndex(otherCell.field);
    const pageSize = apiRef.current.getViewportPageSize();
    const isRowIndexSelectable = (index: number) => isSelectableRow(visibleRows.rows[index].id);
    const isColumnIndexSelectable = (index: number) =>
      isSelectableField(visibleColumns[index].field);
    // In RTL, the next column on the right has a lower index
    const rightStep: 1 | -1 = isRtl ? -1 : 1;
    const leftStep: 1 | -1 = isRtl ? 1 : -1;
    let endRowIndex: number | null = currentRowIndex;
    let endColumnIndex: number | null = currentColumnIndex;

    switch (event.key) {
      case 'ArrowDown':
        endRowIndex = findSelectableIndex(currentRowIndex + 1, 1, rowCount, isRowIndexSelectable);
        break;
      case 'ArrowUp':
        endRowIndex = findSelectableIndex(currentRowIndex - 1, -1, rowCount, isRowIndexSelectable);
        break;
      case 'ArrowRight':
        endColumnIndex = findSelectableIndex(
          currentColumnIndex + rightStep,
          rightStep,
          columnCount,
          isColumnIndexSelectable,
        );
        break;
      case 'ArrowLeft':
        endColumnIndex = findSelectableIndex(
          currentColumnIndex + leftStep,
          leftStep,
          columnCount,
          isColumnIndexSelectable,
        );
        break;
      case 'Home':
        endColumnIndex = findSelectableIndex(0, 1, columnCount, isColumnIndexSelectable);
        break;
      case 'End':
        endColumnIndex = findSelectableIndex(
          columnCount - 1,
          -1,
          columnCount,
          isColumnIndexSelectable,
        );
        break;
      case 'PageDown':
        endRowIndex = findSelectableIndex(
          Math.min(currentRowIndex + pageSize, rowCount - 1),
          -1,
          rowCount,
          isRowIndexSelectable,
        );
        break;
      case 'PageUp':
        endRowIndex = findSelectableIndex(
          Math.max(currentRowIndex - pageSize, 0),
          1,
          rowCount,
          isRowIndexSelectable,
        );
        break;
      default:
        // Shift+Space selects the range up to the cell with the virtual focus
        break;
    }

    // There is no selectable cell in this direction, the range stays as it is
    if (endRowIndex === null || endColumnIndex === null) {
      return;
    }

    cellWithVirtualFocus.current = {
      id: visibleRows.rows[endRowIndex].id,
      field: visibleColumns[endColumnIndex].field,
    };

    apiRef.current.scrollToIndexes({
      rowIndex: getRowIndexRelativeToAllRows(apiRef, visibleRows.rows[endRowIndex].id),
      colIndex: endColumnIndex,
    });

    const { id, field } = params;
    apiRef.current.selectCellRange({ id, field }, cellWithVirtualFocus.current);
    saveRangeEnds({ id, field }, cellWithVirtualFocus.current);
  });

  const serializeCellForClipboard = useEventCallback((id: GridRowId, field: string) => {
    const cellParams = apiRef.current.getCellParams(id, field);

    return serializeCellValue(cellParams, {
      csvOptions: {
        delimiter: clipboardCopyCellDelimiter,
        shouldAppendQuotes: false,
        escapeFormulas: false,
      },
      ignoreValueFormatter,
    });
  });

  // Helper: get source values for a specific field from stored source cells
  const getSourceValuesForField = React.useCallback(
    (field: string): string[] => {
      const sourceValues: string[] = [];
      for (const cell of fillSource.current?.cells ?? []) {
        if (cell.field === field) {
          sourceValues.push(serializeCellForClipboard(cell.id, cell.field));
        }
      }
      return sourceValues;
    },
    [serializeCellForClipboard],
  );

  // Helper: the source cells for a field, in the same order as
  // getSourceValuesForField — so sourceCells[i] is the origin of sourceValues[i]
  // when adjusting a dragged formula's references for its target cell.
  const getSourceCellsForField = React.useCallback(
    (field: string): { id: GridRowId; field: string }[] => {
      const sourceCells: { id: GridRowId; field: string }[] = [];
      for (const cell of fillSource.current?.cells ?? []) {
        if (cell.field === field) {
          sourceCells.push({ id: cell.id, field: cell.field });
        }
      }
      return sourceCells;
    },
    [],
  );

  const getFillSourceData = React.useCallback((): string[][] => {
    const selectedCells = fillSource.current?.cells ?? [];
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
      rowValues.set(cell.field, serializeCellForClipboard(cell.id, cell.field));
    });

    return orderedRowIds.map((rowId) => {
      const rowValues = valueLookup.get(String(rowId));
      return orderedFields.map((field) => rowValues?.get(field) ?? '');
    });
  }, [apiRef, serializeCellForClipboard]);

  const getFillDownSourceData = React.useCallback(
    (selectedCells: { id: GridRowId; field: string }[]): string[][] => {
      if (selectedCells.length === 0) {
        return [];
      }

      const visibleRows = getVisibleRows(apiRef).rows;
      const visibleColumns = apiRef.current.getVisibleColumns();
      const rowIndexLookup = new Map(visibleRows.map((row, index) => [String(row.id), index]));
      const columnIndexLookup = new Map(
        visibleColumns.map((column, index) => [column.field, index]),
      );
      const topCellByField = new Map<string, { id: GridRowId; rowIndex: number }>();

      selectedCells.forEach((cell) => {
        const rowIndex = rowIndexLookup.get(String(cell.id)) ?? Number.MAX_SAFE_INTEGER;
        const currentTopCell = topCellByField.get(cell.field);

        if (!currentTopCell || rowIndex < currentTopCell.rowIndex) {
          topCellByField.set(cell.field, { id: cell.id, rowIndex });
        }
      });

      const orderedFields = [...topCellByField.keys()].sort(
        (a, b) => (columnIndexLookup.get(a) ?? 0) - (columnIndexLookup.get(b) ?? 0),
      );

      return [
        orderedFields.map((field) => {
          const sourceCell = topCellByField.get(field)!;
          return serializeCellForClipboard(sourceCell.id, field);
        }),
      ];
    },
    [apiRef, serializeCellForClipboard],
  );

  // Fill handle: apply fill using CellValueUpdater
  const applyFill = React.useCallback(() => {
    const targetRowIds = fillDrag.current.targetRowIds;
    const targetFields = fillDrag.current.targetFields;
    const direction = fillDrag.current.direction;

    if (targetRowIds.length === 0 || targetFields.length === 0 || !direction) {
      return;
    }

    apiRef.current.publishEvent('clipboardPasteStart', {
      data: getFillSourceData(),
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
        const sourceValues = getSourceValuesForField(field);
        if (sourceValues.length === 0) {
          continue;
        }
        const sourceCells = getSourceCellsForField(field);
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
      const sourceFields = fillSource.current?.fields ?? [];
      targetFields.forEach((targetField, colOffset) => {
        const sourceField = sourceFields[colOffset % sourceFields.length];
        if (!sourceField) {
          return;
        }
        const sourceValues = getSourceValuesForField(sourceField);
        if (sourceValues.length === 0) {
          return;
        }
        const sourceCells = getSourceCellsForField(sourceField);
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
  }, [
    apiRef,
    props.processRowUpdate,
    props.onProcessRowUpdateError,
    props.getRowId,
    getFillSourceData,
    getSourceValuesForField,
    getSourceCellsForField,
  ]);

  // Helper: clear fill preview classes from previously decorated elements
  const clearFillPreviewClasses = React.useCallback(() => {
    const previewClasses = [
      gridClasses['cell--fillPreview'],
      gridClasses['cell--fillPreviewTop'],
      gridClasses['cell--fillPreviewBottom'],
      gridClasses['cell--fillPreviewLeft'],
      gridClasses['cell--fillPreviewRight'],
    ];
    for (const el of fillDrag.current.decoratedElements) {
      el.classList.remove(...previewClasses);
    }
    fillDrag.current.decoratedElements.clear();
  }, []);

  // Helper: clean up fill drag state (used on mouseup and unmount)
  const cleanupFillDrag = React.useCallback(() => {
    if (fillDrag.current.moveRAF != null) {
      cancelAnimationFrame(fillDrag.current.moveRAF);
    }
    const doc = fillDrag.current.doc;
    if (doc) {
      if (fillDrag.current.moveHandler) {
        doc.removeEventListener('mousemove', fillDrag.current.moveHandler);
      }
      if (fillDrag.current.upHandler) {
        doc.removeEventListener('mouseup', fillDrag.current.upHandler);
      }
    }

    clearFillPreviewClasses();

    // If actual dragging occurred, the click guard is not needed — reset it
    // so the next click on a cell works normally.
    if (fillDrag.current.isDragging) {
      skipNextCellClick.current = false;
    }
    fillDrag.current = createInitialFillDragState();
    fillSource.current = null;

    apiRef.current.rootElementRef?.current?.classList.remove(
      gridClasses['root--disableUserSelection'],
    );
  }, [apiRef, clearFillPreviewClasses]);

  // Fill handle: mousedown on the fill handle
  const handleFillHandleMouseDown = React.useCallback<GridEventListener<'cellMouseDown'>>(
    (params, event) => {
      if (!props.cellSelectionFillHandle || !props.cellSelection) {
        return;
      }

      // Check if the click is on the fill handle (::after pseudo-element at bottom-right)
      const rootEl = apiRef.current.rootElementRef?.current;
      if (!rootEl) {
        return;
      }
      const cellElement = apiRef.current.getCellElement(params.id, params.field);
      if (!cellElement || !cellElement.classList.contains(gridClasses['cell--withFillHandle'])) {
        return;
      }

      const rect = cellElement.getBoundingClientRect();
      const clickX = event.clientX;
      const clickY = event.clientY;

      const isRtl = apiRef.current.state.isRtl;

      // Check if click is near the inline-end bottom corner (within hit area)
      const isNearHandle =
        (isRtl
          ? clickX <= rect.left + FILL_HANDLE_HIT_AREA
          : clickX >= rect.right - FILL_HANDLE_HIT_AREA) &&
        clickY >= rect.bottom - FILL_HANDLE_HIT_AREA &&
        clickY >= rect.top; // Ensure click is within cell bounds

      if (!isNearHandle) {
        return;
      }

      // Prevent default cell selection behavior
      event.preventDefault();
      event.stopPropagation();
      (event as any).defaultMuiPrevented = true;

      // Skip the cell click that fires after this mousedown+mouseup so it
      // doesn't replace the multi-cell selection with a single cell.
      skipNextCellClick.current = true;

      // Store selected cells as source (fall back to focused cell if no selection)
      const selectedCells = getSelectedOrFocusedCells(apiRef);
      if (selectedCells.length === 0) {
        return;
      }

      // Compute all source fields in visible column order
      const visibleColumns = apiRef.current.getVisibleColumns();
      const columnFieldToIndex = new Map(visibleColumns.map((col, i) => [col.field, i]));
      const sourceFields = [...new Set(selectedCells.map((c) => c.field))];
      sourceFields.sort(
        (a, b) => (columnFieldToIndex.get(a) ?? 0) - (columnFieldToIndex.get(b) ?? 0),
      );

      // Pre-compute source column index range
      const sourceColIndices = sourceFields.map((f) => columnFieldToIndex.get(f) ?? 0);

      // Pre-compute source row range (doesn't change during drag)
      const sourceRowIds = [...new Set(selectedCells.map((c) => c.id))];
      const sourceRowIndices = sourceRowIds.map((id) =>
        apiRef.current.getRowIndexRelativeToVisibleRows(id),
      );

      // Build row ID lookup map for O(1) resolution during mousemove
      const visibleRows = getVisibleRows(apiRef);
      const idMap = new Map<string, GridRowId>();
      for (const row of visibleRows.rows) {
        idMap.set(String(row.id), row.id);
      }

      fillSource.current = {
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
      fillDrag.current.targetFields = [];
      fillDrag.current.targetRowIds = [];
      fillDrag.current.direction = null;

      rootEl.classList.add(gridClasses['root--disableUserSelection']);

      const doc = ownerDocument(rootEl);
      fillDrag.current.doc = doc;

      const handleFillMouseMove = (moveEvent: MouseEvent) => {
        // Activate dragging on the first mousemove (not on mousedown) so that a
        // click-without-drag never sets isFillDragging — which would cause
        // addClassesToCells to hide the fill handle indicator.
        if (!fillDrag.current.isDragging) {
          fillDrag.current.isDragging = true;
        }

        // Throttle via rAF to avoid layout thrashing
        if (fillDrag.current.moveRAF != null) {
          return;
        }
        fillDrag.current.moveRAF = requestAnimationFrame(() => {
          fillDrag.current.moveRAF = null;
          if (!fillDrag.current.isDragging || !fillSource.current) {
            return;
          }

          const currentRootEl = apiRef.current.rootElementRef?.current;
          const source = fillSource.current;

          // Find which row and field the mouse is over
          const elements = doc.elementsFromPoint(moveEvent.clientX, moveEvent.clientY);
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
                  const resolved = source.rowIdMap.get(idStr);
                  if (resolved != null) {
                    targetRowId = resolved;
                  }
                }
                break;
              }
            }
          }

          if (targetRowId == null || targetField == null) {
            return;
          }

          const { start: minSourceRowIdx, end: maxSourceRowIdx } = source.rowIndexRange;
          const { start: minSourceColIdx, end: maxSourceColIdx } = source.columnIndexRange;
          const currentVisibleRows = getVisibleRows(apiRef);
          const currentVisibleColumns = apiRef.current.getVisibleColumns();
          const targetRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(targetRowId);
          const targetColIndex = apiRef.current.getColumnIndex(targetField);

          const isOutsideRowRange =
            targetRowIndex > maxSourceRowIdx || targetRowIndex < minSourceRowIdx;
          const isOutsideColRange =
            targetColIndex > maxSourceColIdx || targetColIndex < minSourceColIdx;

          // Determine fill direction and target cells
          const newTargetRowIds: GridRowId[] = [];
          let newTargetFields: string[] = [];

          if (isOutsideRowRange) {
            // Vertical fill: extend rows, keep all source columns
            fillDrag.current.direction = 'vertical';
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
            fillDrag.current.direction = 'horizontal';

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
            // Mouse is within source range — no fill
            fillDrag.current.direction = null;
          }

          fillDrag.current.targetRowIds = newTargetRowIds;
          fillDrag.current.targetFields = newTargetFields;

          // Apply fill preview classes directly to DOM for immediate visual feedback
          if (currentRootEl) {
            const nextDecorated = new Set<Element>();

            newTargetRowIds.forEach((rowId, rowIdx) => {
              newTargetFields.forEach((field, colIdx) => {
                const cellEl = getGridCellElement(currentRootEl, { id: rowId, field });
                if (cellEl) {
                  nextDecorated.add(cellEl);
                  cellEl.classList.add(gridClasses['cell--fillPreview']);
                  if (rowIdx === 0) {
                    cellEl.classList.add(gridClasses['cell--fillPreviewTop']);
                  }
                  if (rowIdx === newTargetRowIds.length - 1) {
                    cellEl.classList.add(gridClasses['cell--fillPreviewBottom']);
                  }
                  if (colIdx === 0) {
                    cellEl.classList.add(gridClasses['cell--fillPreviewLeft']);
                  }
                  if (colIdx === newTargetFields.length - 1) {
                    cellEl.classList.add(gridClasses['cell--fillPreviewRight']);
                  }
                }
              });
            });

            // Remove classes only from elements no longer in the target set
            for (const el of fillDrag.current.decoratedElements) {
              if (!nextDecorated.has(el)) {
                el.classList.remove(
                  gridClasses['cell--fillPreview'],
                  gridClasses['cell--fillPreviewTop'],
                  gridClasses['cell--fillPreviewBottom'],
                  gridClasses['cell--fillPreviewLeft'],
                  gridClasses['cell--fillPreviewRight'],
                );
              }
            }
            fillDrag.current.decoratedElements = nextDecorated;
          }

          // Auto-scroll: trigger for both vertical and horizontal edges
          const virtualScrollerRect =
            apiRef.current.virtualScrollerRef?.current?.getBoundingClientRect();
          if (virtualScrollerRect) {
            const dimensions = gridDimensionsSelector(apiRef);
            const mouseX = moveEvent.clientX - virtualScrollerRect.x;
            const mouseY = moveEvent.clientY - virtualScrollerRect.y - totalHeaderHeight;
            const height = dimensions.viewportOuterSize.height - totalHeaderHeight;
            const width = dimensions.viewportOuterSize.width;
            mousePosition.current.x = mouseX;
            mousePosition.current.y = mouseY;

            const isInVerticalSensitivity =
              mouseY <= AUTO_SCROLL_SENSITIVITY || mouseY >= height - AUTO_SCROLL_SENSITIVITY;
            const isInHorizontalSensitivity =
              mouseX <= AUTO_SCROLL_SENSITIVITY || mouseX >= width - AUTO_SCROLL_SENSITIVITY;

            if (isInVerticalSensitivity || isInHorizontalSensitivity) {
              startAutoScroll();
            } else {
              stopAutoScroll();
            }
          }
        });
      };

      const handleFillMouseUp = () => {
        stopAutoScroll();

        if (fillDrag.current.isDragging) {
          applyFill();
        }

        cleanupFillDrag();
      };

      // Store refs for cleanup on unmount
      fillDrag.current.moveHandler = handleFillMouseMove;
      fillDrag.current.upHandler = handleFillMouseUp;

      doc.addEventListener('mousemove', handleFillMouseMove);
      doc.addEventListener('mouseup', handleFillMouseUp);
    },
    [
      apiRef,
      props.cellSelectionFillHandle,
      props.cellSelection,
      applyFill,
      cleanupFillDrag,
      startAutoScroll,
      stopAutoScroll,
      totalHeaderHeight,
    ],
  );

  // Fill handle: Ctrl+D to fill down
  const handleFillKeyDown = useEventCallback<
    [GridEventLookup['cellKeyDown']['params'], GridEventLookup['cellKeyDown']['event']],
    void
  >((_params, event) => {
    if (!isFillDownShortcut(event)) {
      return;
    }

    const selectedCells = getSelectedOrFocusedCells(apiRef);
    if (selectedCells.length === 0) {
      return;
    }

    event.preventDefault();
    (event as any).defaultMuiPrevented = true;

    // Group selected cells by field (column)
    const cellsByField = new Map<string, { id: GridRowId; field: string }[]>();
    for (const cell of selectedCells) {
      const list = cellsByField.get(cell.field) ?? [];
      list.push(cell);
      cellsByField.set(cell.field, list);
    }

    const visibleRows = getVisibleRows(apiRef);
    const fillDownSourceData = getFillDownSourceData(selectedCells);

    if (selectedCells.length === 1) {
      // Single cell selected: extend selection down by one row and fill
      const cell = selectedCells[0];
      const colDef = apiRef.current.getColumn(cell.field);
      if (!colDef?.editable) {
        return;
      }

      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(cell.id);
      const nextRowIndex = rowIndex + 1;
      if (nextRowIndex >= visibleRows.rows.length) {
        return;
      }

      const nextRowId = visibleRows.rows[nextRowIndex].id;
      const sourceValue = serializeCellForClipboard(cell.id, cell.field);
      apiRef.current.publishEvent('clipboardPasteStart', {
        data: fillDownSourceData,
      });

      const cellUpdater = new CellValueUpdater({
        apiRef,
        processRowUpdate: props.processRowUpdate,
        onProcessRowUpdateError: props.onProcessRowUpdateError,
        getRowId: props.getRowId,
      });

      cellUpdater.updateCell({
        rowId: nextRowId,
        field: cell.field,
        pastedCellValue:
          apiRef.current.getFilledFormulaSource?.(
            { id: cell.id, field: cell.field },
            { id: nextRowId, field: cell.field },
          ) ?? sourceValue,
      });
      cellUpdater.applyUpdates();

      // Move selection and focus to the filled cell
      apiRef.current.setCellSelectionModel({ [nextRowId]: { [cell.field]: true } });
      const colIndex = apiRef.current.getColumnIndex(cell.field);
      apiRef.current.scrollToIndexes({
        rowIndex: getRowIndexRelativeToAllRows(apiRef, nextRowId),
        colIndex: colIndex === -1 ? undefined : colIndex,
      });
      apiRef.current.setCellFocus(nextRowId, cell.field);
      cellWithVirtualFocus.current = { id: nextRowId, field: cell.field };
      return;
    }

    // Check if this is a single-row multi-column selection
    const isSingleRowMultiColumn =
      selectedCells.length > 1 && [...cellsByField.values()].every((cells) => cells.length === 1);

    if (isSingleRowMultiColumn) {
      // All cells are in the same row — extend down by one row
      const firstCell = selectedCells[0];
      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(firstCell.id);
      const nextRowIndex = rowIndex + 1;
      if (nextRowIndex >= visibleRows.rows.length) {
        return;
      }
      const nextRowId = visibleRows.rows[nextRowIndex].id;

      apiRef.current.publishEvent('clipboardPasteStart', { data: fillDownSourceData });

      const cellUpdater = new CellValueUpdater({
        apiRef,
        processRowUpdate: props.processRowUpdate,
        onProcessRowUpdateError: props.onProcessRowUpdateError,
        getRowId: props.getRowId,
      });

      const newSelectionModel: Record<GridRowId, Record<string, boolean>> = {};
      for (const [field, cells] of cellsByField) {
        const colDef = apiRef.current.getColumn(field);
        if (!colDef?.editable) {
          continue;
        }
        const sourceValue = serializeCellForClipboard(cells[0].id, field);
        cellUpdater.updateCell({
          rowId: nextRowId,
          field,
          pastedCellValue:
            apiRef.current.getFilledFormulaSource?.(
              { id: cells[0].id, field },
              { id: nextRowId, field },
            ) ?? sourceValue,
        });
        if (!newSelectionModel[nextRowId]) {
          newSelectionModel[nextRowId] = {};
        }
        newSelectionModel[nextRowId][field] = true;
      }

      cellUpdater.applyUpdates();
      apiRef.current.setCellSelectionModel(newSelectionModel);

      // Focus first editable cell in the filled row
      const firstEditableField = [...cellsByField.keys()].find(
        (f) => apiRef.current.getColumn(f)?.editable,
      );
      if (firstEditableField) {
        const colIndex = apiRef.current.getColumnIndex(firstEditableField);
        apiRef.current.scrollToIndexes({
          rowIndex: getRowIndexRelativeToAllRows(apiRef, nextRowId),
          colIndex: colIndex === -1 ? undefined : colIndex,
        });
        apiRef.current.setCellFocus(nextRowId, firstEditableField);
        cellWithVirtualFocus.current = { id: nextRowId, field: firstEditableField };
      }
      return;
    }

    let cellUpdater: CellValueUpdater | null = null;

    // Multiple cells selected: for each column, top row = source, remaining = targets
    for (const [field, cells] of cellsByField) {
      const colDef = apiRef.current.getColumn(field);
      if (!colDef?.editable) {
        continue;
      }

      // Sort cells by row index
      const sortedCells = cells
        .map((cell) => ({
          ...cell,
          rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(cell.id),
        }))
        .sort((a, b) => a.rowIndex - b.rowIndex);

      if (sortedCells.length < 2) {
        continue;
      }

      // Top row is the source
      const sourceCell = sortedCells[0];
      const sourceValue = serializeCellForClipboard(sourceCell.id, sourceCell.field);

      if (!cellUpdater) {
        apiRef.current.publishEvent('clipboardPasteStart', {
          data: fillDownSourceData,
        });
        cellUpdater = new CellValueUpdater({
          apiRef,
          processRowUpdate: props.processRowUpdate,
          onProcessRowUpdateError: props.onProcessRowUpdateError,
          getRowId: props.getRowId,
        });
      }

      // Fill all cells below the source
      for (let i = 1; i < sortedCells.length; i += 1) {
        cellUpdater.updateCell({
          rowId: sortedCells[i].id,
          field,
          pastedCellValue:
            apiRef.current.getFilledFormulaSource?.(
              { id: sourceCell.id, field: sourceCell.field },
              { id: sortedCells[i].id, field },
            ) ?? sourceValue,
        });
      }
    }

    cellUpdater?.applyUpdates();
  });

  // Fill handle: Ctrl+R to fill right
  const handleFillRightKeyDown = useEventCallback<
    [GridEventLookup['cellKeyDown']['params'], GridEventLookup['cellKeyDown']['event']],
    void
  >((_params, event) => {
    if (!isFillRightShortcut(event)) {
      return;
    }

    const selectedCells = getSelectedOrFocusedCells(apiRef);
    if (selectedCells.length === 0) {
      return;
    }

    event.preventDefault();
    (event as any).defaultMuiPrevented = true;

    const visibleColumns = apiRef.current.getVisibleColumns();
    const columnFieldToIndex = new Map(visibleColumns.map((col, i) => [col.field, i]));

    // Group selected cells by row
    const cellsByRow = new Map<GridRowId, { id: GridRowId; field: string }[]>();
    for (const cell of selectedCells) {
      const list = cellsByRow.get(cell.id) ?? [];
      list.push(cell);
      cellsByRow.set(cell.id, list);
    }

    if (selectedCells.length === 1) {
      // Single cell: extend selection right by one column and fill
      const cell = selectedCells[0];
      const colIndex = columnFieldToIndex.get(cell.field) ?? -1;
      const nextColIndex = colIndex + 1;
      if (nextColIndex >= visibleColumns.length) {
        return;
      }
      const nextField = visibleColumns[nextColIndex].field;
      const nextColDef = apiRef.current.getColumn(nextField);
      if (!nextColDef?.editable) {
        return;
      }

      const sourceValue = serializeCellForClipboard(cell.id, cell.field);

      apiRef.current.publishEvent('clipboardPasteStart', {
        data: [[sourceValue]],
      });

      const cellUpdater = new CellValueUpdater({
        apiRef,
        processRowUpdate: props.processRowUpdate,
        onProcessRowUpdateError: props.onProcessRowUpdateError,
        getRowId: props.getRowId,
      });

      cellUpdater.updateCell({
        rowId: cell.id,
        field: nextField,
        pastedCellValue:
          apiRef.current.getFilledFormulaSource?.(
            { id: cell.id, field: cell.field },
            { id: cell.id, field: nextField },
          ) ?? sourceValue,
      });
      cellUpdater.applyUpdates();

      // Move selection and focus to the filled cell
      apiRef.current.setCellSelectionModel({ [cell.id]: { [nextField]: true } });
      const rowIndex = getRowIndexRelativeToAllRows(apiRef, cell.id);
      apiRef.current.scrollToIndexes({ rowIndex, colIndex: nextColIndex });
      apiRef.current.setCellFocus(cell.id, nextField);
      cellWithVirtualFocus.current = { id: cell.id, field: nextField };
      return;
    }

    // Check if single-column multi-row selection (extend right by one column)
    const isSingleColumnMultiRow = [...cellsByRow.values()].every((cells) => cells.length === 1);

    if (isSingleColumnMultiRow) {
      const firstCell = selectedCells[0];
      const colIndex = columnFieldToIndex.get(firstCell.field) ?? -1;
      const nextColIndex = colIndex + 1;
      if (nextColIndex >= visibleColumns.length) {
        return;
      }
      const nextField = visibleColumns[nextColIndex].field;
      const nextColDef = apiRef.current.getColumn(nextField);
      if (!nextColDef?.editable) {
        return;
      }

      apiRef.current.publishEvent('clipboardPasteStart', {
        data: [...cellsByRow.entries()].map(([, cells]) => [
          serializeCellForClipboard(cells[0].id, cells[0].field),
        ]),
      });

      const cellUpdater = new CellValueUpdater({
        apiRef,
        processRowUpdate: props.processRowUpdate,
        onProcessRowUpdateError: props.onProcessRowUpdateError,
        getRowId: props.getRowId,
      });

      const newSelectionModel: Record<GridRowId, Record<string, boolean>> = {};
      for (const [rowId, cells] of cellsByRow) {
        const sourceValue = serializeCellForClipboard(cells[0].id, cells[0].field);
        cellUpdater.updateCell({
          rowId,
          field: nextField,
          pastedCellValue:
            apiRef.current.getFilledFormulaSource?.(
              { id: cells[0].id, field: cells[0].field },
              { id: rowId, field: nextField },
            ) ?? sourceValue,
        });
        if (!newSelectionModel[rowId]) {
          newSelectionModel[rowId] = {};
        }
        newSelectionModel[rowId][nextField] = true;
      }

      cellUpdater.applyUpdates();
      apiRef.current.setCellSelectionModel(newSelectionModel);
      return;
    }

    // Multiple cells per row: for each row, leftmost = source, rest = targets
    let cellUpdater: CellValueUpdater | null = null;

    for (const [rowId, cells] of cellsByRow) {
      // Sort cells by column index
      const sortedCells = cells
        .map((cell) => ({ ...cell, colIndex: columnFieldToIndex.get(cell.field) ?? 0 }))
        .sort((a, b) => a.colIndex - b.colIndex);

      if (sortedCells.length < 2) {
        continue;
      }

      const sourceCell = sortedCells[0];
      const sourceValue = serializeCellForClipboard(sourceCell.id, sourceCell.field);

      if (!cellUpdater) {
        apiRef.current.publishEvent('clipboardPasteStart', {
          data: [...cellsByRow.entries()].map(([, rowCells]) => {
            const sorted = rowCells
              .map((c) => ({ ...c, colIndex: columnFieldToIndex.get(c.field) ?? 0 }))
              .sort((a, b) => a.colIndex - b.colIndex);
            return [serializeCellForClipboard(sorted[0].id, sorted[0].field)];
          }),
        });
        cellUpdater = new CellValueUpdater({
          apiRef,
          processRowUpdate: props.processRowUpdate,
          onProcessRowUpdateError: props.onProcessRowUpdateError,
          getRowId: props.getRowId,
        });
      }

      // Fill all cells to the right of the source
      for (let i = 1; i < sortedCells.length; i += 1) {
        const colDef = apiRef.current.getColumn(sortedCells[i].field);
        if (!colDef?.editable) {
          continue;
        }
        cellUpdater.updateCell({
          rowId,
          field: sortedCells[i].field,
          pastedCellValue:
            apiRef.current.getFilledFormulaSource?.(
              { id: sourceCell.id, field: sourceCell.field },
              { id: rowId, field: sortedCells[i].field },
            ) ?? sourceValue,
        });
      }
    }

    cellUpdater?.applyUpdates();
  });

  useGridEvent(apiRef, 'cellMouseDown', runIfCellSelectionIsEnabled(handleFillHandleMouseDown));
  useGridEvent(apiRef, 'cellClick', runIfCellSelectionIsEnabled(handleCellClick));
  useGridEvent(apiRef, 'cellFocusIn', runIfCellSelectionIsEnabled(handleCellFocusIn));
  useGridEvent(apiRef, 'cellKeyDown', runIfCellSelectionIsEnabled(handleCellKeyDown));
  useGridEvent(apiRef, 'cellKeyDown', runIfCellSelectionIsEnabled(handleFillKeyDown));
  useGridEvent(apiRef, 'cellKeyDown', runIfCellSelectionIsEnabled(handleFillRightKeyDown));
  useGridEvent(apiRef, 'cellMouseDown', runIfCellSelectionIsEnabled(handleCellMouseDown));
  useGridEvent(apiRef, 'cellMouseOver', runIfCellSelectionIsEnabled(handleCellMouseOver));

  React.useEffect(() => {
    if (props.cellSelectionModel) {
      apiRef.current.setCellSelectionModel(props.cellSelectionModel);
    }
  }, [apiRef, props.cellSelectionModel]);

  React.useEffect(() => {
    const rootRef = apiRef.current.rootElementRef?.current;

    return () => {
      stopAutoScroll();
      cleanupFillDrag();

      const document = ownerDocument(rootRef);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [apiRef, hasRootReference, handleMouseUp, stopAutoScroll, cleanupFillDrag]);

  const checkIfCellIsSelected = React.useCallback<GridPipeProcessor<'isCellSelected'>>(
    (isSelected, { id, field }) => {
      return apiRef.current.isCellSelected(id, field);
    },
    [apiRef],
  );

  const addClassesToCells = React.useCallback<GridPipeProcessor<'cellClassName'>>(
    (classes, { id, field }) => {
      const visibleRows = getVisibleRows(apiRef);

      // Note: Fill preview classes during drag are applied via direct DOM manipulation
      // in handleFillMouseMove for performance. The pipe processor only handles
      // the fill handle indicator (cell--withFillHandle) on the selection's bottom-right cell.

      if (!visibleRows.range || !apiRef.current.isCellSelected(id, field)) {
        // Show fill handle on the focused cell when no cell selection exists
        if (props.cellSelectionFillHandle && !fillDrag.current.isDragging) {
          const focusedCell = gridFocusCellSelector(apiRef);
          if (focusedCell && focusedCell.id === id && focusedCell.field === field) {
            const selectionModel = apiRef.current.getCellSelectionModel();
            const hasSelection = Object.keys(selectionModel).some((rowId) =>
              Object.values(selectionModel[rowId]).some(Boolean),
            );
            if (!hasSelection) {
              const col = apiRef.current.getColumn(field);
              if (col?.editable) {
                return [...classes, gridClasses['cell--withFillHandle']];
              }
            }
          }
        }
        return classes;
      }

      const newClasses = [...classes];

      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
      const columnIndex = apiRef.current.getColumnIndex(field);
      const visibleColumns = apiRef.current.getVisibleColumns();

      let isBottom = false;
      let isRight = false;

      if (rowIndex > 0) {
        const { id: previousRowId } = visibleRows.rows[rowIndex - 1];
        if (!apiRef.current.isCellSelected(previousRowId, field)) {
          newClasses.push(gridClasses['cell--rangeTop']);
        }
      } else {
        newClasses.push(gridClasses['cell--rangeTop']);
      }

      if (rowIndex + visibleRows.range.firstRowIndex < visibleRows.range.lastRowIndex) {
        const { id: nextRowId } = visibleRows.rows[rowIndex + 1];
        if (!apiRef.current.isCellSelected(nextRowId, field)) {
          newClasses.push(gridClasses['cell--rangeBottom']);
          isBottom = true;
        }
      } else {
        newClasses.push(gridClasses['cell--rangeBottom']);
        isBottom = true;
      }

      if (columnIndex > 0) {
        const { field: previousColumnField } = visibleColumns[columnIndex - 1];
        if (!apiRef.current.isCellSelected(id, previousColumnField)) {
          newClasses.push(gridClasses['cell--rangeLeft']);
        }
      } else {
        newClasses.push(gridClasses['cell--rangeLeft']);
      }

      if (columnIndex < visibleColumns.length - 1) {
        const { field: nextColumnField } = visibleColumns[columnIndex + 1];
        if (!apiRef.current.isCellSelected(id, nextColumnField)) {
          newClasses.push(gridClasses['cell--rangeRight']);
          isRight = true;
        }
      } else {
        newClasses.push(gridClasses['cell--rangeRight']);
        isRight = true;
      }

      // Mark the corner that Shift + navigation keys, Shift + click, or a drag move.
      // The focused cell is the anchor, there is nothing to mark when they are the same.
      const extendedCell = cellWithVirtualFocus.current;
      const focusedCell = gridFocusCellSelector(apiRef);
      if (
        extendedCell?.id === id &&
        extendedCell.field === field &&
        focusedCell &&
        (focusedCell.id !== id || focusedCell.field !== field)
      ) {
        newClasses.push(gridClasses['cell--rangeEnd']);
      }

      // Add fill handle to the bottom-right cell of the selection
      // Show if any selected column is editable (not just the bottom-right column)
      if (props.cellSelectionFillHandle && isBottom && isRight && !fillDrag.current.isDragging) {
        const selectionModel = apiRef.current.getCellSelectionModel();
        const selectedFieldsInRow = selectionModel[id];
        const hasEditableColumn =
          selectedFieldsInRow &&
          Object.keys(selectedFieldsInRow).some((f) => {
            const col = apiRef.current.getColumn(f);
            return col?.editable && selectedFieldsInRow[f];
          });
        if (hasEditableColumn) {
          newClasses.push(gridClasses['cell--withFillHandle']);
        }
      }

      return newClasses;
    },
    [apiRef, props.cellSelectionFillHandle],
  );

  const canUpdateFocus = React.useCallback<GridPipeProcessor<'canUpdateFocus'>>(
    (initialValue, { event, cell }) => {
      if (!cell || !props.cellSelection) {
        return initialValue;
      }

      if (isKeyboardEvent(event)) {
        // Space selects the cell instead of navigating to the next page
        if (canSelectCellWithSpace(cell, event)) {
          return false;
        }

        if (!event.shiftKey || !isNavigationKey(event.key)) {
          return initialValue;
        }

        // With the row selection, the focus moves to extend the selected rows
        if (props.rowSelection && isRowRangeShortcut(event)) {
          return initialValue;
        }

        // Shift + navigation keys extend the cell selection without moving the focus
        return false;
      }

      if (!event.shiftKey) {
        return initialValue;
      }

      const focusedCell = gridFocusCellSelector(apiRef);
      if (hasClickedValidCellForRangeSelection(cell) && focusedCell) {
        return false;
      }

      return initialValue;
    },
    [
      apiRef,
      props.cellSelection,
      props.rowSelection,
      canSelectCellWithSpace,
      hasClickedValidCellForRangeSelection,
    ],
  );

  const handleClipboardCopy = React.useCallback<GridPipeProcessor<'clipboardCopy'>>(
    (value) => {
      if (!hasMultipleSelectedCells(apiRef)) {
        return value;
      }

      const cellSelectionModel = apiRef.current.getCellSelectionModel();
      const sortedRowIds = gridSortedRowIdsSelector(apiRef);
      const sortedSelectedRowIds = sortedRowIds.filter(
        (id) => cellSelectionModel[id] !== undefined,
      );
      const rowStrings = sortedSelectedRowIds.map((rowId) => {
        const fieldsMap = cellSelectionModel[rowId];
        const rowValues = Object.keys(fieldsMap).map((field) => {
          let cellData: string;
          if (fieldsMap[field]) {
            const cellParams = apiRef.current.getCellParams(rowId, field);
            cellData = serializeCellValue(cellParams, {
              csvOptions: {
                delimiter: clipboardCopyCellDelimiter,
                shouldAppendQuotes: false,
                escapeFormulas: false,
              },
              ignoreValueFormatter,
            });
          } else {
            cellData = '';
          }
          return cellData;
        });
        return rowValues.join(clipboardCopyCellDelimiter);
      });
      return rowStrings.join('\r\n');
    },
    [apiRef, ignoreValueFormatter, clipboardCopyCellDelimiter],
  );

  useGridRegisterPipeProcessor(apiRef, 'isCellSelected', checkIfCellIsSelected);
  useGridRegisterPipeProcessor(apiRef, 'cellClassName', addClassesToCells);
  useGridRegisterPipeProcessor(apiRef, 'canUpdateFocus', canUpdateFocus);
  useGridRegisterPipeProcessor(apiRef, 'clipboardCopy', handleClipboardCopy);
};
