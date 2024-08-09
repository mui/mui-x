import * as React from 'react';
import { defaultMemoize } from 'reselect';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';
import { GridEventListener } from '../../../models/events';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridFilterApi } from '../../../models/api/gridFilterApi';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridRowId } from '../../../models/gridRows';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { useLazyRef } from '../../utils/useLazyRef';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import { GridPreferencePanelsValue } from '../preferencesPanel/gridPreferencePanelsValue';
import { getDefaultGridFilterModel } from './gridFilterState';
import { gridFilterModelSelector } from './gridFilterSelector';
import { useFirstRender } from '../../utils/useFirstRender';
import { gridRowsLookupSelector } from '../rows';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import {
  GRID_DEFAULT_STRATEGY,
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
} from '../../core/strategyProcessing';
import {
  buildAggregatedFilterApplier,
  sanitizeFilterModel,
  mergeStateWithFilterModel,
  cleanFilterItem,
  passFilterLogic,
  shouldQuickFilterExcludeHiddenColumns,
} from './gridFilterUtils';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { isDeepEqual } from '../../../utils/utils';

export const filterStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'filterModel' | 'initialState' | 'disableMultipleColumnsFiltering'>
> = (state, props, apiRef) => {
  const filterModel =
    props.filterModel ?? props.initialState?.filter?.filterModel ?? getDefaultGridFilterModel();

  return {
    ...state,
    filter: {
      filterModel: sanitizeFilterModel(filterModel, props.disableMultipleColumnsFiltering, apiRef),
      filteredRowsLookup: {},
      filteredChildrenCountLookup: {},
      filteredDescendantCountLookup: {},
    },
    visibleRowsLookup: {},
  };
};

const getVisibleRowsLookup: GridStrategyProcessor<'visibleRowsLookupCreation'> = (params) => {
  // For flat tree, the `visibleRowsLookup` and the `filteredRowsLookup` are equals since no row is collapsed.
  return params.filteredRowsLookup;
};

function getVisibleRowsLookupState(
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  state: GridStateCommunity,
) {
  return apiRef.current.applyStrategyProcessor('visibleRowsLookupCreation', {
    tree: state.rows.tree,
    filteredRowsLookup: state.filter.filteredRowsLookup,
  });
}

function createMemoizedValues() {
  return defaultMemoize(Object.values);
}

/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 * @requires useGridRows (event)
 */
export const useGridFilter = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'rows'
    | 'initialState'
    | 'filterModel'
    | 'getRowId'
    | 'onFilterModelChange'
    | 'filterMode'
    | 'disableMultipleColumnsFiltering'
    | 'slots'
    | 'slotProps'
    | 'disableColumnFilter'
    | 'disableEval'
    | 'ignoreDiacritics'
  >,
): void => {
  const logger = useGridLogger(apiRef, 'useGridFilter');

  apiRef.current.registerControlState({
    stateId: 'filter',
    propModel: props.filterModel,
    propOnChange: props.onFilterModelChange,
    stateSelector: gridFilterModelSelector,
    changeEvent: 'filterModelChange',
  });

  const updateFilteredRows = React.useCallback(() => {
    apiRef.current.setState((state) => {
      const filterModel = gridFilterModelSelector(state, apiRef.current.instanceId);
      const filterState = apiRef.current.getFilterState(filterModel);

      const newState = {
        ...state,
        filter: {
          ...state.filter,
          ...filterState,
        },
      };

      const visibleRowsLookupState = getVisibleRowsLookupState(apiRef, newState);

      return {
        ...newState,
        visibleRowsLookup: visibleRowsLookupState,
      };
    });
    apiRef.current.publishEvent('filteredRowsSet');
  }, [apiRef]);

  const addColumnMenuItem = React.useCallback<GridPipeProcessor<'columnMenu'>>(
    (columnMenuItems, colDef) => {
      if (colDef == null || colDef.filterable === false || props.disableColumnFilter) {
        return columnMenuItems;
      }

      return [...columnMenuItems, 'columnMenuFilterItem'];
    },
    [props.disableColumnFilter],
  );

  /**
   * API METHODS
   */
  const applyFilters = React.useCallback<GridFilterApi['unstable_applyFilters']>(() => {
    updateFilteredRows();
    apiRef.current.forceUpdate();
  }, [apiRef, updateFilteredRows]);

  const upsertFilterItem = React.useCallback<GridFilterApi['upsertFilterItem']>(
    (item) => {
      const filterModel = gridFilterModelSelector(apiRef);
      const items = [...filterModel.items];
      const itemIndex = items.findIndex((filterItem) => filterItem.id === item.id);
      if (itemIndex === -1) {
        items.push(item);
      } else {
        items[itemIndex] = item;
      }
      apiRef.current.setFilterModel({ ...filterModel, items }, 'upsertFilterItem');
    },
    [apiRef],
  );

  const upsertFilterItems = React.useCallback<GridFilterApi['upsertFilterItems']>(
    (items) => {
      const filterModel = gridFilterModelSelector(apiRef);
      const existingItems = [...filterModel.items];
      items.forEach((item) => {
        const itemIndex = existingItems.findIndex((filterItem) => filterItem.id === item.id);
        if (itemIndex === -1) {
          existingItems.push(item);
        } else {
          existingItems[itemIndex] = item;
        }
      });
      apiRef.current.setFilterModel({ ...filterModel, items: existingItems }, 'upsertFilterItems');
    },
    [apiRef],
  );

  const deleteFilterItem = React.useCallback<GridFilterApi['deleteFilterItem']>(
    (itemToDelete) => {
      const filterModel = gridFilterModelSelector(apiRef);
      const items = filterModel.items.filter((item) => item.id !== itemToDelete.id);

      if (items.length === filterModel.items.length) {
        return;
      }

      apiRef.current.setFilterModel({ ...filterModel, items }, 'deleteFilterItem');
    },
    [apiRef],
  );

  const showFilterPanel = React.useCallback<GridFilterApi['showFilterPanel']>(
    (targetColumnField, panelId, labelId) => {
      logger.debug('Displaying filter panel');
      if (targetColumnField) {
        const filterModel = gridFilterModelSelector(apiRef);
        const filterItemsWithValue = filterModel.items.filter((item) => {
          if (item.value !== undefined) {
            // Some filters like `isAnyOf` support array as `item.value`.
            // If array is empty, we want to remove it from the filter model.
            if (Array.isArray(item.value) && item.value.length === 0) {
              return false;
            }
            return true;
          }

          const column = apiRef.current.getColumn(item.field);
          const filterOperator = column.filterOperators?.find(
            (operator) => operator.value === item.operator,
          );
          const requiresFilterValue =
            typeof filterOperator?.requiresFilterValue === 'undefined'
              ? true
              : filterOperator?.requiresFilterValue;

          // Operators like `isEmpty` don't have and don't require `item.value`.
          // So we don't want to remove them from the filter model if `item.value === undefined`.
          // See https://github.com/mui/mui-x/issues/5402
          if (requiresFilterValue) {
            return false;
          }
          return true;
        });

        let newFilterItems: GridFilterItem[];
        const filterItemOnTarget = filterItemsWithValue.find(
          (item) => item.field === targetColumnField,
        );

        const targetColumn = apiRef.current.getColumn(targetColumnField);

        if (filterItemOnTarget) {
          newFilterItems = filterItemsWithValue;
        } else if (props.disableMultipleColumnsFiltering) {
          newFilterItems = [
            cleanFilterItem(
              { field: targetColumnField, operator: targetColumn!.filterOperators![0].value! },
              apiRef,
            ),
          ];
        } else {
          newFilterItems = [
            ...filterItemsWithValue,
            cleanFilterItem(
              { field: targetColumnField, operator: targetColumn!.filterOperators![0].value! },
              apiRef,
            ),
          ];
        }

        apiRef.current.setFilterModel({
          ...filterModel,
          items: newFilterItems,
        });
      }
      apiRef.current.showPreferences(GridPreferencePanelsValue.filters, panelId, labelId);
    },
    [apiRef, logger, props.disableMultipleColumnsFiltering],
  );

  const hideFilterPanel = React.useCallback<GridFilterApi['hideFilterPanel']>(() => {
    logger.debug('Hiding filter panel');
    apiRef.current.hidePreferences();
  }, [apiRef, logger]);

  const setFilterLogicOperator = React.useCallback<GridFilterApi['setFilterLogicOperator']>(
    (logicOperator) => {
      const filterModel = gridFilterModelSelector(apiRef);
      if (filterModel.logicOperator === logicOperator) {
        return;
      }
      apiRef.current.setFilterModel(
        {
          ...filterModel,
          logicOperator,
        },
        'changeLogicOperator',
      );
    },
    [apiRef],
  );

  const setQuickFilterValues = React.useCallback<GridFilterApi['setQuickFilterValues']>(
    (values) => {
      const filterModel = gridFilterModelSelector(apiRef);
      if (isDeepEqual(filterModel.quickFilterValues, values)) {
        return;
      }
      apiRef.current.setFilterModel({
        ...filterModel,
        quickFilterValues: [...values],
      });
    },
    [apiRef],
  );

  const setFilterModel = React.useCallback<GridFilterApi['setFilterModel']>(
    (model, reason) => {
      const currentModel = gridFilterModelSelector(apiRef);
      if (currentModel !== model) {
        logger.debug('Setting filter model');
        apiRef.current.updateControlState(
          'filter',
          mergeStateWithFilterModel(model, props.disableMultipleColumnsFiltering, apiRef),
          reason,
        );
        apiRef.current.unstable_applyFilters();
      }
    },
    [apiRef, logger, props.disableMultipleColumnsFiltering],
  );

  const getFilterState = React.useCallback<GridFilterApi['getFilterState']>(
    (inputFilterModel) => {
      const filterModel = sanitizeFilterModel(
        inputFilterModel,
        props.disableMultipleColumnsFiltering,
        apiRef,
      );
      const isRowMatchingFilters =
        props.filterMode === 'client'
          ? buildAggregatedFilterApplier(filterModel, apiRef, props.disableEval)
          : null;

      const filterResult = apiRef.current.applyStrategyProcessor('filtering', {
        isRowMatchingFilters,
        filterModel: filterModel ?? getDefaultGridFilterModel(),
      });
      return {
        ...filterResult,
        filterModel,
      };
    },
    [props.disableMultipleColumnsFiltering, props.filterMode, props.disableEval, apiRef],
  );

  const filterApi: GridFilterApi = {
    setFilterLogicOperator,
    unstable_applyFilters: applyFilters,
    deleteFilterItem,
    upsertFilterItem,
    upsertFilterItems,
    setFilterModel,
    showFilterPanel,
    hideFilterPanel,
    setQuickFilterValues,
    ignoreDiacritics: props.ignoreDiacritics,
    getFilterState,
  };

  useGridApiMethod(apiRef, filterApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const filterModelToExport = gridFilterModelSelector(apiRef);

      const shouldExportFilterModel =
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
        // Always export if the model is controlled
        props.filterModel != null ||
        // Always export if the model has been initialized
        props.initialState?.filter?.filterModel != null ||
        // Export if the model is not equal to the default value
        !isDeepEqual(filterModelToExport, getDefaultGridFilterModel());

      if (!shouldExportFilterModel) {
        return prevState;
      }

      return {
        ...prevState,
        filter: {
          filterModel: filterModelToExport,
        },
      };
    },
    [apiRef, props.filterModel, props.initialState?.filter?.filterModel],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context) => {
      const filterModel = context.stateToRestore.filter?.filterModel;
      if (filterModel == null) {
        return params;
      }
      apiRef.current.updateControlState(
        'filter',
        mergeStateWithFilterModel(filterModel, props.disableMultipleColumnsFiltering, apiRef),
        'restoreState',
      );

      return {
        ...params,
        callbacks: [...params.callbacks, apiRef.current.unstable_applyFilters],
      };
    },
    [apiRef, props.disableMultipleColumnsFiltering],
  );

  const preferencePanelPreProcessing = React.useCallback<GridPipeProcessor<'preferencePanel'>>(
    (initialValue, value) => {
      if (value === GridPreferencePanelsValue.filters) {
        const FilterPanel = props.slots.filterPanel;
        return <FilterPanel {...props.slotProps?.filterPanel} />;
      }

      return initialValue;
    },
    [props.slots.filterPanel, props.slotProps?.filterPanel],
  );

  const { getRowId } = props;
  const getRowsRef = useLazyRef(createMemoizedValues);

  const flatFilteringMethod = React.useCallback<GridStrategyProcessor<'filtering'>>(
    (params) => {
      if (props.filterMode !== 'client' || !params.isRowMatchingFilters) {
        return {
          filteredRowsLookup: {},
          filteredChildrenCountLookup: {},
          filteredDescendantCountLookup: {},
        };
      }

      const dataRowIdToModelLookup = gridRowsLookupSelector(apiRef);
      const filteredRowsLookup: Record<GridRowId, boolean> = {};
      const { isRowMatchingFilters } = params;
      const filterCache = {};

      const result = {
        passingFilterItems: null,
        passingQuickFilterValues: null,
      };

      const rows = getRowsRef.current(apiRef.current.state.rows.dataRowIdToModelLookup);
      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        const id = getRowId ? getRowId(row) : row.id;

        isRowMatchingFilters(row, undefined, result);

        const isRowPassing = passFilterLogic(
          [result.passingFilterItems],
          [result.passingQuickFilterValues],
          params.filterModel,
          apiRef,
          filterCache,
        );

        filteredRowsLookup[id] = isRowPassing;
      }

      const footerId = 'auto-generated-group-footer-root';
      const footer = dataRowIdToModelLookup[footerId];
      if (footer) {
        filteredRowsLookup[footerId] = true;
      }

      return {
        filteredRowsLookup,
        filteredChildrenCountLookup: {},
        filteredDescendantCountLookup: {},
      };
    },
    [apiRef, props.filterMode, getRowId, getRowsRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuItem);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'preferencePanel', preferencePanelPreProcessing);
  useGridRegisterStrategyProcessor(apiRef, GRID_DEFAULT_STRATEGY, 'filtering', flatFilteringMethod);
  useGridRegisterStrategyProcessor(
    apiRef,
    GRID_DEFAULT_STRATEGY,
    'visibleRowsLookupCreation',
    getVisibleRowsLookup,
  );

  /**
   * EVENTS
   */
  const handleColumnsChange = React.useCallback<GridEventListener<'columnsChange'>>(() => {
    logger.debug('onColUpdated - GridColumns changed, applying filters');
    const filterModel = gridFilterModelSelector(apiRef);
    const columnsLookup = gridColumnLookupSelector(apiRef);
    const newFilterItems = filterModel.items.filter(
      (item) => item.field && columnsLookup[item.field],
    );
    if (newFilterItems.length < filterModel.items.length) {
      apiRef.current.setFilterModel({ ...filterModel, items: newFilterItems });
    }
  }, [apiRef, logger]);

  const handleStrategyProcessorChange = React.useCallback<
    GridEventListener<'activeStrategyProcessorChange'>
  >(
    (methodName) => {
      if (methodName === 'filtering') {
        apiRef.current.unstable_applyFilters();
      }
    },
    [apiRef],
  );

  const updateVisibleRowsLookupState = React.useCallback(() => {
    apiRef.current.setState((state) => {
      return {
        ...state,
        visibleRowsLookup: getVisibleRowsLookupState(apiRef, state),
      };
    });
    apiRef.current.forceUpdate();
  }, [apiRef]);

  // Do not call `apiRef.current.forceUpdate` to avoid re-render before updating the sorted rows.
  // Otherwise, the state is not consistent during the render
  useGridApiEventHandler(apiRef, 'rowsSet', updateFilteredRows);
  useGridApiEventHandler(apiRef, 'columnsChange', handleColumnsChange);
  useGridApiEventHandler(apiRef, 'activeStrategyProcessorChange', handleStrategyProcessorChange);
  useGridApiEventHandler(apiRef, 'rowExpansionChange', updateVisibleRowsLookupState);
  useGridApiEventHandler(apiRef, 'columnVisibilityModelChange', () => {
    const filterModel = gridFilterModelSelector(apiRef);
    if (filterModel.quickFilterValues && shouldQuickFilterExcludeHiddenColumns(filterModel)) {
      // re-apply filters because the quick filter results may have changed
      apiRef.current.unstable_applyFilters();
    }
  });

  /**
   * 1ST RENDER
   */
  useFirstRender(() => {
    apiRef.current.unstable_applyFilters();
  });

  /**
   * EFFECTS
   */
  useEnhancedEffect(() => {
    if (props.filterModel !== undefined) {
      apiRef.current.setFilterModel(props.filterModel);
    }
  }, [apiRef, logger, props.filterModel]);
};
