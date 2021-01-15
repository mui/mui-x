import * as React from 'react';
import { ROW_CLICK, ROW_SELECTED, SELECTION_CHANGED } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { SelectionApi } from '../../../models/api/selectionApi';
import { RowParams } from '../../../models/params/rowParams';
import { RowSelectedParams } from '../../../models/params/rowSelectedParams';
import { SelectionChangeParams } from '../../../models/params/selectionChangeParams';
import { RowId, RowModel } from '../../../models/rows';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { keyboardMultipleKeySelector } from '../keyboard/keyboardSelector';
import { rowsLookupSelector } from '../rows/rowsSelector';
import { SelectionState } from './selectionState';

export const useSelection = (apiRef: ApiRef): void => {
  const logger = useLogger('useSelection');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const rowsLookup = useGridSelector(apiRef, rowsLookupSelector);
  const isMultipleKeyPressed = useGridSelector(apiRef, keyboardMultipleKeySelector);

  const allowMultipleSelectionKeyPressed = React.useRef<boolean>(false);

  React.useEffect(() => {
    allowMultipleSelectionKeyPressed.current =
      !options.disableMultipleSelection && isMultipleKeyPressed;
  }, [isMultipleKeyPressed, options.disableMultipleSelection]);

  const getSelectedRows = React.useCallback((): RowModel[] => {
    // TODO replace with selector
    return Object.keys(gridState.selection).map((id) => apiRef.current.getRowFromId(id));
  }, [apiRef, gridState.selection]);

  const selectRowModel = React.useCallback(
    (row: RowModel, allowMultipleOverride?: boolean, isSelected?: boolean) => {
      if (!apiRef.current.isInitialised) {
        setGridState((state) => {
          const selectionState: SelectionState = {};
          selectionState[row.id] = true;
          return { ...state, selection: selectionState };
        });
        return;
      }

      logger.debug(`Selecting row ${row.id}`);

      const allowMultiSelect =
        allowMultipleOverride ||
        allowMultipleSelectionKeyPressed.current ||
        options.checkboxSelection;

      if (allowMultiSelect) {
        setGridState((state) => {
          // eslint-disable-next-line prefer-object-spread
          const selectionState: SelectionState = Object.assign({}, state.selection);
          const isRowSelected: boolean =
            !allowMultiSelect || isSelected == null ? !selectionState[row.id] : isSelected;

          if (isRowSelected) {
            selectionState[row.id] = true;
          } else {
            delete selectionState[row.id];
          }
          return { ...state, selection: selectionState };
        });
      } else {
        setGridState((state) => {
          const selectionState: SelectionState = {};
          selectionState[row.id] = true;
          return { ...state, selection: selectionState };
        });
      }
      forceUpdate();

      const selectionState = apiRef!.current!.getState<SelectionState>('selection');
      const rowSelectedParam: RowSelectedParams = {
        data: row,
        isSelected: !!selectionState[row.id],
      };
      const selectionChangeParam: SelectionChangeParams = {
        rowIds: Object.keys(selectionState),
      };
      apiRef.current.publishEvent(ROW_SELECTED, rowSelectedParam);
      apiRef.current.publishEvent(SELECTION_CHANGED, selectionChangeParam);
    },
    [apiRef, logger, options.checkboxSelection, forceUpdate, setGridState],
  );

  const selectRow = React.useCallback(
    (id: RowId, isSelected = true, allowMultiple = false) => {
      selectRowModel(apiRef.current.getRowFromId(id), allowMultiple, isSelected);
    },
    [apiRef, selectRowModel],
  );

  const selectRows = React.useCallback(
    (ids: RowId[], isSelected = true, deSelectOthers = false) => {
      if (options.disableMultipleSelection && ids.length > 1 && !options.checkboxSelection) {
        return;
      }

      setGridState((state) => {
        const selectionState: SelectionState = deSelectOthers ? {} : { ...state.selection };
        ids.reduce((newState, rowId) => {
          if (isSelected) {
            newState[rowId] = true;
          } else if (newState[rowId]) {
            delete newState[rowId];
          }
          return newState;
        }, selectionState);
        return { ...state, selection: selectionState };
      });

      forceUpdate();

      // We don't emit ROW_SELECTED on each row as it would be too consuming for large set of data.
      apiRef.current.publishEvent(SELECTION_CHANGED, {
        rowIds: Object.keys(apiRef!.current!.getState<SelectionState>('selection')),
      });
    },
    [
      options.disableMultipleSelection,
      options.checkboxSelection,
      setGridState,
      forceUpdate,
      apiRef,
    ],
  );

  const rowClickHandler = React.useCallback(
    (params: RowParams) => {
      if (!options.disableSelectionOnClick) {
        selectRowModel(params.row);
      }
    },
    [options.disableSelectionOnClick, selectRowModel],
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
    setGridState((state) => {
      const newSelectionState = { ...state.selection };
      let hasChanged = false;
      Object.keys(newSelectionState).forEach((id: RowId) => {
        if (!rowsLookup[id]) {
          delete newSelectionState[id];
          hasChanged = true;
        }
      });
      if (hasChanged) {
        return { ...state, selection: newSelectionState };
      }
      return state;
    });
    forceUpdate();
  }, [rowsLookup, apiRef, setGridState, forceUpdate]);
};
