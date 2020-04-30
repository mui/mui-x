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
import { POST_SORT } from '../../constants/eventsConstants';
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
    return mappedCols;
  }, [columns]);

  const columnFieldLookup = useMemo<ColumnLookup>(() => {
    logger.debug('Building columns lookup');
    return allColumns.reduce((lookup, col) => {
      lookup[col.field] = col;
      return lookup;
    }, {});
  }, [columns]);

  const visibleColumns = useMemo<Columns>(() => {
    logger.debug('Calculating visibleColumns');
    return allColumns.filter(c => c.field != null && !c.hide);
  }, [columns]);

  const columnsMeta = useMemo<ColumnsMeta>(() => {
    logger.debug('Calculating columnsMeta');
    let totalWidth = 0;
    const positions: number[] = [];

    totalWidth = visibleColumns.reduce((totalW, curCol) => {
      positions.push(totalW);
      return totalW + curCol.width!;
    }, 0);
    return { totalWidth, positions: positions };
  }, [columns]);

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
  }, [columns]);

  const getColumnFromField: (field: string) => ColDef = field => stateRef.current.lookup[field];

  const onSortedColumns = (sortModel: SortModel) => {
    stateRef.current.all.forEach(c => (c.sortDirection = null));

    //We mutate state here to avoid rebuilding all state, as they are all pointing to the same ref internally
    //TODO refactor this to create a new object ref
    sortModel.forEach(model => {
      stateRef.current.lookup[model.colId].sortDirection = model.sort;
    });
    rafUpdate();
  };

  useEffect(() => {
    if (apiRef && apiRef.current) {
      logger.debug('Adding column api to apiRef');

      const colApi: ColumnApi = {
        getColumnFromField,
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
