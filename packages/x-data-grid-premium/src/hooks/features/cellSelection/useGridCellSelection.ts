'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import ownerDocument from '@mui/utils/ownerDocument';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  type GridPipeProcessor,
  type GridStateInitializer,
  getGridCellElement,
  getTotalHeaderHeight,
  getVisibleRows,
  isFillDownShortcut,
  isFillRightShortcut,
  isNavigationKey,
  serializeCellValue,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid-pro/internals';
import {
  useGridEvent,
  useGridApiMethod,
  type GridEventListener,
  type GridEventLookup,
  GRID_ACTIONS_COLUMN_TYPE,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
  type GridCellCoordinates,
  type GridRowId,
  gridClasses,
  gridFocusCellSelector,
  type GridCellParams,
  GRID_REORDER_COL_DEF,
  gridSortedRowIdsSelector,
  gridDimensionsSelector,
  GridCellModes,
} from '@mui/x-data-grid-pro';
import { gridCellSelectionStateSelector } from './gridCellSelectionSelector';
import type { GridCellSelectionApi } from './gridCellSelectionInterfaces';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { CellValueUpdater } from '../clipboard/useGridClipboardImport';

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
      const rowsInRange = visibleRows.rows.slice(finalStartRowIndex, finalEndRowIndex + 1);
      const columnsInRange = visibleColumns.slice(finalStartColumnIndex, finalEndColumnIndex + 1);

      const newModel = keepOtherSelected ? { ...apiRef.current.getCellSelectionModel() } : {};

      rowsInRange.forEach((row) => {
        if (!newModel[row.id]) {
          newModel[row.id] = {};
        }
        columnsInRange.forEach((column) => {
          newModel[row.id][column.field] = true;
        }, {});
      });

      apiRef.current.setCellSelectionModel(newModel);
    },
    [apiRef],
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
      if (params.field === GRID_CHECKBOX_SELECTION_COL_DEF.field) {
        return false;
      }

      if (params.field === GRID_DETAIL_PANEL_TOGGLE_FIELD) {
        return false;
      }

      const column = apiRef.current.getColumn(params.field);
      if (column.type === GRID_ACTIONS_COLUMN_TYPE) {
        return false;
      }

      return params.rowNode.type !== 'pinnedRow';
    },
    [apiRef],
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
      const isMacOs = window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      if (event.button !== 0 || (event.ctrlKey && isMacOs)) {
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

  const handleCellKeyDown = useEventCallback<
    [GridEventLookup['cellKeyDown']['params'], GridEventLookup['cellKeyDown']['event']],
    void
  >((params, event) => {
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

    apiRef.current.scrollToIndexes({ rowIndex: endRowIndex, colIndex: endColumnIndex });

    const { id, field } = params;
    apiRef.current.selectCellRange({ id, field }, cellWithVirtualFocus.current);
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
        targetRowIds.forEach((rowId, i) => {
          const pastedCellValue = sourceValues[i % sourceValues.length];
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
        targetRowIds.forEach((rowId, rowIdx) => {
          const pastedCellValue = sourceValues[rowIdx % sourceValues.length];
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

      cellUpdater.updateCell({ rowId: nextRowId, field: cell.field, pastedCellValue: sourceValue });
      cellUpdater.applyUpdates();

      // Move selection and focus to the filled cell
      apiRef.current.setCellSelectionModel({ [nextRowId]: { [cell.field]: true } });
      const colIndex = apiRef.current.getColumnIndex(cell.field);
      apiRef.current.scrollToIndexes({ rowIndex: nextRowIndex, colIndex });
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
        cellUpdater.updateCell({ rowId: nextRowId, field, pastedCellValue: sourceValue });
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
        apiRef.current.scrollToIndexes({ rowIndex: nextRowIndex, colIndex });
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
          pastedCellValue: sourceValue,
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

      cellUpdater.updateCell({ rowId: cell.id, field: nextField, pastedCellValue: sourceValue });
      cellUpdater.applyUpdates();

      // Move selection and focus to the filled cell
      apiRef.current.setCellSelectionModel({ [cell.id]: { [nextField]: true } });
      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(cell.id);
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
        cellUpdater.updateCell({ rowId, field: nextField, pastedCellValue: sourceValue });
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
          pastedCellValue: sourceValue,
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
      if (apiRef.current.getSelectedCellsAsArray().length <= 1) {
        return value;
      }
      const sortedRowIds = gridSortedRowIdsSelector(apiRef);
      const cellSelectionModel = apiRef.current.getCellSelectionModel();
      const unsortedSelectedRowIds = Object.keys(cellSelectionModel);
      const sortedSelectedRowIds = sortedRowIds.filter((id) =>
        unsortedSelectedRowIds.includes(`${id}`),
      );
      const copyData = sortedSelectedRowIds.reduce<string>((acc, rowId) => {
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
        }, '');
        const rowString = rowValues.join(clipboardCopyCellDelimiter);
        return acc === '' ? rowString : [acc, rowString].join('\r\n');
      }, '');
      return copyData;
    },
    [apiRef, ignoreValueFormatter, clipboardCopyCellDelimiter],
  );

  useGridRegisterPipeProcessor(apiRef, 'isCellSelected', checkIfCellIsSelected);
  useGridRegisterPipeProcessor(apiRef, 'cellClassName', addClassesToCells);
  useGridRegisterPipeProcessor(apiRef, 'canUpdateFocus', canUpdateFocus);
  useGridRegisterPipeProcessor(apiRef, 'clipboardCopy', handleClipboardCopy);
};
