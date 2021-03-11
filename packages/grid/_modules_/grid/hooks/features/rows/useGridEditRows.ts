import * as React from 'react';
import {
  GRID_CELL_MODE_CHANGE,
  GRID_CELL_CHANGE,
  GRID_CELL_CHANGE_COMMITTED,
  GRID_ROW_EDIT_MODEL_CHANGE,
  GRID_CELL_DOUBLE_CLICK,
  GRID_CELL_ENTER_EDIT_KEY_DOWN,
  GRID_CELL_EXIT_EDIT_KEY_DOWN,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridEditRowApi } from '../../../models/api/gridEditRowApi';
import { GridCellMode } from '../../../models/gridCell';
import { GridEditRowsModel, GridEditRowUpdate } from '../../../models/gridEditRowModel';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridRowId } from '../../../models/gridRows';
import { GridCellParams } from '../../../models/params/gridCellParams';
import {
  GridCellModeChangeParams,
  GridEditCellParams,
  GridEditRowModelParams,
} from '../../../models/params/gridEditCellParams';
import { isDeleteKeys, isKeyboardEvent } from '../../../utils/keyboardUtils';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';

export function useGridEditRows(apiRef: GridApiRef) {
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);

  const setCellEditMode = React.useCallback(
    ({ id, field }: { id: GridRowId; field: string }) => {
      let hasChanged = false;
      setGridState((state) => {
        if (state.editRows[id] && state.editRows[id][field]) {
          return state;
        }

        const currentCellEditState: GridEditRowsModel = { ...state.editRows };
        currentCellEditState[id] = { ...currentCellEditState[id] } || {};
        currentCellEditState[id][field] = { value: apiRef.current.getCellValue(id, field) };

        const newEditRowsState: GridEditRowsModel = { ...state.editRows, ...currentCellEditState };
        hasChanged = true;
        return { ...state, editRows: newEditRowsState };
      });

      if (!hasChanged) {
        return;
      }
      forceUpdate();
      apiRef.current.publishEvent(GRID_CELL_MODE_CHANGE, {
        id,
        field,
        mode: 'edit',
        api: apiRef.current,
      });

      const editRowParams: GridEditRowModelParams = {
        api: apiRef.current,
        model: apiRef.current.getState().editRows,
      };
      apiRef.current.publishEvent(GRID_ROW_EDIT_MODEL_CHANGE, editRowParams);
    },
    [apiRef, forceUpdate, setGridState],
  );

  const setCellViewMode = React.useCallback(
    ({ id, field }) => {
      let hasChanged = false;
      setGridState((state) => {
        const newEditRowsState: GridEditRowsModel = { ...state.editRows };

        if (!newEditRowsState[id] || !newEditRowsState[id][field]) {
          return state;
        }

        if (newEditRowsState[id][field]) {
          delete newEditRowsState[id][field];
          if (!Object.keys(newEditRowsState[id]).length) {
            delete newEditRowsState[id];
          }
        }
        hasChanged = true;
        return { ...state, editRows: newEditRowsState };
      });
      if (!hasChanged) {
        return;
      }
      forceUpdate();
      const params: GridCellModeChangeParams = {
        id,
        field,
        mode: 'view',
        api: apiRef.current,
      };
      apiRef.current.publishEvent(GRID_CELL_MODE_CHANGE, params);
      const editRowParams: GridEditRowModelParams = {
        api: apiRef.current,
        model: apiRef.current.getState().editRows,
      };
      apiRef.current.publishEvent(GRID_ROW_EDIT_MODEL_CHANGE, editRowParams);
    },
    [apiRef, forceUpdate, setGridState],
  );

  const setCellMode = React.useCallback(
    (id, field, mode: GridCellMode) => {
      if (mode === 'edit') {
        setCellEditMode({ id, field });
      } else {
        setCellViewMode({ id, field });
      }
    },
    [setCellEditMode, setCellViewMode],
  );
  const getCellMode = React.useCallback(
    (id, field) => {
      const editState = apiRef.current.getState().editRows;
      const isEditing = editState[id] && editState[id][field];
      return isEditing ? 'edit' : 'view';
    },
    [apiRef],
  );

  const isCellEditable = React.useCallback(
    (params: GridCellParams) => {
      return (
        params.colDef.editable &&
        params.colDef!.renderEditCell &&
        (!options.isCellEditable || options.isCellEditable(params))
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.isCellEditable],
  );

  const commitCellChange = React.useCallback(
    (id: GridRowId, update: GridEditRowUpdate) => {
      if (options.editMode === GridFeatureModeConstant.server) {
        const params: GridEditCellParams = { api: apiRef.current, id, update };
        apiRef.current.publishEvent(GRID_CELL_CHANGE_COMMITTED, params);
        return;
      }
      const field = Object.keys(update).find((key) => key !== 'id')!;
      const rowUpdate = { id };
      rowUpdate[field] = update[field].value;
      apiRef.current.updateRows([rowUpdate]);
    },
    [apiRef, options.editMode],
  );

  const setEditCellProps = React.useCallback(
    (id: GridRowId, update: GridEditRowUpdate) => {
      if (options.editMode === GridFeatureModeConstant.server) {
        const params: GridEditCellParams = { api: apiRef.current, id, update };
        apiRef.current.publishEvent(GRID_CELL_CHANGE, params);
        return;
      }
      setGridState((state) => {
        const editRowsModel: GridEditRowsModel = { ...state.editRows };
        editRowsModel[id] = {
          ...state.editRows[id],
          ...update,
        };
        return { ...state, editRows: editRowsModel };
      });
      forceUpdate();
      const params: GridEditRowModelParams = {
        api: apiRef.current,
        model: apiRef.current.getState().editRows,
      };
      apiRef.current.publishEvent(GRID_ROW_EDIT_MODEL_CHANGE, params);
    },
    [apiRef, forceUpdate, options.editMode, setGridState],
  );

  const setEditRowsModel = React.useCallback(
    (editRows: GridEditRowsModel) => {
      setGridState((state) => {
        const newState = { ...state, editRows };
        return newState;
      });
      forceUpdate();
    },
    [forceUpdate, setGridState],
  );
  // TODO cleanup params What should we put?
  const onEditRowModelChange = React.useCallback(
    (handler: (param: GridEditRowModelParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_ROW_EDIT_MODEL_CHANGE, handler);
    },
    [apiRef],
  );
  const onCellModeChange = React.useCallback(
    (handler: (param: GridCellModeChangeParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_CELL_MODE_CHANGE, handler);
    },
    [apiRef],
  );
  const onEditCellChange = React.useCallback(
    (handler: (param: GridEditCellParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_CELL_CHANGE, handler);
    },
    [apiRef],
  );
  const onEditCellChangeCommitted = React.useCallback(
    (handler: (param: GridEditCellParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_CELL_CHANGE_COMMITTED, handler);
    },
    [apiRef],
  );

  // TAKE an appraoch link to the action so we can map the keyboard to a generic event
  //
  const handleEnterEdit = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent | React.KeyboardEvent) => {
      if (!params.isEditable) {
        return;
      }
      setCellEditMode(params);
      if (isKeyboardEvent(event) && isDeleteKeys(event.key)) {
        const update = {};
        update[params.field] = { value: '' };
        apiRef.current.setEditCellProps(params.id, update);
      }
    },
    [apiRef, setCellEditMode],
  );

  useGridApiEventHandler(apiRef, GRID_CELL_DOUBLE_CLICK, handleEnterEdit);
  useGridApiEventHandler(apiRef, GRID_CELL_ENTER_EDIT_KEY_DOWN, handleEnterEdit);
  useGridApiEventHandler(apiRef, GRID_CELL_EXIT_EDIT_KEY_DOWN, setCellViewMode);

  useGridApiEventHandler(apiRef, GRID_CELL_CHANGE, options.onEditCellChange);
  useGridApiEventHandler(apiRef, GRID_CELL_CHANGE_COMMITTED, options.onEditCellChangeCommitted);
  useGridApiEventHandler(apiRef, GRID_CELL_MODE_CHANGE, options.onCellModeChange);
  useGridApiEventHandler(apiRef, GRID_ROW_EDIT_MODEL_CHANGE, options.onEditRowModelChange);

  useGridApiMethod<GridEditRowApi>(
    apiRef,
    {
      setCellMode,
      getCellMode,
      onEditRowModelChange,
      onCellModeChange,
      onEditCellChangeCommitted,
      onEditCellChange,
      isCellEditable,
      commitCellChange,
      setEditCellProps,
      setEditRowsModel,
    },
    'EditRowApi',
  );

  React.useEffect(() => {
    apiRef.current.setEditRowsModel(options.editRowsModel || {});
  }, [apiRef, options.editRowsModel]);
}
