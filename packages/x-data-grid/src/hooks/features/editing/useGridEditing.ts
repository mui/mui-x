'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type {
  GridEditingApi,
  GridEditingPrivateApi,
  GridEditingSharedApi,
  GridEditingSharedPrivateApi,
} from '../../../models/api/gridEditingApi';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import type { GridConfiguration } from '../../../models/configuration/gridConfiguration';
import type { GridRowId } from '../../../models/gridRows';
import { useGridCellEditing } from './useGridCellEditing';
import { GridCellModes, GridEditModes } from '../../../models/gridEditRowModel';
import { useGridRowEditing } from './useGridRowEditing';
import type { GridStateInitializer } from '../../utils/useGridInitializeState';
import { gridEditRowsStateSelector } from './gridEditingSelectors';

export const editingStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  editRows: {},
});

export const useGridEditing = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    'isCellEditable' | 'editMode' | 'processRowUpdate' | 'dataSource' | 'onDataSourceError'
  >,
  configuration: GridConfiguration,
) => {
  useGridCellEditing(apiRef, props);
  useGridRowEditing(apiRef, props);

  const debounceMap = React.useRef<
    Record<GridRowId, Record<string, [ReturnType<typeof setTimeout>, () => Promise<void>]>>
  >({});
  // The updates of each field that ran immediately and did not end, so that a stop can wait for them.
  // The entry of a field stays until all its updates end, so that a detach reaches all of them.
  const flushedMutations = React.useRef<
    Record<GridRowId, Record<string, { promises: Set<Promise<void>>; isDetached: boolean }>>
  >({});

  const { isCellEditable: isCellEditableProp } = props;

  const isCellEditableFn = configuration.hooks.useIsCellEditable(
    apiRef,
    props as DataGridProcessedProps,
  );
  const isCellEditable = React.useCallback<GridEditingApi['isCellEditable']>(
    (params) => {
      if (!isCellEditableFn(params)) {
        return false;
      }
      if (!params.colDef.editable) {
        return false;
      }
      if (!params.colDef.renderEditCell) {
        return false;
      }
      if (isCellEditableProp) {
        return isCellEditableProp(params);
      }
      return true;
    },
    [isCellEditableProp, isCellEditableFn],
  );

  const maybeDebounce = (
    id: GridRowId,
    field: string,
    debounceMs: number | undefined,
    callback: () => Promise<void>,
  ) => {
    if (!debounceMs) {
      callback();
      return;
    }

    if (!debounceMap.current[id]) {
      debounceMap.current[id] = {};
    }

    if (debounceMap.current[id][field]) {
      const [timeout] = debounceMap.current[id][field];
      clearTimeout(timeout);
    }

    // To run the callback immediately without waiting the timeout
    const runImmediately = () => {
      const [timeout] = debounceMap.current[id][field];
      clearTimeout(timeout);
      const mutation = callback();
      delete debounceMap.current[id][field];
      return mutation;
    };

    const timeout = setTimeout(() => {
      callback();
      delete debounceMap.current[id][field];
    }, debounceMs);

    debounceMap.current[id][field] = [timeout, runImmediately];
  };

  React.useEffect(() => {
    const debounces = debounceMap.current;

    return () => {
      Object.entries(debounces).forEach(([id, fields]) => {
        Object.keys(fields).forEach((field) => {
          const [timeout] = debounces[id][field];
          clearTimeout(timeout);
          delete debounces[id][field];
        });
      });
    };
  }, []);

  const runPendingEditCellValueMutation = React.useCallback<
    GridEditingPrivateApi['runPendingEditCellValueMutation']
  >((id, field) => {
    const debounces = debounceMap.current[id] ?? {};
    const fields = field ? [field] : Object.keys(debounces);
    fields.forEach((debouncedField) => {
      if (!debounces[debouncedField]) {
        return;
      }
      const [, runCallback] = debounces[debouncedField];
      if (!flushedMutations.current[id]) {
        flushedMutations.current[id] = {};
      }
      if (!flushedMutations.current[id][debouncedField]) {
        flushedMutations.current[id][debouncedField] = { promises: new Set(), isDetached: false };
      }
      const fieldMutations = flushedMutations.current[id][debouncedField];
      const mutation = runCallback();
      fieldMutations.promises.add(mutation);
      // `finally()` keeps a rejection of the mutation unhandled, as before.
      mutation.finally(() => {
        fieldMutations.promises.delete(mutation);
        if (
          fieldMutations.promises.size === 0 &&
          flushedMutations.current[id]?.[debouncedField] === fieldMutations
        ) {
          delete flushedMutations.current[id][debouncedField];
        }
      });
    });

    const inProgress = flushedMutations.current[id] ?? {};
    const fieldsMutations = Object.keys(inProgress)
      .filter((mutatedField) => !field || mutatedField === field)
      .map((mutatedField) => inProgress[mutatedField]);
    if (fieldsMutations.length === 0) {
      return null;
    }
    const promises = fieldsMutations.reduce<Promise<void>[]>(
      (acc, fieldMutations) => acc.concat(Array.from(fieldMutations.promises)),
      [],
    );
    return Promise.all(promises)
      .then(
        () => {},
        () => {},
      )
      .then(() => fieldsMutations.every((fieldMutations) => !fieldMutations.isDetached));
  }, []);

  const detachEditCellValueMutations = React.useCallback<
    GridEditingPrivateApi['detachEditCellValueMutations']
  >((id, field) => {
    const inProgress = flushedMutations.current[id] ?? {};
    Object.keys(inProgress)
      .filter((mutatedField) => !field || mutatedField === field)
      .forEach((mutatedField) => {
        inProgress[mutatedField].isDetached = true;
        delete inProgress[mutatedField];
      });
  }, []);

  const setEditCellValue = React.useCallback<GridEditingApi['setEditCellValue']>(
    (params) => {
      const { id, field, debounceMs } = params;

      return new Promise((resolve) => {
        maybeDebounce(id, field, debounceMs, async () => {
          const setEditCellValueToCall =
            props.editMode === GridEditModes.Row
              ? apiRef.current.setRowEditingEditCellValue
              : apiRef.current.setCellEditingEditCellValue;

          // Check if the cell is in edit mode
          // By the time this callback runs the user may have cancelled the editing
          if (apiRef.current.getCellMode(id, field) === GridCellModes.Edit) {
            const result = await setEditCellValueToCall(params);
            resolve(result);
          }
        });
      });
    },
    [apiRef, props.editMode],
  );

  const getRowWithUpdatedValues = React.useCallback<
    GridEditingSharedApi['getRowWithUpdatedValues']
  >(
    (id, field) => {
      return props.editMode === GridEditModes.Cell
        ? apiRef.current.getRowWithUpdatedValuesFromCellEditing(id, field)
        : apiRef.current.getRowWithUpdatedValuesFromRowEditing(id);
    },
    [apiRef, props.editMode],
  );

  const getEditCellMeta = React.useCallback<GridEditingSharedApi['unstable_getEditCellMeta']>(
    (id, field) => {
      const editingState = gridEditRowsStateSelector(apiRef);
      return editingState[id]?.[field] ?? null;
    },
    [apiRef],
  );

  const editingSharedApi: GridEditingSharedApi = {
    isCellEditable,
    setEditCellValue,
    getRowWithUpdatedValues,
    unstable_getEditCellMeta: getEditCellMeta,
  };

  const editingSharedPrivateApi: GridEditingSharedPrivateApi = {
    runPendingEditCellValueMutation,
    detachEditCellValueMutations,
  };

  useGridApiMethod(apiRef, editingSharedApi, 'public');
  useGridApiMethod(apiRef, editingSharedPrivateApi, 'private');
};
