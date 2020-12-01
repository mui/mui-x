import * as React from 'react';
import { ROWS_UPDATED } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { FilterApi } from '../../../models/api/filterApi';
import { FilterItem, LinkOperator } from '../../../models/filterItem';
import { RowId, RowsProp } from '../../../models/rows';
import { buildCellParams } from '../../../utils/paramsUtils';
import { isEqual } from '../../../utils/utils';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { optionsSelector } from '../../utils/useOptionsProp';
import { filterableColumnsSelector } from '../columns/columnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { PreferencePanelsValue } from '../preferencesPanel/preferencesPanelValue';
import { sortedRowsSelector } from '../sorting/sortingSelector';
import { getInitialVisibleRowsState } from './visibleRowsState';

export const useFilter = (apiRef: ApiRef, rowsProp: RowsProp): void => {
  const logger = useLogger('useFilter');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const filterableColumns = useGridSelector(apiRef, filterableColumnsSelector);
  const { disableMultipleColumnsFiltering } = useGridSelector(apiRef, optionsSelector);

  const clearFilteredRows = React.useCallback(() => {
    setGridState((state) => ({
      ...state,
      visibleRows: getInitialVisibleRowsState(),
    }));
  }, [setGridState]);

  const applyFilter = React.useCallback(
    (filterItem: FilterItem, linkOperator: LinkOperator = LinkOperator.And) => {
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
        const visibleRows: RowId[] = [];
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
          if (isShown) {
            visibleRows.push(row.id);
          }
        });
        return {
          ...state,
          visibleRows: { visibleRowsLookup, visibleRows },
        };
      });
      forceUpdate();
    },
    [apiRef, forceUpdate, logger, setGridState],
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
        if (disableMultipleColumnsFiltering && items.length > 1) {
          items.length = 1;
        }
        const newState = {
          ...state,
          filter: { ...state.filter, items },
        };
        return newState;
      });
      applyFilters();
    },
    [apiRef, applyFilters, disableMultipleColumnsFiltering, filterableColumns, setGridState],
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

  const onRowsUpdated = React.useCallback(() => {
    if (gridState.filter.items.length > 0) {
      apiRef.current.applyFilters();
    }
  }, [gridState.filter.items.length, apiRef]);

  useApiEventHandler(apiRef, ROWS_UPDATED, onRowsUpdated);
  const filterApi: FilterApi = {
    applyFilterLinkOperator,
    applyFilters,
    applyFilter,
    upsertFilter,
    deleteFilter,
    showFilterPanel,
  };
  useApiMethod(apiRef, filterApi, 'FilterApi');

  React.useEffect(() => {
    if (apiRef.current) {
      // When the rows prop change, we reapply the filters.
      apiRef.current.applyFilters();
    }
  }, [apiRef, rowsProp]);
};
