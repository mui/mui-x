import { useEffect, useRef, useState } from 'react';
import {
  GridOptions,
  RowClickedParam,
  RowId,
  RowModel,
  Rows,
  RowSelectedParam,
  SelectionChangedParam,
} from '../../models';
import { useLogger } from '../utils/useLogger';
import {
  MULTIPLE_KEY_PRESS_CHANGED,
  ROW_CLICKED,
  ROW_SELECTED_EVENT,
  SELECTION_CHANGED_EVENT,
} from '../../constants/eventsConstants';
import { GridApi, SelectionApi } from '../../models/gridApi';
import { GridApiRef } from '../../grid';

export const useSelection = (options: GridOptions, rows: Rows, initialised: boolean, apiRef: GridApiRef): void => {
  const logger = useLogger('useSelection');
  const selectedItemsRef = useRef<RowId[]>([]);
  const allowMultipleSelectionKeyPressed = useRef<boolean>(false);
  const [, forceUpdate] = useState();

  const getSelectedRows = () => {
    return selectedItemsRef.current.map(id => apiRef!.current!.getRowFromId(id));
  };

  const selectRowModel = (row: RowModel, allowMultipleOverride?: boolean, isSelected?: boolean) => {
    if (!apiRef || apiRef.current == null) {
      throw 'ApiRef should be defined at this stage';
    }

    if (!apiRef.current.isInitialised) {
      selectedItemsRef.current = [row.id];
      return;
    }

    logger.debug(`Selecting row ${row.id}`);
    const rowIndex = apiRef.current.getRowIndexFromId(row.id);
    let allowMultiSelect = allowMultipleSelectionKeyPressed.current;
    if (allowMultipleOverride) {
      allowMultiSelect = allowMultipleOverride;
    }
    const isRowSelected = allowMultiSelect ? (isSelected == null ? !row.selected : isSelected) : true;

    if (allowMultiSelect) {
      if (isRowSelected) {
        selectedItemsRef.current =
          selectedItemsRef.current.indexOf(row.id) === -1
            ? [...selectedItemsRef.current, row.id]
            : selectedItemsRef.current;
      } else {
        selectedItemsRef.current.splice(selectedItemsRef.current.indexOf(row.id), 1);
      }
    } else {
      selectedItemsRef.current.forEach(id => {
        const otherSelectedRow = apiRef!.current!.getRowFromId(id);
        apiRef!.current!.updateRowModels([{ ...otherSelectedRow, selected: false }]);
      });
      selectedItemsRef.current = [row.id];
    }
    apiRef!.current!.updateRowModels([{ ...row, selected: isRowSelected }]);

    if (apiRef && apiRef.current != null) {
      const rowSelectedParam: RowSelectedParam = { data: row.data, isSelected: isRowSelected, rowIndex };
      const selectionChangedParam: SelectionChangedParam = { rows: getSelectedRows().map(r => r.data) };
      apiRef.current!.emit(ROW_SELECTED_EVENT, rowSelectedParam);
      apiRef.current!.emit(SELECTION_CHANGED_EVENT, selectionChangedParam);
    }

    forceUpdate((p: any) => !p);
  };

  const selectRow = (id: RowId, allowMultiple?: boolean, isSelected?: boolean) => {
    if (!apiRef || !apiRef.current) {
      return;
    }
    return selectRowModel(apiRef.current.getRowFromId(id), allowMultiple, isSelected);
  };

  const selectRows = (ids: RowId[], isSelected?: boolean) => {
    if (!apiRef || !apiRef.current) {
      return;
    }
    if (!options.enableMultipleSelection && ids.length > 1) {
      throw new Error('Enable Options.enableMultipleSelection to select more than 1 item');
    }

    apiRef!.current!.updateRowModels(ids.map(id => ({ id, selected: isSelected })));
    selectedItemsRef.current = isSelected ? ids : [];
    forceUpdate((p: any) => !p);

    if (apiRef && apiRef.current != null) {
      //We don't emit ROW_SELECTED_EVENT on each row as it would be too consuming for large set of data.
      const selectionChangedParam: SelectionChangedParam = { rows: getSelectedRows().map(r => r.data) };
      apiRef.current!.emit(SELECTION_CHANGED_EVENT, selectionChangedParam);
    }
  };

  const rowClickedHandler = (params: RowClickedParam) => {
    if (!options.disableSelectionOnClick) {
      selectRowModel(params.rowModel);
    }
  };

  const onMultipleKeyPressed = (isPressed: boolean) => {
    allowMultipleSelectionKeyPressed.current = options.enableMultipleSelection && isPressed;
  };

  const onSelectedRow = (handler: (param: RowSelectedParam) => void): (() => void) => {
    return apiRef!.current!.registerEvent(ROW_SELECTED_EVENT, handler);
  };
  const onSelectionChanged = (handler: (param: SelectionChangedParam) => void): (() => void) => {
    return apiRef!.current!.registerEvent(SELECTION_CHANGED_EVENT, handler);
  };

  useEffect(() => {
    if (apiRef && apiRef.current && initialised) {
      logger.debug('Binding click event');
      apiRef.current.on(ROW_CLICKED, rowClickedHandler);
      apiRef.current.on(MULTIPLE_KEY_PRESS_CHANGED, onMultipleKeyPressed);
      //TODO handle Cell Clicked?

      selectedItemsRef.current.forEach(id => selectRow(id));
      return () => {
        apiRef.current!.removeListener(ROW_CLICKED, rowClickedHandler);
        apiRef.current!.removeListener(MULTIPLE_KEY_PRESS_CHANGED, onMultipleKeyPressed);
      };
    }
  }, [initialised]);

  useEffect(() => {
    if (apiRef && apiRef.current) {
      logger.debug('Adding row selection to api');

      const selectionApi: SelectionApi = { selectRow, getSelectedRows, selectRows, onSelectedRow, onSelectionChanged };
      apiRef.current = Object.assign(apiRef.current, selectionApi) as GridApi;
    }
  }, [apiRef]);
};
