import * as React from 'react';
import {
  GRID_ROW_CLICK,
  GRID_ROW_SELECTED,
  GRID_SELECTION_CHANGED,
} from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
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
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import { GridSelectionState } from './gridSelectionState';
import { selectedGridRowsSelector } from './gridSelectionSelector';

export const useGridSelection = (apiRef: GridApiRef, props: GridComponentProps): void => {
  const logger = useLogger('useGridSelection');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const rowsLookup = useGridSelector(apiRef, gridRowsLookupSelector);

  const {
    checkboxSelection,
    disableMultipleSelection,
    disableSelectionOnClick,
    selectionModel,
    isRowSelectable,
    onRowSelected,
    onSelectionModelChange,
  } = options;

  const getSelectedRows = React.useCallback(
    () => selectedGridRowsSelector(apiRef.current.getState()),
    [apiRef],
  );

  interface RowModelParams {
    id: GridRowId;
    row: GridRowModel;
    allowMultipleOverride?: boolean;
    isSelected?: boolean;
    isMultipleKey?: boolean;
  }

  const selectRowModel = React.useCallback(
    (rowModelParams: RowModelParams) => {
      const { id, row, allowMultipleOverride, isSelected, isMultipleKey } = rowModelParams;

      if (isRowSelectable && !isRowSelectable(apiRef.current.getRowParams(id))) {
        return;
      }

      logger.debug(`Selecting row ${id}`);

      setGridState((state) => {
        let selectionState: GridSelectionState = { ...state.selection };
        const allowMultiSelect =
          allowMultipleOverride ||
          (!disableMultipleSelection && isMultipleKey) ||
          checkboxSelection;

        if (allowMultiSelect) {
          const isRowSelected = isSelected == null ? selectionState[id] === undefined : isSelected;
          if (isRowSelected) {
            selectionState[id] = id;
          } else {
            delete selectionState[id];
          }
        } else {
          const isRowSelected =
            isSelected == null ? !isMultipleKey || selectionState[id] === undefined : isSelected;
          selectionState = {};
          if (isRowSelected) {
            selectionState[id] = id;
          }
        }
        return { ...state, selection: selectionState };
      });
      forceUpdate();
    },
    [
      isRowSelectable,
      disableMultipleSelection,
      apiRef,
      logger,
      checkboxSelection,
      forceUpdate,
      setGridState,
    ],
  );

  const selectRow = React.useCallback(
    (id: GridRowId, isSelected = true, allowMultiple = false) => {
      selectRowModel({
        id,
        row: apiRef.current.getRow(id),
        allowMultipleOverride: allowMultiple,
        isSelected,
      });
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
    (params: GridRowParams, event: React.MouseEvent) => {
      if (!disableSelectionOnClick) {
        selectRowModel({
          id: params.id,
          row: params.row,
          isMultipleKey: event.metaKey || event.ctrlKey,
        });
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

  React.useEffect(() => {
    apiRef.current.registerControlState<GridSelectionModel, GridSelectionState>({
      stateId: 'selectionModel',
      propModel: props.selectionModel,
      propOnChange: props.onSelectionModelChange,
      stateSelector: (state) => state.selection,
      mapStateToModel: (selectionState) => {
        if (!selectionState) {
          return undefined;
        }
        const model = Object.values(selectionState);
        return model;
      },
      onChangeCallback: (model: GridSelectionModel) => {
        apiRef.current.publishEvent(GRID_SELECTION_CHANGED, model);
      },
    });
  }, [apiRef, props.onSelectionModelChange, props.selectionModel]);
};
