import * as React from 'react';
import {
  GRID_COLUMNS_UPDATED,
  GRID_FILTER_MODEL_CHANGE,
  GRID_ROWS_SET,
  GRID_ROWS_UPDATED,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridFilterApi } from '../../../models/api/gridFilterApi';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
import { GridFilterModelParams } from '../../../models/params/gridFilterModelParams';
import { GridRowsProp, GridRowId, GridRowModel } from '../../../models/gridRows';
import { isDeepEqual } from '../../../utils/utils';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useLogger } from '../../utils/useLogger';
import { filterableGridColumnsIdsSelector } from '../columns/gridColumnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { GridPreferencePanelsValue } from '../preferencesPanel/gridPreferencePanelsValue';
import { sortedGridRowsSelector } from '../sorting/gridSortingSelector';
import {
  GridFilterModel,
  GridFilterModelState,
  getInitialGridFilterState,
} from './gridFilterModelState';
import { getInitialVisibleGridRowsState } from './visibleGridRowsState';
import { visibleSortedGridRowsSelector } from './gridFilterSelector';

export const useGridFilter = (apiRef: GridApiRef, rowsProp: GridRowsProp): void => {
  const logger = useLogger('useGridFilter');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const filterableColumnsIds = useGridSelector(apiRef, filterableGridColumnsIdsSelector);
  const options = useGridSelector(apiRef, optionsSelector);

  const getFilterModelParams = React.useCallback(
    (): GridFilterModelParams => ({
      filterModel: apiRef.current.getState<GridFilterModelState>('filter'),
      api: apiRef.current,
      columns: apiRef.current.getAllColumns(),
      rows: apiRef.current.getRowModels(),
      visibleRows: apiRef.current.getVisibleRowModels(),
    }),
    [apiRef],
  );

  const clearFilteredRows = React.useCallback(() => {
    logger.debug('clearing filtered rows');
    setGridState((state) => ({
      ...state,
      visibleRows: getInitialVisibleGridRowsState(),
    }));
  }, [logger, setGridState]);

  const applyFilter = React.useCallback(
    (filterItem: GridFilterItem, linkOperator: GridLinkOperator = GridLinkOperator.And) => {
      if (!filterItem.columnField || !filterItem.operatorValue || !filterItem.value) {
        return;
      }
      logger.debug(
        `Filtering column: ${filterItem.columnField} ${filterItem.operatorValue} ${filterItem.value} `,
      );

      const column = apiRef.current.getColumn(filterItem.columnField);
      if (!column) {
        return;
      }
      const filterOperators = column.filterOperators;

      if (!filterOperators?.length) {
        throw new Error(`Material-UI: No filter operators found for column '${column.field}'.`);
      }
      const filterOperator = filterOperators.find(
        (operator) => operator.value === filterItem.operatorValue,
      )!;

      if (!filterOperator) {
        throw new Error(
          `Material-UI: No filter operator found for column '${column.field}' and operator value '${filterItem.operatorValue}'.`,
        );
      }

      const applyFilterOnRow = filterOperator.getApplyFilterFn(filterItem, column)!;

      setGridState((state) => {
        const visibleRowsLookup = { ...state.visibleRows.visibleRowsLookup };

        // We run the selector on the state here to avoid rendering the rows and then filtering again.
        // This way we have latest rows on the first rendering
        const rows = sortedGridRowsSelector(state);

        rows.forEach((row: GridRowModel, id: GridRowId) => {
          const params = apiRef.current.getCellParams(id, filterItem.columnField!);

          const isShown = applyFilterOnRow(params);
          if (visibleRowsLookup[id] == null) {
            visibleRowsLookup[id] = isShown;
          } else {
            visibleRowsLookup[id] =
              linkOperator === GridLinkOperator.And
                ? visibleRowsLookup[id] && isShown
                : visibleRowsLookup[id] || isShown;
          }
        });

        return {
          ...state,
          visibleRows: {
            visibleRowsLookup,
            visibleRows: Object.entries(visibleRowsLookup)
              .filter(([, isVisible]) => isVisible)
              .map(([id]) => id),
          },
        };
      });
      forceUpdate();
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const applyFilters = React.useCallback(() => {
    if (options.filterMode === GridFeatureModeConstant.server) {
      forceUpdate();
      return;
    }

    clearFilteredRows();

    const { items, linkOperator } = apiRef.current.state.filter;
    items.forEach((filterItem) => {
      apiRef.current.applyFilter(filterItem, linkOperator);
    });
    forceUpdate();
  }, [apiRef, clearFilteredRows, forceUpdate, options.filterMode]);

  const upsertFilter = React.useCallback(
    (item: GridFilterItem) => {
      logger.debug('Upserting filter');

      setGridState((state) => {
        const items = [...state.filter.items];
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
          newItem.id = new Date().getTime();
        }

        if (newItem.columnField == null) {
          newItem.columnField = filterableColumnsIds[0];
        }
        if (newItem.columnField != null && newItem.operatorValue == null) {
          // we select a default operator
          const column = apiRef!.current!.getColumn(newItem.columnField);
          newItem.operatorValue = column && column!.filterOperators![0].value!;
        }
        if (options.disableMultipleColumnsFiltering && items.length > 1) {
          items.length = 1;
        }
        const newState = {
          ...state,
          filter: { ...state.filter, items },
        };
        return newState;
      });
      applyFilters();
      apiRef.current.publishEvent(GRID_FILTER_MODEL_CHANGE, getFilterModelParams());
    },
    [
      logger,
      setGridState,
      apiRef,
      getFilterModelParams,
      applyFilters,
      options.disableMultipleColumnsFiltering,
      filterableColumnsIds,
    ],
  );

  const deleteFilter = React.useCallback(
    (item: GridFilterItem) => {
      logger.debug(`Deleting filter on column ${item.columnField} with value ${item.value}`);
      let hasNoItem = false;
      setGridState((state) => {
        const items = [...state.filter.items.filter((filterItem) => filterItem.id !== item.id)];
        hasNoItem = items.length === 0;
        const newState = {
          ...state,
          filter: { ...state.filter, items },
        };
        return newState;
      });
      if (hasNoItem) {
        upsertFilter({});
      }
      applyFilters();
      apiRef.current.publishEvent(GRID_FILTER_MODEL_CHANGE, getFilterModelParams());
    },
    [apiRef, applyFilters, getFilterModelParams, logger, setGridState, upsertFilter],
  );

  const showFilterPanel = React.useCallback(
    (targetColumnField?: string) => {
      logger.debug('Displaying filter panel');
      if (targetColumnField) {
        const lastFilter =
          gridState.filter.items.length > 0
            ? gridState.filter.items[gridState.filter.items.length - 1]
            : null;
        if (!lastFilter || lastFilter.columnField !== targetColumnField) {
          apiRef!.current.upsertFilter({ columnField: targetColumnField });
        }
      }
      apiRef.current.showPreferences(GridPreferencePanelsValue.filters);
    },
    [apiRef, gridState.filter.items, logger],
  );
  const hideFilterPanel = React.useCallback(() => {
    logger.debug('Hiding filter panel');
    apiRef?.current.hidePreferences();
  }, [apiRef, logger]);

  const applyFilterLinkOperator = React.useCallback(
    (linkOperator: GridLinkOperator = GridLinkOperator.And) => {
      logger.debug('Applying filter link operator');
      setGridState((state) => ({
        ...state,
        filter: { ...state.filter, linkOperator },
      }));
      applyFilters();
    },
    [applyFilters, logger, setGridState],
  );

  const clearFilterModel = React.useCallback(() => {
    clearFilteredRows();
    logger.debug('Clearing filter model');
    setGridState((state) => ({ ...state, filter: getInitialGridFilterState() }));
  }, [clearFilteredRows, logger, setGridState]);

  const setFilterModel = React.useCallback(
    (model: GridFilterModel) => {
      clearFilterModel();
      logger.debug('Setting filter model');
      applyFilterLinkOperator(model.linkOperator);
      model.items.forEach((item) => upsertFilter(item));

      apiRef.current.publishEvent(GRID_FILTER_MODEL_CHANGE, getFilterModelParams());
    },
    [apiRef, applyFilterLinkOperator, clearFilterModel, getFilterModelParams, logger, upsertFilter],
  );

  const getVisibleRowModels = React.useCallback(
    () => visibleSortedGridRowsSelector(apiRef.current.state),
    [apiRef],
  );

  useGridApiMethod<GridFilterApi>(
    apiRef,
    {
      applyFilterLinkOperator,
      applyFilters,
      applyFilter,
      deleteFilter,
      upsertFilter,
      setFilterModel,
      showFilterPanel,
      hideFilterPanel,
      getVisibleRowModels,
    },
    'FilterApi',
  );

  useGridApiEventHandler(apiRef, GRID_ROWS_SET, apiRef.current.applyFilters);
  useGridApiEventHandler(apiRef, GRID_ROWS_UPDATED, apiRef.current.applyFilters);
  useGridApiOptionHandler(apiRef, GRID_FILTER_MODEL_CHANGE, options.onFilterModelChange);

  React.useEffect(() => {
    const filterModel = options.filterModel;
    const oldFilterModel = apiRef.current.state.filter;
    if (filterModel && !isDeepEqual(filterModel, oldFilterModel)) {
      logger.debug('filterModel prop changed, applying filters');
      // we use apiRef to avoid watching setFilterModel as it will trigger an update on every state change
      apiRef.current.setFilterModel(filterModel);
    }
  }, [apiRef, logger, options.filterModel]);

  React.useEffect(() => {
    if (apiRef.current) {
      logger.debug('Rows prop changed, applying filters');
      clearFilteredRows();
      apiRef.current.applyFilters();
    }
  }, [apiRef, clearFilteredRows, logger, rowsProp]);

  const onColUpdated = React.useCallback(() => {
    logger.debug('onColUpdated - GridColumns changed, applying filters');
    const filterState = apiRef.current.getState<GridFilterModelState>('filter');
    const columnsIds = filterableGridColumnsIdsSelector(apiRef.current.state);
    logger.debug('GridColumns changed, applying filters');

    filterState.items.forEach((filter) => {
      if (!columnsIds.find((field) => field === filter.columnField)) {
        apiRef.current.deleteFilter(filter);
      }
    });
    apiRef.current.applyFilters();
  }, [apiRef, logger]);

  useGridApiEventHandler(apiRef, GRID_COLUMNS_UPDATED, onColUpdated);
};
