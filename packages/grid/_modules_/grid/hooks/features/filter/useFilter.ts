import * as React from 'react';
import { ApiRef } from '../../../models/api/apiRef';
import { FilterItem, LinkOperator } from '../../../models/filterItem';
import { buildCellParams } from '../../../utils/paramsUtils';
import { isEqual } from '../../../utils/utils';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { PreferencePanelsValue } from '../preferencesPanel/preferencesPanelValue';
import { filterableColumnsSelector } from '../columns/columnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { sortedRowsSelector } from '../sorting/sortingSelector';
import { getInitialFilterState } from './FilterModelState';
import { getInitialVisibleRowsState } from './visibleRowsState';

export const useFilter = (apiRef: ApiRef): void => {
  const logger = useLogger('useFilter');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);

  const rows = useGridSelector(apiRef, sortedRowsSelector);
  const filterableColumns = useGridSelector(apiRef, filterableColumnsSelector);

  const clearFilteredRows = React.useCallback(() => {
    setGridState((state) => ({
      ...state,
      visibleRows: getInitialVisibleRowsState(),
    }));
  }, [setGridState]);

  const clearFilters = React.useCallback(() => {
    setGridState((state) => ({
      ...state,
      filter: getInitialFilterState(),
    }));
    clearFilteredRows();
    apiRef.current.upsertFilter({});
    forceUpdate();
  }, [apiRef, clearFilteredRows, forceUpdate, setGridState]);

  const applyFilter = React.useCallback(
    (filterItem: FilterItem, linkOperator: LinkOperator) => {
      if (!filterItem.columnField || !filterItem.operatorValue || !filterItem.value) {
        return;
      }
      logger.info(
        `Filtering column: ${filterItem.columnField} ${filterItem.operatorValue} ${filterItem.value} `,
      );

      const column = apiRef.current.getColumnFromField(filterItem.columnField);
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
    clearFilteredRows();
    const { items, linkOperator } = apiRef.current.state.filter;
    items.forEach((filterItem) => {
      applyFilter(filterItem, linkOperator);
    });
    forceUpdate();
  }, [apiRef, applyFilter, clearFilteredRows, forceUpdate]);

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

        const newState = {
          ...state,
          filter: { ...state.filter, items },
        };
        return newState;
      });
      applyFilters();
    },
    [apiRef, applyFilters, filterableColumns, setGridState],
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
      applyFilters();
    },
    [applyFilters, setGridState, upsertFilter],
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
      forceUpdate();
    },
    [apiRef, forceUpdate, gridState.filter.items],
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

  useApiMethod(
    apiRef,
    {
      applyFilterLinkOperator,
      applyFilters,
      upsertFilter,
      clearFilters,
      deleteFilter,
      showFilterPanel,
    },
    'FilterApi',
  );
};
