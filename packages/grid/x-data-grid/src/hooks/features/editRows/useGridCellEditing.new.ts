import * as React from 'react';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { GridEvents } from '../../../models/events/gridEvents';
import { GridEventListener } from '../../../models/events/gridEventListener';
import {
  GridEditModes,
  GridCellModes,
  GridEditingState,
  GridEditCellProps,
} from '../../../models/gridEditRowModel';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import {
  GridNewCellEditingApi,
  GridEditingSharedApi,
  GridStopCellEditModeParams,
} from '../../../models/api/gridEditingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridEditRowsStateSelector } from './gridEditRowsSelector';
import { GridRowId } from '../../../models/gridRows';
import { isPrintableKey } from '../../../utils/keyboardUtils';
import { buildWarning } from '../../../utils/warning';
import {
  GridCellEditStartParams,
  GridCellEditStopParams,
  GridCellEditStartReasons,
  GridCellEditStopReasons,
} from '../../../models/params/gridEditCellParams';

const missingOnProcessRowUpdateErrorWarning = buildWarning(
  [
    'MUI: A call to `processRowUpdate` threw an error which was not handled because `onProcessRowUpdateError` is missing.',
    'To handle the error pass a callback to the `onProcessRowUpdateError` prop, e.g. `<DataGrid onProcessRowUpdateError={(error) => ...} />`.',
    'For more detail, see http://mui.com/components/data-grid/editing/#persistence.',
  ],
  'error',
);

export const useGridCellEditing = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'editMode'
    | 'processRowUpdate'
    | 'onCellEditStart'
    | 'onCellEditStop'
    | 'onProcessRowUpdateError'
  >,
) => {
  const { processRowUpdate, onProcessRowUpdateError } = props;

  const runIfEditModeIsCell =
    <Args extends any[]>(callback: (...args: Args) => void) =>
    (...args: Args) => {
      if (props.editMode === GridEditModes.Cell) {
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
    (id: GridRowId, field: string, mode: GridCellModes) => {
      if (apiRef.current.getCellMode(id, field) !== mode) {
        throw new Error(`MUI: The cell with id=${id} and field=${field} is not in ${mode} mode.`);
      }
    },
    [apiRef],
  );

  const handleCellDoubleClick = React.useCallback<GridEventListener<GridEvents.cellDoubleClick>>(
    (params, event) => {
      if (!params.isEditable) {
        return;
      }
      if (params.cellMode === GridCellModes.Edit) {
        return;
      }
      const newParams: GridCellEditStartParams = {
        ...params,
        reason: GridCellEditStartReasons.cellDoubleClick,
      };
      apiRef.current.publishEvent(GridEvents.cellEditStart, newParams, event);
    },
    [apiRef],
  );

  const handleCellFocusOut = React.useCallback<GridEventListener<GridEvents.cellFocusOut>>(
    (params, event) => {
      if (params.cellMode === GridCellModes.View) {
        return;
      }
      const newParams = { ...params, reason: GridCellEditStopReasons.cellFocusOut };
      apiRef.current.publishEvent(GridEvents.cellEditStop, newParams, event);
    },
    [apiRef],
  );

  const handleCellKeyDown = React.useCallback<GridEventListener<GridEvents.cellKeyDown>>(
    (params, event) => {
      if (params.cellMode === GridCellModes.Edit) {
        let reason: GridCellEditStopReasons | undefined;

        if (event.key === 'Escape') {
          reason = GridCellEditStopReasons.escapeKeyDown;
        } else if (event.key === 'Enter') {
          reason = GridCellEditStopReasons.enterKeyDown;
        } else if (event.key === 'Tab') {
          reason = event.shiftKey
            ? GridCellEditStopReasons.shiftTabKeyDown
            : GridCellEditStopReasons.tabKeyDown;
          event.preventDefault(); // Prevent going to the next element in the tab sequence
        }

        if (reason) {
          const newParams: GridCellEditStopParams = { ...params, reason };
          apiRef.current.publishEvent(GridEvents.cellEditStop, newParams, event);
        }
      } else if (params.isEditable) {
        let reason: GridCellEditStartReasons | undefined;

        if (isPrintableKey(event.key)) {
          if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) {
            return;
          }
          reason = GridCellEditStartReasons.printableKeyDown;
        } else if (event.key === 'Enter') {
          reason = GridCellEditStartReasons.enterKeyDown;
        } else if (event.key === 'Delete') {
          reason = GridCellEditStartReasons.deleteKeyDown;
        }

        if (reason) {
          const newParams: GridCellEditStartParams = { ...params, reason };
          apiRef.current.publishEvent(GridEvents.cellEditStart, newParams, event);
        }
      }
    },
    [apiRef],
  );

  const handleCellEditStart = React.useCallback<GridEventListener<GridEvents.cellEditStart>>(
    (params, event) => {
      const { id, field, reason } = params;

      apiRef.current.startCellEditMode(params);

      if (
        reason === GridCellEditStartReasons.deleteKeyDown ||
        reason === GridCellEditStartReasons.printableKeyDown
      ) {
        apiRef.current.setEditCellValue({ id, field, value: '' }, event);
      }
    },
    [apiRef],
  );

  const handleCellEditStop = React.useCallback<GridEventListener<GridEvents.cellEditStop>>(
    (params) => {
      const { id, field, reason } = params;

      let cellToFocusAfter: GridStopCellEditModeParams['cellToFocusAfter'];
      if (reason === GridCellEditStopReasons.enterKeyDown) {
        cellToFocusAfter = 'below';
      } else if (reason === GridCellEditStopReasons.tabKeyDown) {
        cellToFocusAfter = 'right';
      } else if (reason === GridCellEditStopReasons.shiftTabKeyDown) {
        cellToFocusAfter = 'left';
      }

      let ignoreModifications = reason === 'escapeKeyDown';
      const editingState = gridEditRowsStateSelector(apiRef.current.state);
      if (editingState[id][field].isProcessingProps) {
        // The user wants to stop editing the cell but we can't wait for the props to be processed.
        // In this case, discard the modifications.
        ignoreModifications = true;
      }

      apiRef.current.stopCellEditMode({
        id,
        field,
        ignoreModifications,
        cellToFocusAfter,
      });
    },
    [apiRef],
  );

  useGridApiEventHandler(
    apiRef,
    GridEvents.cellDoubleClick,
    runIfEditModeIsCell(handleCellDoubleClick),
  );
  useGridApiEventHandler(apiRef, GridEvents.cellFocusOut, runIfEditModeIsCell(handleCellFocusOut));
  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, runIfEditModeIsCell(handleCellKeyDown));

  useGridApiEventHandler(
    apiRef,
    GridEvents.cellEditStart,
    runIfEditModeIsCell(handleCellEditStart),
  );
  useGridApiEventHandler(apiRef, GridEvents.cellEditStop, runIfEditModeIsCell(handleCellEditStop));

  useGridApiOptionHandler(apiRef, GridEvents.cellEditStart, props.onCellEditStart);
  useGridApiOptionHandler(apiRef, GridEvents.cellEditStop, props.onCellEditStop);

  const getCellMode = React.useCallback<GridNewCellEditingApi['getCellMode']>(
    (id, field) => {
      const editingState = gridEditRowsStateSelector(apiRef.current.state);
      const isEditing = editingState[id] && editingState[id][field];
      return isEditing ? GridCellModes.Edit : GridCellModes.View;
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

  const startCellEditMode = React.useCallback<GridNewCellEditingApi['startCellEditMode']>(
    (params) => {
      const { id, field } = params;

      throwIfNotEditable(id, field);
      throwIfNotInMode(id, field, GridCellModes.View);

      const newProps = {
        value: apiRef.current.getCellValue(id, field),
        error: false,
        isProcessingProps: false,
      };

      updateOrDeleteFieldState(id, field, newProps);

      apiRef.current.setCellFocus(id, field);
    },
    [apiRef, throwIfNotEditable, throwIfNotInMode, updateOrDeleteFieldState],
  );

  const stopCellEditMode = React.useCallback<GridNewCellEditingApi['stopCellEditMode']>(
    (params) => {
      const { id, field, ignoreModifications, cellToFocusAfter = 'none' } = params;

      throwIfNotInMode(id, field, GridCellModes.Edit);

      apiRef.current.unstable_runPendingEditCellValueMutation(id, field);

      const updateFocusedCellIfNeeded = () => {
        if (cellToFocusAfter !== 'none') {
          apiRef.current.unstable_moveFocusToRelativeCell(id, field, cellToFocusAfter);
        }
      };

      if (ignoreModifications) {
        updateFocusedCellIfNeeded();
        updateOrDeleteFieldState(id, field, null);
        return;
      }

      const editingState = gridEditRowsStateSelector(apiRef.current.state);
      const row = apiRef.current.getRow(id)!;
      const column = apiRef.current.getColumn(field);
      const { value, error, isProcessingProps } = editingState[id][field];

      if (error || isProcessingProps) {
        return;
      }

      const rowUpdate = column.valueSetter
        ? column.valueSetter({ value, row })
        : { ...row, [field]: value };

      if (processRowUpdate) {
        const handleError = (errorThrown: any) => {
          if (onProcessRowUpdateError) {
            onProcessRowUpdateError(errorThrown);
          } else {
            missingOnProcessRowUpdateErrorWarning();
          }
        };

        try {
          Promise.resolve(processRowUpdate(rowUpdate, row))
            .then((finalRowUpdate) => {
              apiRef.current.updateRows([finalRowUpdate]);
              updateFocusedCellIfNeeded();
              updateOrDeleteFieldState(id, field, null);
            })
            .catch(handleError);
        } catch (errorThrown) {
          handleError(errorThrown);
        }
      } else {
        apiRef.current.updateRows([rowUpdate]);
        updateFocusedCellIfNeeded();
        updateOrDeleteFieldState(id, field, null);
      }
    },
    [apiRef, onProcessRowUpdateError, processRowUpdate, throwIfNotInMode, updateOrDeleteFieldState],
  );

  const setCellEditingEditCellValue = React.useCallback<
    GridNewCellEditingApi['unstable_setCellEditingEditCellValue']
  >(
    async (params) => {
      const { id, field, value } = params;

      throwIfNotEditable(id, field);
      throwIfNotInMode(id, field, GridCellModes.Edit);

      const column = apiRef.current.getColumn(field);
      const row = apiRef.current.getRow(id)!;

      let parsedValue = value;
      if (column.valueParser) {
        parsedValue = column.valueParser(value, apiRef.current.getCellParams(id, field));
      }

      let editingState = gridEditRowsStateSelector(apiRef.current.state);
      let newProps: GridEditCellProps = { ...editingState[id][field], value: parsedValue };

      if (column.preProcessEditCellProps) {
        const hasChanged = value !== editingState[id][field].value;

        newProps = { ...newProps, isProcessingProps: true };
        updateOrDeleteFieldState(id, field, newProps);

        newProps = await Promise.resolve(
          column.preProcessEditCellProps({ id, row, props: newProps, hasChanged }),
        );
      }

      // Check again if the cell is in edit mode because the user may have
      // discarded the changes while the props were being processed.
      if (apiRef.current.getCellMode(id, field) === GridCellModes.View) {
        return false;
      }

      editingState = gridEditRowsStateSelector(apiRef.current.state);
      newProps = { ...newProps, isProcessingProps: false };
      // We don't update the value with the one coming from the props pre-processing
      // because when the promise resolves it may be already outdated. The only
      // exception to this rule is when there's no pre-processing.
      newProps.value = column.preProcessEditCellProps ? editingState[id][field].value : parsedValue;
      updateOrDeleteFieldState(id, field, newProps);

      editingState = gridEditRowsStateSelector(apiRef.current.state);
      return !editingState[id][field].error;
    },
    [apiRef, throwIfNotEditable, throwIfNotInMode, updateOrDeleteFieldState],
  );

  const editingApi: Omit<GridNewCellEditingApi, keyof GridEditingSharedApi> = {
    getCellMode,
    startCellEditMode,
    stopCellEditMode,
    unstable_setCellEditingEditCellValue: setCellEditingEditCellValue,
  };

  useGridApiMethod(apiRef, editingApi, 'EditingApi');
};
