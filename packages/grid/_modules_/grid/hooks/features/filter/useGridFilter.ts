import * as React from 'react';
import { GridEventListener, GridEvents } from '../../../models/events';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridFilterApi } from '../../../models/api/gridFilterApi';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { filterableGridColumnsIdsSelector } from '../columns/gridColumnsSelector';
import { GridPreferencePanelsValue } from '../preferencesPanel/gridPreferencePanelsValue';
import {
  getDefaultGridFilterModel,
  GridFilteringMethod,
  GridFilteringMethodCollection,
} from './gridFilterState';
import { GridFilterModel } from '../../../models/gridFilterModel';
import { gridFilterModelSelector, gridVisibleSortedRowEntriesSelector } from './gridFilterSelector';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { useFirstRender } from '../../utils/useFirstRender';
import { gridRowIdsSelector, gridRowGroupingNameSelector } from '../rows';
import { GridPreProcessingGroup } from '../../core/preProcessing';
import { useGridRegisterFilteringMethod } from './useGridRegisterFilteringMethod';
import { buildAggregatedFilterApplier, cleanFilterItem } from './gridFilterUtils';

const checkFilterModelValidity = (model: GridFilterModel) => {
  if (model.items.length > 1) {
    const hasItemsWithoutIds = model.items.find((item) => item.id == null);
    if (hasItemsWithoutIds) {
      throw new Error(
        "MUI: The 'id' field is required on `filterModel.items` when you use multiple filters.",
      );
    }
  }
};

/**
 * @requires useGridColumns (state, method, event)
 * @requires useGridParamsApi (method)
 * @requires useGridRows (event)
 */
export const useGridFilter = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    | 'initialState'
    | 'filterModel'
    | 'onFilterModelChange'
    | 'filterMode'
    | 'disableMultipleColumnsFiltering'
  >,
): void => {
  const logger = useGridLogger(apiRef, 'useGridFilter');
  const filteringMethodCollectionRef = React.useRef<GridFilteringMethodCollection>({});
  const lastFilteringMethodApplied = React.useRef<GridFilteringMethod | null>(null);

  useGridStateInit(apiRef, (state) => {
    if (props.filterModel) {
      checkFilterModelValidity(props.filterModel);
    }

    return {
      ...state,
      filter: {
        filterModel:
          props.filterModel ??
          props.initialState?.filter?.filterModel ??
          getDefaultGridFilterModel(),
        visibleRowsLookup: {},
        filteredDescendantCountLookup: {},
      },
    };
  });

  apiRef.current.unstable_updateControlState({
    stateId: 'filter',
    propModel: props.filterModel,
    propOnChange: props.onFilterModelChange,
    stateSelector: gridFilterModelSelector,
    changeEvent: GridEvents.filterModelChange,
  });

  /**
   * API METHODS
   */
  const applyFilters = React.useCallback<GridFilterApi['unstable_applyFilters']>(() => {
    apiRef.current.setState((state) => {
      const rowGroupingName = gridRowGroupingNameSelector(state);
      const filteringMethod = filteringMethodCollectionRef.current[rowGroupingName];
      if (!filteringMethod) {
        throw new Error('MUI: Invalid filtering method.');
      }

      const filterModel = gridFilterModelSelector(state);
      const isRowMatchingFilters =
        props.filterMode === GridFeatureModeConstant.client
          ? buildAggregatedFilterApplier(filterModel, apiRef)
          : null;

      lastFilteringMethodApplied.current = filteringMethod;
      const filteringResult = filteringMethod({
        isRowMatchingFilters,
      });

      return {
        ...state,
        filter: {
          ...state.filter,
          ...filteringResult,
        },
      };
    });
    apiRef.current.publishEvent(GridEvents.visibleRowsSet);
    apiRef.current.forceUpdate();
  }, [apiRef, props.filterMode]);

  const upsertFilterItem = React.useCallback<GridFilterApi['upsertFilterItem']>(
    (item) => {
      const filterModel = gridFilterModelSelector(apiRef.current.state);
      const items = [...filterModel.items];
      const itemIndex = items.findIndex((filterItem) => filterItem.id === item.id);
      const newItem = cleanFilterItem(item, apiRef);
      if (itemIndex === -1) {
        items.push(newItem);
      } else {
        items[itemIndex] = newItem;
      }
      apiRef.current.setFilterModel({ ...filterModel, items });
    },
    [apiRef],
  );

  const deleteFilterItem = React.useCallback<GridFilterApi['deleteFilterItem']>(
    (itemToDelete) => {
      const filterModel = gridFilterModelSelector(apiRef.current.state);
      const items = filterModel.items.filter((item) => item.id !== itemToDelete.id);

      if (items.length === filterModel.items.length) {
        return;
      }

      apiRef.current.setFilterModel({ ...filterModel, items });
    },
    [apiRef],
  );

  const showFilterPanel = React.useCallback<GridFilterApi['showFilterPanel']>(
    (targetColumnField) => {
      logger.debug('Displaying filter panel');
      if (targetColumnField) {
        const filterModel = gridFilterModelSelector(apiRef.current.state);
        const filterItemsWithValue = filterModel.items.filter((item) => item.value !== undefined);

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
      const filterModel = gridFilterModelSelector(apiRef.current.state);
      if (filterModel.linkOperator === linkOperator) {
        return;
      }
      apiRef.current.setFilterModel({
        ...filterModel,
        linkOperator,
      });
    },
    [apiRef],
  );

  const setFilterModel = React.useCallback<GridFilterApi['setFilterModel']>(
    (model) => {
      const currentModel = gridFilterModelSelector(apiRef.current.state);
      if (currentModel !== model) {
        checkFilterModelValidity(model);

        if (model.items.length > 1 && props.disableMultipleColumnsFiltering) {
          model.items = [model.items[0]];
        }

        logger.debug('Setting filter model');
        apiRef.current.setState((state) => ({
          ...state,
          filter: {
            ...state.filter,
            filterModel: model,
          },
        }));
        apiRef.current.unstable_applyFilters();
      }
    },
    [apiRef, logger, props.disableMultipleColumnsFiltering],
  );

  const getVisibleRowModels = React.useCallback<GridFilterApi['getVisibleRowModels']>(() => {
    const visibleSortedRows = gridVisibleSortedRowEntriesSelector(apiRef.current.state);
    return new Map<GridRowId, GridRowModel>(visibleSortedRows.map((row) => [row.id, row.model]));
  }, [apiRef]);

  const filterApi: GridFilterApi = {
    setFilterLinkOperator,
    unstable_applyFilters: applyFilters,
    deleteFilterItem,
    upsertFilterItem,
    setFilterModel,
    showFilterPanel,
    hideFilterPanel,
    getVisibleRowModels,
  };

  useGridApiMethod<GridFilterApi>(apiRef, filterApi, 'GridFilterApi');

  /**
   * PRE-PROCESSING
   */
  const flatFilteringMethod = React.useCallback<GridFilteringMethod>(
    (params) => {
      if (props.filterMode === GridFeatureModeConstant.client && params.isRowMatchingFilters) {
        const rowIds = gridRowIdsSelector(apiRef.current.state);
        const visibleRowsLookup: Record<GridRowId, boolean> = {};
        for (let i = 0; i < rowIds.length; i += 1) {
          const rowId = rowIds[i];
          visibleRowsLookup[rowId] = params.isRowMatchingFilters(rowId);
        }
        return {
          visibleRowsLookup,
          filteredDescendantCountLookup: {},
        };
      }

      return {
        visibleRowsLookup: {},
        filteredDescendantCountLookup: {},
      };
    },
    [apiRef, props.filterMode],
  );

  useGridRegisterFilteringMethod(apiRef, 'none', flatFilteringMethod);

  /**
   * EVENTS
   */
  const handleColumnsChange = React.useCallback<GridEventListener<GridEvents.columnsChange>>(() => {
    logger.debug('onColUpdated - GridColumns changed, applying filters');
    const filterModel = gridFilterModelSelector(apiRef.current.state);
    const columnsIds = filterableGridColumnsIdsSelector(apiRef.current.state);
    const newFilterItems = filterModel.items.filter(
      (item) => item.columnField && columnsIds.includes(item.columnField),
    );
    if (newFilterItems.length < filterModel.items.length) {
      apiRef.current.setFilterModel({ ...filterModel, items: newFilterItems });
    }
  }, [apiRef, logger]);

  const handlePreProcessorRegister = React.useCallback<
    GridEventListener<GridEvents.preProcessorRegister>
  >(
    (name) => {
      if (name !== GridPreProcessingGroup.filteringMethod) {
        return;
      }

      filteringMethodCollectionRef.current = apiRef.current.unstable_applyPreProcessors(
        GridPreProcessingGroup.filteringMethod,
        {},
      );

      const rowGroupingName = gridRowGroupingNameSelector(apiRef.current.state);
      if (
        lastFilteringMethodApplied.current !== filteringMethodCollectionRef.current[rowGroupingName]
      ) {
        apiRef.current.unstable_applyFilters();
      }
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GridEvents.rowsSet, apiRef.current.unstable_applyFilters);
  useGridApiEventHandler(
    apiRef,
    GridEvents.rowExpansionChange,
    apiRef.current.unstable_applyFilters,
  );
  useGridApiEventHandler(apiRef, GridEvents.columnsChange, handleColumnsChange);
  useGridApiEventHandler(apiRef, GridEvents.preProcessorRegister, handlePreProcessorRegister);

  /**
   * 1ST RENDER
   */
  useFirstRender(() => {
    // This line of pre-processor initialization should always come after the registration of `flatFilteringMethod`
    // Otherwise on the 1st render there would be no filtering method registered
    filteringMethodCollectionRef.current = apiRef.current.unstable_applyPreProcessors(
      GridPreProcessingGroup.filteringMethod,
      {},
    );
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
