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
  const isMultipleKeyPressedRef = React.useRef<boolean>(false);

  const {
    checkboxSelection,
    disableMultipleSelection,
    disableSelectionOnClick,
    selectionModel,
    isRowSelectable,
    onRowSelected,
    onSelectionModelChange,
  } = options;

  React.useEffect(() => {
    allowMultipleSelectionKeyPressed.current = !disableMultipleSelection && isMultipleKeyPressed;
    isMultipleKeyPressedRef.current = isMultipleKeyPressed;
  }, [isMultipleKeyPressed, disableMultipleSelection]);

  const getSelectedRows = React.useCallback(
    () => selectedGridRowsSelector(apiRef.current.getState()),
    [apiRef],
  );

  const selectRowModel = React.useCallback(
    (id: GridRowId, row: GridRowModel, allowMultipleOverride?: boolean, isSelected?: boolean) => {
      if (isRowSelectable && !isRowSelectable(apiRef.current.getRowParams(id))) {
        return;
      }

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
        allowMultipleOverride || allowMultipleSelectionKeyPressed.current || checkboxSelection;

      setGridState((state) => {
        let selection: GridSelectionState = { ...state.selection };
        if (allowMultiSelect) {
          const isRowSelected =
            !allowMultiSelect || isSelected == null ? selection[id] === undefined : isSelected;
          if (isRowSelected) {
            selection[id] = id;
          } else {
            delete selection[id];
          }
        } else if (isMultipleKeyPressedRef.current && selection[id] !== undefined) {
          selection = {};
        } else {
          selection = {};
          selection[id] = id;
        }
        return { ...state, selection };
      });
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
    [isRowSelectable, apiRef, logger, checkboxSelection, forceUpdate, setGridState],
  );

  const selectRow = React.useCallback(
    (id: GridRowId, isSelected = true, allowMultiple = false) => {
      selectRowModel(id, apiRef.current.getRow(id), allowMultiple, isSelected);
    },
    [apiRef, selectRowModel],
  );

  const selectRows = React.useCallback(
    (ids: GridRowId[], isSelected = true, deSelectOthers = false) => {
      const selectableIds = isRowSelectable
        ? ids.filter((id) => isRowSelectable!(apiRef.current.getRowParams(id)))
        : ids;

      if (disableMultipleSelection && selectableIds.length > 1 && !checkboxSelection) {
        return;
      }

      setGridState((state) => {
        const selectionState: GridSelectionState = deSelectOthers ? {} : { ...state.selection };
        selectableIds.forEach((id) => {
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
      isRowSelectable,
      disableMultipleSelection,
      checkboxSelection,
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

  const handleRowClick = React.useCallback(
    (params: GridRowParams) => {
      if (!disableSelectionOnClick) {
        selectRowModel(params.id, params.row);
      }
    },
    [disableSelectionOnClick, selectRowModel],
  );

  useGridApiEventHandler(apiRef, GRID_ROW_CLICK, handleRowClick);
  useGridApiOptionHandler(apiRef, GRID_ROW_SELECTED, onRowSelected);
  useGridApiOptionHandler(apiRef, GRID_SELECTION_CHANGED, onSelectionModelChange);

  // TODO handle Cell Click/range selection?
  const selectionApi: GridSelectionApi = {
    selectRow,
    getSelectedRows,
    selectRows,
    setSelectionModel,
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
    if (!isDeepEqual(currentModel, selectionModel)) {
      apiRef.current.setSelectionModel(selectionModel || []);
    }
  }, [apiRef, selectionModel]);

  React.useEffect(() => {
    setGridState((state) => {
      const newSelectionState = { ...state.selection };
      let hasChanged = false;
      Object.keys(newSelectionState).forEach((id: GridRowId) => {
        const isSelectable = !isRowSelectable || isRowSelectable(apiRef.current.getRowParams(id));
        if (!isSelectable) {
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
  }, [apiRef, setGridState, forceUpdate, isRowSelectable]);
};
