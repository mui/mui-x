import * as React from 'react';
import {
  GRID_CELL_MODE_CHANGE,
  GRID_EDIT_CELL_PROPS_CHANGE,
  GRID_CELL_EDIT_COMMIT,
  GRID_CELL_DOUBLE_CLICK,
  GRID_CELL_EDIT_START,
  GRID_CELL_EDIT_STOP,
  GRID_CELL_NAVIGATION_KEY_DOWN,
  GRID_CELL_MOUSE_DOWN,
  GRID_CELL_KEY_DOWN,
  GRID_COLUMN_HEADER_DRAG_START,
  GRID_CELL_FOCUS_OUT,
  GRID_EDIT_ROWS_MODEL_CHANGE,
  GRID_CELL_FOCUS_IN,
  GRID_ROW_EDIT_STOP,
  GRID_ROW_EDIT_COMMIT,
  GRID_ROW_EDIT_START,
} from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridRowId } from '../../../models/gridRows';
import { GridEditRowApi } from '../../../models/api/gridEditRowApi';
import { GridCellMode } from '../../../models/gridCell';
import { GridEditRowsModel } from '../../../models/gridEditRowModel';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { GridRowParams } from '../../../models/params/gridRowParams';
import {
  GridEditCellPropsParams,
  GridEditCellValueParams,
  GridCellEditCommitParams,
  GridCommitCellChangeParams,
} from '../../../models/params/gridEditCellParams';
import {
  isPrintableKey,
  isCellEditCommitKeys,
  isCellEnterEditModeKeys,
  isCellExitEditModeKeys,
  isDeleteKeys,
  isKeyboardEvent,
} from '../../../utils/keyboardUtils';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { allGridColumnsSelector } from '../columns/gridColumnsSelector';
import { useEventCallback } from '../../../utils/material-ui-utils';
import { useLogger } from '../../utils/useLogger';
import { useGridState } from '../core/useGridState';
import { useGridSelector } from '../core/useGridSelector';

export function useGridEditRows(
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    | 'editRowsModel'
    | 'onEditRowsModelChange'
    | 'onEditCellPropsChange'
    | 'onCellEditCommit'
    | 'onCellEditStart'
    | 'onCellEditStop'
    | 'onRowEditCommit'
    | 'onRowEditStart'
    | 'onRowEditStop'
    | 'isCellEditable'
    | 'editMode'
  >,
) {
  const logger = useLogger('useGridEditRows');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const focusTimeout = React.useRef<any>(null);
  const nextFocusedCell = React.useRef<GridCellParams | null>(null);
  const columns = useGridSelector(apiRef, allGridColumnsSelector);

  const commitPropsAndExit = (params: GridCellParams, event: MouseEvent | React.SyntheticEvent) => {
    if (params.cellMode === 'view') {
      return;
    }
    if (props.editMode === 'row') {
      nextFocusedCell.current = null;
      focusTimeout.current = setTimeout(() => {
        if (nextFocusedCell.current?.id !== params.id) {
          apiRef.current.commitRowChange(params.id);
          const rowParams = apiRef.current.getRowParams(params.id);
          apiRef.current.publishEvent(GRID_ROW_EDIT_STOP, rowParams, event);
        }
      });
    } else {
      apiRef.current.commitCellChange(params);
      apiRef.current.publishEvent(GRID_CELL_EDIT_STOP, params, event);
    }
  };

  const handleCellFocusIn = React.useCallback((params) => {
    nextFocusedCell.current = params;
  }, []);

  const handleCellFocusOut = useEventCallback(
    (params: GridCellParams, event: MouseEvent | React.SyntheticEvent) => {
      commitPropsAndExit(params, event);
    },
  );

  const handleColumnHeaderDragStart = useEventCallback((nativeEvent) => {
    const { cell } = apiRef.current.getState().focus;
    if (!cell) {
      return;
    }
    const params = apiRef.current.getCellParams(cell.id, cell.field);
    commitPropsAndExit(params, nativeEvent);
  });

  const setCellMode = React.useCallback(
    (id, field, mode: GridCellMode) => {
      const isInEditMode = apiRef.current.getCellMode(id, field) === 'edit';
      if ((mode === 'edit' && isInEditMode) || (mode === 'view' && !isInEditMode)) {
        return;
      }

      logger.debug(`Switching cell id: ${id} field: ${field} to mode: ${mode}`);
      setGridState((state) => {
        const newEditRowsState: GridEditRowsModel = { ...state.editRows };
        newEditRowsState[id] = { ...newEditRowsState[id] };
        if (mode === 'edit') {
          newEditRowsState[id][field] = { value: apiRef.current.getCellValue(id, field) };
        } else {
          delete newEditRowsState[id][field];
          if (!Object.keys(newEditRowsState[id]).length) {
            delete newEditRowsState[id];
          }
        }
        return { ...state, editRows: newEditRowsState };
      });
      forceUpdate();
      apiRef.current.publishEvent(GRID_CELL_MODE_CHANGE, {
        id,
        field,
        mode,
        api: apiRef.current,
      });
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const setRowMode = React.useCallback(
    (id, mode) => {
      setGridState((state) => {
        const newEditRowsState: GridEditRowsModel = { ...state.editRows };
        if (mode === 'edit') {
          newEditRowsState[id] = {};
          columns.forEach((column) => {
            const cellParams = apiRef.current.getCellParams(id, column.field);
            if (cellParams.isEditable) {
              newEditRowsState[id][column.field] = { value: cellParams.value };
            }
          });
        } else {
          delete newEditRowsState[id];
        }
        return { ...state, editRows: newEditRowsState };
      });
      forceUpdate();
    },
    [apiRef, columns, forceUpdate, setGridState],
  );

  const getRowMode = React.useCallback(
    (id) => {
      if (props.editMode === 'cell') {
        return 'view';
      }
      return apiRef.current.getState().editRows[id] ? 'edit' : 'view';
    },
    [apiRef, props.editMode],
  );

  const getCellMode = React.useCallback(
    (id, field) => {
      const editState = apiRef.current.getState().editRows;
      const isEditing = editState[id] && editState[id][field];
      return isEditing ? 'edit' : 'view';
    },
    [apiRef],
  );

  // TODO it's returning undefined when colDef.editable is undefined
  const isCellEditable = React.useCallback(
    (params: GridCellParams) =>
      !!params.colDef.editable &&
      !!params.colDef!.renderEditCell &&
      (!props.isCellEditable || props.isCellEditable(params)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.isCellEditable],
  );

  const setEditCellValue = React.useCallback(
    (params: GridEditCellValueParams, event?: React.SyntheticEvent) => {
      const newParams: GridEditCellPropsParams = {
        id: params.id,
        field: params.field,
        props: { value: params.value },
      };
      apiRef.current.publishEvent(GRID_EDIT_CELL_PROPS_CHANGE, newParams, event);
    },
    [apiRef],
  );

  const setEditCellProps = React.useCallback(
    (params: GridEditCellPropsParams) => {
      const { id, field, props: editProps } = params;
      logger.debug(`Setting cell props on id: ${id} field: ${field}`);
      setGridState((state) => {
        const column = apiRef.current.getColumn(field);
        const parsedValue = column.valueParser
          ? column.valueParser(editProps.value, apiRef.current.getCellParams(id, field))
          : editProps.value;

        const editRowsModel: GridEditRowsModel = { ...state.editRows };
        editRowsModel[id] = { ...state.editRows[id] };
        editRowsModel[id][field] = { ...editProps, value: parsedValue };
        return { ...state, editRows: editRowsModel };
      });
      forceUpdate();
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const handleEditCellPropsChange = React.useCallback(
    (params: GridEditCellPropsParams) => {
      setEditCellProps(params);
    },
    [setEditCellProps],
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

  const commitCellChange = React.useCallback(
    (params: GridCommitCellChangeParams, event?: MouseEvent | React.SyntheticEvent): boolean => {
      const { id, field } = params;
      const model = apiRef.current.getEditRowsModel();
      if (!model[id] || !model[id][field]) {
        throw new Error(`Material-UI: Cell at id: ${id} and field: ${field} is not in edit mode`);
      }

      const { error, value } = model[id][field];
      if (!error) {
        const commitParams: GridCellEditCommitParams = { ...params, value };
        apiRef.current.publishEvent(GRID_CELL_EDIT_COMMIT, commitParams, event);
        return true;
      }
      return false;
    },
    [apiRef],
  );

  const handleCellEditCommit = React.useCallback(
    (params: GridCommitCellChangeParams) => {
      if (props.editMode === 'row') {
        throw new Error(`Material-UI: You can't commit changes when the edit mode is 'row'`);
      }

      const { id, field } = params;
      const model = apiRef.current.getEditRowsModel();
      const { value } = model[id][field];
      logger.debug(`Setting cell id: ${id} field: ${field} to value: ${value?.toString()}`);
      const row = apiRef.current.getRow(id);
      const rowUpdate = { ...row, [field]: value };
      apiRef.current.updateRows([rowUpdate]);
    },
    [apiRef, logger, props.editMode],
  );

  const commitRowChange = React.useCallback(
    (id: GridRowId, event?: React.SyntheticEvent): boolean => {
      if (props.editMode === 'cell') {
        throw new Error(`Material-UI: You can't commit changes when the edit mode is 'cell'`);
      }

      const model = apiRef.current.getEditRowsModel();
      const row = model[id];
      if (!row) {
        throw new Error(`Material-UI: Row at id: ${id} is not being editted`);
      }

      const hasFieldWithError = Object.keys(row).some((field) => !!row[field].error);
      if (!hasFieldWithError) {
        apiRef.current.publishEvent(GRID_ROW_EDIT_COMMIT, id, event);
        return true;
      }

      return false;
    },
    [apiRef, props.editMode],
  );

  const handleCellEditStart = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent | React.KeyboardEvent) => {
      if (!params.isEditable) {
        return;
      }

      setCellMode(params.id, params.field, 'edit');

      if (isKeyboardEvent(event) && isPrintableKey(event.key)) {
        setEditCellProps({
          id: params.id,
          field: params.field,
          props: { value: '' },
        });
      }
    },
    [setEditCellProps, setCellMode],
  );

  const handleRowEditStart = React.useCallback(
    (params: GridRowParams) => {
      apiRef.current.setRowMode(params.id, 'edit');
    },
    [apiRef],
  );

  const handleRowEditStop = React.useCallback(
    (params: GridRowParams, event) => {
      apiRef.current.setRowMode(params.id, 'view');

      if (event.key === 'Enter') {
        apiRef.current.publishEvent(GRID_CELL_NAVIGATION_KEY_DOWN, params, event);
      }
    },
    [apiRef],
  );

  const handleRowEditCommit = React.useCallback(
    (id: GridRowId) => {
      const model = apiRef.current.getEditRowsModel();
      const editRow = model[id];
      if (!editRow) {
        throw new Error(`Material-UI: Row at id: ${id} is not being editted`);
      }

      const row = apiRef.current.getRow(id);
      const rowUpdate = { ...row };
      Object.keys(editRow).forEach((field) => {
        rowUpdate[field] = editRow[field].value;
      });
      apiRef.current.updateRows([rowUpdate]);
    },
    [apiRef],
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

  const handleCellKeyDown = React.useCallback(
    (params: GridCellParams, event) => {
      const { id, field, cellMode, isEditable } = params;
      if (!isEditable) {
        return;
      }

      const isEditMode = cellMode === 'edit';

      if (props.editMode === 'row') {
        const rowParams = apiRef.current.getRowParams(params.id);
        if (isEditMode) {
          if (event.key === 'Enter') {
            apiRef.current.commitRowChange(params.id);
            apiRef.current.publishEvent(GRID_ROW_EDIT_STOP, rowParams, event);
          } else if (event.key === 'Escape') {
            apiRef.current.publishEvent(GRID_ROW_EDIT_STOP, rowParams, event);
          }
        } else if (event.key === 'Enter') {
          apiRef.current.publishEvent(GRID_ROW_EDIT_START, rowParams, event);
        }
        return;
      }

      const isModifierKeyPressed = event.ctrlKey || event.metaKey || event.altKey;

      if (!isEditMode && isCellEnterEditModeKeys(event.key) && !isModifierKeyPressed) {
        apiRef.current.publishEvent(GRID_CELL_EDIT_START, params, event);
      }
      if (!isEditMode && isDeleteKeys(event.key)) {
        apiRef.current.setEditCellValue({ id, field, value: '' });
        apiRef.current.commitCellChange({ id, field }, event);
        apiRef.current.publishEvent(GRID_CELL_EDIT_STOP, params, event);
      }
      if (isEditMode && isCellEditCommitKeys(event.key)) {
        const commitParams = { id, field };
        if (!apiRef.current.commitCellChange(commitParams, event)) {
          return;
        }
      }
      if (isEditMode && isCellExitEditModeKeys(event.key)) {
        apiRef.current.publishEvent(GRID_CELL_EDIT_STOP, params, event);
      }
    },
    [apiRef, props.editMode],
  );

  const handleCellEditStop = React.useCallback(
    (params: GridCellParams, event?: React.SyntheticEvent) => {
      setCellMode(params.id, params.field, 'view');

      // When dispatched by the document, the event is not passed
      if (!event || !isKeyboardEvent(event)) {
        return;
      }

      if (isCellEditCommitKeys(event.key)) {
        apiRef.current.publishEvent(GRID_CELL_NAVIGATION_KEY_DOWN, params, event);
        return;
      }
      if (event.key === 'Escape' || isDeleteKeys(event.key)) {
        apiRef.current.setCellFocus(params.id, params.field);
      }
    },
    [apiRef, setCellMode],
  );

  const handleCellDoubleClick = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (!params.isEditable) {
        return;
      }
      if (props.editMode === 'row') {
        const rowParams = apiRef.current.getRowParams(params.id);
        apiRef.current.publishEvent(GRID_ROW_EDIT_START, rowParams, event);
      } else {
        apiRef.current.publishEvent(GRID_CELL_EDIT_START, params, event);
      }
    },
    [apiRef, props.editMode],
  );

  // General events
  useGridApiEventHandler(apiRef, GRID_CELL_KEY_DOWN, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GRID_CELL_MOUSE_DOWN, preventTextSelection);
  useGridApiEventHandler(apiRef, GRID_CELL_DOUBLE_CLICK, handleCellDoubleClick);
  useGridApiEventHandler(apiRef, GRID_CELL_FOCUS_OUT, handleCellFocusOut);
  useGridApiEventHandler(apiRef, GRID_CELL_FOCUS_IN, handleCellFocusIn);
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_DRAG_START, handleColumnHeaderDragStart);

  // Events shared between cell and row editing
  useGridApiEventHandler(apiRef, GRID_EDIT_CELL_PROPS_CHANGE, handleEditCellPropsChange);

  // Events exclusive to cell editing
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_START, handleCellEditStart);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_STOP, handleCellEditStop);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_COMMIT, handleCellEditCommit);

  // Events exclusive to row editing
  useGridApiEventHandler(apiRef, GRID_ROW_EDIT_START, handleRowEditStart);
  useGridApiEventHandler(apiRef, GRID_ROW_EDIT_STOP, handleRowEditStop);
  useGridApiEventHandler(apiRef, GRID_ROW_EDIT_COMMIT, handleRowEditCommit);

  useGridApiOptionHandler(apiRef, GRID_EDIT_CELL_PROPS_CHANGE, props.onEditCellPropsChange);
  useGridApiOptionHandler(apiRef, GRID_CELL_EDIT_COMMIT, props.onCellEditCommit);
  useGridApiOptionHandler(apiRef, GRID_CELL_EDIT_START, props.onCellEditStart);
  useGridApiOptionHandler(apiRef, GRID_CELL_EDIT_STOP, props.onCellEditStop);
  useGridApiOptionHandler(apiRef, GRID_ROW_EDIT_COMMIT, props.onRowEditCommit);
  useGridApiOptionHandler(apiRef, GRID_ROW_EDIT_START, props.onRowEditStart);
  useGridApiOptionHandler(apiRef, GRID_ROW_EDIT_STOP, props.onRowEditStop);

  useGridApiMethod<GridEditRowApi>(
    apiRef,
    {
      setCellMode,
      getCellMode,
      setRowMode,
      getRowMode,
      isCellEditable,
      commitCellChange,
      commitRowChange,
      setEditRowsModel,
      getEditRowsModel,
      setEditCellValue,
    },
    'EditRowApi',
  );

  React.useEffect(() => {
    apiRef.current.updateControlState<GridEditRowsModel>({
      stateId: 'editRows',
      propModel: props.editRowsModel,
      propOnChange: props.onEditRowsModelChange,
      stateSelector: (state) => state.editRows,
      changeEvent: GRID_EDIT_ROWS_MODEL_CHANGE,
    });
  }, [apiRef, props.editRowsModel, props.onEditRowsModelChange]);

  React.useEffect(() => {
    const currentEditRowsModel = apiRef.current.getState().editRows;

    if (props.editRowsModel !== undefined && props.editRowsModel !== currentEditRowsModel) {
      apiRef.current.setEditRowsModel(props.editRowsModel || {});
    }
  }, [apiRef, props.editRowsModel]);
}
