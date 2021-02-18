import * as React from 'react';
import {
  GRID_ROW_CLICK,
  GRID_ROW_SELECTED,
  GRID_SELECTION_CHANGED,
} from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { SelectionApi } from '../../../models/api/selectionApi';
import { RowParams } from '../../../models/params/rowParams';
import { RowSelectedParams } from '../../../models/params/rowSelectedParams';
import { SelectionModelChangeParams } from '../../../models/params/selectionModelChangeParams';
import { RowId, RowModel } from '../../../models/rows';
import { SelectionModel } from '../../../models/selectionModel';
import { isDeepEqual } from '../../../utils/utils';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { gridKeyboardMultipleKeySelector } from '../keyboard/keyboardSelector';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import { GridSelectionState } from './gridSelectionState';

export const useGridSelection = (apiRef: ApiRef): void => {
  const logger = useLogger('useGridSelection');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const rowsLookup = useGridSelector(apiRef, gridRowsLookupSelector);
  const isMultipleKeyPressed = useGridSelector(apiRef, gridKeyboardMultipleKeySelector);

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
          const selectionState: GridSelectionState = {};
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
          const selectionState: GridSelectionState = Object.assign({}, state.selection);
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
          const selectionState: GridSelectionState = {};
          selectionState[row.id] = true;
          return { ...state, selection: selectionState };
        });
      }
      forceUpdate();

      const selectionState = apiRef!.current!.getState<GridSelectionState>('selection');

      const rowSelectedParam: RowSelectedParams = {
        api: apiRef,
        data: row,
        isSelected: !!selectionState[row.id],
      };
      const selectionChangeParam: SelectionModelChangeParams = {
        selectionModel: Object.keys(selectionState),
      };
      apiRef.current.publishEvent(GRID_ROW_SELECTED, rowSelectedParam);
      apiRef.current.publishEvent(GRID_SELECTION_CHANGED, selectionChangeParam);
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
        const selectionState: GridSelectionState = deSelectOthers ? {} : { ...state.selection };
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

      const params: SelectionModelChangeParams = {
        selectionModel: Object.keys(apiRef!.current!.getState<GridSelectionState>('selection')),
      };
      // We don't emit GRID_ROW_SELECTED on each row as it would be too consuming for large set of data.
      apiRef.current.publishEvent(GRID_SELECTION_CHANGED, params);
    },
    [
      options.disableMultipleSelection,
      options.checkboxSelection,
      setGridState,
      forceUpdate,
      apiRef,
    ],
  );

  const setSelectionModel = React.useCallback(
    (model: SelectionModel) => {
      apiRef.current.selectRows(model, true, true);
    },
    [apiRef],
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
      return apiRef.current.subscribeEvent(GRID_ROW_SELECTED, handler);
    },
    [apiRef],
  );
  const onSelectionModelChange = React.useCallback(
    (handler: (param: SelectionModelChangeParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_SELECTION_CHANGED, handler);
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GRID_ROW_CLICK, rowClickHandler);
  useGridApiEventHandler(apiRef, GRID_ROW_SELECTED, options.onRowSelected);
  useGridApiEventHandler(apiRef, GRID_SELECTION_CHANGED, options.onSelectionModelChange);

  // TODO handle Cell Click/range selection?
  const selectionApi: SelectionApi = {
    selectRow,
    getSelectedRows,
    selectRows,
    setSelectionModel,
    onRowSelected,
    onSelectionModelChange,
  };
  useGridApiMethod(apiRef, selectionApi, 'SelectionApi');

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

  React.useEffect(() => {
    const currentModel = Object.keys(apiRef.current.getState().selection);
    if (!isDeepEqual(currentModel, options.selectionModel)) {
      apiRef.current.setSelectionModel(options.selectionModel || []);
    }
  }, [apiRef, options.selectionModel]);
};
