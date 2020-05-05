import { useEffect, useMemo, useRef, useState } from 'react';
import {
  checkboxSelectionColDef,
  ColDef,
  ColumnApi,
  ColumnLookup,
  Columns,
  ColumnsMeta,
  getColDef,
  GridApi,
  GridOptions,
  InternalColumns,
  SortModel,
} from '../../models';
import { useLogger } from '../utils/useLogger';
import { GridApiRef } from '../../grid';
import {COLUMNS_UPDATED, POST_SORT} from '../../constants/eventsConstants';
import { useRafUpdate } from '../utils';

export function useColumns(options: GridOptions, columns: Columns, apiRef: GridApiRef): InternalColumns {
  const logger = useLogger('useColumns');
  const [, forceUpdate] = useState();
  const [rafUpdate] = useRafUpdate(() => forceUpdate(p => !p));

  const allColumns = useMemo<Columns>(() => {
    logger.debug('Hydrating Columns with default definitions');
    let mappedCols = columns.map(c => ({ ...getColDef(c.type), ...c }));
    if (options.checkboxSelection) {
      mappedCols = [checkboxSelectionColDef, ...mappedCols];
    }
    const sortedCols = mappedCols.filter(c => c.sortDirection != null);
    if (sortedCols.length > 0 && apiRef.current) {
      //in case consumer missed to set the sort index
      sortedCols.forEach((c, idx) => {
        if (c.sortIndex == null) {
          c.sortIndex = idx + 1;
        }
      });
    }
    // we check if someone called setSortModel using apiref to apply icons
    if (apiRef.current && apiRef.current!.getSortModel) {
      const sortedCols = apiRef.current!.getSortModel();
      sortedCols.forEach((c, idx) => {
        const col = mappedCols.find(mc => mc.field === c.colId);
        if (col) {
          col.sortDirection = c.sort;
          col.sortIndex = sortedCols.length > 1 ? idx + 1 : undefined;
        }
      });
    }
    return mappedCols;
  }, [columns, options]);

  const columnFieldLookup = useMemo<ColumnLookup>(() => {
    logger.debug('Building columns lookup');
    return allColumns.reduce((lookup, col) => {
      lookup[col.field] = col;
      return lookup;
    }, {});
  }, [columns, options]);

  const visibleColumns = useMemo<Columns>(() => {
    logger.debug('Calculating visibleColumns');
    return allColumns.filter(c => c.field != null && !c.hide);
  }, [columns, options, apiRef]);

  const columnsMeta = useMemo<ColumnsMeta>(() => {
    logger.debug('Calculating columnsMeta');
    let totalWidth = 0;
    const positions: number[] = [];

    totalWidth = visibleColumns.reduce((totalW, curCol) => {
      positions.push(totalW);
      return totalW + curCol.width!;
    }, 0);
    return { totalWidth, positions: positions };
  }, [columns, options]);

  const state = {
    all: allColumns,
    visible: visibleColumns,
    meta: columnsMeta,
    hasColumns: allColumns.length > 0,
    hasVisibleColumns: visibleColumns.length > 0,
    lookup: columnFieldLookup,
  };

  const [internalColumns, setInternalColumns] = useState<InternalColumns>(state);
  const stateRef = useRef<InternalColumns>(state);

  useEffect(() => {
    logger.debug('Columns have changed.');
    const newState = {
      all: allColumns,
      visible: visibleColumns,
      meta: columnsMeta,
      hasColumns: allColumns.length > 0,
      hasVisibleColumns: visibleColumns.length > 0,
      lookup: columnFieldLookup,
    };
    setInternalColumns(newState);
    stateRef.current = newState;
    if(apiRef.current) {
      apiRef.current.emit(COLUMNS_UPDATED, newState.all);
    }
  }, [columns, options]);

  const getColumnFromField: (field: string) => ColDef = field => stateRef.current.lookup[field];
  const getAllColumns: () => Columns = () => stateRef.current.all;
  const getColumnsMeta: () => ColumnsMeta = () => stateRef.current.meta;
  const getVisibleColumns: () => Columns = () => stateRef.current.visible;

  const onSortedColumns = (sortModel: SortModel) => {
    logger.debug('Sort model changed to ', sortModel);
    stateRef.current.all.forEach(c => (c.sortDirection = null));

    //We mutate state here to avoid rebuilding all state, as they are all pointing to the same ref internally
    //TODO refactor this to create a new object ref
    sortModel.forEach((model, index) => {
      stateRef.current.lookup[model.colId].sortIndex = sortModel.length > 1 ? index + 1 : undefined;
      stateRef.current.lookup[model.colId].sortDirection = model.sort;
    });
    rafUpdate();
  };

  useEffect(() => {
    if (apiRef && apiRef.current) {
      logger.debug('Adding column api to apiRef');

      const colApi: ColumnApi = {
        getColumnFromField,
        getAllColumns,
        getVisibleColumns,
        getColumnsMeta
      };

      apiRef.current = Object.assign(apiRef.current, colApi) as GridApi;
      apiRef.current.on(POST_SORT, onSortedColumns);

      return () => {
        apiRef.current!.removeListener(POST_SORT, onSortedColumns);
      };
    }
  }, [apiRef]);

  return internalColumns;
}
