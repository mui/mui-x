import * as React from 'react';
import {
  GridOptions,
  RowId,
  RowModel,
  RowSelectedParams,
  RowsProp,
  SelectionChangeParams,
  ApiRef,
  RowParams,
} from '../../models';
import { useLogger } from '../utils/useLogger';
import {
  MULTIPLE_KEY_PRESS_CHANGED,
  ROW_CLICK,
  ROW_SELECTED,
  SELECTION_CHANGED,
} from '../../constants/eventsConstants';
import { useApiEventHandler } from '../root/useApiEventHandler';
import { useApiMethod } from '../root/useApiMethod';
import { SelectionApi } from '../../models/api/selectionApi';

export const useSelection = (
  options: GridOptions,
  rowsProp: RowsProp,
  initialised: boolean,
  apiRef: ApiRef,
): void => {
  const logger = useLogger('useSelection');
  const selectedItemsRef = React.useRef<RowId[]>([]);
  const allowMultipleSelectionKeyPressed = React.useRef<boolean>(false);
  const [, forceUpdate] = React.useState();

  const getSelectedRows = React.useCallback((): RowModel[] => {
    return selectedItemsRef.current.map((id) => apiRef.current.getRowFromId(id));
  }, [selectedItemsRef, apiRef]);

  const selectRowModel = React.useCallback(
    (row: RowModel, allowMultipleOverride?: boolean, isSelected?: boolean) => {
      if (!apiRef.current.isInitialised) {
        selectedItemsRef.current = [row.id];
        return;
      }

      logger.debug(`Selecting row ${row.id}`);
      const rowIndex = apiRef.current.getRowIndexFromId(row.id);
      // if checkboxSelection true then we allow click to deselect a row.
      let allowMultiSelect = allowMultipleSelectionKeyPressed.current || options.checkboxSelection;
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
          const otherSelectedRow = apiRef.current.getRowFromId(id);
          updatedRowModels.push({ ...otherSelectedRow, selected: false });
        });
        selectedItemsRef.current = [row.id];
      }
      apiRef.current.updateRowModels([...updatedRowModels, { ...row, selected: isRowSelected }]);

      logger.info(
        `Row at index ${rowIndex} has change to ${isRowSelected ? 'selected' : 'unselected'} `,
      );
      const rowSelectedParam: RowSelectedParams = {
        data: row.data,
        isSelected: isRowSelected,
        rowIndex,
      };
      const selectionChangeParam: SelectionChangeParams = {
        rows: getSelectedRows().map((r) => r.data),
      };
      apiRef.current.publishEvent(ROW_SELECTED, rowSelectedParam);
      apiRef.current.publishEvent(SELECTION_CHANGED, selectionChangeParam);

      forceUpdate((p: any) => !p);
    },
    [
      forceUpdate,
      apiRef,
      logger,
      selectedItemsRef,
      allowMultipleSelectionKeyPressed,
      getSelectedRows,
      options.checkboxSelection,
    ],
  );

  const selectRow = React.useCallback(
    (id: RowId, isSelected = true, allowMultiple = false) => {
      selectRowModel(apiRef.current.getRowFromId(id), allowMultiple, isSelected);
    },
    [apiRef, selectRowModel],
  );

  const selectRows = React.useCallback(
    (ids: RowId[], isSelected = true, deSelectOthers = false) => {
      if (!options.enableMultipleSelection && ids.length > 1) {
        throw new Error(
          'Material-UI: Enable options.enableMultipleSelection to select more than 1 item.',
        );
      }
      let updates = ids.map((id) => ({ id, selected: isSelected }));

      if (deSelectOthers) {
        updates = [...selectedItemsRef.current.map((id) => ({ id, selected: false })), ...updates];
      }

      apiRef.current.updateRowModels(updates);
      selectedItemsRef.current = isSelected ? ids : [];
      forceUpdate((p: any) => !p);

      // We don't emit ROW_SELECTED on each row as it would be too consuming for large set of data.
      const selectionChangeParam: SelectionChangeParams = {
        rows: getSelectedRows().map((r) => r.data),
      };
      apiRef.current.publishEvent(SELECTION_CHANGED, selectionChangeParam);
    },
    [apiRef, selectedItemsRef, forceUpdate, options.enableMultipleSelection, getSelectedRows],
  );

  const rowClickHandler = React.useCallback(
    (params: RowParams) => {
      if (!options.disableSelectionOnClick) {
        selectRowModel(params.rowModel);
      }
    },
    [options.disableSelectionOnClick, selectRowModel],
  );

  const onMultipleKeyPressed = React.useCallback(
    (isPressed: boolean) => {
      allowMultipleSelectionKeyPressed.current = options.enableMultipleSelection && isPressed;
    },
    [options.enableMultipleSelection, allowMultipleSelectionKeyPressed],
  );

  const onRowSelected = React.useCallback(
    (handler: (param: RowSelectedParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(ROW_SELECTED, handler);
    },
    [apiRef],
  );
  const onSelectionChange = React.useCallback(
    (handler: (param: SelectionChangeParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(SELECTION_CHANGED, handler);
    },
    [apiRef],
  );

  useApiEventHandler(apiRef, ROW_CLICK, rowClickHandler);
  useApiEventHandler(apiRef, MULTIPLE_KEY_PRESS_CHANGED, onMultipleKeyPressed);

  useApiEventHandler(apiRef, ROW_SELECTED, options.onRowSelected);
  useApiEventHandler(apiRef, SELECTION_CHANGED, options.onSelectionChange);

  // TODO handle Cell Click/range selection?

  const selectionApi: SelectionApi = {
    selectRow,
    getSelectedRows,
    selectRows,
    onRowSelected,
    onSelectionChange,
  };
  useApiMethod(apiRef, selectionApi, 'SelectionApi');

  React.useEffect(() => {
    if (initialised && selectedItemsRef.current.length > 0) {
      selectRows(selectedItemsRef.current);
    }
  }, [initialised, selectRows, selectedItemsRef]);

  React.useEffect(() => {
    selectedItemsRef.current = [];
    const selectionChangeParam: SelectionChangeParams = { rows: [] };
    apiRef.current.publishEvent(SELECTION_CHANGED, selectionChangeParam);
  }, [rowsProp, apiRef]);
};
