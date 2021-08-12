import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
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
          apiRef.current.commitRowChange(params.id, event);
          const rowParams = apiRef.current.getRowParams(params.id);
          apiRef.current.publishEvent(GridEvents.rowEditStop, rowParams, event);
        }
      });
    } else {
      apiRef.current.commitCellChange(params, event);
      apiRef.current.publishEvent(GridEvents.cellEditStop, params, event);
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
    const { cell } = apiRef.current.state.focus;
    if (!cell) {
      return;
    }
    const params = apiRef.current.getCellParams(cell.id, cell.field);
    commitPropsAndExit(params, nativeEvent);
  });

  const setCellMode = React.useCallback<GridEditRowApi['setCellMode']>(
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
      apiRef.current.publishEvent(GridEvents.cellModeChange, {
        id,
        field,
        mode,
        api: apiRef.current,
      });
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const setRowMode = React.useCallback<GridEditRowApi['setRowMode']>(
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

  const getRowMode = React.useCallback<GridEditRowApi['getRowMode']>(
    (id) => {
      if (props.editMode === 'cell') {
        return 'view';
      }
      return apiRef.current.state.editRows[id] ? 'edit' : 'view';
    },
    [apiRef, props.editMode],
  );

  const getCellMode = React.useCallback<GridEditRowApi['getCellMode']>(
    (id, field) => {
      const editState = apiRef.current.state.editRows;
      const isEditing = editState[id] && editState[id][field];
      return isEditing ? 'edit' : 'view';
    },
    [apiRef],
  );

  // TODO it's returning undefined when colDef.editable is undefined
  const isCellEditable = React.useCallback<GridEditRowApi['isCellEditable']>(
    (params: GridCellParams) =>
      !!params.colDef.editable &&
      !!params.colDef!.renderEditCell &&
      (!props.isCellEditable || props.isCellEditable(params)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.isCellEditable],
  );

  const setEditCellValue = React.useCallback<GridEditRowApi['setEditCellValue']>(
    (params: GridEditCellValueParams, event?: React.SyntheticEvent) => {
      const newParams: GridEditCellPropsParams = {
        id: params.id,
        field: params.field,
        props: { value: params.value },
      };
      apiRef.current.publishEvent(GridEvents.editCellPropsChange, newParams, event);
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

  const setEditRowsModel = React.useCallback<GridEditRowApi['setEditRowsModel']>(
    (editRows: GridEditRowsModel): void => {
      logger.debug(`Setting row model`);

      setGridState((state) => ({ ...state, editRows }));
      forceUpdate();
    },
    [forceUpdate, logger, setGridState],
  );

  const getEditRowsModel = React.useCallback<GridEditRowApi['getEditRowsModel']>(
    (): GridEditRowsModel => apiRef.current.state.editRows,
    [apiRef],
  );

  const commitCellChange = React.useCallback<GridEditRowApi['commitCellChange']>(
    (params: GridCommitCellChangeParams, event?: MouseEvent | React.SyntheticEvent): boolean => {
      const { id, field } = params;
      const model = apiRef.current.getEditRowsModel();
      if (!model[id] || !model[id][field]) {
        throw new Error(`Material-UI: Cell at id: ${id} and field: ${field} is not in edit mode`);
      }

      const { error, value } = model[id][field];
      if (!error) {
        const commitParams: GridCellEditCommitParams = { ...params, value };
        apiRef.current.publishEvent(GridEvents.cellEditCommit, commitParams, event);
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

  const commitRowChange = React.useCallback<GridEditRowApi['commitRowChange']>(
    (id: GridRowId, event?: React.SyntheticEvent): boolean => {
      if (props.editMode === 'cell') {
        throw new Error(`Material-UI: You can't commit changes when the edit mode is 'cell'`);
      }

      const model = apiRef.current.getEditRowsModel();
      const row = model[id];
      if (!row) {
        throw new Error(`Material-UI: Row at id: ${id} is not being editted`);
      }

      const hasFieldWithError = Object.values(row).some((value) => !!value.error);
      if (!hasFieldWithError) {
        apiRef.current.publishEvent(GridEvents.rowEditCommit, id, event);
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
        apiRef.current.publishEvent(GridEvents.cellNavigationKeyDown, params, event);
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
            apiRef.current.publishEvent(GridEvents.rowEditStop, rowParams, event);
          } else if (event.key === 'Escape') {
            apiRef.current.publishEvent(GridEvents.rowEditStop, rowParams, event);
          }
        } else if (event.key === 'Enter') {
          apiRef.current.publishEvent(GridEvents.rowEditStart, rowParams, event);
        }
        return;
      }

      const isModifierKeyPressed = event.ctrlKey || event.metaKey || event.altKey;

      if (!isEditMode && isCellEnterEditModeKeys(event.key) && !isModifierKeyPressed) {
        apiRef.current.publishEvent(GridEvents.cellEditStart, params, event);
      }
      if (!isEditMode && isDeleteKeys(event.key)) {
        apiRef.current.setEditCellValue({ id, field, value: '' });
        apiRef.current.commitCellChange({ id, field }, event);
        apiRef.current.publishEvent(GridEvents.cellEditStop, params, event);
      }
      if (isEditMode && isCellEditCommitKeys(event.key)) {
        const commitParams = { id, field };
        if (!apiRef.current.commitCellChange(commitParams, event)) {
          return;
        }
      }
      if (isEditMode && isCellExitEditModeKeys(event.key)) {
        apiRef.current.publishEvent(GridEvents.cellEditStop, params, event);
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
        apiRef.current.publishEvent(GridEvents.cellNavigationKeyDown, params, event);
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
        apiRef.current.publishEvent(GridEvents.rowEditStart, rowParams, event);
      } else {
        apiRef.current.publishEvent(GridEvents.cellEditStart, params, event);
      }
    },
    [apiRef, props.editMode],
  );

  // General events
  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.cellMouseDown, preventTextSelection);
  useGridApiEventHandler(apiRef, GridEvents.cellDoubleClick, handleCellDoubleClick);
  useGridApiEventHandler(apiRef, GridEvents.cellFocusOut, handleCellFocusOut);
  useGridApiEventHandler(apiRef, GridEvents.cellFocusIn, handleCellFocusIn);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragStart, handleColumnHeaderDragStart);

  // Events shared between cell and row editing
  useGridApiEventHandler(apiRef, GridEvents.editCellPropsChange, handleEditCellPropsChange);

  // Events exclusive to cell editing
  useGridApiEventHandler(apiRef, GridEvents.cellEditStart, handleCellEditStart);
  useGridApiEventHandler(apiRef, GridEvents.cellEditStop, handleCellEditStop);
  useGridApiEventHandler(apiRef, GridEvents.cellEditCommit, handleCellEditCommit);

  // Events exclusive to row editing
  useGridApiEventHandler(apiRef, GridEvents.rowEditStart, handleRowEditStart);
  useGridApiEventHandler(apiRef, GridEvents.rowEditStop, handleRowEditStop);
  useGridApiEventHandler(apiRef, GridEvents.rowEditCommit, handleRowEditCommit);

  useGridApiOptionHandler(apiRef, GridEvents.editCellPropsChange, props.onEditCellPropsChange);
  useGridApiOptionHandler(apiRef, GridEvents.cellEditCommit, props.onCellEditCommit);
  useGridApiOptionHandler(apiRef, GridEvents.cellEditStart, props.onCellEditStart);
  useGridApiOptionHandler(apiRef, GridEvents.cellEditStop, props.onCellEditStop);
  useGridApiOptionHandler(apiRef, GridEvents.rowEditCommit, props.onRowEditCommit);
  useGridApiOptionHandler(apiRef, GridEvents.rowEditStart, props.onRowEditStart);
  useGridApiOptionHandler(apiRef, GridEvents.rowEditStop, props.onRowEditStop);

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
      changeEvent: GridEvents.editRowsModelChange,
    });
  }, [apiRef, props.editRowsModel, props.onEditRowsModelChange]);

  React.useEffect(() => {
    const currentEditRowsModel = apiRef.current.state.editRows;

    if (props.editRowsModel !== undefined && props.editRowsModel !== currentEditRowsModel) {
      apiRef.current.setEditRowsModel(props.editRowsModel || {});
    }
  }, [apiRef, props.editRowsModel]);
}
