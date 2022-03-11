import * as React from 'react';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { GridEvents } from '../../../models/events/gridEvents';
import { GridEventListener } from '../../../models/events/gridEventListener';
import {
  GridEditModes,
  GridRowModes,
  GridEditingState,
  GridEditCellProps,
  GridEditRowProps,
} from '../../../models/gridEditRowModel';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridNewRowEditingApi, GridEditingSharedApi } from '../../../models/api/gridEditingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridEditingStateSelector } from './gridEditRowsSelector';
import { GridRowId } from '../../../models/gridRows';
import { isPrintableKey } from '../../../utils/keyboardUtils';
import { gridColumnFieldsSelector } from '../columns/gridColumnsSelector';
import { GridCellParams } from '../../../models/params/gridCellParams';
import {
  GridRowEditStopParams,
  GridRowEditStartParams,
  GridRowEditStopReasons,
  GridRowEditStartReasons,
} from '../../../models/params/gridRowParams';

export const useGridRowEditing = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    'editMode' | 'processRowUpdate' | 'onRowEditStart' | 'onRowEditStop'
  >,
) => {
  const focusTimeout = React.useRef<any>(null);
  const nextFocusedCell = React.useRef<GridCellParams | null>(null);

  const { processRowUpdate } = props;

  const runIfEditModeIsRow =
    <Args extends any[]>(callback: (...args: Args) => void) =>
    (...args: Args) => {
      if (props.editMode === GridEditModes.Row) {
        callback(...args);
      }
    };

  const throwIfNotEditable = React.useCallback(
    (id: GridRowId, field: string) => {
      const params = apiRef.current.getCellParams(id, field);
      if (!apiRef.current.isCellEditable(params)) {
        throw new Error(`MUI: The cell with id=${id} and field=${field} is not editable.`);
      }
    },
    [apiRef],
  );

  const throwIfNotInMode = React.useCallback(
    (id: GridRowId, mode: GridRowModes) => {
      if (apiRef.current.getRowMode(id) !== mode) {
        throw new Error(`MUI: The row with id=${id} is not in ${mode} mode.`);
      }
    },
    [apiRef],
  );

  const handleCellDoubleClick = React.useCallback<GridEventListener<GridEvents.cellDoubleClick>>(
    (params, event) => {
      if (!params.isEditable) {
        return;
      }
      if (apiRef.current.getRowMode(params.id) === GridRowModes.Edit) {
        return;
      }
      const rowParams = apiRef.current.getRowParams(params.id);
      const newParams: GridRowEditStartParams = {
        ...rowParams,
        field: params.field,
        reason: GridRowEditStartReasons.cellDoubleClick,
      };
      apiRef.current.publishEvent(GridEvents.rowEditStart, newParams, event);
    },
    [apiRef],
  );

  const handleCellFocusIn = React.useCallback<GridEventListener<GridEvents.cellFocusIn>>(
    (params) => {
      nextFocusedCell.current = params;
    },
    [],
  );

  const handleCellFocusOut = React.useCallback<GridEventListener<GridEvents.cellFocusOut>>(
    (params, event) => {
      if (!params.isEditable) {
        return;
      }
      if (apiRef.current.getRowMode(params.id) === GridRowModes.View) {
        return;
      }
      // The mechanism to detect if we can stop editing a row is different from
      // the cell editing. Instead of triggering it when clicking outside a cell,
      // we must check if another cell in the same row was not clicked. To achieve
      // that, first we keep track of all cells that gained focus. When a cell loses
      // focus we check if the next cell that received focus is from a different row.
      nextFocusedCell.current = null;
      focusTimeout.current = setTimeout(() => {
        focusTimeout.current = null;
        if (nextFocusedCell.current?.id !== params.id) {
          const rowParams = apiRef.current.getRowParams(params.id);
          const newParams = {
            ...rowParams,
            field: params.field,
            reason: GridRowEditStopReasons.rowFocusOut,
          };
          apiRef.current.publishEvent(GridEvents.rowEditStop, newParams, event);
        }
      });
    },
    [apiRef],
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(focusTimeout.current);
    };
  }, []);

  const handleCellKeyDown = React.useCallback<GridEventListener<GridEvents.cellKeyDown>>(
    (params, event) => {
      if (params.cellMode === GridRowModes.Edit) {
        let reason: GridRowEditStopReasons | undefined;

        if (event.key === 'Escape') {
          reason = GridRowEditStopReasons.escapeKeyDown;
        } else if (event.key === 'Enter') {
          reason = GridRowEditStopReasons.enterKeyDown;
        }

        if (reason) {
          const rowParams = apiRef.current.getRowParams(params.id);
          const newParams: GridRowEditStopParams = { ...rowParams, reason, field: params.field };
          apiRef.current.publishEvent(GridEvents.rowEditStop, newParams, event);
        }
      } else if (params.isEditable) {
        let reason: GridRowEditStartReasons | undefined;

        if (isPrintableKey(event.key)) {
          if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) {
            return;
          }
          reason = GridRowEditStartReasons.printableKeyDown;
        } else if (event.key === 'Enter') {
          reason = GridRowEditStartReasons.enterKeyDown;
        } else if (event.key === 'Delete') {
          reason = GridRowEditStartReasons.deleteKeyDown;
        }

        if (reason) {
          const rowParams = apiRef.current.getRowParams(params.id);
          const newParams: GridRowEditStartParams = { ...rowParams, field: params.field, reason };
          apiRef.current.publishEvent(GridEvents.rowEditStart, newParams, event);
        }
      }
    },
    [apiRef],
  );

  const handleRowEditStart = React.useCallback<GridEventListener<GridEvents.rowEditStart>>(
    (params, event) => {
      const { id, field, reason } = params;
      apiRef.current.startRowEditMode({ id, fieldToFocus: field });

      if (
        reason === GridRowEditStartReasons.deleteKeyDown ||
        reason === GridRowEditStartReasons.printableKeyDown
      ) {
        apiRef.current.setEditCellValue({ id, field: field!, value: '' }, event);
      }
    },
    [apiRef],
  );

  const handleRowEditStop = React.useCallback<GridEventListener<GridEvents.rowEditStop>>(
    (params) => {
      const { id, reason, field } = params;

      apiRef.current.unstable_runPendingEditCellValueMutation(id);

      const fieldFromRowBelowToFocus =
        reason === GridRowEditStopReasons.enterKeyDown ? field : undefined;

      let ignoreModifications = reason === 'escapeKeyDown';
      const editingState = gridEditingStateSelector(apiRef.current.state);
      if (!ignoreModifications) {
        // The user wants to stop editing the cell but we can't wait for the props to be processed.
        // In this case, discard the modifications if any field is processing its props.
        ignoreModifications = Object.values(editingState[id]).some((fieldProps) => {
          return fieldProps.isProcessingProps;
        });
      }

      apiRef.current.stopRowEditMode({ id, ignoreModifications, fieldFromRowBelowToFocus });
    },
    [apiRef],
  );

  useGridApiEventHandler(
    apiRef,
    GridEvents.cellDoubleClick,
    runIfEditModeIsRow(handleCellDoubleClick),
  );
  useGridApiEventHandler(apiRef, GridEvents.cellFocusIn, runIfEditModeIsRow(handleCellFocusIn));
  useGridApiEventHandler(apiRef, GridEvents.cellFocusOut, runIfEditModeIsRow(handleCellFocusOut));
  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, runIfEditModeIsRow(handleCellKeyDown));

  useGridApiEventHandler(apiRef, GridEvents.rowEditStart, runIfEditModeIsRow(handleRowEditStart));
  useGridApiEventHandler(apiRef, GridEvents.rowEditStop, runIfEditModeIsRow(handleRowEditStop));

  useGridApiOptionHandler(apiRef, GridEvents.rowEditStart, props.onRowEditStart);
  useGridApiOptionHandler(apiRef, GridEvents.rowEditStop, props.onRowEditStop);

  const getRowMode = React.useCallback<GridNewRowEditingApi['getRowMode']>(
    (id) => {
      if (props.editMode === GridEditModes.Cell) {
        return GridRowModes.View;
      }
      const editingState = gridEditingStateSelector(apiRef.current.state);
      const isEditing = editingState[id] && Object.keys(editingState[id]).length > 0;
      return isEditing ? GridRowModes.Edit : GridRowModes.View;
    },
    [apiRef, props.editMode],
  );

  const updateOrDeleteRowState = React.useCallback(
    (id: GridRowId, newProps: GridEditRowProps | null) => {
      apiRef.current.setState((state) => {
        const newEditingState: GridEditingState = { ...state.editRows };

        if (newProps !== null) {
          newEditingState[id] = newProps;
        } else {
          delete newEditingState[id];
        }

        return { ...state, editRows: newEditingState };
      });
      apiRef.current.forceUpdate();
    },
    [apiRef],
  );

  const updateOrDeleteFieldState = React.useCallback(
    (id: GridRowId, field: string, newProps: GridEditCellProps | null) => {
      apiRef.current.setState((state) => {
        const newEditingState: GridEditingState = { ...state.editRows };

        if (newProps !== null) {
          newEditingState[id] = { ...newEditingState[id], [field]: { ...newProps } };
        } else {
          delete newEditingState[id][field];
          if (Object.keys(newEditingState[id]).length === 0) {
            delete newEditingState[id];
          }
        }

        return { ...state, editRows: newEditingState };
      });
      apiRef.current.forceUpdate();
    },
    [apiRef],
  );

  const startRowEditMode = React.useCallback<GridNewRowEditingApi['startRowEditMode']>(
    (params) => {
      const { id, fieldToFocus } = params;

      throwIfNotInMode(id, GridRowModes.View);

      if (apiRef.current.getRowMode(id) === GridRowModes.Edit) {
        throw new Error(`MUI: The cell with id=${id} is already in edit mode.`);
      }

      const columnFields = gridColumnFieldsSelector(apiRef);

      const newProps = columnFields.reduce<Record<string, GridEditCellProps>>((acc, field) => {
        const cellParams = apiRef.current.getCellParams(id, field);
        if (!cellParams.isEditable) {
          return acc;
        }

        acc[field] = {
          value: apiRef.current.getCellValue(id, field),
          error: false,
          isProcessingProps: false,
        };

        return acc;
      }, {});

      updateOrDeleteRowState(id, newProps);

      if (fieldToFocus) {
        apiRef.current.setCellFocus(id, fieldToFocus);
      }
    },
    [apiRef, throwIfNotInMode, updateOrDeleteRowState],
  );

  const stopRowEditMode = React.useCallback<GridNewRowEditingApi['stopRowEditMode']>(
    async (params) => {
      const { id, ignoreModifications, fieldFromRowBelowToFocus } = params;

      throwIfNotInMode(id, GridRowModes.Edit);

      apiRef.current.unstable_runPendingEditCellValueMutation(id);

      let canUpdate = true;

      if (!ignoreModifications) {
        const editingState = gridEditingStateSelector(apiRef.current.state);
        const row = apiRef.current.getRow(id)!;

        const isSomeFieldProcessingProps = Object.values(editingState[id]).some(
          (fieldProps) => fieldProps.isProcessingProps,
        );

        if (isSomeFieldProcessingProps) {
          return false;
        }

        const hasSomeFieldWithError = Object.values(editingState[id]).some(
          (fieldProps) => fieldProps.error,
        );

        if (hasSomeFieldWithError) {
          return false;
        }

        let rowUpdate = { ...row };

        Object.entries(editingState[id]).forEach(([field, fieldProps]) => {
          const column = apiRef.current.getColumn(field);
          if (column.valueSetter) {
            rowUpdate = column.valueSetter({
              value: fieldProps.value,
              row: rowUpdate,
            });
          } else {
            rowUpdate[field] = fieldProps.value;
          }
        });

        if (processRowUpdate) {
          try {
            rowUpdate = await Promise.resolve(processRowUpdate(rowUpdate, row));
          } catch {
            canUpdate = false;
          }
        }

        apiRef.current.updateRows([rowUpdate]);
      }

      if (fieldFromRowBelowToFocus) {
        // TODO Don't fire event and set focus manually here
        apiRef.current.publishEvent(
          GridEvents.cellNavigationKeyDown,
          apiRef.current.getCellParams(id, fieldFromRowBelowToFocus),
          { key: 'Enter', preventDefault: () => {} } as any,
        );
      }

      if (!canUpdate) {
        return false;
      }

      updateOrDeleteRowState(id, null);
      return true;
    },
    [apiRef, processRowUpdate, throwIfNotInMode, updateOrDeleteRowState],
  );

  const setRowEditingEditCellValue = React.useCallback<
    GridNewRowEditingApi['unstable_setRowEditingEditCellValue']
  >(
    (params) => {
      const { id, field, value } = params;

      throwIfNotEditable(id, field);

      const column = apiRef.current.getColumn(field);
      const row = apiRef.current.getRow(id)!;

      let parsedValue = value;
      if (column.valueParser) {
        parsedValue = column.valueParser(value, apiRef.current.getCellParams(id, field));
      }

      let editingState = gridEditingStateSelector(apiRef.current.state);
      let newProps = { ...editingState[id][field], value: parsedValue };

      if (!column.preProcessEditCellProps) {
        updateOrDeleteFieldState(id, field, newProps);
      }

      return new Promise((resolve) => {
        const promises: Promise<void>[] = [];

        if (column.preProcessEditCellProps) {
          const hasChanged = newProps.value !== editingState[id][field].value;

          newProps = { ...newProps, isProcessingProps: true };
          updateOrDeleteFieldState(id, field, newProps);

          const { [field]: ignoredField, ...otherFieldsProps } = editingState[id];

          const promise = Promise.resolve(
            column.preProcessEditCellProps({
              id,
              row,
              props: newProps,
              hasChanged,
              otherFieldsProps,
            }),
          ).then((processedProps) => {
            // Check again if the row is in edit mode because the user may have
            // discarded the changes while the props were being processed.
            if (apiRef.current.getRowMode(id) === GridRowModes.View) {
              resolve(false);
              return;
            }

            editingState = gridEditingStateSelector(apiRef.current.state);
            processedProps = { ...processedProps, isProcessingProps: false };
            // We don't reuse the value from the props pre-processing because when the
            // promise resolves it may be already outdated. The only exception to this rule
            // is when there's no pre-processing.
            processedProps.value = column.preProcessEditCellProps
              ? editingState[id][field].value
              : parsedValue;
            updateOrDeleteFieldState(id, field, processedProps);
          });

          promises.push(promise);
        }

        Object.entries(editingState[id]).forEach(([thisField, fieldProps]) => {
          if (thisField === field) {
            return;
          }

          const fieldColumn = apiRef.current.getColumn(thisField);
          if (!fieldColumn.preProcessEditCellProps) {
            return;
          }

          fieldProps = { ...fieldProps, isProcessingProps: true };
          updateOrDeleteFieldState(id, thisField, fieldProps);

          editingState = gridEditingStateSelector(apiRef.current.state);
          const { [thisField]: ignoredField, ...otherFieldsProps } = editingState[id];

          const promise = Promise.resolve(
            fieldColumn.preProcessEditCellProps({
              id,
              row,
              props: fieldProps,
              hasChanged: false,
              otherFieldsProps,
            }),
          ).then((processedProps) => {
            // Check again if the row is in edit mode because the user may have
            // discarded the changes while the props were being processed.
            if (apiRef.current.getRowMode(id) === GridRowModes.View) {
              resolve(false);
              return;
            }

            processedProps = { ...processedProps, isProcessingProps: false };
            updateOrDeleteFieldState(id, thisField, processedProps);
          });

          promises.push(promise);
        });

        Promise.all(promises).then(() => {
          if (apiRef.current.getRowMode(id) === GridRowModes.Edit) {
            editingState = gridEditingStateSelector(apiRef.current.state);
            resolve(!editingState[id][field].error);
          } else {
            resolve(false);
          }
        });
      });
    },
    [apiRef, throwIfNotEditable, updateOrDeleteFieldState],
  );

  const editingApi: Omit<GridNewRowEditingApi, keyof GridEditingSharedApi> = {
    getRowMode,
    startRowEditMode,
    stopRowEditMode,
    unstable_setRowEditingEditCellValue: setRowEditingEditCellValue,
  };

  useGridApiMethod(apiRef, editingApi, 'EditingApi');
};
