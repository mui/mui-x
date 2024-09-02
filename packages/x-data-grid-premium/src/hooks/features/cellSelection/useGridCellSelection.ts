import * as React from 'react';
import { ownerDocument, useEventCallback } from '@mui/material/utils';
import {
  GridPipeProcessor,
  GridStateInitializer,
  getTotalHeaderHeight,
  getVisibleRows,
  isNavigationKey,
  serializeCellValue,
  useGridRegisterPipeProcessor,
  useGridVisibleRows,
} from '@mui/x-data-grid-pro/internals';
import {
  useGridApiEventHandler,
  useGridApiMethod,
  GridEventListener,
  GridEventLookup,
  GRID_ACTIONS_COLUMN_TYPE,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
  GridCellCoordinates,
  gridRowsDataRowIdToIdLookupSelector,
  GridRowId,
  gridClasses,
  gridFocusCellSelector,
  GridCellParams,
  GRID_REORDER_COL_DEF,
  useGridSelector,
  gridSortedRowIdsSelector,
  gridDimensionsSelector,
} from '@mui/x-data-grid-pro';
import { gridCellSelectionStateSelector } from './gridCellSelectionSelector';
import { GridCellSelectionApi } from './gridCellSelectionInterfaces';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';

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

export const useGridCellSelection = (
  apiRef: React.MutableRefObject<GridPrivateApiPremium>,
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
  >,
) => {
  const visibleRows = useGridVisibleRows(apiRef, props);
  const cellWithVirtualFocus = React.useRef<GridCellCoordinates | null>();
  const lastMouseDownCell = React.useRef<GridCellCoordinates | null>();
  const mousePosition = React.useRef<{ x: number; y: number } | null>(null);
  const autoScrollRAF = React.useRef<number | null>();
  const sortedRowIds = useGridSelector(apiRef, gridSortedRowIdsSelector);
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  const totalHeaderHeight = getTotalHeaderHeight(apiRef, props);

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
      const cellSelectionModel = gridCellSelectionStateSelector(apiRef.current.state);
      return cellSelectionModel[id] ? !!cellSelectionModel[id][field] : false;
    },
    [apiRef, props.cellSelection],
  );

  const getCellSelectionModel = React.useCallback(() => {
    return gridCellSelectionStateSelector(apiRef.current.state);
  }, [apiRef]);

  const setCellSelectionModel = React.useCallback<GridCellSelectionApi['setCellSelectionModel']>(
    (newModel) => {
      if (!props.cellSelection) {
        return;
      }
      apiRef.current.setState((prevState) => ({ ...prevState, cellSelection: newModel }));
      apiRef.current.forceUpdate();
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
    [apiRef, visibleRows.rows],
  );

  const getSelectedCellsAsArray = React.useCallback<
    GridCellSelectionApi['getSelectedCellsAsArray']
  >(() => {
    const selectionModel = apiRef.current.getCellSelectionModel();
    const idToIdLookup = gridRowsDataRowIdToIdLookupSelector(apiRef);
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
                selectedFields.push({ id: idToIdLookup[id], field });
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

      const { x: mouseX, y: mouseY } = mousePosition.current;
      const { height, width } = dimensions.viewportInnerSize;

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
  }, [apiRef, dimensions]);

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

      const { x, y } = virtualScrollerRect;
      const { height, width } = dimensions.viewportInnerSize;
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
    [apiRef, startAutoScroll, stopAutoScroll, totalHeaderHeight, dimensions],
  );

  const handleCellClick = useEventCallback<
    [GridEventLookup['cellClick']['params'], GridEventLookup['cellClick']['event']],
    void
  >((params, event) => {
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

  useGridApiEventHandler(apiRef, 'cellClick', runIfCellSelectionIsEnabled(handleCellClick));
  useGridApiEventHandler(apiRef, 'cellFocusIn', runIfCellSelectionIsEnabled(handleCellFocusIn));
  useGridApiEventHandler(apiRef, 'cellKeyDown', runIfCellSelectionIsEnabled(handleCellKeyDown));
  useGridApiEventHandler(apiRef, 'cellMouseDown', runIfCellSelectionIsEnabled(handleCellMouseDown));
  useGridApiEventHandler(apiRef, 'cellMouseOver', runIfCellSelectionIsEnabled(handleCellMouseOver));

  React.useEffect(() => {
    if (props.cellSelectionModel) {
      apiRef.current.setCellSelectionModel(props.cellSelectionModel);
    }
  }, [apiRef, props.cellSelectionModel]);

  React.useEffect(() => {
    const rootRef = apiRef.current.rootElementRef?.current;

    return () => {
      stopAutoScroll();

      const document = ownerDocument(rootRef);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [apiRef, handleMouseUp, stopAutoScroll]);

  const checkIfCellIsSelected = React.useCallback<GridPipeProcessor<'isCellSelected'>>(
    (isSelected, { id, field }) => {
      return apiRef.current.isCellSelected(id, field);
    },
    [apiRef],
  );

  const addClassesToCells = React.useCallback<GridPipeProcessor<'cellClassName'>>(
    (classes, { id, field }) => {
      if (!visibleRows.range || !apiRef.current.isCellSelected(id, field)) {
        return classes;
      }

      const newClasses = [...classes];

      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
      const columnIndex = apiRef.current.getColumnIndex(field);
      const visibleColumns = apiRef.current.getVisibleColumns();

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
        }
      } else {
        newClasses.push(gridClasses['cell--rangeBottom']);
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
        }
      } else {
        newClasses.push(gridClasses['cell--rangeRight']);
      }

      return newClasses;
    },
    [apiRef, visibleRows.range, visibleRows.rows],
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
      const cellSelectionModel = apiRef.current.getCellSelectionModel();
      const unsortedSelectedRowIds = Object.keys(cellSelectionModel);
      const sortedSelectedRowIds = sortedRowIds.filter((id) =>
        unsortedSelectedRowIds.includes(`${id}`),
      );
      const copyData = sortedSelectedRowIds.reduce<string>((acc, rowId) => {
        const fieldsMap = cellSelectionModel[rowId];
        const rowString = Object.keys(fieldsMap).reduce((acc2, field) => {
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
          return acc2 === '' ? cellData : [acc2, cellData].join(clipboardCopyCellDelimiter);
        }, '');
        return acc === '' ? rowString : [acc, rowString].join('\r\n');
      }, '');
      return copyData;
    },
    [apiRef, ignoreValueFormatter, clipboardCopyCellDelimiter, sortedRowIds],
  );

  useGridRegisterPipeProcessor(apiRef, 'isCellSelected', checkIfCellIsSelected);
  useGridRegisterPipeProcessor(apiRef, 'cellClassName', addClassesToCells);
  useGridRegisterPipeProcessor(apiRef, 'canUpdateFocus', canUpdateFocus);
  useGridRegisterPipeProcessor(apiRef, 'clipboardCopy', handleClipboardCopy);
};
