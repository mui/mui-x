import * as React from 'react';
import { useEventCallback } from '@mui/material/utils';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import {
  GridEditingApi,
  GridEditingSharedApi,
  GridRowEditingApi,
} from '../../../models/api/gridEditingApi';
import {
  GridRowModes,
  GridEditRowsModel,
  GridEditModes,
  GridCellModes,
} from '../../../models/gridEditRowModel';
import { useGridSelector } from '../../utils/useGridSelector';
import { allGridColumnsSelector } from '../columns/gridColumnsSelector';
import { gridEditRowsStateSelector } from './gridEditRowsSelector';
import { GridEvents } from '../../../models/events/gridEvents';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridEventListener } from '../../../models/events/gridEventListener';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { MuiBaseEvent } from '../../../models/muiEvent';
import { gridFocusCellSelector } from '../focus/gridFocusStateSelector';
import {
  useGridApiOptionHandler,
  useGridApiEventHandler,
} from '../../utils/useGridApiEventHandler';

export const useGridRowEditing = (
  apiRef: GridApiRef,
  props: Pick<
    DataGridProcessedProps,
    'editMode' | 'onRowEditCommit' | 'onRowEditStart' | 'onRowEditStop' | 'experimentalFeatures'
  >,
) => {
  const focusTimeout = React.useRef<any>(null);
  const nextFocusedCell = React.useRef<GridCellParams | null>(null);
  const columns = useGridSelector(apiRef, allGridColumnsSelector);

  const buildCallback =
    <Args extends any[]>(callback: (...args: Args) => void) =>
    (...args: Args) => {
      if (props.editMode === GridEditModes.Row) {
        callback(...args);
      }
    };

  const setRowMode = React.useCallback<GridEditingApi['setRowMode']>(
    (id, mode) => {
      if (mode === apiRef.current.getRowMode(id)) {
        return;
      }

      apiRef.current.setState((state) => {
        const newEditRowsState: GridEditRowsModel = { ...state.editRows };
        if (mode === GridRowModes.Edit) {
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
      apiRef.current.forceUpdate();
    },
    [apiRef, columns],
  );

  const getRowMode = React.useCallback<GridEditingApi['getRowMode']>(
    (id) => {
      if (props.editMode === GridEditModes.Cell) {
        return GridRowModes.View;
      }
      const editRowsState = gridEditRowsStateSelector(apiRef.current.state);
      return editRowsState[id] ? GridRowModes.Edit : GridRowModes.View;
    },
    [apiRef, props.editMode],
  );

  const commitRowChange = React.useCallback<GridEditingApi['commitRowChange']>(
    (id, event = {}) => {
      if (props.editMode === GridEditModes.Cell) {
        throw new Error(`MUI: You can't commit changes when the edit mode is 'cell'.`);
      }

      apiRef.current.unstable_runPendingEditCellValueChangeDebounce(id);

      const model = apiRef.current.getEditRowsModel();
      const editRowProps = model[id];
      if (!editRowProps) {
        throw new Error(`MUI: Row at id: ${id} is not being edited.`);
      }

      if (props.experimentalFeatures?.preventCommitWhileValidating) {
        const isValid = Object.keys(editRowProps).reduce((acc, field) => {
          return acc && !editRowProps[field].isValidating && !editRowProps[field].error;
        }, true);

        if (!isValid) {
          return false;
        }
      }

      const hasFieldWithError = Object.values(editRowProps).some((value) => !!value.error);
      if (hasFieldWithError) {
        return false;
      }

      const fieldsWithValidator = Object.keys(editRowProps).filter((field) => {
        const column = apiRef.current.getColumn(field);
        return typeof column.preProcessEditCellProps === 'function';
      });

      if (fieldsWithValidator.length > 0) {
        const row = apiRef.current.getRow(id)!;

        const validatorErrors = fieldsWithValidator.map(async (field) => {
          const column = apiRef.current.getColumn(field);
          const newEditCellProps = await Promise.resolve(
            column.preProcessEditCellProps!({ id, row, props: editRowProps[field] }),
          );
          apiRef.current.unstable_setEditCellProps({ id, field, props: newEditCellProps });
          return newEditCellProps.error;
        });

        return Promise.all(validatorErrors).then((errors) => {
          if (errors.some((error) => !!error)) {
            return false;
          }
          apiRef.current.publishEvent(GridEvents.rowEditCommit, id, event);
          return true;
        });
      }

      apiRef.current.publishEvent(GridEvents.rowEditCommit, id, event);
      return true;
    },
    [apiRef, props.editMode, props.experimentalFeatures?.preventCommitWhileValidating],
  );

  const setRowEditingEditCellValue = React.useCallback<
    GridRowEditingApi['unstable_setRowEditingEditCellValue']
  >(
    (params) => {
      const model = apiRef.current.getEditRowsModel();
      const editRow = model[params.id];
      const row = apiRef.current.getRow(params.id)!;
      let isValid = true;

      return new Promise((resolve) => {
        Object.keys(editRow).forEach(async (field) => {
          const column = apiRef.current.getColumn(field);
          let editCellProps = field === params.field ? { value: params.value } : editRow[field];

          // setEditCellProps runs the value parser and returns the updated props
          editCellProps = apiRef.current.unstable_setEditCellProps({
            id: params.id,
            field,
            props: { ...editCellProps, isValidating: true },
          });

          if (column.preProcessEditCellProps) {
            editCellProps = await Promise.resolve(
              column.preProcessEditCellProps!({
                id: params.id,
                row,
                props: {
                  ...editCellProps,
                  value:
                    field === params.field
                      ? apiRef.current.unstable_parseValue(params.id, field, params.value)
                      : editCellProps.value,
                },
              }),
            );
          }

          if (editCellProps.error) {
            isValid = false;
          }

          apiRef.current.unstable_setEditCellProps({
            id: params.id,
            field,
            props: { ...editCellProps, isValidating: false },
          });
        });

        resolve(isValid);
      });
    },
    [apiRef],
  );

  const rowEditingApi: Omit<GridRowEditingApi, keyof GridEditingSharedApi> = {
    setRowMode,
    getRowMode,
    commitRowChange,
    unstable_setRowEditingEditCellValue: setRowEditingEditCellValue,
  };

  useGridApiMethod<typeof rowEditingApi>(apiRef, rowEditingApi, 'EditRowApi');

  const handleCellKeyDown = React.useCallback<GridEventListener<GridEvents.cellKeyDown>>(
    async (params, event) => {
      const { cellMode, isEditable } = params;
      if (!isEditable) {
        return;
      }

      const isEditMode = cellMode === GridCellModes.Edit;

      const rowParams = apiRef.current.getRowParams(params.id);
      if (isEditMode) {
        if (event.key === 'Enter') {
          // TODO: check the return before firing GridEvents.rowEditStop
          // On cell editing, it won't exits the edit mode with error
          const isValid = await apiRef.current.commitRowChange(params.id);
          if (!isValid && props.experimentalFeatures?.preventCommitWhileValidating) {
            return;
          }
          apiRef.current.publishEvent(GridEvents.rowEditStop, rowParams, event);
        } else if (event.key === 'Escape') {
          apiRef.current.publishEvent(GridEvents.rowEditStop, rowParams, event);
        }
      } else if (event.key === 'Enter') {
        apiRef.current.publishEvent(GridEvents.rowEditStart, rowParams, event);
      }
    },
    [apiRef, props.experimentalFeatures?.preventCommitWhileValidating],
  );

  const handleCellDoubleClick = React.useCallback<GridEventListener<GridEvents.cellDoubleClick>>(
    (params, event) => {
      if (!params.isEditable) {
        return;
      }
      const rowParams = apiRef.current.getRowParams(params.id);
      apiRef.current.publishEvent(GridEvents.rowEditStart, rowParams, event);
    },
    [apiRef],
  );

  const handleEditCellPropsChange = React.useCallback<
    GridEventListener<GridEvents.editCellPropsChange>
  >(
    (params) => {
      const row = apiRef.current.getRow(params.id)!;
      const model = apiRef.current.getEditRowsModel();
      const editRow = model[params.id];

      Object.keys(editRow).forEach(async (field) => {
        const column = apiRef.current.getColumn(field);
        if (column.preProcessEditCellProps) {
          const editCellProps = field === params.field ? params.props : editRow[field];
          const newEditCellProps = await Promise.resolve(
            column.preProcessEditCellProps!({ id: params.id, row, props: editCellProps }),
          );
          apiRef.current.unstable_setEditCellProps({
            id: params.id,
            field,
            props: newEditCellProps,
          });
        } else if (field === params.field) {
          apiRef.current.unstable_setEditCellProps(params);
        }
      });
    },
    [apiRef],
  );

  const handleRowEditStart = React.useCallback<GridEventListener<GridEvents.rowEditStart>>(
    (params) => {
      apiRef.current.setRowMode(params.id, GridRowModes.Edit);
    },
    [apiRef],
  );

  const handleRowEditStop = React.useCallback<GridEventListener<GridEvents.rowEditStop>>(
    (params, event) => {
      apiRef.current.setRowMode(params.id, GridRowModes.View);

      if ((event as React.KeyboardEvent).key === 'Enter') {
        apiRef.current.publishEvent(
          GridEvents.cellNavigationKeyDown,
          params,
          event as React.KeyboardEvent<HTMLElement>,
        );
      }
    },
    [apiRef],
  );

  const handleRowEditCommit = React.useCallback<GridEventListener<GridEvents.rowEditCommit>>(
    (id) => {
      const model = apiRef.current.getEditRowsModel();
      const editRow = model[id];
      if (!editRow) {
        throw new Error(`MUI: Row at id: ${id} is not being edited.`);
      }

      const row = apiRef.current.getRow(id);
      if (row) {
        let rowUpdate = { ...row };
        Object.keys(editRow).forEach((field) => {
          const column = apiRef.current.getColumn(field);
          const value = editRow[field].value;
          if (column.valueSetter) {
            rowUpdate = column.valueSetter({ row: rowUpdate, value });
          } else {
            rowUpdate[field] = value;
          }
        });
        apiRef.current.updateRows([rowUpdate]);
      }
    },
    [apiRef],
  );

  const handleCellFocusIn = React.useCallback<GridEventListener<GridEvents.cellFocusIn>>(
    (params) => {
      nextFocusedCell.current = params;
    },
    [],
  );

  const commitPropsAndExit = async (params: GridCellParams, event: MuiBaseEvent) => {
    if (params.cellMode === GridCellModes.View) {
      return;
    }
    nextFocusedCell.current = null;
    focusTimeout.current = setTimeout(async () => {
      if (nextFocusedCell.current?.id !== params.id) {
        await apiRef.current.commitRowChange(params.id, event);
        const rowParams = apiRef.current.getRowParams(params.id);
        apiRef.current.publishEvent(GridEvents.rowEditStop, rowParams, event);
      }
    });
  };

  const handleCellFocusOut: GridEventListener<GridEvents.cellFocusOut> = useEventCallback(
    (params, event) => {
      commitPropsAndExit(params, event);
    },
  );

  const handleColumnHeaderDragStart: GridEventListener<GridEvents.columnHeaderDragEnter> =
    useEventCallback(() => {
      const cell = gridFocusCellSelector(apiRef);
      if (!cell) {
        return;
      }
      const params = apiRef.current.getCellParams(cell.id, cell.field);
      commitPropsAndExit(params, {});
    });

  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, buildCallback(handleCellKeyDown));
  useGridApiEventHandler(apiRef, GridEvents.cellDoubleClick, buildCallback(handleCellDoubleClick));
  useGridApiEventHandler(
    apiRef,
    GridEvents.editCellPropsChange,
    buildCallback(handleEditCellPropsChange),
  );
  useGridApiEventHandler(apiRef, GridEvents.rowEditStart, buildCallback(handleRowEditStart));
  useGridApiEventHandler(apiRef, GridEvents.rowEditStop, buildCallback(handleRowEditStop));
  useGridApiEventHandler(apiRef, GridEvents.rowEditCommit, buildCallback(handleRowEditCommit));
  useGridApiEventHandler(apiRef, GridEvents.cellFocusIn, buildCallback(handleCellFocusIn));
  useGridApiEventHandler(apiRef, GridEvents.cellFocusOut, buildCallback(handleCellFocusOut));
  useGridApiEventHandler(
    apiRef,
    GridEvents.columnHeaderDragStart,
    buildCallback(handleColumnHeaderDragStart),
  );

  useGridApiOptionHandler(apiRef, GridEvents.rowEditCommit, props.onRowEditCommit);
  useGridApiOptionHandler(apiRef, GridEvents.rowEditStart, props.onRowEditStart);
  useGridApiOptionHandler(apiRef, GridEvents.rowEditStop, props.onRowEditStop);
};
