import * as React from 'react';
import { PreferencePanelsValue } from '../../../components/tools/preferences';
import { ApiRef } from '../../../models/api/apiRef';
import { isEqual } from '../../../utils/utils';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { filterableColumnsSelector } from '../columns/columnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { sortedRowsSelector } from '../sorting/sortingSelector';
import { FilterItem, getInitialFilterState, getInitialVisibleRowsState } from './visibleRowsState';

export const useFilter = (apiRef: ApiRef): void => {
  const logger = useLogger('useFilter');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);

  const rows = useGridSelector(apiRef, sortedRowsSelector);
  const filterableColumns = useGridSelector(apiRef, filterableColumnsSelector);
  // const visibleRowsState = useGridSelector(apiRef, visibleRowsStateSelector);

  const applyFilter = React.useCallback((filterItem: FilterItem)=> {
      if(!filterItem.columnField || !filterItem.operator || !filterItem.value) {
        return;
      }
    logger.info(`Filtering column: ${filterItem.columnField} ${filterItem.operator.label} ${filterItem.value} `);

    const column = apiRef.current.getColumnFromField(filterItem.columnField);
      const filterOperators = column.filterOperators;
      if(!filterOperators?.length) {
        throw new Error(`No Filter operator found for column ${column.field}`);
      }
      const filterOperator = filterOperators.find(operator => operator.value === filterItem.operator!.value)!;

    const applyFilterOnRow = filterOperator.getApplyFilterFn(filterItem)!;

    setGridState(state=> {
      const visibleRowsLookup = {...state.visibleRows.visibleRowsLookup};

      rows.forEach((row) => {
        const isShown = applyFilterOnRow(row);
          visibleRowsLookup[row.id] =
            visibleRowsLookup[row.id] == null ? isShown : visibleRowsLookup[row.id] || isShown; //if AND it might be better to take the visible rows
      });
      return {...state, visibleRows: {visibleRowsLookup, visibleRows: Object.keys(visibleRowsLookup)}};
    });
    // apiRef.current.updateColumn({ ...column, filterValue: filterValues }); ??? NOT SURE WHY IVE DONE THTA?
    forceUpdate();
  }, [apiRef, forceUpdate, logger, rows, setGridState]);

  const applyFilters = React.useCallback((filterItems: FilterItem[])=> {
    filterItems.forEach(filterItem => {
      applyFilter(filterItem);
    });
  }, [applyFilter])

  const applyAllFilters = React.useCallback(()=> {
    const filterItems = gridState.filter.items;
    applyFilters(filterItems);
  },[applyFilters, gridState.filter.items]);

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

        if(item.columnField == null) {
          item.columnField = filterableColumns[0].field;
        }
        if(item.columnField != null && item.operator == null) {
          // we select a default operator
          item.operator = apiRef!.current!.getColumnFromField(item.columnField)!.filterOperators![0];
        }

        const newState = {
          ...state,
          filter: { ...state.filter, items },
        };
        return newState;
      });
      applyFilter(item);
      forceUpdate();
    },
    [apiRef, applyFilter, filterableColumns, forceUpdate, setGridState],
  );

  const deleteFilter = React.useCallback(
    (item: FilterItem) => {
      setGridState((state) => {
        const items = [...state.filter.items.filter((filterItem) => filterItem.id !== item.id)];

        const newState = {
          ...state,
          filter: { ...state.filter, items },
          visibleRows: getInitialVisibleRowsState()
        };
        applyFilters(items);
        return newState;
      });
      forceUpdate();
    },
    [applyFilters, forceUpdate, setGridState],
  );

  const clearFilter = React.useCallback(() => {
    setGridState((state) => ({
      ...state,
      filter: getInitialFilterState(),
      visibleRows: getInitialVisibleRowsState()
    }));
    forceUpdate();
  }, [forceUpdate, setGridState]);

  const showFilterPanel = React.useCallback(
    (targetColumnField?: string) => {
      setGridState((state) => ({
        ...state,
        preferencePanel: {
          open: true,
          openedPanelValue: PreferencePanelsValue.filters,
          targetField: targetColumnField,
        },
      }));
      forceUpdate();
    },
    [forceUpdate, setGridState],
  );

  useApiMethod(apiRef, { applyFilter, upsertFilter, clearFilter, deleteFilter, showFilterPanel }, 'FilterApi');
};
