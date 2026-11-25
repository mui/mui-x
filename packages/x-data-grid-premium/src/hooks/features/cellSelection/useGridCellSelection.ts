'use client';
import * as React from 'react';
import { platform } from '@base-ui/utils/platform';
import type { RefObject } from '@mui/x-internals/types';
import ownerDocument from '@mui/utils/ownerDocument';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  getRowIndexRelativeToAllRows,
  getTotalHeaderHeight,
  getVisibleRows,
  isEventTargetInPortal,
  isFillDownShortcut,
  isFillRightShortcut,
  isNavigationKey,
  isPointerDragType,
  isSelectAllShortcut,
  serializeCellValue,
  useGridRegisterPipeProcessor,
  useGridRootNativeEventListener,
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
import {
  applyFill as applyFillToTargets,
  clearFillPreview,
  createFillSource,
  decorateFillPreview,
  getFillTargetCell,
  getFillTargets,
  getSelectedOrFocusedCells,
  isPointerOnFillHandle,
  serializeCellForClipboard as serializeCell,
} from './fillHandleUtils';
import type { FillSourceState } from './fillHandleUtils';

export const cellSelectionStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'cellSelectionModel' | 'initialState'>
> = (state, props) => ({
  ...state,
  cellSelection: { ...(props.cellSelectionModel ?? props.initialState?.cellSelection) },
});

function isKeyboardEvent(event: any): event is React.KeyboardEvent {
  return !!event.key;
}

const AUTO_SCROLL_SENSITIVITY = 50; // The distance from the edge to start scrolling
const AUTO_SCROLL_SPEED = 20; // The speed to scroll once the mouse enters the sensitivity area

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
  const cellWithVirtualFocus = React.useRef<GridCellCoordinates>(null);
  const lastMouseDownCell = React.useRef<GridCellCoordinates>(null);
  const mousePosition = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const autoScrollRAF = React.useRef<number>(null);
  const totalHeaderHeight = getTotalHeaderHeight(apiRef, props);

  // Fill handle state — grouped by lifecycle:
  // fillSource: set on mousedown, read-only during drag, cleared on mouseup
  // fillDrag: managed during active drag, reset on mouseup
  const fillSource = React.useRef<FillSourceState | null>(null);
  const fillDrag = React.useRef<FillDragState>(createInitialFillDragState());
  const skipNextCellClick = React.useRef(false);
  // Touch and pen drags of the fill handle are handled by `useGridFillHandlePointer`
  const lastPressPointerType = React.useRef<string | null>(null);

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

  const handleCellFocusIn = React.useCallback<GridEventListener<'cellFocusIn'>>((params) => {
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

      apiRef.current.selectCellRange(
        lastMouseDownCell.current,
        { id, field },
        event.ctrlKey || event.metaKey,
      );

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
    [apiRef, startAutoScroll, stopAutoScroll, totalHeaderHeight],
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

    // Same for a touch or pen tap on the fill handle. They don't use `skipNextCellClick`:
    // the click after a pointer drag is suppressed, and would leave it set.
    if (
      isPointerDragType(lastPressPointerType.current) &&
      isPointerOnFillHandle(
        apiRef.current.getCellElement(id, field),
        event,
        apiRef.current.state.isRtl,
      )
    ) {
      return;
    }

    if (!hasClickedValidCellForRangeSelection(params)) {
      return;
    }

    const focusedCell = gridFocusCellSelector(apiRef);
    if (event.shiftKey && focusedCell) {
      apiRef.current.selectCellRange(focusedCell, { id, field });
      cellWithVirtualFocus.current = { id, field };
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

    // Do not apply the shortcut if the focus is not on the cell root component
    if (isEventTargetInPortal(event)) {
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

  const handleCellKeyDown = useEventCallback<
    [GridEventLookup['cellKeyDown']['params'], MuiEvent<GridEventLookup['cellKeyDown']['event']>],
    void
  >((params, event) => {
    if (isSelectAllShortcut(event)) {
      selectAllCells(params, event);
      return;
    }

    if (!isNavigationKey(event.key) || !cellWithVirtualFocus.current) {
      return;
    }

    if (event.key === ' ' && params.cellMode === GridCellModes.Edit) {
      return;
    }

    if (!event.shiftKey) {
      apiRef.current.setCellSelectionModel({});
      return;
    }

    const { current: otherCell } = cellWithVirtualFocus;
    let endRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(otherCell.id);
    let endColumnIndex = apiRef.current.getColumnIndex(otherCell.field);

    if (event.key === 'ArrowDown') {
      endRowIndex += 1;
    } else if (event.key === 'ArrowUp') {
      endRowIndex -= 1;
    } else if (event.key === 'ArrowRight') {
      endColumnIndex += 1;
    } else if (event.key === 'ArrowLeft') {
      endColumnIndex -= 1;
    }

    const visibleRows = getVisibleRows(apiRef);
    if (endRowIndex < 0 || endRowIndex >= visibleRows.rows.length) {
      return;
    }

    const visibleColumns = apiRef.current.getVisibleColumns();
    if (endColumnIndex < 0 || endColumnIndex >= visibleColumns.length) {
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
  });

  const serializeCellForClipboard = useEventCallback((id: GridRowId, field: string) =>
    serializeCell(apiRef, props, id, field),
  );

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
    if (fillSource.current) {
      applyFillToTargets(apiRef, fillSource.current, fillDrag.current, {
        processRowUpdate: props.processRowUpdate,
        onProcessRowUpdateError: props.onProcessRowUpdateError,
        getRowId: props.getRowId,
        ignoreValueFormatterDuringExport: props.ignoreValueFormatterDuringExport,
        clipboardCopyCellDelimiter: props.clipboardCopyCellDelimiter,
      });
    }
  }, [
    apiRef,
    props.processRowUpdate,
    props.onProcessRowUpdateError,
    props.getRowId,
    props.ignoreValueFormatterDuringExport,
    props.clipboardCopyCellDelimiter,
  ]);

  // Helper: clear fill preview classes from previously decorated elements
  const clearFillPreviewClasses = React.useCallback(() => {
    clearFillPreview(fillDrag.current.decoratedElements);
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
      if (!isPointerOnFillHandle(cellElement, event, apiRef.current.state.isRtl)) {
        return;
      }

      // Prevent default cell selection behavior
      event.preventDefault();
      event.stopPropagation();
      (event as any).defaultMuiPrevented = true;

      // The compatibility `mousedown` of a touch or pen press. Pen also fires `mousemove`
      // during its pointer drag, which would fill a second time.
      if (isPointerDragType(lastPressPointerType.current)) {
        return;
      }

      // Skip the cell click that fires after this mousedown+mouseup so it
      // doesn't replace the multi-cell selection with a single cell.
      skipNextCellClick.current = true;

      // Store selected cells as source (fall back to focused cell if no selection)
      const source = createFillSource(apiRef);
      if (!source) {
        return;
      }
      fillSource.current = source;
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
          const targetCell = getFillTargetCell(
            doc.elementsFromPoint(moveEvent.clientX, moveEvent.clientY),
            source.rowIdMap,
          );
          if (targetCell == null) {
            return;
          }

          const targets = getFillTargets(apiRef, source, targetCell);
          fillDrag.current.direction = targets.direction;
          fillDrag.current.targetRowIds = targets.targetRowIds;
          fillDrag.current.targetFields = targets.targetFields;

          // Apply fill preview classes directly to DOM for immediate visual feedback
          if (currentRootEl) {
            fillDrag.current.decoratedElements = decorateFillPreview(
              currentRootEl,
              targets,
              fillDrag.current.decoratedElements,
            );
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

  const handlePointerDown = useEventCallback((event: PointerEvent) => {
    lastPressPointerType.current = event.pointerType;
  });

  // Capture phase: the compatibility `mousedown` of the press must see its pointer type
  useGridRootNativeEventListener(apiRef, 'pointerdown', handlePointerDown, true);
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
      if (!cell || !props.cellSelection || !event.shiftKey) {
        return initialValue;
      }

      if (isKeyboardEvent(event)) {
        return isNavigationKey(event.key) ? false : initialValue;
      }

      const focusedCell = gridFocusCellSelector(apiRef);
      if (hasClickedValidCellForRangeSelection(cell) && focusedCell) {
        return false;
      }

      return initialValue;
    },
    [apiRef, props.cellSelection, hasClickedValidCellForRangeSelection],
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
