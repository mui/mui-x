import * as React from 'react';
import {
  GRID_ROW_CLICK,
  GRID_ROW_SELECTED,
  GRID_SELECTION_CHANGED,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridSelectionApi } from '../../../models/api/gridSelectionApi';
import { GridRowParams } from '../../../models/params/gridRowParams';
import { GridRowSelectedParams } from '../../../models/params/gridRowSelectedParams';
import { GridSelectionModelChangeParams } from '../../../models/params/gridSelectionModelChangeParams';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { GridSelectionModel } from '../../../models/gridSelectionModel';
import { isDeepEqual } from '../../../utils/utils';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { gridKeyboardMultipleKeySelector } from '../keyboard/gridKeyboardSelector';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import { GridSelectionState } from './gridSelectionState';
import { selectedGridRowsSelector } from './gridSelectionSelector';

export const useGridSelection = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridSelection');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const rowsLookup = useGridSelector(apiRef, gridRowsLookupSelector);
  const isMultipleKeyPressed = useGridSelector(apiRef, gridKeyboardMultipleKeySelector);

  const allowMultipleSelectionKeyPressed = React.useRef<boolean>(false);

  React.useEffect(() => {
    allowMultipleSelectionKeyPressed.current =
      !options.disableMultipleSelection && isMultipleKeyPressed;
  }, [isMultipleKeyPressed, options.disableMultipleSelection]);

  const getSelectedRows = React.useCallback(
    () => selectedGridRowsSelector(apiRef.current.getState()),
    [apiRef],
  );

  const selectRowModel = React.useCallback(
    (id: GridRowId, row: GridRowModel, allowMultipleOverride?: boolean, isSelected?: boolean) => {
      if (!apiRef.current.isInitialised) {
        setGridState((state) => {
          const selectionState: GridSelectionState = {};
          selectionState[id] = id;
          return { ...state, selection: selectionState };
        });
        return;
      }

      logger.debug(`Selecting row ${id}`);

      const allowMultiSelect =
        allowMultipleOverride ||
        allowMultipleSelectionKeyPressed.current ||
        options.checkboxSelection;

      if (allowMultiSelect) {
        setGridState((state) => {
          // eslint-disable-next-line prefer-object-spread
          const selectionState: GridSelectionState = Object.assign({}, state.selection);
          const isRowSelected =
            !allowMultiSelect || isSelected == null ? selectionState[id] === undefined : isSelected;

          if (isRowSelected) {
            selectionState[id] = id;
          } else {
            delete selectionState[id];
          }
          return { ...state, selection: selectionState };
        });
      } else {
        setGridState((state) => {
          const selectionState: GridSelectionState = {};
          selectionState[id] = id;
          return { ...state, selection: selectionState };
        });
      }
      forceUpdate();

      const selectionState = apiRef!.current!.getState<GridSelectionState>('selection');

      const rowSelectedParam: GridRowSelectedParams = {
        api: apiRef,
        data: row,
        isSelected: selectionState[id] !== undefined,
      };
      const selectionChangeParam: GridSelectionModelChangeParams = {
        selectionModel: Object.values(selectionState),
      };
      apiRef.current.publishEvent(GRID_ROW_SELECTED, rowSelectedParam);
      apiRef.current.publishEvent(GRID_SELECTION_CHANGED, selectionChangeParam);
    },
    [apiRef, logger, options.checkboxSelection, forceUpdate, setGridState],
  );

  const selectRow = React.useCallback(
    (id: GridRowId, isSelected = true, allowMultiple = false) => {
      selectRowModel(id, apiRef.current.getRowFromId(id), allowMultiple, isSelected);
    },
    [apiRef, selectRowModel],
  );

  const selectRows = React.useCallback(
    (ids: GridRowId[], isSelected = true, deSelectOthers = false) => {
      if (options.disableMultipleSelection && ids.length > 1 && !options.checkboxSelection) {
        return;
      }

      setGridState((state) => {
        const selectionState: GridSelectionState = deSelectOthers ? {} : { ...state.selection };
        ids.forEach((id) => {
          if (isSelected) {
            selectionState[id] = id;
          } else if (selectionState[id] !== undefined) {
            delete selectionState[id];
          }
        });
        return { ...state, selection: selectionState };
      });

      forceUpdate();

      const params: GridSelectionModelChangeParams = {
        selectionModel: Object.values(apiRef!.current!.getState<GridSelectionState>('selection')),
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
    (model: GridSelectionModel) => {
      apiRef.current.selectRows(model, true, true);
    },
    [apiRef],
  );

  const rowClickHandler = React.useCallback(
    (params: GridRowParams) => {
      if (!options.disableSelectionOnClick) {
        selectRowModel(params.id, params.row);
      }
    },
    [options.disableSelectionOnClick, selectRowModel],
  );

  const onRowSelected = React.useCallback(
    (handler: (param: GridRowSelectedParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_ROW_SELECTED, handler);
    },
    [apiRef],
  );
  const onSelectionModelChange = React.useCallback(
    (handler: (param: GridSelectionModelChangeParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_SELECTION_CHANGED, handler);
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GRID_ROW_CLICK, rowClickHandler);
  useGridApiOptionHandler(apiRef, GRID_ROW_SELECTED, options.onRowSelected);
  useGridApiOptionHandler(apiRef, GRID_SELECTION_CHANGED, options.onSelectionModelChange);

  // TODO handle Cell Click/range selection?
  const selectionApi: GridSelectionApi = {
    selectRow,
    getSelectedRows,
    selectRows,
    setSelectionModel,
    onRowSelected,
    onSelectionModelChange,
  };
  useGridApiMethod(apiRef, selectionApi, 'GridSelectionApi');

  React.useEffect(() => {
    setGridState((state) => {
      const newSelectionState = { ...state.selection };
      let hasChanged = false;
      Object.keys(newSelectionState).forEach((id: GridRowId) => {
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
    const currentModel = Object.values(apiRef.current.getState().selection);
    if (!isDeepEqual(currentModel, options.selectionModel)) {
      apiRef.current.setSelectionModel(options.selectionModel || []);
    }
  }, [apiRef, options.selectionModel]);
};
