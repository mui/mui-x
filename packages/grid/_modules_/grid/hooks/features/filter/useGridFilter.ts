import * as React from 'react';
import { GridEventListener, GridEvents } from '../../../models/events';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridFilterApi } from '../../../models/api/gridFilterApi';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { filterableGridColumnsIdsSelector } from '../columns/gridColumnsSelector';
import { useGridState } from '../../utils/useGridState';
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

type GridFilterItemApplier = (rowId: GridRowId) => boolean;

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
 * @requires useGridControlState (method)
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

  const [, setGridState, forceUpdate] = useGridState(apiRef);

  apiRef.current.unstable_updateControlState({
    stateId: 'filter',
    propModel: props.filterModel,
    propOnChange: props.onFilterModelChange,
    stateSelector: gridFilterModelSelector,
    changeEvent: GridEvents.filterModelChange,
  });

  const buildAggregatedFilterApplier = React.useCallback(
    (filterModel: GridFilterModel): GridFilterItemApplier | null => {
      const { items, linkOperator = GridLinkOperator.And } = filterModel;

      const getFilterCallbackFromItem = (
        filterItem: GridFilterItem,
      ): GridFilterItemApplier | null => {
        if (!filterItem.columnField || !filterItem.operatorValue) {
          return null;
        }

        const column = apiRef.current.getColumn(filterItem.columnField);
        if (!column) {
          return null;
        }

        const parsedValue = column.valueParser
          ? column.valueParser(filterItem.value)
          : filterItem.value;
        const newFilterItem: GridFilterItem = { ...filterItem, value: parsedValue };

        const filterOperators = column.filterOperators;
        if (!filterOperators?.length) {
          throw new Error(`MUI: No filter operators found for column '${column.field}'.`);
        }

        const filterOperator = filterOperators.find(
          (operator) => operator.value === newFilterItem.operatorValue,
        )!;
        if (!filterOperator) {
          throw new Error(
            `MUI: No filter operator found for column '${column.field}' and operator value '${newFilterItem.operatorValue}'.`,
          );
        }

        const applyFilterOnRow = filterOperator.getApplyFilterFn(newFilterItem, column)!;
        if (typeof applyFilterOnRow !== 'function') {
          return null;
        }

        return (rowId: GridRowId) => {
          const cellParams = apiRef.current.getCellParams(rowId, newFilterItem.columnField!);

          return applyFilterOnRow(cellParams);
        };
      };

      const appliers = items
        .map(getFilterCallbackFromItem)
        .filter((callback): callback is GridFilterItemApplier => !!callback);

      if (appliers.length === 0) {
        return null;
      }

      return (rowId: GridRowId) => {
        // Return `false` as soon as we have a failing filter
        if (linkOperator === GridLinkOperator.And) {
          return appliers.every((applier) => applier(rowId));
        }

        // Return `true` as soon as we have a passing filter
        return appliers.some((applier) => applier(rowId));
      };
    },
    [apiRef],
  );

  /**
   * Generate the `visibleRowsLookup` and `visibleDescendantsCountLookup` for the current `filterModel`
   * If the tree is not flat, we have to create the lookups even with "server" filtering or 0 filter item to remove to collapsed rows.
   */
  const applyFilters = React.useCallback<GridFilterApi['unstable_applyFilters']>(() => {
    setGridState((state) => {
      const rowGroupingName = gridRowGroupingNameSelector(state);
      const filteringMethod = filteringMethodCollectionRef.current[rowGroupingName];
      if (!filteringMethod) {
        throw new Error('MUI: Invalid filtering method.');
      }

      const filterModel = gridFilterModelSelector(state);
      const isRowMatchingFilters =
        props.filterMode === GridFeatureModeConstant.client
          ? buildAggregatedFilterApplier(filterModel)
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
    forceUpdate();
  }, [apiRef, setGridState, forceUpdate, props.filterMode, buildAggregatedFilterApplier]);

  const cleanFilterItem = React.useCallback(
    (item: GridFilterItem) => {
      const cleanItem: GridFilterItem = { ...item };

      if (cleanItem.id == null) {
        cleanItem.id = Math.round(Math.random() * 1e5);
      }

      if (cleanItem.operatorValue == null) {
        // we select a default operator
        const column = apiRef.current.getColumn(cleanItem.columnField);
        cleanItem.operatorValue = column && column!.filterOperators![0].value!;
      }

      return cleanItem;
    },
    [apiRef],
  );

  const upsertFilterItem = React.useCallback<GridFilterApi['upsertFilterItem']>(
    (item) => {
      const filterModel = gridFilterModelSelector(apiRef.current.state);
      const items = [...filterModel.items];
      const itemIndex = items.findIndex((filterItem) => filterItem.id === item.id);
      const newItem = cleanFilterItem(item);
      if (itemIndex === -1) {
        items.push(newItem);
      } else {
        items[itemIndex] = newItem;
      }
      apiRef.current.setFilterModel({ ...filterModel, items });
    },
    [apiRef, cleanFilterItem],
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
          newFilterItems = [cleanFilterItem({ columnField: targetColumnField })];
        } else {
          newFilterItems = [
            ...filterItemsWithValue,
            cleanFilterItem({ columnField: targetColumnField }),
          ];
        }

        apiRef.current.setFilterModel({
          ...filterModel,
          items: newFilterItems,
        });
      }
      apiRef.current.showPreferences(GridPreferencePanelsValue.filters);
    },
    [apiRef, logger, cleanFilterItem, props.disableMultipleColumnsFiltering],
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
        setGridState((state) => ({
          ...state,
          filter: {
            ...state.filter,
            filterModel: model,
          },
        }));
        apiRef.current.unstable_applyFilters();
      }
    },
    [apiRef, logger, setGridState, props.disableMultipleColumnsFiltering],
  );

  const getVisibleRowModels = React.useCallback<GridFilterApi['getVisibleRowModels']>(() => {
    const visibleSortedRows = gridVisibleSortedRowEntriesSelector(apiRef.current.state);
    return new Map<GridRowId, GridRowModel>(visibleSortedRows.map((row) => [row.id, row.model]));
  }, [apiRef]);

  useGridApiMethod<GridFilterApi>(
    apiRef,
    {
      setFilterLinkOperator,
      unstable_applyFilters: applyFilters,
      deleteFilterItem,
      upsertFilterItem,
      setFilterModel,
      showFilterPanel,
      hideFilterPanel,
      getVisibleRowModels,
    },
    'FilterApi',
  );

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
