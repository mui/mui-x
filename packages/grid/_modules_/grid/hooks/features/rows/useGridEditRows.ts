import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridEditRowApi } from '../../../models/api/gridEditRowApi';
import { GridCellMode } from '../../../models/gridCell';
import { GridEditRowsModel } from '../../../models/gridEditRowModel';
import { GridCellParams } from '../../../models/params/gridCellParams';
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
import { useEventCallback } from '../../../utils/material-ui-utils';
import { useLogger } from '../../utils/useLogger';
import { useGridState } from '../core/useGridState';

export function useGridEditRows(
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    | 'editRowsModel'
    | 'onEditRowsModelChange'
    | 'onCellEditCommit'
    | 'onEditCellPropsChange'
    | 'onCellEditStart'
    | 'onCellEditStop'
    | 'isCellEditable'
  >,
) {
  const logger = useLogger('useGridEditRows');
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const commitPropsAndExit = (params: GridCellParams, event: MouseEvent | React.SyntheticEvent) => {
    if (params.cellMode === 'view') {
      return;
    }
    apiRef.current.commitCellChange(params, event);
    apiRef.current.publishEvent(GridEvents.cellEditStop, params, event);
  };

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
      apiRef.current.publishEvent(GridEvents.cellModeChange, {
        id,
        field,
        mode,
        api: apiRef.current,
      });
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const getCellMode = React.useCallback(
    (id, field) => {
      const editState = apiRef.current.state.editRows;
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

  const setEditRowsModel = React.useCallback(
    (editRows: GridEditRowsModel): void => {
      logger.debug(`Setting row model`);

      setGridState((state) => ({ ...state, editRows }));
      forceUpdate();
    },
    [forceUpdate, logger, setGridState],
  );

  const getEditRowsModel = React.useCallback(
    (): GridEditRowsModel => apiRef.current.state.editRows,
    [apiRef],
  );

  const commitCellChange = React.useCallback(
    (params: GridCommitCellChangeParams, event?: MouseEvent | React.SyntheticEvent): boolean => {
      const { id, field } = params;
      const model = apiRef.current.getEditRowsModel();
      if (!model[id] || !model[id][field]) {
        throw new Error(`Cell at id: ${id} and field: ${field} is not in edit mode`);
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
      const { id, field } = params;
      const model = apiRef.current.getEditRowsModel();
      const { value } = model[id][field];
      logger.debug(`Setting cell id: ${id} field: ${field} to value: ${value?.toString()}`);
      const row = apiRef.current.getRow(id);
      const rowUpdate = { ...row, [field]: value };
      apiRef.current.updateRows([rowUpdate]);
    },
    [apiRef, logger],
  );

  const handleCellEditEnter = React.useCallback(
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
    [apiRef],
  );

  const handleCellEditExit = React.useCallback(
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
    (params: GridCellParams, event: React.SyntheticEvent) => {
      if (!params.isEditable) {
        return;
      }
      apiRef.current.publishEvent(GridEvents.cellEditStart, params, event);
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.cellMouseDown, preventTextSelection);
  useGridApiEventHandler(apiRef, GridEvents.cellDoubleClick, handleCellDoubleClick);
  useGridApiEventHandler(apiRef, GridEvents.cellFocusOut, handleCellFocusOut);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragStart, handleColumnHeaderDragStart);
  useGridApiEventHandler(apiRef, GridEvents.cellEditStart, handleCellEditEnter);
  useGridApiEventHandler(apiRef, GridEvents.cellEditStop, handleCellEditExit);
  useGridApiEventHandler(apiRef, GridEvents.cellEditCommit, handleCellEditCommit);
  useGridApiEventHandler(apiRef, GridEvents.editCellPropsChange, handleEditCellPropsChange);

  useGridApiOptionHandler(apiRef, GridEvents.cellEditCommit, props.onCellEditCommit);
  useGridApiOptionHandler(apiRef, GridEvents.editCellPropsChange, props.onEditCellPropsChange);
  useGridApiOptionHandler(apiRef, GridEvents.cellEditStart, props.onCellEditStart);
  useGridApiOptionHandler(apiRef, GridEvents.cellEditStop, props.onCellEditStop);

  useGridApiMethod<GridEditRowApi>(
    apiRef,
    {
      setCellMode,
      getCellMode,
      isCellEditable,
      commitCellChange,
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
    const currentEditRowsModel = apiRef.current.getState().editRows;

    if (props.editRowsModel !== undefined && props.editRowsModel !== currentEditRowsModel) {
      apiRef.current.setEditRowsModel(props.editRowsModel || {});
    }
  }, [apiRef, props.editRowsModel]);
}
