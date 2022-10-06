import * as React from 'react';
import { GridEventListener } from '../../../models/events';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridFilterApi } from '../../../models/api/gridFilterApi';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridGroupNode, GridRowId, GridRowModel } from '../../../models/gridRows';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridFilterableColumnLookupSelector } from '../columns/gridColumnsSelector';
import { GridPreferencePanelsValue } from '../preferencesPanel/gridPreferencePanelsValue';
import { getDefaultGridFilterModel } from './gridFilterState';
import { gridFilterModelSelector, gridVisibleSortedRowEntriesSelector } from './gridFilterSelector';
import { useFirstRender } from '../../utils/useFirstRender';
import { GRID_ROOT_GROUP_ID, gridRowTreeSelector } from '../rows';
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
      visibleRowsLookup: {},
      filteredDescendantCountLookup: {},
    },
  };
};

/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 * @requires useGridRows (event)
 */
export const useGridFilter = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'initialState'
    | 'filterModel'
    | 'onFilterModelChange'
    | 'filterMode'
    | 'disableMultipleColumnsFiltering'
    | 'components'
    | 'componentsProps'
  >,
): void => {
  const logger = useGridLogger(apiRef, 'useGridFilter');

  apiRef.current.unstable_registerControlState({
    stateId: 'filter',
    propModel: props.filterModel,
    propOnChange: props.onFilterModelChange,
    stateSelector: gridFilterModelSelector,
    changeEvent: 'filterModelChange',
  });

  const updateFilteredRows = React.useCallback(() => {
    apiRef.current.setState((state) => {
      const filterModel = gridFilterModelSelector(state, apiRef.current.instanceId);
      const isRowMatchingFilters =
        props.filterMode === 'client' ? buildAggregatedFilterApplier(filterModel, apiRef) : null;

      const filteringResult = apiRef.current.unstable_applyStrategyProcessor('filtering', {
        isRowMatchingFilters,
        filterModel: filterModel ?? getDefaultGridFilterModel(),
      });

      return {
        ...state,
        filter: {
          ...state.filter,
          ...filteringResult,
        },
      };
    });
    apiRef.current.publishEvent('filteredRowsSet');
  }, [props.filterMode, apiRef]);

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
        const itemIndex = items.findIndex((filterItem) => filterItem.id === item.id);
        if (itemIndex === -1) {
          existingItems.push(item);
        } else {
          existingItems[itemIndex] = item;
        }
      });
      apiRef.current.setFilterModel({ ...filterModel, items }, 'upsertFilterItems');
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
    (targetColumnField) => {
      logger.debug('Displaying filter panel');
      if (targetColumnField) {
        const filterModel = gridFilterModelSelector(apiRef);
        const filterItemsWithValue = filterModel.items.filter((item) => {
          if (item.value !== undefined) {
            return true;
          }

          const column = apiRef.current.getColumn(item.columnField);
          const filterOperator = column.filterOperators?.find(
            (operator) => operator.value === item.operatorValue,
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
          (item) => item.columnField === targetColumnField,
        );

        if (filterItemOnTarget) {
          newFilterItems = filterItemsWithValue;
        } else if (props.disableMultipleColumnsFiltering) {
          newFilterItems = [cleanFilterItem({ columnField: targetColumnField }, apiRef)];
        } else {
          newFilterItems = [
            ...filterItemsWithValue,
            cleanFilterItem({ columnField: targetColumnField }, apiRef),
          ];
        }

        apiRef.current.setFilterModel({
          ...filterModel,
          items: newFilterItems,
        });
      }
      apiRef.current.showPreferences(GridPreferencePanelsValue.filters);
    },
    [apiRef, logger, props.disableMultipleColumnsFiltering],
  );

  const hideFilterPanel = React.useCallback<GridFilterApi['hideFilterPanel']>(() => {
    logger.debug('Hiding filter panel');
    apiRef.current.hidePreferences();
  }, [apiRef, logger]);

  const setFilterLinkOperator = React.useCallback<GridFilterApi['setFilterLinkOperator']>(
    (linkOperator) => {
      const filterModel = gridFilterModelSelector(apiRef);
      if (filterModel.linkOperator === linkOperator) {
        return;
      }
      apiRef.current.setFilterModel(
        {
          ...filterModel,
          linkOperator,
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
        apiRef.current.unstable_updateControlState(
          'filter',
          mergeStateWithFilterModel(model, props.disableMultipleColumnsFiltering, apiRef),
          reason,
        );
        apiRef.current.unstable_applyFilters();
      }
    },
    [apiRef, logger, props.disableMultipleColumnsFiltering],
  );

  const getVisibleRowModels = React.useCallback<GridFilterApi['getVisibleRowModels']>(() => {
    const visibleSortedRows = gridVisibleSortedRowEntriesSelector(apiRef);
    return new Map<GridRowId, GridRowModel>(visibleSortedRows.map((row) => [row.id, row.model]));
  }, [apiRef]);

  const filterApi: GridFilterApi = {
    setFilterLinkOperator,
    unstable_applyFilters: applyFilters,
    deleteFilterItem,
    upsertFilterItem,
    upsertFilterItems,
    setFilterModel,
    showFilterPanel,
    hideFilterPanel,
    getVisibleRowModels,
    setQuickFilterValues,
  };

  useGridApiMethod(apiRef, filterApi, 'GridFilterApi');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const filterModelToExport = gridFilterModelSelector(apiRef);

      const shouldExportFilterModel =
        // Always export if the `exportOnlyDirtyModels` property is activated
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
      apiRef.current.unstable_updateControlState(
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
        const FilterPanel = props.components.FilterPanel;
        return <FilterPanel {...props.componentsProps?.filterPanel} />;
      }

      return initialValue;
    },
    [props.components.FilterPanel, props.componentsProps?.filterPanel],
  );

  const flatFilteringMethod = React.useCallback<GridStrategyProcessor<'filtering'>>(
    (params) => {
      if (props.filterMode === 'client' && params.isRowMatchingFilters) {
        const tree = gridRowTreeSelector(apiRef);
        const rowIds = (tree[GRID_ROOT_GROUP_ID] as GridGroupNode).children;
        const filteredRowsLookup: Record<GridRowId, boolean> = {};
        for (let i = 0; i < rowIds.length; i += 1) {
          const rowId = rowIds[i];
          let isRowPassing;
          if (typeof rowId === 'string' && rowId.startsWith('auto-generated-group-footer')) {
            isRowPassing = true;
          } else {
            const { passingFilterItems, passingQuickFilterValues } =
              params.isRowMatchingFilters(rowId);
            isRowPassing = passFilterLogic(
              [passingFilterItems],
              [passingQuickFilterValues],
              params.filterModel,
              apiRef,
            );
          }
          filteredRowsLookup[rowId] = isRowPassing;
        }
        return {
          filteredRowsLookup,
          // For flat tree, the `visibleRowsLookup` and the `filteredRowsLookup` are equals since no row is collapsed.
          visibleRowsLookup: filteredRowsLookup,
          filteredDescendantCountLookup: {},
        };
      }

      return {
        visibleRowsLookup: {},
        filteredRowsLookup: {},
        filteredDescendantCountLookup: {},
      };
    },
    [apiRef, props.filterMode],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'preferencePanel', preferencePanelPreProcessing);
  useGridRegisterStrategyProcessor(apiRef, GRID_DEFAULT_STRATEGY, 'filtering', flatFilteringMethod);

  /**
   * EVENTS
   */
  const handleColumnsChange = React.useCallback<GridEventListener<'columnsChange'>>(() => {
    logger.debug('onColUpdated - GridColumns changed, applying filters');
    const filterModel = gridFilterModelSelector(apiRef);
    const filterableColumnsLookup = gridFilterableColumnLookupSelector(apiRef);
    const newFilterItems = filterModel.items.filter(
      (item) => item.columnField && filterableColumnsLookup[item.columnField],
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

  // Do not call `apiRef.current.forceUpdate` to avoid re-render before updating the sorted rows.
  // Otherwise, the state is not consistent during the render
  useGridApiEventHandler(apiRef, 'rowsSet', updateFilteredRows);
  useGridApiEventHandler(apiRef, 'rowExpansionChange', apiRef.current.unstable_applyFilters);
  useGridApiEventHandler(apiRef, 'columnsChange', handleColumnsChange);
  useGridApiEventHandler(apiRef, 'activeStrategyProcessorChange', handleStrategyProcessorChange);

  /**
   * 1ST RENDER
   */
  useFirstRender(() => {
    apiRef.current.unstable_applyFilters();
  });

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.filterModel !== undefined) {
      apiRef.current.setFilterModel(props.filterModel);
    }
  }, [apiRef, logger, props.filterModel]);
};
