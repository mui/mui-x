import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GridOptions,
  RowClickedParam,
  RowId,
  RowModel,
  RowSelectedParams,
  RowsProp,
  SelectionChangedParams,
  GridApiRef,
} from '../../models';
import { useLogger } from '../utils/useLogger';
import {
  MULTIPLE_KEY_PRESS_CHANGED,
  ROW_CLICKED,
  ROW_SELECTED_EVENT,
  SELECTION_CHANGED_EVENT,
} from '../../constants/eventsConstants';
import { useApiEventHandler } from '../root/useApiEventHandler';
import { useApiMethod } from '../root/useApiMethod';
import { SelectionApi } from '../../models/api/selectionApi';

export const useSelection = (
  options: GridOptions,
  rowsProp: RowsProp,
  initialised: boolean,
  apiRef: GridApiRef,
): void => {
  const logger = useLogger('useSelection');
  const selectedItemsRef = useRef<RowId[]>([]);
  const allowMultipleSelectionKeyPressed = useRef<boolean>(false);
  const [, forceUpdate] = useState();

  const getSelectedRows = useCallback((): RowModel[] => {
    return selectedItemsRef.current.map((id) => apiRef!.current!.getRowFromId(id));
  }, [selectedItemsRef, apiRef]);

  const selectRowModel = useCallback(
    (row: RowModel, allowMultipleOverride?: boolean, isSelected?: boolean) => {
      if (!apiRef || apiRef.current == null) {
        throw new Error('Material-UI: ApiRef should be defined at this stage.');
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
      let isRowSelected: boolean;
      if (allowMultiSelect) {
        isRowSelected = isSelected == null ? !row.selected : isSelected;
      } else {
        isRowSelected = true;
      }
      const updatedRowModels: RowModel[] = [];
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
        selectedItemsRef.current.forEach((id) => {
          const otherSelectedRow = apiRef!.current!.getRowFromId(id);
          updatedRowModels.push({ ...otherSelectedRow, selected: false });
        });
        selectedItemsRef.current = [row.id];
      }
      apiRef!.current!.updateRowModels([...updatedRowModels, { ...row, selected: isRowSelected }]);

      if (apiRef && apiRef.current != null) {
        logger.info(
          `Row at index ${rowIndex} has changed to ${isRowSelected ? 'selected' : 'unselected'} `,
        );
        const rowSelectedParam: RowSelectedParams = {
          data: row.data,
          isSelected: isRowSelected,
          rowIndex,
        };
        const selectionChangedParam: SelectionChangedParams = {
          rows: getSelectedRows().map((r) => r.data),
        };
        apiRef.current!.emit(ROW_SELECTED_EVENT, rowSelectedParam);
        apiRef.current!.emit(SELECTION_CHANGED_EVENT, selectionChangedParam);
      }

      forceUpdate((p: any) => !p);
    },
    [
      forceUpdate,
      apiRef,
      logger,
      selectedItemsRef,
      allowMultipleSelectionKeyPressed,
      getSelectedRows,
    ],
  );

  const selectRow = useCallback(
    (id: RowId, isSelected = true, allowMultiple = false) => {
      if (!apiRef || !apiRef.current) {
        return;
      }
      selectRowModel(apiRef.current.getRowFromId(id), allowMultiple, isSelected);
    },
    [apiRef, selectRowModel],
  );

  const selectRows = useCallback(
    (ids: RowId[], isSelected = true, deSelectOthers = false) => {
      if (!apiRef || !apiRef.current) {
        return;
      }
      if (!options.enableMultipleSelection && ids.length > 1) {
        throw new Error(
          'Material-UI: Enable options.enableMultipleSelection to select more than 1 item.',
        );
      }
      let updates = ids.map((id) => ({ id, selected: isSelected }));

      if (deSelectOthers) {
        updates = [...selectedItemsRef.current.map((id) => ({ id, selected: false })), ...updates];
      }

      apiRef!.current!.updateRowModels(updates);
      selectedItemsRef.current = isSelected ? ids : [];
      forceUpdate((p: any) => !p);

      if (apiRef && apiRef.current != null) {
        // We don't emit ROW_SELECTED_EVENT on each row as it would be too consuming for large set of data.
        const selectionChangedParam: SelectionChangedParams = {
          rows: getSelectedRows().map((r) => r.data),
        };
        apiRef.current!.emit(SELECTION_CHANGED_EVENT, selectionChangedParam);
      }
    },
    [apiRef, selectedItemsRef, forceUpdate, options.enableMultipleSelection, getSelectedRows],
  );

  const rowClickedHandler = useCallback(
    (params: RowClickedParam) => {
      if (!options.disableSelectionOnClick) {
        selectRowModel(params.rowModel);
      }
    },
    [options.disableSelectionOnClick, selectRowModel],
  );

  const onMultipleKeyPressed = useCallback(
    (isPressed: boolean) => {
      allowMultipleSelectionKeyPressed.current = options.enableMultipleSelection && isPressed;
    },
    [options.enableMultipleSelection, allowMultipleSelectionKeyPressed],
  );

  const onSelectedRow = useCallback(
    (handler: (param: RowSelectedParams) => void): (() => void) => {
      return apiRef!.current!.registerEvent(ROW_SELECTED_EVENT, handler);
    },
    [apiRef],
  );
  const onSelectionChanged = useCallback(
    (handler: (param: SelectionChangedParams) => void): (() => void) => {
      return apiRef!.current!.registerEvent(SELECTION_CHANGED_EVENT, handler);
    },
    [apiRef],
  );

  useApiEventHandler(apiRef, ROW_CLICKED, rowClickedHandler);
  useApiEventHandler(apiRef, MULTIPLE_KEY_PRESS_CHANGED, onMultipleKeyPressed);
  // TODO handle Cell Clicked/range selection?

  const selectionApi: SelectionApi = {
    selectRow,
    getSelectedRows,
    selectRows,
    onSelectedRow,
    onSelectionChanged,
  };
  useApiMethod(apiRef, selectionApi, 'SelectionApi');

  useEffect(() => {
    if (initialised && selectedItemsRef.current.length > 0) {
      selectRows(selectedItemsRef.current);
    }
  }, [initialised, selectRows, selectedItemsRef]);

  useEffect(() => {
    selectedItemsRef.current = [];
    if (apiRef && apiRef.current != null) {
      const selectionChangedParam: SelectionChangedParams = { rows: [] };
      apiRef.current!.emit(SELECTION_CHANGED_EVENT, selectionChangedParam);
    }
  }, [rowsProp, apiRef]);
};
