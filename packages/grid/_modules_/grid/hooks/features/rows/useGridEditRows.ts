import * as React from 'react';
import {
  GRID_CELL_MODE_CHANGE,
  GRID_CELL_EDIT_PROPS_CHANGE,
  GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED,
  GRID_ROW_EDIT_MODEL_CHANGE,
  GRID_CELL_DOUBLE_CLICK,
  GRID_CELL_ENTER_EDIT,
  GRID_CELL_EXIT_EDIT,
  GRID_CELL_NAVIGATION_KEYDOWN,
  GRID_CELL_MOUSE_DOWN,
  GRID_CELL_EDIT_BLUR,
  GRID_CELL_KEYDOWN,
  GRID_CELL_VALUE_CHANGE,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridEditRowApi } from '../../../models/api/gridEditRowApi';
import { GridCellMode } from '../../../models/gridCell';
import { GridEditRowsModel, GridEditRowProps } from '../../../models/gridEditRowModel';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridRowId } from '../../../models/gridRows';
import { GridCellParams } from '../../../models/params/gridCellParams';
import {
  GridCellModeChangeParams,
  GridEditCellPropsParams,
  GridEditCellValueParams,
  GridEditRowModelParams,
} from '../../../models/params/gridEditCellParams';
import {
  isAlphaKeys,
  isCellEditCommitKeys,
  isCellEnterEditModeKeys,
  isCellExitEditModeKeys,
  isDeleteKeys,
  isEscapeKey,
  isKeyboardEvent,
} from '../../../utils/keyboardUtils';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';

export function useGridEditRows(apiRef: GridApiRef) {
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const lastEditedCell = React.useRef<GridCellParams | null>(null);

  const setCellMode = React.useCallback(
    (id, field, mode: GridCellMode) => {
      let hasChanged = false;
      setGridState((state) => {
        const stateExist = state.editRows[id] && state.editRows[id][field];
        const newEditRowsState: GridEditRowsModel = { ...state.editRows };
        if ((mode === 'edit' && stateExist) || (mode === 'view' && !stateExist)) {
          return state;
        }

        if (mode === 'edit') {
          newEditRowsState[id] = { ...newEditRowsState[id] } || {};
          newEditRowsState[id][field] = { value: apiRef.current.getCellValue(id, field) };
          lastEditedCell.current = apiRef.current.getCellParams(id, field);
        } else {
          delete newEditRowsState[id][field];
          lastEditedCell.current = null;
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
      apiRef.current.publishEvent(GRID_CELL_MODE_CHANGE, {
        id,
        field,
        mode,
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

  const getCellMode = React.useCallback(
    (id, field) => {
      const editState = apiRef.current.getState().editRows;
      const isEditing = editState[id] && editState[id][field];
      return isEditing ? 'edit' : 'view';
    },
    [apiRef],
  );

  const isCellEditable = React.useCallback(
    (params: GridCellParams) =>
      params.colDef.editable &&
      params.colDef!.renderEditCell &&
      (!options.isCellEditable || options.isCellEditable(params)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.isCellEditable],
  );

  const setEditCellProps = React.useCallback(
    (id: GridRowId, update: GridEditRowProps) => {
      const field = Object.keys(update).find((key) => key !== 'id')!;
      if (options.editMode === GridFeatureModeConstant.server) {
        const params = apiRef.current.getEditCellPropsParams(id, field);
        params.props = update[field];
        apiRef.current.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE, params);
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

  const getEditCellProps = React.useCallback(
    (id: GridRowId, field: string) => {
      const model = apiRef.current.getEditRowsModel();
      if (!model[id] || !model[id][field]) {
        return { id, field, value: apiRef.current.getCellValue(id, field) };
      }
      return model[id][field];
    },
    [apiRef],
  );

  const setEditRowsModel = React.useCallback(
    (editRows: GridEditRowsModel): void => {
      setGridState((state) => ({ ...state, editRows }));
      forceUpdate();
    },
    [forceUpdate, setGridState],
  );

  const getEditRowsModel = React.useCallback(
    (): GridEditRowsModel => apiRef.current.getState().editRows,
    [apiRef],
  );

  const getEditCellPropsParams = React.useCallback(
    (id: GridRowId, field: string): GridEditCellPropsParams => {
      const fieldProps = apiRef.current.getEditCellProps(id, field);
      return { id, field, props: fieldProps };
    },
    [apiRef],
  );
  const getEditCellValueParams = React.useCallback(
    (id: GridRowId, field: string): GridEditCellValueParams => {
      const fieldProps = apiRef.current.getEditCellProps(id, field);
      return { id, field, value: fieldProps?.value };
    },
    [apiRef],
  );

  const setCellValue = React.useCallback(
    (params: GridEditCellValueParams) => {
      const rowUpdate = { id: params.id };
      rowUpdate[params.field] = params.value;
      apiRef.current.updateRows([rowUpdate]);
      apiRef.current.publishEvent(GRID_CELL_VALUE_CHANGE, params);
    },
    [apiRef],
  );

  const commitCellChange = React.useCallback(
    (params: GridEditCellPropsParams) => {
      if (options.editMode === GridFeatureModeConstant.server) {
        return;
      }

      const value = params.props && params.props.value;
      apiRef.current.setCellValue({ id: params.id, field: params.field, value });
    },
    [apiRef, options.editMode],
  );

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
    (handler: (param: GridEditCellValueParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_CELL_EDIT_PROPS_CHANGE, handler);
    },
    [apiRef],
  );

  const onEditCellChangeCommitted = React.useCallback(
    (handler: (param: GridEditCellValueParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED, handler);
    },
    [apiRef],
  );

  const handleExitEdit = React.useCallback(
    (params: GridCellParams, event: React.SyntheticEvent) => {
      setCellMode(params.id, params.field, 'view');

      if (!isKeyboardEvent(event)) {
        return;
      }

      if (isCellEditCommitKeys(event.key)) {
        apiRef.current.publishEvent(GRID_CELL_NAVIGATION_KEYDOWN, params, event);
        return;
      }
      if (isEscapeKey(event.key) || isDeleteKeys(event.key)) {
        apiRef.current.setCellFocus(params);
      }
    },
    [apiRef, setCellMode],
  );

  const handleEnterEdit = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent | React.KeyboardEvent) => {
      if (!params.isEditable) {
        return;
      }
      if (isKeyboardEvent(event) && isAlphaKeys(event.key)) {
        const update = {};
        update[params.field] = { value: '' };

        apiRef.current.setEditCellProps(params.id, update);
      }
      setCellMode(params.id, params.field, 'edit');
    },
    [apiRef, setCellMode],
  );

  const preventTextSelection = React.useCallback((params, event) => {
    const isMoreThanOneClick = event.detail > 1;
    if (params.isEditable && isMoreThanOneClick) {
      // If we click more than one time, then we prevent the default behavior of selecting the text cell.
      event.preventDefault();
    }
  }, []);

  const handleCellEditBlur = React.useCallback(
    (params: GridCellParams, event) => {
      if (params.cellMode === 'view') {
        return;
      }
      const cellCommitParams = apiRef.current.getEditCellPropsParams(params.id, params.field);
      apiRef.current.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED, cellCommitParams, event);
      apiRef.current.publishEvent(GRID_CELL_EXIT_EDIT, params, event);
    },
    [apiRef],
  );

  const handleCellKeyDown = React.useCallback(
    (params: GridCellParams, event) => {
      const isEditMode = params.cellMode === 'edit';

      if (!isEditMode && isCellEnterEditModeKeys(event.key)) {
        apiRef.current.publishEvent(GRID_CELL_ENTER_EDIT, params, event);
      }
      if (!isEditMode && isDeleteKeys(event.key)) {
        const commitParams: GridEditCellPropsParams = apiRef.current.getEditCellPropsParams(
          params.id,
          params.field,
        );
        commitParams.props.value = '';
        apiRef.current.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED, commitParams, event);
        apiRef.current.publishEvent(GRID_CELL_EXIT_EDIT, params, event);
      }
      if (isEditMode && isCellEditCommitKeys(event.key)) {
        const cellCommitParams = apiRef.current.getEditCellPropsParams(params.id, params.field);
        apiRef.current.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED, cellCommitParams, event);
      }
      if (isEditMode && !event.isPropagationStopped() && isCellExitEditModeKeys(event.key)) {
        apiRef.current.publishEvent(GRID_CELL_EXIT_EDIT, params, event);
      }
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GRID_CELL_KEYDOWN, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_BLUR, handleCellEditBlur);
  useGridApiEventHandler(apiRef, GRID_CELL_MOUSE_DOWN, preventTextSelection);
  useGridApiEventHandler(apiRef, GRID_CELL_DOUBLE_CLICK, handleEnterEdit);
  useGridApiEventHandler(apiRef, GRID_CELL_ENTER_EDIT, handleEnterEdit);
  useGridApiEventHandler(apiRef, GRID_CELL_EXIT_EDIT, handleExitEdit);

  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_PROPS_CHANGE, options.onEditCellChange);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED, commitCellChange);
  useGridApiEventHandler(
    apiRef,
    GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED,
    options.onEditCellChangeCommitted,
  );

  useGridApiEventHandler(apiRef, GRID_CELL_VALUE_CHANGE, options.onCellValueChange);
  useGridApiEventHandler(apiRef, GRID_CELL_MODE_CHANGE, options.onCellModeChange);
  useGridApiEventHandler(apiRef, GRID_ROW_EDIT_MODEL_CHANGE, options.onEditRowModelChange);

  useGridApiMethod<GridEditRowApi>(
    apiRef,
    {
      setCellMode,
      getCellMode,
      isCellEditable,
      setCellValue,
      commitCellChange,
      setEditCellProps,
      getEditCellProps,
      getEditCellPropsParams,
      getEditCellValueParams,
      setEditRowsModel,
      getEditRowsModel,

      onEditRowModelChange,
      onCellModeChange,
      onEditCellChangeCommitted,
      onEditCellChange,
    },
    'EditRowApi',
  );

  React.useEffect(() => {
    apiRef.current.setEditRowsModel(options.editRowsModel || {});
  }, [apiRef, options.editRowsModel]);
}
