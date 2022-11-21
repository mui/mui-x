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
  GridColDef,
  GridEventListener,
  GridEventLookup,
  GRID_ACTIONS_COLUMN_TYPE,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
  GridCellCoordinates,
  gridRowsDataRowIdToIdLookupSelector,
  GridRowId,
  gridClasses,
} from '@mui/x-data-grid-pro';
import { gridCellSelectionStateSelector } from './gridCellSelectionSelector';
import { GridCellSelectionApi, GridCellSelectionModel } from './gridCellSelectionInterfaces';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';

export const cellSelectionStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'cellSelectionModel' | 'initialState'>
> = (state, props) => ({
  ...state,
  cellSelection: { ...(props.cellSelectionModel ?? props.initialState?.cellSelection) },
});

export const useGridCellSelection = (
  apiRef: React.MutableRefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'cellSelection'
    | 'cellSelectionModel'
    | 'onCellSelectionModelChange'
    | 'pagination'
    | 'paginationMode'
  >,
) => {
  const visibleRows = useGridVisibleRows(apiRef, props);
  const lastClickedCell = React.useRef<GridCellCoordinates | null>();
  const lastMouseDownCell = React.useRef<GridCellCoordinates | null>();
  const focusedCellWhenShiftWasPressed = React.useRef<GridCellCoordinates | null>(null);

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
      apiRef.current.setState((prevState) => ({ ...prevState, cellSelection: newModel }));
      apiRef.current.forceUpdate();
    },
    [apiRef],
  );

  const selectCellRange = React.useCallback<GridCellSelectionApi['selectCellRange']>(
    (start, end) => {
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

      const newModel = rowsInRange.reduce<GridCellSelectionModel>((acc, row) => {
        acc[row.id] = columnsInRange.reduce<Record<GridColDef['field'], boolean>>(
          (acc2, column) => {
            acc2[column.field] = true;
            return acc2;
          },
          {},
        );
        return acc;
      }, {});

      apiRef.current.setCellSelectionModel(newModel);
    },
    [apiRef, visibleRows.rows],
  );

  const getSelectedCellsAsArray = React.useCallback<
    GridCellSelectionApi['getSelectedCellsAsArray']
  >(() => {
    const model = apiRef.current.getCellSelectionModel();
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
    isCellSelected,
    getCellSelectionModel,
    setCellSelectionModel,
    selectCellRange,
    getSelectedCellsAsArray,
  };

  useGridApiMethod(apiRef, cellSelectionApi, 'public');

  const handleCellMouseDown = React.useCallback<GridEventListener<'cellMouseDown'>>(
    (params) => {
      lastMouseDownCell.current = { id: params.id, field: params.field };
      apiRef.current.rootElementRef?.current?.classList.add(
        gridClasses['root--disableUserSelection'],
      );
    },
    [apiRef],
  );

  const handleCellMouseUp = React.useCallback<GridEventListener<'cellMouseDown'>>(() => {
    lastMouseDownCell.current = null;
    apiRef.current.rootElementRef?.current?.classList.remove(
      gridClasses['root--disableUserSelection'],
    );
  }, [apiRef]);

  const handleCellMouseOver = React.useCallback<GridEventListener<'cellMouseOver'>>(
    (params) => {
      if (!lastMouseDownCell.current) {
        return;
      }

      const { id, field } = params;
      apiRef.current.selectCellRange(lastMouseDownCell.current, { id, field });
    },
    [apiRef],
  );

  const handleCellClick = useEventCallback<
    [GridEventLookup['cellClick']['params'], GridEventLookup['cellClick']['event']],
    void
  >((params, event) => {
    const { id, field } = params;

    if (params.field === GRID_CHECKBOX_SELECTION_COL_DEF.field) {
      return;
    }

    if (params.field === GRID_DETAIL_PANEL_TOGGLE_FIELD) {
      return;
    }

    const column = apiRef.current.getColumn(params.field);
    if (column.type === GRID_ACTIONS_COLUMN_TYPE) {
      return;
    }

    if (params.rowNode.type === 'pinnedRow') {
      return;
    }

    if (event.shiftKey && lastClickedCell.current) {
      apiRef.current.selectCellRange(lastClickedCell.current, { id, field });
      lastClickedCell.current = { id, field };
      return;
    }

    lastClickedCell.current = { id, field };

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
    const { id, field } = params;

    if (event.key === 'Shift') {
      focusedCellWhenShiftWasPressed.current = { id, field };
      return;
    }

    if (!focusedCellWhenShiftWasPressed.current || !isNavigationKey(event.key) || !event.shiftKey) {
      return;
    }

    let endRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
    let endColumnIndex = apiRef.current.getColumnIndex(field);

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

    apiRef.current.selectCellRange(focusedCellWhenShiftWasPressed.current, {
      id: visibleRows.rows[endRowIndex].id,
      field: visibleColumns[endColumnIndex].field,
    });
  });

  const handleCellKeyUp = useEventCallback<
    [GridEventLookup['cellKeyUp']['params'], GridEventLookup['cellKeyUp']['event']],
    void
  >((params, event) => {
    if (event.key === 'Shift') {
      focusedCellWhenShiftWasPressed.current = null;
    }
  });

  useGridApiEventHandler(apiRef, 'cellClick', runIfCellSelectionIsEnabled(handleCellClick));
  useGridApiEventHandler(apiRef, 'cellKeyDown', runIfCellSelectionIsEnabled(handleCellKeyDown));
  useGridApiEventHandler(apiRef, 'cellKeyUp', runIfCellSelectionIsEnabled(handleCellKeyUp));
  useGridApiEventHandler(apiRef, 'cellMouseDown', runIfCellSelectionIsEnabled(handleCellMouseDown));
  useGridApiEventHandler(apiRef, 'cellMouseUp', runIfCellSelectionIsEnabled(handleCellMouseUp));
  useGridApiEventHandler(apiRef, 'cellMouseOver', runIfCellSelectionIsEnabled(handleCellMouseOver));

  React.useEffect(() => {
    if (props.cellSelectionModel) {
      apiRef.current.setCellSelectionModel(props.cellSelectionModel);
    }
  }, [apiRef, props.cellSelectionModel]);

  const checkIfCellIsSelected = React.useCallback<GridPipeProcessor<'isCellSelected'>>(
    (isSelected, { id, field }) => {
      return apiRef.current.isCellSelected(id, field);
    },
    [apiRef],
  );

  const addClassesToCells = React.useCallback<GridPipeProcessor<'cellClassName'>>(
    (classes, { id, field }) => {
      const newClasses = [...classes];

      if (!visibleRows.range || !apiRef.current.isCellSelected(id, field)) {
        return classes;
      }

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

      if (rowIndex < visibleRows.range.lastRowIndex) {
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

  useGridRegisterPipeProcessor(apiRef, 'isCellSelected', checkIfCellIsSelected);
  useGridRegisterPipeProcessor(apiRef, 'cellClassName', addClassesToCells);
};
