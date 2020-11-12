import * as React from 'react';
import { PreferencePanelsValue } from '../../../components/tools/preferences';
import { COLUMN_FILTER_CHANGED } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { ColDef } from '../../../models/colDef/colDef';
import { isEqual } from '../../../utils/utils';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { sortedRowsSelector } from '../sorting/sortingSelector';
import { FilterItem, getInitialFilterState, HiddenRowsState } from './hiddenRowsState';

export const useFilter = (apiRef: ApiRef): void => {
  const logger = useLogger('useFilter');
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const rows = useGridSelector(apiRef, sortedRowsSelector);

  const onColumnFilterChanged = React.useCallback(
    ({ column, filterValues }: { column: ColDef; filterValues: string[] }) => {
      logger.info(`Filtering column ${column.field} with ${filterValues.join(', ')} `);
      const filterRegexes = filterValues.map((filterValue) => new RegExp(filterValue, 'ig'));

      // setGridState((state) => {
      //   const newFilterState: HiddenRowsState = { ...state.filter, hiddenRows: [] };
      //   rows.forEach((row) => {
      //     // const isShown = filterRegex.test(row.data[column.field]);
      //     const isShown =
      //       !filterRegexes.length ||
      //       filterRegexes.some((regEx) => regEx.test(row.data[column.field]));
      //
      //     if (!isShown) {
      //       newFilterState.hiddenRows.push(row.id);
      //     }
      //   });
      //   return { ...state, filter: newFilterState };
      // });
      //
      // apiRef.current.updateColumn({ ...column, filterValue: filterValues });
      // forceUpdate();
    },
    [apiRef, forceUpdate, logger, rows, setGridState],
  );

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

        const newState = {
          ...state,
          filter: { ...state.filter, items },
        };
        return newState;
      });
      forceUpdate();
    },
    [forceUpdate, setGridState],
  );

  const deleteFilter = React.useCallback(
    (item: FilterItem) => {
      setGridState((state) => {
        const items = [...state.filter.items.filter((filterItem) => filterItem.id !== item.id)];

        const newState = {
          ...state,
          filter: { ...state.filter, items },
        };
        return newState;
      });
      forceUpdate();
    },
    [forceUpdate, setGridState],
  );

  const clearFilter = React.useCallback(() => {
    setGridState((state) => ({
      ...state,
      filter: getInitialFilterState(),
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

  useApiMethod(apiRef, { upsertFilter, clearFilter, deleteFilter, showFilterPanel }, 'FilterApi');

  useApiEventHandler(apiRef, COLUMN_FILTER_CHANGED, onColumnFilterChanged);
};
