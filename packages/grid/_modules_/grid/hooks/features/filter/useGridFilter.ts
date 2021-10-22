import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridFilterApi } from '../../../models/api/gridFilterApi';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { isDeepEqual } from '../../../utils/utils';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { filterableGridColumnsIdsSelector } from '../columns/gridColumnsSelector';
import { useGridState } from '../../utils/useGridState';
import { GridPreferencePanelsValue } from '../preferencesPanel/gridPreferencePanelsValue';
import { gridSortedRowIdsSelector } from '../sorting/gridSortingSelector';
import { getDefaultGridFilterModel } from './gridFilterState';
import { GridFilterModel } from '../../../models/gridFilterModel';
import { gridFilterModelSelector, gridVisibleSortedRowEntriesSelector } from './gridFilterSelector';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { useFirstRender } from '../../utils/useFirstRender';

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
        visibleRows: null,
      },
    };
  });

  const [, setGridState, forceUpdate] = useGridState(apiRef);

  apiRef.current.updateControlState({
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

  const applyFilters = React.useCallback<GridFilterApi['applyFilters']>(() => {
    setGridState((state) => {
      const filterModel = gridFilterModelSelector(state);

      if (props.filterMode === GridFeatureModeConstant.server) {
        return {
          ...state,
          filter: {
            ...state.filter,
            visibleRowsLookup: {},
            visibleRows: null,
          },
        };
      }

      // No filter to apply
      const filteringMethod = buildAggregatedFilterApplier(filterModel);
      if (!filteringMethod) {
        return {
          ...state,
          filter: {
            ...state.filter,
            visibleRowsLookup: {},
            visibleRows: null,
          },
        };
      }

      const rowIds = gridSortedRowIdsSelector(apiRef.current.state);
      const visibleRowsLookup: Record<GridRowId, boolean> = {};
      rowIds.forEach((rowId) => {
        visibleRowsLookup[rowId] = filteringMethod(rowId);
      });

      return {
        ...state,
        filter: {
          ...state.filter,
          visibleRowsLookup,
          visibleRows: Object.entries(visibleRowsLookup)
            .filter(([, isVisible]) => isVisible)
            .map(([id]) => id),
        },
      };
    });
    apiRef.current.publishEvent(GridEvents.visibleRowsSet);
    forceUpdate();
  }, [apiRef, setGridState, forceUpdate, props.filterMode, buildAggregatedFilterApplier]);

  const upsertFilter = React.useCallback<GridFilterApi['upsertFilter']>(
    (item) => {
      logger.debug('Upserting filter');

      setGridState((state) => {
        const filterableColumnsIds = filterableGridColumnsIdsSelector(state);
        const items = [...gridFilterModelSelector(state).items];
        const newItem = { ...item };
        const itemIndex = items.findIndex((filterItem) => filterItem.id === newItem.id);

        if (items.length === 1 && isDeepEqual(items[0], {})) {
          // we replace the first filter as it's empty
          items[0] = newItem;
        } else if (itemIndex === -1) {
          items.push(newItem);
        } else {
          items[itemIndex] = newItem;
        }

        if (newItem.id == null) {
          newItem.id = Math.round(Math.random() * 1e5);
        }

        if (newItem.columnField == null) {
          newItem.columnField = filterableColumnsIds[0];
        }
        if (newItem.columnField != null && newItem.operatorValue == null) {
          // we select a default operator
          const column = apiRef.current.getColumn(newItem.columnField);
          newItem.operatorValue = column && column!.filterOperators![0].value!;
        }
        if (props.disableMultipleColumnsFiltering && items.length > 1) {
          items.length = 1;
        }

        return {
          ...state,
          filter: { ...state.filter, filterModel: { ...state.filter.filterModel, items } },
        };
      });
      apiRef.current.applyFilters();
    },
    [apiRef, logger, setGridState, props.disableMultipleColumnsFiltering],
  );

  const deleteFilter = React.useCallback<GridFilterApi['deleteFilter']>(
    (item) => {
      logger.debug(`Deleting filter on column ${item.columnField} with value ${item.value}`);
      setGridState((state) => {
        const items = [
          ...gridFilterModelSelector(state).items.filter((filterItem) => filterItem.id !== item.id),
        ];

        return {
          ...state,
          filter: { ...state.filter, filterModel: { ...state.filter.filterModel, items } },
        };
      });
      if (gridFilterModelSelector(apiRef.current.state).items.length === 0) {
        apiRef.current.upsertFilter({});
      }
      apiRef.current.applyFilters();
    },
    [apiRef, logger, setGridState],
  );

  const showFilterPanel = React.useCallback<GridFilterApi['showFilterPanel']>(
    (targetColumnField) => {
      logger.debug('Displaying filter panel');
      if (targetColumnField) {
        const filterModel = gridFilterModelSelector(apiRef.current.state);

        const lastFilter =
          filterModel.items.length > 0 ? filterModel.items[filterModel.items.length - 1] : null;
        if (!lastFilter || lastFilter.columnField !== targetColumnField) {
          apiRef.current.upsertFilter({ columnField: targetColumnField });
        }
      }
      apiRef.current.showPreferences(GridPreferencePanelsValue.filters);
    },
    [apiRef, logger],
  );

  const hideFilterPanel = React.useCallback<GridFilterApi['hideFilterPanel']>(() => {
    logger.debug('Hiding filter panel');
    apiRef.current.hidePreferences();
  }, [apiRef, logger]);

  const applyFilterLinkOperator = React.useCallback<GridFilterApi['applyFilterLinkOperator']>(
    (linkOperator) => {
      logger.debug('Applying filter link operator');
      setGridState((state) => ({
        ...state,
        filter: { ...state.filter, filterModel: { ...state.filter.filterModel, linkOperator } },
      }));
      apiRef.current.applyFilters();
    },
    [apiRef, logger, setGridState],
  );

  const setFilterModel = React.useCallback<GridFilterApi['setFilterModel']>(
    (model) => {
      const currentModel = gridFilterModelSelector(apiRef.current.state);
      if (currentModel !== model) {
        checkFilterModelValidity(model);

        logger.debug('Setting filter model');
        setGridState((state) => ({
          ...state,
          filter: {
            ...state.filter,
            filterModel: model,
          },
        }));
        apiRef.current.applyFilters();
      }
    },
    [apiRef, logger, setGridState],
  );

  const getVisibleRowModels = React.useCallback<GridFilterApi['getVisibleRowModels']>(() => {
    const visibleSortedRows = gridVisibleSortedRowEntriesSelector(apiRef.current.state);
    return new Map<GridRowId, GridRowModel>(visibleSortedRows.map((row) => [row.id, row.model]));
  }, [apiRef]);

  useGridApiMethod<GridFilterApi>(
    apiRef,
    {
      applyFilterLinkOperator,
      applyFilters,
      deleteFilter,
      upsertFilter,
      setFilterModel,
      showFilterPanel,
      hideFilterPanel,
      getVisibleRowModels,
    },
    'FilterApi',
  );

  const onColUpdated = React.useCallback(() => {
    logger.debug('onColUpdated - GridColumns changed, applying filters');
    const filterModel = gridFilterModelSelector(apiRef.current.state);
    const columnsIds = filterableGridColumnsIdsSelector(apiRef.current.state);
    logger.debug('GridColumns changed, applying filters');

    filterModel.items.forEach((filter) => {
      if (!columnsIds.find((field) => field === filter.columnField)) {
        apiRef.current.deleteFilter(filter);
      }
    });
    apiRef.current.applyFilters();
  }, [apiRef, logger]);

  React.useEffect(() => {
    if (props.filterModel !== undefined) {
      apiRef.current.setFilterModel(props.filterModel);
    }
  }, [apiRef, logger, props.filterModel]);

  useFirstRender(() => apiRef.current.applyFilters());

  useGridApiEventHandler(apiRef, GridEvents.rowsSet, apiRef.current.applyFilters);
  useGridApiEventHandler(apiRef, GridEvents.columnsChange, onColUpdated);
};
