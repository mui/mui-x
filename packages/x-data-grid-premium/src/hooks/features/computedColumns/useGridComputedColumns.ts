'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { warnOnce } from '@mui/x-internals/warning';
import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import { useGridApiMethod, useGridRegisterPipeProcessor } from '@mui/x-data-grid-pro/internals';
import type {
  GridStateInitializer,
  GridPipeProcessor,
  GridRestoreStatePreProcessingContext,
} from '@mui/x-data-grid-pro/internals';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { GridInitialStatePremium } from '../../../models/gridStatePremium';
import { GridSidebarValue } from '../sidebar/gridSidebarInterfaces';
import type {
  GridComputedColumnsApi,
  GridComputedColumnsModel,
} from './gridComputedColumnsInterfaces';
import {
  gridComputedColumnDefinitionSelector,
  gridComputedColumnsPanelOpenSelector,
  gridComputedColumnsSelector,
} from './gridComputedColumnsSelectors';

/**
 * Keeps the first definition of each field.
 * Returns the input array itself when there is nothing to remove: the control
 * state compares the model with the `computedColumns` prop by reference.
 */
const removeDuplicateFields = (model: GridComputedColumnsModel): GridComputedColumnsModel => {
  const fields = new Set<string>();
  const duplicates = new Set<string>();
  for (let i = 0; i < model.length; i += 1) {
    const field = model[i].field;
    if (fields.has(field)) {
      duplicates.add(field);
    }
    fields.add(field);
  }
  if (duplicates.size === 0) {
    return model;
  }

  warnOnce([
    `MUI X Data Grid: The computed columns model contains several definitions for the same field (${Array.from(
      duplicates,
    )
      .map((field) => `"${field}"`)
      .join(', ')}).`,
    'Each computed column needs a unique field, so only the first definition of each field is kept.',
    'Use `updateComputedColumn()` to change an existing computed column.',
  ]);

  const seen = new Set<string>();
  return model.filter((definition) => {
    if (seen.has(definition.field)) {
      return false;
    }
    seen.add(definition.field);
    return true;
  });
};

export const computedColumnsStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'computedColumns' | 'initialState'>,
  GridPrivateApiPremium
> = (state, props, apiRef) => {
  apiRef.current.caches.computedColumns = {
    editorRequest: null,
    pendingColumnIndexes: new Map(),
    pendingColumnDimensions: new Map(),
    previousModel: null,
    historyEcho: null,
  };

  return {
    ...state,
    computedColumns: {
      model: removeDuplicateFields(
        props.computedColumns ?? props.initialState?.computedColumns?.model ?? [],
      ),
      revision: 0,
    },
  };
};

/**
 * The bundled half of the computed columns feature: the model, its API and its persistence.
 * The columns themselves are created and evaluated by the injectable formula feature.
 */
export const useGridComputedColumns = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'computedColumns'
    | 'onComputedColumnsChange'
    | 'initialState'
    | 'disableComputedColumns'
    | 'disableFormulas'
    | 'dataSource'
    | 'featureDependencies'
  >,
) => {
  apiRef.current.registerControlState({
    stateId: 'computedColumns',
    propModel: props.computedColumns,
    propOnChange: props.onComputedColumnsChange,
    stateSelector: gridComputedColumnsSelector,
    changeEvent: 'computedColumnsChange',
  });

  /**
   * API METHODS
   */
  const setComputedColumns = React.useCallback<GridComputedColumnsApi['setComputedColumns']>(
    (model) => {
      const currentModel = gridComputedColumnsSelector(apiRef);
      const newModel = removeDuplicateFields(
        typeof model === 'function' ? model(currentModel) : model,
      );
      if (newModel === currentModel) {
        return;
      }

      // The `computedColumnsChange` event is published from inside `setState`, once the
      // state holds the new model: the history handler reads the previous one from here.
      // A write the controlled parent has not echoed yet stashes it too, and the echo
      // (which comes back through here) stashes the same model again.
      apiRef.current.caches.computedColumns.previousModel = currentModel;

      apiRef.current.setState((state) => ({
        ...state,
        computedColumns: { ...state.computedColumns, model: newModel },
      }));

      // The update is not applied when the model is controlled and the parent has not echoed it yet.
      const appliedModel = gridComputedColumnsSelector(apiRef);
      if (appliedModel === currentModel) {
        return;
      }

      // An index or dimensions still pending for a field that is not part of the applied
      // model belong to an insertion the parent rejected.
      const { pendingColumnIndexes, pendingColumnDimensions } =
        apiRef.current.caches.computedColumns;
      if (pendingColumnIndexes.size > 0 || pendingColumnDimensions.size > 0) {
        const fields = new Set(appliedModel.map((definition) => definition.field));
        for (const field of Array.from(pendingColumnIndexes.keys())) {
          if (!fields.has(field)) {
            pendingColumnIndexes.delete(field);
          }
        }
        for (const field of Array.from(pendingColumnDimensions.keys())) {
          if (!fields.has(field)) {
            pendingColumnDimensions.delete(field);
          }
        }
      }

      apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
    },
    [apiRef],
  );

  const addComputedColumn = React.useCallback<GridComputedColumnsApi['addComputedColumn']>(
    (definition, options) => {
      // The column is inserted by the formula feature once the model is applied,
      // which a controlled model defers until the parent echoes it: the index
      // waits in the cache instead of being applied with `setColumnIndex()` here.
      const { pendingColumnIndexes, pendingColumnDimensions } =
        apiRef.current.caches.computedColumns;
      const isNewField = !gridComputedColumnsSelector(apiRef).some(
        (item) => item.field === definition.field,
      );
      if (isNewField && options?.columnIndex != null) {
        pendingColumnIndexes.set(definition.field, options.columnIndex);
      } else {
        pendingColumnIndexes.delete(definition.field);
      }
      // Dimensions a rejected `restoreState()` left for this field are not this insertion's.
      pendingColumnDimensions.delete(definition.field);

      apiRef.current.setComputedColumns((prev) => [...prev, definition]);
    },
    [apiRef],
  );

  const updateComputedColumn = React.useCallback<GridComputedColumnsApi['updateComputedColumn']>(
    (field, changes) => {
      apiRef.current.setComputedColumns((prev) => {
        if (!prev.some((definition) => definition.field === field)) {
          return prev;
        }
        return prev.map((definition) => {
          if (definition.field !== field) {
            return definition;
          }
          const next = { ...definition, ...changes, field };
          // An `undefined` change removes the property (`numberFormat: undefined` clears the format).
          for (const key of Object.keys(changes) as (keyof typeof changes)[]) {
            if (changes[key] === undefined) {
              delete next[key];
            }
          }
          return next;
        });
      });
    },
    [apiRef],
  );

  const removeComputedColumn = React.useCallback<GridComputedColumnsApi['removeComputedColumn']>(
    (field) => {
      apiRef.current.caches.computedColumns.pendingColumnIndexes.delete(field);
      apiRef.current.caches.computedColumns.pendingColumnDimensions.delete(field);
      apiRef.current.setComputedColumns((prev) => {
        if (!prev.some((definition) => definition.field === field)) {
          return prev;
        }
        return prev.filter((definition) => definition.field !== field);
      });
    },
    [apiRef],
  );

  const isAvailable =
    props.featureDependencies?.formula !== undefined &&
    !props.disableComputedColumns &&
    !props.disableFormulas &&
    !props.dataSource;

  const showComputedColumnEditor = React.useCallback<
    GridComputedColumnsApi['showComputedColumnEditor']
  >(
    (field, options) => {
      if (!isAvailable) {
        warnOnce([
          'MUI X Data Grid: `showComputedColumnEditor()` was called, but computed columns are not available, so the call was ignored.',
          'Computed columns need the formula feature passed through `featureDependencies={{ formula: formulaFeature }}`.',
          'They are turned off by the `disableComputedColumns`, `disableFormulas` and `dataSource` props.',
        ]);
        return;
      }

      apiRef.current.caches.computedColumns.editorRequest = {
        field: field ?? null,
        sampleRowId: options?.sampleRowId,
        columnIndex: options?.columnIndex,
      };
      apiRef.current.showSidebar(GridSidebarValue.ComputedColumns);
    },
    [apiRef, isAvailable],
  );

  const hideComputedColumnEditor = React.useCallback<
    GridComputedColumnsApi['hideComputedColumnEditor']
  >(() => {
    apiRef.current.caches.computedColumns.editorRequest = null;
    if (gridComputedColumnsPanelOpenSelector(apiRef)) {
      apiRef.current.hideSidebar();
    }
  }, [apiRef]);

  const validateComputedColumn = React.useCallback<
    GridComputedColumnsApi['validateComputedColumn']
  >(
    (definition) =>
      // A definition whose field is already stored is validated as the replacement of the stored one.
      apiRef.current.validateComputedColumnDefinition?.(
        definition,
        gridComputedColumnDefinitionSelector(apiRef, definition.field) === null
          ? undefined
          : { ignoreField: definition.field },
      ) ?? {
        valid: false,
        issues: [
          {
            code: 'featureMissing',
            message:
              'The formula feature is missing, so the computed column cannot be validated. ' +
              'Pass `featureDependencies={{ formula: formulaFeature }}` to the grid.',
          },
        ],
      },
    [apiRef],
  );

  const computedColumnsApi: GridComputedColumnsApi = {
    setComputedColumns,
    addComputedColumn,
    updateComputedColumn,
    removeComputedColumn,
    showComputedColumnEditor,
    hideComputedColumnEditor,
    validateComputedColumn,
  };

  useGridApiMethod(apiRef, computedColumnsApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const addColumnMenuItem = React.useCallback<GridPipeProcessor<'columnMenu'>>(
    (columnMenuItems) => {
      if (!isAvailable) {
        return columnMenuItems;
      }
      // The item decides per column what it renders (add / edit / remove).
      return [...columnMenuItems, 'columnMenuComputedColumnItem'];
    },
    [isAvailable],
  );

  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const modelToExport = gridComputedColumnsSelector(apiRef);

      const shouldExportModel =
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
        // Always export if the model is controlled
        props.computedColumns != null ||
        // Always export if the model has been initialized
        props.initialState?.computedColumns?.model != null ||
        // Export if the model is not empty
        modelToExport.length > 0;

      if (!shouldExportModel) {
        return prevState;
      }

      return {
        ...prevState,
        computedColumns: {
          model: modelToExport,
        },
      };
    },
    [apiRef, props.computedColumns, props.initialState?.computedColumns?.model],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context: GridRestoreStatePreProcessingContext<GridInitialStatePremium>) => {
      const model = context.stateToRestore.computedColumns?.model;
      if (model == null) {
        return params;
      }

      // Registered before `useGridColumns`: the computed columns exist by the
      // time the columns restore applies `orderedFields` and the dimensions.
      const modelBefore = gridComputedColumnsSelector(apiRef);
      apiRef.current.setComputedColumns(model);
      const modelAfter = gridComputedColumnsSelector(apiRef);

      const columnsToRestore = context.stateToRestore.columns;
      if (modelAfter !== modelBefore || modelBefore === model || columnsToRestore == null) {
        return params;
      }

      // Not applied: the model is controlled and the parent has not echoed it yet, so the
      // columns restore that follows finds no column for the new definitions and drops their
      // order and dimensions. They wait in the cache for the `hydrateColumns` pass that
      // inserts the columns once the echo is applied; the visibility model keeps the keys of
      // columns that do not exist yet, so it needs nothing.
      const { pendingColumnIndexes, pendingColumnDimensions } =
        apiRef.current.caches.computedColumns;
      const lookup = gridColumnLookupSelector(apiRef);
      const { orderedFields = [], dimensions = {} } = columnsToRestore;
      for (const definition of model) {
        const { field } = definition;
        if (lookup[field] !== undefined) {
          continue;
        }
        const index = orderedFields.indexOf(field);
        if (index !== -1) {
          pendingColumnIndexes.set(field, index);
        }
        if (dimensions[field] !== undefined) {
          pendingColumnDimensions.set(field, dimensions[field]);
        }
      }
      return params;
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuItem);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.computedColumns !== undefined) {
      apiRef.current.setComputedColumns(props.computedColumns);
    }
  }, [apiRef, props.computedColumns]);
};
