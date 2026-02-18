'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { type Plugin, createPlugin } from '../core/plugin';
import type { GridRowId } from '../internal/rows/types';
import { filteringSelectors } from './selectors';
import { buildFilterApplier, cleanFilterModel, isFilterCondition } from './filteringUtils';
import type {
  FilterCondition,
  FilterModel,
  FilteringState,
  FilteringOptions,
  FilteringInternalOptions,
  FilteringApi,
  FilteringColumnMeta,
} from './types';

type FilteringPluginOptions = FilteringOptions & FilteringInternalOptions;

type FilteringPlugin = Plugin<
  'filtering',
  FilteringState,
  typeof filteringSelectors,
  FilteringApi,
  FilteringPluginOptions,
  FilteringColumnMeta
>;

const EMPTY_FILTER_MODEL: FilterModel = { logicOperator: 'and', conditions: [] };
const FILTERING_PIPELINE_PROCESSOR_NAME = 'filtering';

const filteringPlugin = createPlugin<FilteringPlugin>()({
  name: 'filtering',
  order: 40,
  selectors: filteringSelectors,

  initialize: (state, params) => {
    const initialModel =
      params.filtering?.model ?? params.initialState?.filtering?.model ?? undefined;

    const inputRowIds: GridRowId[] = state.rows.processedRowIds;

    let filteredRowIds: GridRowId[];

    if (!initialModel || params.filtering?.external || params.filtering?.mode === 'manual') {
      // For empty filtering model or external/manual filtering, just mirror the input row order
      filteredRowIds = inputRowIds;
    } else {
      const getColumn = (field: string) =>
        state.columns.lookup[field] as
          | ((typeof state.columns.lookup)[string] & FilteringColumnMeta)
          | undefined;
      const getRow = (id: GridRowId) => state.rows.dataRowIdToModelLookup[id];
      const { orderedFields, columnVisibilityModel } = state.columns;

      const filterApplier = buildFilterApplier({
        model: initialModel,
        getColumn,
        getRow,
        disableEval: params.filtering?.disableEval,
        ignoreDiacritics: params.filtering?.ignoreDiacritics,
        getAllColumnFields: () => orderedFields as string[],
        getVisibleColumnFields: () =>
          (orderedFields as string[]).filter((field) => columnVisibilityModel[field] !== 'hidden'),
      });
      filteredRowIds = filterApplier ? filterApplier(inputRowIds) : inputRowIds;
    }

    return {
      ...state,
      rows: {
        ...state.rows,
        processedRowIds: filteredRowIds,
      },
      filtering: {
        model: initialModel ?? EMPTY_FILTER_MODEL,
      },
    };
  },

  use: (store, params, api) => {
    const isExternalFiltering = params.filtering?.external === true;
    const isAutoMode = params.filtering?.mode !== 'manual';

    const getColumn = (field: string) => {
      return api.columns.get(field) as
        | (ReturnType<typeof api.columns.get> & FilteringColumnMeta)
        | undefined;
    };

    const getAllColumnFields = (): string[] => {
      return api.columns.getAll().map((col) => col.id);
    };

    const getVisibleColumnFields = (): string[] => {
      return api.columns.getVisible().map((col) => col.id);
    };

    const computeFilteredRowIds: FilteringApi['filtering']['computeFilteredRowIds'] = (
      rowIds,
      filterModel,
    ) => {
      const originalRowIds = rowIds ?? api.rows.getAllRowIds();
      const modelToUse = filterModel ?? store.state.filtering.model;

      const filterApplier = buildFilterApplier({
        model: modelToUse,
        getColumn,
        getRow: api.rows.getRow,
        disableEval: params.filtering?.disableEval,
        ignoreDiacritics: params.filtering?.ignoreDiacritics,
        getAllColumnFields,
        getVisibleColumnFields,
      });

      return filterApplier ? filterApplier(originalRowIds) : originalRowIds;
    };

    const filteringProcessor = useStableCallback((inputIds: GridRowId[]): GridRowId[] => {
      if (isExternalFiltering) {
        // In external mode, rows are already filtered — don't filter.
        return inputIds;
      }

      return computeFilteredRowIds(inputIds);
    });

    const applyFiltering = useStableCallback((): void => {
      if (isExternalFiltering) {
        return;
      }

      if (!isAutoMode) {
        api.rows.rowIdsPipeline.enable(FILTERING_PIPELINE_PROCESSOR_NAME);
        api.rows.rowIdsPipeline.recompute(FILTERING_PIPELINE_PROCESSOR_NAME);
        api.rows.rowIdsPipeline.disable(FILTERING_PIPELINE_PROCESSOR_NAME);
        return;
      }

      api.rows.rowIdsPipeline.recompute(FILTERING_PIPELINE_PROCESSOR_NAME);
    });

    React.useEffect(() => {
      return api.rows.rowIdsPipeline.register(
        FILTERING_PIPELINE_PROCESSOR_NAME,
        filteringProcessor,
        { disabled: !isAutoMode || isExternalFiltering },
      );
    }, [api, isAutoMode, isExternalFiltering, filteringProcessor]);

    const setModel = (model: FilterModel): void => {
      const prevModel = store.state.filtering.model;

      store.setState({
        ...store.state,
        filtering: {
          ...store.state.filtering,
          model,
        },
      });

      if (prevModel !== model) {
        params.filtering?.onModelChange?.(model);
      }

      if (isAutoMode && !isExternalFiltering) {
        applyFiltering();
      }
    };

    const getModel = (): FilterModel => {
      return filteringSelectors.model(store.state);
    };

    const upsertCondition = (condition: FilterCondition): void => {
      const model = getModel();
      const existingIndex = model.conditions.findIndex(
        (c) =>
          isFilterCondition(c) && c.field === condition.field && c.operator === condition.operator,
      );

      let newConditions;
      if (existingIndex >= 0) {
        newConditions = [...model.conditions];
        newConditions[existingIndex] = condition;
      } else {
        newConditions = [...model.conditions, condition];
      }

      setModel({ ...model, conditions: newConditions });
    };

    const deleteCondition = (condition: FilterCondition): void => {
      const model = getModel();
      const newConditions = model.conditions.filter(
        (c) =>
          !(
            isFilterCondition(c) &&
            c.field === condition.field &&
            c.operator === condition.operator
          ),
      );

      if (newConditions.length !== model.conditions.length) {
        setModel({ ...model, conditions: newConditions });
      }
    };

    // Track previous model prop for controlled mode
    const prevFilterModelRef = React.useRef<FilterModel>(store.state.filtering.model);

    // Subscribe to store changes to detect column and visibility changes.
    // Row ID changes are handled automatically by the pipeline.
    React.useEffect(() => {
      let prevColumnsLookup = (store.state as any).columns?.lookup;
      let prevColumnVisibilityModel = (store.state.columns as any).columnVisibilityModel;

      const unsubscribe = store.subscribe(() => {
        // Detect column changes and clean up filter model
        const currentColumnsLookup = (store.state as any).columns?.lookup;
        if (currentColumnsLookup && prevColumnsLookup !== currentColumnsLookup) {
          prevColumnsLookup = currentColumnsLookup;

          const model = store.state.filtering.model;
          const cleaned = cleanFilterModel(model, (field) => field in currentColumnsLookup);
          if (cleaned !== model) {
            store.setState({
              ...store.state,
              filtering: {
                ...store.state.filtering,
                model: cleaned,
              },
            });
            params.filtering?.onModelChange?.(cleaned);
            if (isAutoMode && !isExternalFiltering) {
              applyFiltering();
            }
          }
        }

        // Detect column visibility changes for quick filter re-application
        const currentVisibilityModel = (store.state.columns as any).columnVisibilityModel;
        if (currentVisibilityModel && prevColumnVisibilityModel !== currentVisibilityModel) {
          prevColumnVisibilityModel = currentVisibilityModel;

          const model = store.state.filtering.model;
          const hasQuickFilter =
            model.quickFilter &&
            model.quickFilter.values &&
            model.quickFilter.values.length > 0 &&
            model.quickFilter.excludeHiddenColumns !== false;

          if (hasQuickFilter && isAutoMode && !isExternalFiltering) {
            applyFiltering();
          }
        }
      });
      return unsubscribe;
    }, [store, applyFiltering, isExternalFiltering, isAutoMode, params.filtering]);

    // Handle controlled filtering.model prop changes
    React.useEffect(() => {
      if (params.filtering?.model !== undefined) {
        const currentModel = store.state.filtering.model;
        if (
          params.filtering.model !== currentModel &&
          params.filtering.model !== prevFilterModelRef.current
        ) {
          prevFilterModelRef.current = params.filtering.model;
          store.setState({
            ...store.state,
            filtering: {
              ...store.state.filtering,
              model: params.filtering.model,
            },
          });

          if (isAutoMode && !isExternalFiltering) {
            applyFiltering();
          }
        }
      }
    }, [params.filtering?.model, store, applyFiltering, isAutoMode, isExternalFiltering]);

    return {
      filtering: {
        getModel,
        setModel,
        apply: applyFiltering,
        computeFilteredRowIds,
        upsertCondition,
        deleteCondition,
      },
    };
  },
});

export default filteringPlugin;
