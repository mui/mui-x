import * as React from 'react';
import {
  GRID_CELL_MODE_CHANGE,
  GRID_CELL_EDIT_PROPS_CHANGE,
  GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED,
  GRID_ROW_EDIT_MODEL_CHANGE,
  GRID_CELL_DOUBLE_CLICK,
  GRID_CELL_EDIT_ENTER,
  GRID_CELL_EDIT_EXIT,
  GRID_CELL_NAVIGATION_KEY_DOWN,
  GRID_CELL_MOUSE_DOWN,
  GRID_CELL_BLUR,
  GRID_CELL_KEY_DOWN,
  GRID_CELL_VALUE_CHANGE,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridEditRowApi } from '../../../models/api/gridEditRowApi';
import { GridCellMode } from '../../../models/gridCell';
import { GridEditRowsModel } from '../../../models/gridEditRowModel';
import { GridRowId } from '../../../models/gridRows';
import { GridCellParams } from '../../../models/params/gridCellParams';
import {
  GridEditCellPropsParams,
  GridEditCellValueParams,
  GridEditRowModelParams,
} from '../../../models/params/gridEditCellParams';
import {
  isPrintableKey,
  isCellEditCommitKeys,
  isCellEnterEditModeKeys,
  isCellExitEditModeKeys,
  isDeleteKeys,
  isEscapeKey,
  isKeyboardEvent,
} from '../../../utils/keyboardUtils';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';

export function useGridEditRows(apiRef: GridApiRef) {
  const logger = useLogger('useGridEditRows');
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
      logger.debug(`Switching cell id: ${id} field: ${field} to mode: ${mode}`);
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
    [apiRef, forceUpdate, logger, setGridState],
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
    (params: GridEditCellPropsParams, event?: React.SyntheticEvent) => {
      if (event?.isPropagationStopped()) {
        return;
      }

      const { id, field, props } = params;
      logger.debug(`Setting cell props on id: ${id} field: ${field}`);
      setGridState((state) => {
        const editRowsModel: GridEditRowsModel = { ...state.editRows };
        editRowsModel[id] = { ...state.editRows[id] };
        editRowsModel[id][field] = props;
        return { ...state, editRows: editRowsModel };
      });
      forceUpdate();
      const editRowParams: GridEditRowModelParams = {
        api: apiRef.current,
        model: apiRef.current.getState().editRows,
      };
      apiRef.current.publishEvent(GRID_ROW_EDIT_MODEL_CHANGE, editRowParams);
    },
    [apiRef, forceUpdate, logger, setGridState],
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
      logger.debug(`Setting row model`);

      setGridState((state) => ({ ...state, editRows }));
      forceUpdate();
    },
    [forceUpdate, logger, setGridState],
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

  const setCellValue = React.useCallback(
    (params: GridEditCellValueParams) => {
      const column = apiRef.current.getColumn(params.field);
      const parsedValue = column.valueParser
        ? column.valueParser(params.value, apiRef.current.getCellParams(params.id, params.field))
        : params.value;
      logger.debug(
        `Setting cell id: ${params.id} field: ${params.field} to value: ${parsedValue?.toString()}`,
      );
      const rowUpdate = { id: params.id };
      rowUpdate[params.field] = parsedValue;
      apiRef.current.updateRows([rowUpdate]);
      apiRef.current.publishEvent(GRID_CELL_VALUE_CHANGE, params);
    },
    [apiRef, logger],
  );

  const commitCellChange = React.useCallback(
    (params: GridEditCellPropsParams, event?: React.SyntheticEvent) => {
      if (event?.isPropagationStopped()) {
        return;
      }

      logger.debug(`Committing cell change on id: ${params.id} field: ${params.field}`);

      const value = params.props && params.props.value;
      apiRef.current.setCellValue({ id: params.id, field: params.field, value });
    },
    [apiRef, logger],
  );

  const handleExitEdit = React.useCallback(
    (params: GridCellParams, event: React.SyntheticEvent) => {
      setCellMode(params.id, params.field, 'view');

      if (!isKeyboardEvent(event)) {
        return;
      }

      if (isCellEditCommitKeys(event.key)) {
        apiRef.current.publishEvent(GRID_CELL_NAVIGATION_KEY_DOWN, params, event);
        return;
      }
      if (isEscapeKey(event.key) || isDeleteKeys(event.key)) {
        apiRef.current.setCellFocus(params.id, params.field);
      }
    },
    [apiRef, setCellMode],
  );

  const handleEnterEdit = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent | React.KeyboardEvent) => {
      if (!params.isEditable || event.isPropagationStopped()) {
        return;
      }
      if (isKeyboardEvent(event) && isPrintableKey(event.key)) {
        const propsParams = apiRef.current.getEditCellPropsParams(params.id, params.field);
        propsParams.props.value = '';
        apiRef.current.setEditCellProps(propsParams);
      }
      setCellMode(params.id, params.field, 'edit');
    },
    [apiRef, setCellMode],
  );

  const preventTextSelection = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      const isMoreThanOneClick = event.detail > 1;
      if (params.isEditable && params.cellMode === 'view' && isMoreThanOneClick) {
        // If we click more than one time, then we prevent the default behavior of selecting the text cell.
        event.preventDefault();
      }
    },
    [],
  );

  const handleCellBlur = React.useCallback(
    (params: GridCellParams, event) => {
      if (event.isPropagationStopped() || params.cellMode === 'view') {
        return;
      }
      const cellCommitParams = apiRef.current.getEditCellPropsParams(params.id, params.field);
      if (!cellCommitParams.props.error) {
        // We commit the change when there are no error
        apiRef.current.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED, cellCommitParams, event);
      }
      apiRef.current.publishEvent(GRID_CELL_EDIT_EXIT, params, event);
    },
    [apiRef],
  );

  const handleCellKeyDown = React.useCallback(
    (params: GridCellParams, event) => {
      if (!params.isEditable || event.isPropagationStopped()) {
        return;
      }

      const isEditMode = params.cellMode === 'edit';

      if (!isEditMode && isCellEnterEditModeKeys(event.key)) {
        apiRef.current.publishEvent(GRID_CELL_EDIT_ENTER, params, event);
      }
      if (!isEditMode && isDeleteKeys(event.key)) {
        const commitParams: GridEditCellPropsParams = apiRef.current.getEditCellPropsParams(
          params.id,
          params.field,
        );
        commitParams.props.value = '';
        apiRef.current.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED, commitParams, event);
        apiRef.current.publishEvent(GRID_CELL_EDIT_EXIT, params, event);
      }
      if (isEditMode && isCellEditCommitKeys(event.key)) {
        const cellCommitParams = apiRef.current.getEditCellPropsParams(params.id, params.field);
        if (cellCommitParams.props.error) {
          return;
        }
        apiRef.current.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED, cellCommitParams, event);
      }
      if (isEditMode && !event.isPropagationStopped() && isCellExitEditModeKeys(event.key)) {
        apiRef.current.publishEvent(GRID_CELL_EDIT_EXIT, params, event);
      }
    },
    [apiRef],
  );

  const handleDoubleClick = React.useCallback(
    (...args) => {
      apiRef.current.publishEvent(GRID_CELL_EDIT_ENTER, ...args);
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GRID_CELL_KEY_DOWN, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GRID_CELL_BLUR, handleCellBlur);
  useGridApiEventHandler(apiRef, GRID_CELL_MOUSE_DOWN, preventTextSelection);
  useGridApiEventHandler(apiRef, GRID_CELL_DOUBLE_CLICK, handleDoubleClick);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_ENTER, handleEnterEdit);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_EXIT, handleExitEdit);

  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_PROPS_CHANGE, setEditCellProps);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED, commitCellChange);

  useGridApiOptionHandler(
    apiRef,
    GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED,
    options.onEditCellChangeCommitted,
  );
  useGridApiOptionHandler(apiRef, GRID_CELL_EDIT_PROPS_CHANGE, options.onEditCellChange);
  useGridApiOptionHandler(apiRef, GRID_CELL_VALUE_CHANGE, options.onCellValueChange);
  useGridApiOptionHandler(apiRef, GRID_CELL_MODE_CHANGE, options.onCellModeChange);
  useGridApiOptionHandler(apiRef, GRID_ROW_EDIT_MODEL_CHANGE, options.onEditRowModelChange);

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
      setEditRowsModel,
      getEditRowsModel,
    },
    'EditRowApi',
  );

  React.useEffect(() => {
    apiRef.current.setEditRowsModel(options.editRowsModel || {});
  }, [apiRef, options.editRowsModel]);
}
