import * as React from 'react';
import {
  COLUMNS_UPDATED,
  FILTER_MODEL_CHANGE,
  ROWS_SET,
  ROWS_UPDATED,
} from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { FilterApi } from '../../../models/api/filterApi';
import { FeatureModeConstant } from '../../../models/featureMode';
import { FilterItem, LinkOperator } from '../../../models/filterItem';
import { FilterModelParams } from '../../../models/params/filterModelParams';
import { RowsProp } from '../../../models/rows';
import { buildCellParams } from '../../../utils/paramsUtils';
import { isDeepEqual } from '../../../utils/utils';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useLogger } from '../../utils/useLogger';
import { filterableColumnsIdsSelector } from '../columns/columnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { PreferencePanelsValue } from '../preferencesPanel/preferencesPanelValue';
import { sortedRowsSelector } from '../sorting/sortingSelector';
import { FilterModel, FilterModelState, getInitialFilterState } from './FilterModelState';
import { getInitialVisibleRowsState } from './visibleRowsState';

export const useFilter = (apiRef: ApiRef, rowsProp: RowsProp): void => {
  const logger = useLogger('useFilter');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const filterableColumnsIds = useGridSelector(apiRef, filterableColumnsIdsSelector);
  const options = useGridSelector(apiRef, optionsSelector);

  const getFilterModelParams = React.useCallback(
    (): FilterModelParams => ({
      filterModel: apiRef.current.getState<FilterModelState>('filter'),
      api: apiRef.current,
      columns: apiRef.current.getAllColumns(),
      rows: apiRef.current.getRowModels(),
    }),
    [apiRef],
  );

  const clearFilteredRows = React.useCallback(() => {
    logger.debug('clearing filtered rows');
    setGridState((state) => ({
      ...state,
      visibleRows: getInitialVisibleRowsState(),
    }));
  }, [logger, setGridState]);

  const applyFilter = React.useCallback(
    (filterItem: FilterItem, linkOperator: LinkOperator = LinkOperator.And) => {
      if (!filterItem.columnField || !filterItem.operatorValue || !filterItem.value) {
        return;
      }
      logger.debug(
        `Filtering column: ${filterItem.columnField} ${filterItem.operatorValue} ${filterItem.value} `,
      );

      const column = apiRef.current.getColumnFromField(filterItem.columnField);
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
        const rows = sortedRowsSelector(state);

        rows.forEach((row, rowIndex) => {
          const params = buildCellParams({
            rowModel: row,
            colDef: column,
            rowIndex,
            value: row[column.field],
            api: apiRef!.current!,
          });

          const isShown = applyFilterOnRow(params);
          if (visibleRowsLookup[row.id] == null) {
            visibleRowsLookup[row.id] = isShown;
          } else {
            visibleRowsLookup[row.id] =
              linkOperator === LinkOperator.And
                ? visibleRowsLookup[row.id] && isShown
                : visibleRowsLookup[row.id] || isShown;
          }
        });

        return {
          ...state,
          visibleRows: {
            visibleRowsLookup,
            visibleRows: Object.entries(visibleRowsLookup)
              .filter((entry) => entry[1])
              .map((entry) => entry[0]),
          },
        };
      });
      forceUpdate();
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const applyFilters = React.useCallback(() => {
    if (options.filterMode === FeatureModeConstant.server) {
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
    (item: FilterItem) => {
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
          const column = apiRef!.current!.getColumnFromField(newItem.columnField);
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
      apiRef.current.publishEvent(FILTER_MODEL_CHANGE, getFilterModelParams());

      applyFilters();
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
    (item: FilterItem) => {
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
      apiRef.current.publishEvent(FILTER_MODEL_CHANGE, getFilterModelParams());

      applyFilters();
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
      apiRef.current.showPreferences(PreferencePanelsValue.filters);
    },
    [apiRef, gridState.filter.items, logger],
  );
  const hideFilterPanel = React.useCallback(() => {
    logger.debug('Hiding filter panel');
    apiRef?.current.hidePreferences();
  }, [apiRef, logger]);

  const applyFilterLinkOperator = React.useCallback(
    (linkOperator: LinkOperator = LinkOperator.And) => {
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
    setGridState((state) => ({ ...state, filter: getInitialFilterState() }));
  }, [clearFilteredRows, logger, setGridState]);

  const setFilterModel = React.useCallback(
    (model: FilterModel) => {
      clearFilterModel();
      logger.debug('Setting filter model');
      applyFilterLinkOperator(model.linkOperator);
      model.items.forEach((item) => upsertFilter(item));

      apiRef.current.publishEvent(FILTER_MODEL_CHANGE, getFilterModelParams());
    },
    [apiRef, applyFilterLinkOperator, clearFilterModel, getFilterModelParams, logger, upsertFilter],
  );

  const onFilterModelChange = React.useCallback(
    (handler: (param: FilterModelParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(FILTER_MODEL_CHANGE, handler);
    },
    [apiRef],
  );

  useApiMethod<FilterApi>(
    apiRef,
    {
      applyFilterLinkOperator,
      applyFilters,
      applyFilter,
      deleteFilter,
      upsertFilter,
      onFilterModelChange,
      setFilterModel,
      showFilterPanel,
      hideFilterPanel,
    },
    'FilterApi',
  );

  useApiEventHandler(apiRef, ROWS_SET, apiRef.current.applyFilters);
  useApiEventHandler(apiRef, ROWS_UPDATED, apiRef.current.applyFilters);
  useApiEventHandler(apiRef, FILTER_MODEL_CHANGE, options.onFilterModelChange);

  React.useEffect(() => {
    const filterModel = options.filterModel;
    const oldFilterModel = apiRef.current.state.filter;
    if (filterModel && filterModel.items.length > 0 && !isDeepEqual(filterModel, oldFilterModel)) {
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
    logger.debug('onColUpdated - Columns changed, applying filters');
    const filterState = apiRef.current.getState<FilterModelState>('filter');
    const columnsIds = filterableColumnsIdsSelector(apiRef.current.state);
    logger.debug('Columns changed, applying filters');

    filterState.items.forEach((filter) => {
      if (!columnsIds.find((field) => field === filter.columnField)) {
        apiRef.current.deleteFilter(filter);
      }
    });
    apiRef.current.applyFilters();
  }, [apiRef, logger]);

  useApiEventHandler(apiRef, COLUMNS_UPDATED, onColUpdated);
};
