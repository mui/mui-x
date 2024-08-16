import * as React from 'react';
import {
  unstable_useEventCallback as useEventCallback,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from '@mui/utils';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { GridEventListener } from '../../../models/events/gridEventListener';
import {
  GridEditModes,
  GridRowModes,
  GridEditingState,
  GridEditCellProps,
  GridEditRowProps,
} from '../../../models/gridEditRowModel';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import {
  GridRowEditingApi,
  GridEditingSharedApi,
  GridStopRowEditModeParams,
  GridStartRowEditModeParams,
  GridRowModesModel,
  GridRowModesModelProps,
  GridRowEditingPrivateApi,
  GridEditingSharedPrivateApi,
} from '../../../models/api/gridEditingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridEditRowsStateSelector } from './gridEditingSelectors';
import { GridRowId } from '../../../models/gridRows';
import { isPrintableKey, isPasteShortcut } from '../../../utils/keyboardUtils';
import {
  gridColumnFieldsSelector,
  gridVisibleColumnFieldsSelector,
} from '../columns/gridColumnsSelector';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { warnOnce } from '../../../internals/utils/warning';
import { gridRowsDataRowIdToIdLookupSelector } from '../rows/gridRowsSelector';
import { deepClone } from '../../../utils/utils';
import {
  GridRowEditStopParams,
  GridRowEditStartParams,
  GridRowEditStopReasons,
  GridRowEditStartReasons,
} from '../../../models/params/gridRowParams';
import { GRID_ACTIONS_COLUMN_TYPE } from '../../../colDef';

export const useGridRowEditing = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'editMode'
    | 'processRowUpdate'
    | 'onRowEditStart'
    | 'onRowEditStop'
    | 'onProcessRowUpdateError'
    | 'rowModesModel'
    | 'onRowModesModelChange'
    | 'signature'
  >,
) => {
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const rowModesModelRef = React.useRef(rowModesModel);
  const prevRowModesModel = React.useRef<GridRowModesModel>({});
  const focusTimeout = React.useRef<ReturnType<typeof setTimeout>>();
  const nextFocusedCell = React.useRef<GridCellParams | null>(null);

  const {
    processRowUpdate,
    onProcessRowUpdateError,
    rowModesModel: rowModesModelProp,
    onRowModesModelChange,
  } = props;

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
        throw new Error(`MUI X: The cell with id=${id} and field=${field} is not editable.`);
      }
    },
    [apiRef],
  );

  const throwIfNotInMode = React.useCallback(
    (id: GridRowId, mode: GridRowModes) => {
      if (apiRef.current.getRowMode(id) !== mode) {
        throw new Error(`MUI X: The row with id=${id} is not in ${mode} mode.`);
      }
    },
    [apiRef],
  );

  const hasFieldsWithErrors = React.useCallback(
    (rowId: GridRowId) => {
      const editingState = gridEditRowsStateSelector(apiRef.current.state);
      return Object.values(editingState[rowId]).some((fieldProps) => fieldProps.error);
    },
    [apiRef],
  );

  const handleCellDoubleClick = React.useCallback<GridEventListener<'cellDoubleClick'>>(
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
      apiRef.current.publishEvent('rowEditStart', newParams, event);
    },
    [apiRef],
  );

  const handleCellFocusIn = React.useCallback<GridEventListener<'cellFocusIn'>>((params) => {
    nextFocusedCell.current = params;
  }, []);

  const handleCellFocusOut = React.useCallback<GridEventListener<'cellFocusOut'>>(
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
        if (nextFocusedCell.current?.id !== params.id) {
          // The row might have been deleted during the click
          if (!apiRef.current.getRow(params.id)) {
            return;
          }

          // The row may already changed its mode
          if (apiRef.current.getRowMode(params.id) === GridRowModes.View) {
            return;
          }

          if (hasFieldsWithErrors(params.id)) {
            return;
          }

          const rowParams = apiRef.current.getRowParams(params.id);
          const newParams: GridRowEditStopParams = {
            ...rowParams,
            field: params.field,
            reason: GridRowEditStopReasons.rowFocusOut,
          };
          apiRef.current.publishEvent('rowEditStop', newParams, event);
        }
      });
    },
    [apiRef, hasFieldsWithErrors],
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(focusTimeout.current);
    };
  }, []);

  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      if (params.cellMode === GridRowModes.Edit) {
        // Wait until IME is settled for Asian languages like Japanese and Chinese
        // TODO: `event.which` is deprecated but this is a temporary workaround
        if (event.which === 229) {
          return;
        }

        let reason: GridRowEditStopReasons | undefined;

        if (event.key === 'Escape') {
          reason = GridRowEditStopReasons.escapeKeyDown;
        } else if (event.key === 'Enter') {
          reason = GridRowEditStopReasons.enterKeyDown;
        } else if (event.key === 'Tab') {
          const columnFields = gridVisibleColumnFieldsSelector(apiRef).filter((field) => {
            const column = apiRef.current.getColumn(field);
            if (column.type === GRID_ACTIONS_COLUMN_TYPE) {
              return true;
            }
            return apiRef.current.isCellEditable(apiRef.current.getCellParams(params.id, field));
          });
          if (event.shiftKey) {
            if (params.field === columnFields[0]) {
              // Exit if user pressed Shift+Tab on the first field
              reason = GridRowEditStopReasons.shiftTabKeyDown;
            }
          } else if (params.field === columnFields[columnFields.length - 1]) {
            // Exit if user pressed Tab on the last field
            reason = GridRowEditStopReasons.tabKeyDown;
          }

          // Always prevent going to the next element in the tab sequence because the focus is
          // handled manually to support edit components rendered inside Portals
          event.preventDefault();

          if (!reason) {
            const index = columnFields.findIndex((field) => field === params.field);
            const nextFieldToFocus = columnFields[event.shiftKey ? index - 1 : index + 1];
            apiRef.current.setCellFocus(params.id, nextFieldToFocus);
          }
        }

        if (reason) {
          if (reason !== GridRowEditStopReasons.escapeKeyDown && hasFieldsWithErrors(params.id)) {
            return;
          }
          const newParams: GridRowEditStopParams = {
            ...apiRef.current.getRowParams(params.id),
            reason,
            field: params.field,
          };
          apiRef.current.publishEvent('rowEditStop', newParams, event);
        }
      } else if (params.isEditable) {
        let reason: GridRowEditStartReasons | undefined;

        const canStartEditing = apiRef.current.unstable_applyPipeProcessors(
          'canStartEditing',
          true,
          { event, cellParams: params, editMode: 'row' },
        );

        if (!canStartEditing) {
          return;
        }

        if (isPrintableKey(event)) {
          reason = GridRowEditStartReasons.printableKeyDown;
        } else if (isPasteShortcut(event)) {
          reason = GridRowEditStartReasons.printableKeyDown;
        } else if (event.key === 'Enter') {
          reason = GridRowEditStartReasons.enterKeyDown;
        } else if (event.key === 'Backspace' || event.key === 'Delete') {
          reason = GridRowEditStartReasons.deleteKeyDown;
        }

        if (reason) {
          const rowParams = apiRef.current.getRowParams(params.id);
          const newParams: GridRowEditStartParams = {
            ...rowParams,
            field: params.field,
            reason,
          };
          apiRef.current.publishEvent('rowEditStart', newParams, event);
        }
      }
    },
    [apiRef, hasFieldsWithErrors],
  );

  const handleRowEditStart = React.useCallback<GridEventListener<'rowEditStart'>>(
    (params) => {
      const { id, field, reason } = params;

      const startRowEditModeParams: GridStartRowEditModeParams = { id, fieldToFocus: field };

      if (
        reason === GridRowEditStartReasons.printableKeyDown ||
        reason === GridRowEditStartReasons.deleteKeyDown
      ) {
        startRowEditModeParams.deleteValue = !!field;
      }

      apiRef.current.startRowEditMode(startRowEditModeParams);
    },
    [apiRef],
  );

  const handleRowEditStop = React.useCallback<GridEventListener<'rowEditStop'>>(
    (params) => {
      const { id, reason, field } = params;

      apiRef.current.runPendingEditCellValueMutation(id);

      let cellToFocusAfter: GridStopRowEditModeParams['cellToFocusAfter'];
      if (reason === GridRowEditStopReasons.enterKeyDown) {
        cellToFocusAfter = 'below';
      } else if (reason === GridRowEditStopReasons.tabKeyDown) {
        cellToFocusAfter = 'right';
      } else if (reason === GridRowEditStopReasons.shiftTabKeyDown) {
        cellToFocusAfter = 'left';
      }

      const ignoreModifications = reason === 'escapeKeyDown';

      apiRef.current.stopRowEditMode({ id, ignoreModifications, field, cellToFocusAfter });
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, 'cellDoubleClick', runIfEditModeIsRow(handleCellDoubleClick));
  useGridApiEventHandler(apiRef, 'cellFocusIn', runIfEditModeIsRow(handleCellFocusIn));
  useGridApiEventHandler(apiRef, 'cellFocusOut', runIfEditModeIsRow(handleCellFocusOut));
  useGridApiEventHandler(apiRef, 'cellKeyDown', runIfEditModeIsRow(handleCellKeyDown));

  useGridApiEventHandler(apiRef, 'rowEditStart', runIfEditModeIsRow(handleRowEditStart));
  useGridApiEventHandler(apiRef, 'rowEditStop', runIfEditModeIsRow(handleRowEditStop));

  useGridApiOptionHandler(apiRef, 'rowEditStart', props.onRowEditStart);
  useGridApiOptionHandler(apiRef, 'rowEditStop', props.onRowEditStop);

  const getRowMode = React.useCallback<GridRowEditingApi['getRowMode']>(
    (id) => {
      if (props.editMode === GridEditModes.Cell) {
        return GridRowModes.View;
      }
      const editingState = gridEditRowsStateSelector(apiRef.current.state);
      const isEditing = editingState[id] && Object.keys(editingState[id]).length > 0;
      return isEditing ? GridRowModes.Edit : GridRowModes.View;
    },
    [apiRef, props.editMode],
  );

  const updateRowModesModel = useEventCallback((newModel: GridRowModesModel) => {
    const isNewModelDifferentFromProp = newModel !== props.rowModesModel;

    if (onRowModesModelChange && isNewModelDifferentFromProp) {
      onRowModesModelChange(newModel, {
        api: apiRef.current,
      });
    }

    if (props.rowModesModel && isNewModelDifferentFromProp) {
      return; // The prop always win
    }

    setRowModesModel(newModel);
    rowModesModelRef.current = newModel;
    apiRef.current.publishEvent('rowModesModelChange', newModel);
  });

  const updateRowInRowModesModel = React.useCallback(
    (id: GridRowId, newProps: GridRowModesModelProps | null) => {
      const newModel = { ...rowModesModelRef.current };

      if (newProps !== null) {
        newModel[id] = { ...newProps };
      } else {
        delete newModel[id];
      }

      updateRowModesModel(newModel);
    },
    [updateRowModesModel],
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

  const startRowEditMode = React.useCallback<GridRowEditingApi['startRowEditMode']>(
    (params) => {
      const { id, ...other } = params;

      throwIfNotInMode(id, GridRowModes.View);

      updateRowInRowModesModel(id, { mode: GridRowModes.Edit, ...other });
    },
    [throwIfNotInMode, updateRowInRowModesModel],
  );

  const updateStateToStartRowEditMode = useEventCallback<[GridStartRowEditModeParams], void>(
    (params) => {
      const { id, fieldToFocus, deleteValue, initialValue } = params;

      const columnFields = gridColumnFieldsSelector(apiRef);

      const newProps = columnFields.reduce<Record<string, GridEditCellProps>>((acc, field) => {
        const cellParams = apiRef.current.getCellParams(id, field);
        if (!cellParams.isEditable) {
          return acc;
        }

        let newValue = apiRef.current.getCellValue(id, field);
        if (fieldToFocus === field && (deleteValue || initialValue)) {
          newValue = deleteValue ? '' : initialValue;
        }

        acc[field] = {
          value: newValue,
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
  ) as GridRowEditingApi['stopRowEditMode'];

  const stopRowEditMode = React.useCallback<GridRowEditingApi['stopRowEditMode']>(
    (params) => {
      const { id, ...other } = params;

      throwIfNotInMode(id, GridRowModes.Edit);

      updateRowInRowModesModel(id, { mode: GridRowModes.View, ...other });
    },
    [throwIfNotInMode, updateRowInRowModesModel],
  );

  const updateStateToStopRowEditMode = useEventCallback<[GridStopRowEditModeParams], void>(
    (params) => {
      const { id, ignoreModifications, field: focusedField, cellToFocusAfter = 'none' } = params;

      apiRef.current.runPendingEditCellValueMutation(id);

      const finishRowEditMode = () => {
        if (cellToFocusAfter !== 'none' && focusedField) {
          apiRef.current.moveFocusToRelativeCell(id, focusedField, cellToFocusAfter);
        }
        updateOrDeleteRowState(id, null);
        updateRowInRowModesModel(id, null);
      };

      if (ignoreModifications) {
        finishRowEditMode();
        return;
      }

      const editingState = gridEditRowsStateSelector(apiRef.current.state);
      const row = apiRef.current.getRow(id)!;

      const isSomeFieldProcessingProps = Object.values(editingState[id]).some(
        (fieldProps) => fieldProps.isProcessingProps,
      );

      if (isSomeFieldProcessingProps) {
        prevRowModesModel.current[id].mode = GridRowModes.Edit;
        return;
      }

      if (hasFieldsWithErrors(id)) {
        prevRowModesModel.current[id].mode = GridRowModes.Edit;
        // Revert the mode in the rowModesModel prop back to "edit"
        updateRowInRowModesModel(id, { mode: GridRowModes.Edit });
        return;
      }

      const rowUpdate = apiRef.current.getRowWithUpdatedValuesFromRowEditing(id);

      if (processRowUpdate) {
        const handleError = (errorThrown: any) => {
          prevRowModesModel.current[id].mode = GridRowModes.Edit;
          // Revert the mode in the rowModesModel prop back to "edit"
          updateRowInRowModesModel(id, { mode: GridRowModes.Edit });

          if (onProcessRowUpdateError) {
            onProcessRowUpdateError(errorThrown);
          } else if (process.env.NODE_ENV !== 'production') {
            warnOnce(
              [
                'MUI X: A call to `processRowUpdate` threw an error which was not handled because `onProcessRowUpdateError` is missing.',
                'To handle the error pass a callback to the `onProcessRowUpdateError` prop, for example `<DataGrid onProcessRowUpdateError={(error) => ...} />`.',
                'For more detail, see https://mui.com/x/react-data-grid/editing/#server-side-persistence.',
              ],
              'error',
            );
          }
        };

        try {
          Promise.resolve(processRowUpdate(rowUpdate, row))
            .then((finalRowUpdate) => {
              apiRef.current.updateRows([finalRowUpdate]);
              finishRowEditMode();
            })
            .catch(handleError);
        } catch (errorThrown) {
          handleError(errorThrown);
        }
      } else {
        apiRef.current.updateRows([rowUpdate]);
        finishRowEditMode();
      }
    },
  ) as GridRowEditingApi['startRowEditMode'];

  const setRowEditingEditCellValue = React.useCallback<
    GridRowEditingPrivateApi['setRowEditingEditCellValue']
  >(
    (params) => {
      const { id, field, value, debounceMs, unstable_skipValueParser: skipValueParser } = params;

      throwIfNotEditable(id, field);

      const column = apiRef.current.getColumn(field);
      const row = apiRef.current.getRow(id)!;

      let parsedValue = value;
      if (column.valueParser && !skipValueParser) {
        parsedValue = column.valueParser(value, row, column, apiRef);
      }

      let editingState = gridEditRowsStateSelector(apiRef.current.state);
      let newProps: GridEditCellProps = {
        ...editingState[id][field],
        value: parsedValue,
        changeReason: debounceMs ? 'debouncedSetEditCellValue' : 'setEditCellValue',
      };

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

            editingState = gridEditRowsStateSelector(apiRef.current.state);
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

          editingState = gridEditRowsStateSelector(apiRef.current.state);
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
            editingState = gridEditRowsStateSelector(apiRef.current.state);
            resolve(!editingState[id][field].error);
          } else {
            resolve(false);
          }
        });
      });
    },
    [apiRef, throwIfNotEditable, updateOrDeleteFieldState],
  );

  const getRowWithUpdatedValuesFromRowEditing = React.useCallback<
    GridRowEditingPrivateApi['getRowWithUpdatedValuesFromRowEditing']
  >(
    (id) => {
      const editingState = gridEditRowsStateSelector(apiRef.current.state);
      const row = apiRef.current.getRow(id);

      if (!editingState[id]) {
        return apiRef.current.getRow(id)!;
      }

      let rowUpdate = { ...row };

      Object.entries(editingState[id]).forEach(([field, fieldProps]) => {
        const column = apiRef.current.getColumn(field);
        if (column.valueSetter) {
          rowUpdate = column.valueSetter(fieldProps.value, rowUpdate, column, apiRef);
        } else {
          rowUpdate[field] = fieldProps.value;
        }
      });

      return rowUpdate;
    },
    [apiRef],
  );

  const editingApi: Omit<GridRowEditingApi, keyof GridEditingSharedApi> = {
    getRowMode,
    startRowEditMode,
    stopRowEditMode,
  };

  const editingPrivateApi: Omit<GridRowEditingPrivateApi, keyof GridEditingSharedPrivateApi> = {
    setRowEditingEditCellValue,
    getRowWithUpdatedValuesFromRowEditing,
  };

  useGridApiMethod(apiRef, editingApi, 'public');
  useGridApiMethod(apiRef, editingPrivateApi, 'private');

  React.useEffect(() => {
    if (rowModesModelProp) {
      updateRowModesModel(rowModesModelProp);
    }
  }, [rowModesModelProp, updateRowModesModel]);

  // Run this effect synchronously so that the keyboard event can impact the yet-to-be-rendered input.
  useEnhancedEffect(() => {
    const idToIdLookup = gridRowsDataRowIdToIdLookupSelector(apiRef);

    // Update the ref here because updateStateToStopRowEditMode may change it later
    const copyOfPrevRowModesModel = prevRowModesModel.current;
    prevRowModesModel.current = deepClone(rowModesModel); // Do a deep-clone because the attributes might be changed later

    const ids = new Set([...Object.keys(rowModesModel), ...Object.keys(copyOfPrevRowModesModel)]);
    Array.from(ids).forEach((id) => {
      const params = rowModesModel[id] ?? { mode: GridRowModes.View };
      const prevMode = copyOfPrevRowModesModel[id]?.mode || GridRowModes.View;
      const originalId = idToIdLookup[id] ?? id;
      if (params.mode === GridRowModes.Edit && prevMode === GridRowModes.View) {
        updateStateToStartRowEditMode({ id: originalId, ...params });
      } else if (params.mode === GridRowModes.View && prevMode === GridRowModes.Edit) {
        updateStateToStopRowEditMode({ id: originalId, ...params });
      }
    });
  }, [apiRef, rowModesModel, updateStateToStartRowEditMode, updateStateToStopRowEditMode]);
};
