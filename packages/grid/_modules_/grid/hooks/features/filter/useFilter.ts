import * as React from 'react';
import { FILTER_MODEL_CHANGE } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { FilterApi } from '../../../models/api/filterApi';
import { FeatureModeConstant } from '../../../models/featureMode';
import { FilterItem, LinkOperator } from '../../../models/filterItem';
import { FilterModelParams } from '../../../models/params/filterModelParams';
import { buildCellParams } from '../../../utils/paramsUtils';
import { isEqual } from '../../../utils/utils';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { optionsSelector } from '../../utils/useOptionsProp';
import { PreferencePanelsValue } from '../preferencesPanel/preferencesPanelValue';
import { columnsSelector, filterableColumnsSelector } from '../columns/columnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { sortedRowsSelector } from '../sorting/sortingSelector';
import { FilterModel, FilterModelState } from './FilterModelState';
import { getInitialVisibleRowsState } from './visibleRowsState';

export const useFilter = (apiRef: ApiRef): void => {
  const logger = useLogger('useFilter');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);

  const rows = useGridSelector(apiRef, sortedRowsSelector);
  const filterableColumns = useGridSelector(apiRef, filterableColumnsSelector);
  const options = useGridSelector(apiRef, optionsSelector);
  const columns = useGridSelector(apiRef, filterableColumnsSelector);

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
    setGridState((state) => ({
      ...state,
      visibleRows: getInitialVisibleRowsState(),
    }));
  }, [setGridState]);

  const applyFilter = React.useCallback(
    (filterItem: FilterItem, linkOperator: LinkOperator) => {
      if (!filterItem.columnField || !filterItem.operatorValue || !filterItem.value) {
        return;
      }
      logger.info(
        `Filtering column: ${filterItem.columnField} ${filterItem.operatorValue} ${filterItem.value} `,
      );

      const column = apiRef.current.getColumnFromField(filterItem.columnField);
      if(!column) {
        return;
      }
      const filterOperators = column.filterOperators;
      if (!filterOperators?.length) {
        throw new Error(`No Filter operator found for column ${column.field}`);
      }
      const filterOperator = filterOperators.find(
        (operator) => operator.value === filterItem.operatorValue,
      )!;

      const applyFilterOnRow = filterOperator.getApplyFilterFn(filterItem, column)!;

      setGridState((state) => {
        const visibleRowsLookup = { ...state.visibleRows.visibleRowsLookup };

        rows.forEach((row, rowIndex) => {
          const params = buildCellParams({
            rowModel: row,
            colDef: column,
            rowIndex,
            value: row.data[column.field],
            api: apiRef!.current!,
          });

          const isShown = applyFilterOnRow(params);
          visibleRowsLookup[row.id] =
            // eslint-disable-next-line no-nested-ternary
            visibleRowsLookup[row.id] == null
              ? isShown
              : linkOperator === LinkOperator.And
              ? visibleRowsLookup[row.id] && isShown
              : visibleRowsLookup[row.id] || isShown;
        });
        return {
          ...state,
          visibleRows: { visibleRowsLookup, visibleRows: Object.keys(visibleRowsLookup) },
        };
      });
      forceUpdate();
    },
    [apiRef, forceUpdate, logger, rows, setGridState],
  );

  const applyFilters = React.useCallback(() => {
    if (options.filterMode === FeatureModeConstant.server) {
      return;
    }

    clearFilteredRows();

    const { items, linkOperator } = apiRef.current.state.filter;
    items.forEach((filterItem) => {
      applyFilter(filterItem, linkOperator);
    });
    forceUpdate();
  }, [apiRef, applyFilter, clearFilteredRows, forceUpdate, options.filterMode]);

  const upsertFilter = React.useCallback(
    (item: FilterItem) => {
      setGridState((state) => {
        const items = [...state.filter.items];
        const itemIndex = items.findIndex((filterItem) => filterItem.id === item.id);

        if (items.length === 1 && isEqual(items[0], {})) {
          // we replace the first filter as it's empty
          items[0] = item;
        } else if (itemIndex === -1) {
          items.push(item);
        } else {
          items[itemIndex] = item;
        }

        if (item.id == null) {
          item.id = new Date().getTime();
        }

        if (item.columnField == null) {
          item.columnField = filterableColumns[0].field;
        }
        if (item.columnField != null && item.operatorValue == null) {
          // we select a default operator
          item.operatorValue = apiRef!.current!.getColumnFromField(
            item.columnField,
          )!.filterOperators![0].value!;
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
    [setGridState, apiRef, getFilterModelParams, applyFilters, options.disableMultipleColumnsFiltering, filterableColumns],
  );

  const deleteFilter = React.useCallback(
    (item: FilterItem) => {
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
    [apiRef, applyFilters, getFilterModelParams, setGridState, upsertFilter],
  );

  const showFilterPanel = React.useCallback(
    (targetColumnField?: string) => {
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
    [apiRef, gridState.filter.items],
  );

  const applyFilterLinkOperator = React.useCallback(
    (linkOperator: LinkOperator) => {
      setGridState((state) => ({
        ...state,
        filter: { ...state.filter, linkOperator },
      }));
      applyFilters();
    },
    [applyFilters, setGridState],
  );

  const setFilterModel = React.useCallback((model: FilterModel)=> {
    applyFilterLinkOperator(model.linkOperator)
    model.items.forEach(item=> upsertFilter(item));

    apiRef.current.publishEvent(FILTER_MODEL_CHANGE, getFilterModelParams());
  }, [apiRef, applyFilterLinkOperator, getFilterModelParams, upsertFilter]);

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
      deleteFilter,
      upsertFilter,
      onFilterModelChange,
      setFilterModel,
      showFilterPanel,
    },
    'FilterApi',
  );

  useApiEventHandler(apiRef, FILTER_MODEL_CHANGE, options.onFilterModelChange);

  React.useEffect(() => {
    const filterModel = options.filterModel;
    const oldFilterModel = apiRef.current.state.filter;
    if (filterModel && filterModel.items.length > 0 && !isEqual(filterModel, oldFilterModel)) {
      // we use apiRef to avoid watching setFilterMOdel as it will trigger an update on every state change
      apiRef.current.setFilterModel(filterModel);
    }
  }, [apiRef, options.filterModel]);

  React.useEffect(()=> {
    if(apiRef && apiRef.current && columns.length> 0) {
      apiRef.current.applyFilters();
    }
  }, [columns]);

};
