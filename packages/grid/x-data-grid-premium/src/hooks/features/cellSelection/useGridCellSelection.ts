import * as React from 'react';
import { useEventCallback } from '@mui/material/utils';
import {
  GridPipeProcessor,
  GridStateInitializer,
  isNavigationKey,
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
} from '@mui/x-data-grid-pro';
import { gridCellSelectionStateSelector } from './gridCellSelectionSelector';
import { GridCellSelectionApi } from './gridCellSelectionInterfaces';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';

export const cellSelectionStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'unstable_cellSelectionModel' | 'initialState'>
> = (state, props) => ({
  ...state,
  cellSelection: { ...(props.unstable_cellSelectionModel ?? props.initialState?.cellSelection) },
});

function isKeyboardEvent(event: any): event is React.KeyboardEvent {
  return !!event.key;
}

export const useGridCellSelection = (
  apiRef: React.MutableRefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'unstable_cellSelection'
    | 'unstable_cellSelectionModel'
    | 'unstable_onCellSelectionModelChange'
    | 'pagination'
    | 'paginationMode'
  >,
) => {
  const visibleRows = useGridVisibleRows(apiRef, props);
  const cellWithVirtualFocus = React.useRef<GridCellCoordinates | null>();
  const lastMouseDownCell = React.useRef<GridCellCoordinates | null>();

  apiRef.current.registerControlState({
    stateId: 'cellSelection',
    propModel: props.unstable_cellSelectionModel,
    propOnChange: props.unstable_onCellSelectionModelChange,
    stateSelector: gridCellSelectionStateSelector,
    changeEvent: 'cellSelectionChange',
  });

  const runIfCellSelectionIsEnabled =
    <Args extends any[]>(callback: (...args: Args) => void) =>
    (...args: Args) => {
      if (props.unstable_cellSelection) {
        callback(...args);
      }
    };

  const isCellSelected = React.useCallback<GridCellSelectionApi['unstable_isCellSelected']>(
    (id, field) => {
      if (!props.unstable_cellSelection) {
        return false;
      }
      const cellSelectionModel = gridCellSelectionStateSelector(apiRef.current.state);
      return cellSelectionModel[id] ? !!cellSelectionModel[id][field] : false;
    },
    [apiRef, props.unstable_cellSelection],
  );

  const getCellSelectionModel = React.useCallback(() => {
    return gridCellSelectionStateSelector(apiRef.current.state);
  }, [apiRef]);

  const setCellSelectionModel = React.useCallback<
    GridCellSelectionApi['unstable_setCellSelectionModel']
  >(
    (newModel) => {
      if (!props.unstable_cellSelection) {
        return;
      }
      apiRef.current.setState((prevState) => ({ ...prevState, cellSelection: newModel }));
      apiRef.current.forceUpdate();
    },
    [apiRef, props.unstable_cellSelection],
  );

  const selectCellRange = React.useCallback<GridCellSelectionApi['unstable_selectCellRange']>(
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

      const newModel = keepOtherSelected ? apiRef.current.unstable_getCellSelectionModel() : {};

      rowsInRange.forEach((row) => {
        if (!newModel[row.id]) {
          newModel[row.id] = {};
        }
        columnsInRange.forEach((column) => {
          newModel[row.id][column.field] = true;
        }, {});
      });

      apiRef.current.unstable_setCellSelectionModel(newModel);
    },
    [apiRef, visibleRows.rows],
  );

  const getSelectedCellsAsArray = React.useCallback<
    GridCellSelectionApi['unstable_getSelectedCellsAsArray']
  >(() => {
    const model = apiRef.current.unstable_getCellSelectionModel();
    const idToIdLookup = gridRowsDataRowIdToIdLookupSelector(apiRef);

    return Object.entries(model).reduce<{ id: GridRowId; field: string }[]>(
      (acc, [id, fields]) => [
        ...acc,
        ...Object.entries(fields).reduce<{ id: GridRowId; field: string }[]>(
          (acc2, [field, isSelected]) => {
            return isSelected ? [...acc2, { id: idToIdLookup[id], field }] : acc2;
          },
          [],
        ),
      ],
      [],
    );
  }, [apiRef]);

  const cellSelectionApi: GridCellSelectionApi = {
    unstable_isCellSelected: isCellSelected,
    unstable_getCellSelectionModel: getCellSelectionModel,
    unstable_setCellSelectionModel: setCellSelectionModel,
    unstable_selectCellRange: selectCellRange,
    unstable_getSelectedCellsAsArray: getSelectedCellsAsArray,
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

  const handleCellMouseDown = React.useCallback<GridEventListener<'cellMouseDown'>>(
    (params, event) => {
      // Skip if the click comes from the right-button or, only on macOS, Ctrl is pressed
      // Fix for https://github.com/mui/mui-x/pull/6567#issuecomment-1329155578
      const isMacOs = window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      if (event.button !== 0 || (event.ctrlKey && isMacOs)) {
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
    },
    [apiRef, hasClickedValidCellForRangeSelection],
  );

  const handleCellMouseUp = React.useCallback<GridEventListener<'cellMouseUp'>>(() => {
    lastMouseDownCell.current = null;
    apiRef.current.rootElementRef?.current?.classList.remove(
      gridClasses['root--disableUserSelection'],
    );
  }, [apiRef]);

  const handleCellFocusIn = React.useCallback<GridEventListener<'cellFocusIn'>>((params) => {
    cellWithVirtualFocus.current = { id: params.id, field: params.field };
  }, []);

  const handleCellMouseOver = React.useCallback<GridEventListener<'cellMouseOver'>>(
    (params, event) => {
      if (!lastMouseDownCell.current) {
        return;
      }

      const { id, field } = params;

      apiRef.current.unstable_selectCellRange(
        lastMouseDownCell.current,
        { id, field },
        event.ctrlKey || event.metaKey,
      );
    },
    [apiRef],
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
      apiRef.current.unstable_selectCellRange(focusedCell, { id, field });
      cellWithVirtualFocus.current = { id, field };
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      // Add the clicked cell to the selection
      const prevModel = apiRef.current.unstable_getCellSelectionModel();
      apiRef.current.unstable_setCellSelectionModel({
        ...prevModel,
        [id]: { ...prevModel[id], [field]: !apiRef.current.unstable_isCellSelected(id, field) },
      });
    } else {
      // Clear the selection and keep only the clicked cell selected
      apiRef.current.unstable_setCellSelectionModel({ [id]: { [field]: true } });
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
      apiRef.current.unstable_setCellSelectionModel({});
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

    const { id, field } = params;
    apiRef.current.unstable_selectCellRange({ id, field }, cellWithVirtualFocus.current);
  });

  useGridApiEventHandler(apiRef, 'cellClick', runIfCellSelectionIsEnabled(handleCellClick));
  useGridApiEventHandler(apiRef, 'cellFocusIn', runIfCellSelectionIsEnabled(handleCellFocusIn));
  useGridApiEventHandler(apiRef, 'cellKeyDown', runIfCellSelectionIsEnabled(handleCellKeyDown));
  useGridApiEventHandler(apiRef, 'cellMouseDown', runIfCellSelectionIsEnabled(handleCellMouseDown));
  useGridApiEventHandler(apiRef, 'cellMouseUp', runIfCellSelectionIsEnabled(handleCellMouseUp));
  useGridApiEventHandler(apiRef, 'cellMouseOver', runIfCellSelectionIsEnabled(handleCellMouseOver));

  React.useEffect(() => {
    if (props.unstable_cellSelectionModel) {
      apiRef.current.unstable_setCellSelectionModel(props.unstable_cellSelectionModel);
    }
  }, [apiRef, props.unstable_cellSelectionModel]);

  const checkIfCellIsSelected = React.useCallback<GridPipeProcessor<'isCellSelected'>>(
    (isSelected, { id, field }) => {
      return apiRef.current.unstable_isCellSelected(id, field);
    },
    [apiRef],
  );

  const addClassesToCells = React.useCallback<GridPipeProcessor<'cellClassName'>>(
    (classes, { id, field }) => {
      const newClasses = [...classes];

      if (!visibleRows.range || !apiRef.current.unstable_isCellSelected(id, field)) {
        return classes;
      }

      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
      const columnIndex = apiRef.current.getColumnIndex(field);
      const visibleColumns = apiRef.current.getVisibleColumns();

      if (rowIndex > 0) {
        const { id: previousRowId } = visibleRows.rows[rowIndex - 1];
        if (!apiRef.current.unstable_isCellSelected(previousRowId, field)) {
          newClasses.push(gridClasses['cell--rangeTop']);
        }
      } else {
        newClasses.push(gridClasses['cell--rangeTop']);
      }

      if (rowIndex < visibleRows.range.lastRowIndex) {
        const { id: nextRowId } = visibleRows.rows[rowIndex + 1];
        if (!apiRef.current.unstable_isCellSelected(nextRowId, field)) {
          newClasses.push(gridClasses['cell--rangeBottom']);
        }
      } else {
        newClasses.push(gridClasses['cell--rangeBottom']);
      }

      if (columnIndex > 0) {
        const { field: previousColumnField } = visibleColumns[columnIndex - 1];
        if (!apiRef.current.unstable_isCellSelected(id, previousColumnField)) {
          newClasses.push(gridClasses['cell--rangeLeft']);
        }
      } else {
        newClasses.push(gridClasses['cell--rangeLeft']);
      }

      if (columnIndex < visibleColumns.length - 1) {
        const { field: nextColumnField } = visibleColumns[columnIndex + 1];
        if (!apiRef.current.unstable_isCellSelected(id, nextColumnField)) {
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
      if (!cell || !props.unstable_cellSelection || !event.shiftKey) {
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
    [apiRef, props.unstable_cellSelection, hasClickedValidCellForRangeSelection],
  );

  // TODO: move this to the GridColDef to make if configurable?
  const stringifyCellForClipboard = React.useCallback(
    (rowId: GridRowId, field: string) => {
      const cellParams = apiRef.current.getCellParams(rowId, field);
      let data: string;
      const columnType = cellParams.colDef.type;
      if (columnType === 'number') {
        data = String(cellParams.value);
      } else if (columnType === 'date' || columnType === 'dateTime') {
        data = (cellParams.value as Date)?.toString();
      } else {
        data = cellParams.formattedValue as any;
      }
      return data;
    },
    [apiRef],
  );

  const handleClipboardCopy = React.useCallback<GridPipeProcessor<'clipboardCopy'>>(
    (value) => {
      if (apiRef.current.unstable_getSelectedCellsAsArray().length > 1) {
        const cellSelectionModel = apiRef.current.unstable_getCellSelectionModel();
        const copyData = Object.keys(cellSelectionModel).reduce((acc, rowId) => {
          const fieldsMap = cellSelectionModel[rowId];
          const rowString = Object.keys(fieldsMap).reduce((acc2, field) => {
            let cellData: string;
            if (fieldsMap[field]) {
              cellData = stringifyCellForClipboard(rowId, field);
            } else {
              cellData = '';
            }
            return acc2 === '' ? cellData : [acc2, cellData].join('\t');
          }, '');
          return acc === '' ? rowString : [acc, rowString].join('\r\n');
        }, '');
        return copyData;
      }

      return value;
    },
    [apiRef, stringifyCellForClipboard],
  );

  useGridRegisterPipeProcessor(apiRef, 'isCellSelected', checkIfCellIsSelected);
  useGridRegisterPipeProcessor(apiRef, 'cellClassName', addClassesToCells);
  useGridRegisterPipeProcessor(apiRef, 'canUpdateFocus', canUpdateFocus);
  useGridRegisterPipeProcessor(apiRef, 'clipboardCopy', handleClipboardCopy);
};
