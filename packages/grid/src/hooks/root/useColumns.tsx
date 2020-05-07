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
import {Logger, useLogger} from '../utils/useLogger';
import { GridApiRef } from '../../grid';
import { COLUMNS_UPDATED, POST_SORT } from '../../constants/eventsConstants';
import { useRafUpdate } from '../utils';

function hydrateColumns(columns: Columns, options: GridOptions, logger: Logger, apiRef): Columns {
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
}

function toLookup(logger: Logger, allColumns: Columns) {
  logger.debug('Building columns lookup');
  return allColumns.reduce((lookup, col) => {
    lookup[col.field] = col;
    return lookup;
  }, {});
}

function filterVisible(logger: Logger, allColumns: Columns) {
  logger.debug('Calculating visibleColumns');
  return allColumns.filter(c => c.field != null && !c.hide);
}

function toMeta(logger: Logger, visibleColumns: Columns): ColumnsMeta {
  logger.debug('Calculating columnsMeta');
  let totalWidth = 0;
  const positions: number[] = [];

  totalWidth = visibleColumns.reduce((totalW, curCol) => {
    positions.push(totalW);
    return totalW + curCol.width!;
  }, 0);
  return { totalWidth, positions: positions };
}

const resetState = (columns: Columns, options: GridOptions, logger: Logger, apiRef): InternalColumns => {
  const all = hydrateColumns(columns, options, logger, apiRef);
  const visible = filterVisible(logger, all);
  const meta = toMeta(logger, visible);
  const lookup = toLookup(logger, all);
  return {
    all, visible, meta, lookup, hasColumns: all.length > 0, hasVisibleColumns: visible.length > 0
  };
};

const getUpdatedColumnState = (logger: Logger, state: InternalColumns, newColumn: ColDef): InternalColumns => {
  const index = state.all.findIndex(c=> c.field === newColumn.field);
  const newState = {...state};
  newState.all[index] = {...newColumn};
  newState.all = [...newState.all];

  newState.lookup[newColumn.field] = {...newColumn};
  newState.lookup = {...newState.lookup};

  const visible = filterVisible(logger, state.all);
  const meta = toMeta(logger, visible);
  return {
    ...newState, visible, meta, hasColumns: newState.all.length > 0, hasVisibleColumns: visible.length > 0
  };
};

export function useColumns(options: GridOptions, columns: Columns, apiRef: GridApiRef): InternalColumns {
  const logger = useLogger('useColumns');
  const [, forceUpdate] = useState();
  const [rafUpdate] = useRafUpdate(() => forceUpdate(p => !p));

  // const allColumns = useMemo<Columns>(() => hydrateColumns(columns, options, logger, apiRef), [columns, options]);
  // const columnFieldLookup = useMemo<ColumnLookup>(() => toLookup(logger, allColumns), [columns, options]);
  // const visibleColumns = useMemo<Columns>(() => filterVisible(logger, allColumns), [columns, options, apiRef]);
  // const columnsMeta = useMemo<ColumnsMeta>(() => toMeta(logger, visibleColumns), [columns, options]);

  const state = useMemo(()=> resetState(columns, options, logger, apiRef), [columns, options, apiRef]);
  const [internalColumns, setInternalColumns] = useState<InternalColumns>(state);
  const stateRef = useRef<InternalColumns>(state);

  const updateState = (newState, emit = true)=> {
    setInternalColumns(newState);
    stateRef.current = newState;
    if (apiRef.current && emit) {
      apiRef.current.emit(COLUMNS_UPDATED, newState.all);
    }
  };

  useEffect(() => {
    logger.debug('Columns have changed.');
    const newState = resetState(columns, options, logger, apiRef);
    updateState(newState);
  }, [columns, options]);

  const getColumnFromField: (field: string) => ColDef = field => stateRef.current.lookup[field];
  const getAllColumns: () => Columns = () => stateRef.current.all;
  const getColumnsMeta: () => ColumnsMeta = () => stateRef.current.meta;
  const getColumnIndex: (field: string) => number = (field) => stateRef.current.visible.findIndex(c=> c.field === field);
  const getColumnPosition: (field: string) => number = (field) => {
    const index = getColumnIndex(field);
    return stateRef.current.meta.positions[index];
  };
  const getVisibleColumns: () => Columns = () => stateRef.current.visible;

  const updateColumn = (col: ColDef)=> {
    const newState = getUpdatedColumnState(logger, stateRef.current, col);
    updateState(newState, false);
  };

  const onSortedColumns = (sortModel: SortModel) => {
    logger.debug('Sort model changed to ', sortModel);
    stateRef.current.all.forEach(c => (c.sortDirection = null));

    //We mutate state here to avoid rebuilding all state, as they are all pointing to the same ref internally
    //TODO refactor this to create a new object ref
    sortModel.forEach((model, index) => {
      const col = { ...stateRef.current.lookup[model.colId] };
      col.sortIndex = sortModel.length > 1 ? index + 1 : undefined;
      col.sortDirection = model.sort;
      updateColumn(col);
    });
    rafUpdate();
  };

  useEffect(() => {
    if (apiRef && apiRef.current) {
      logger.debug('Adding column api to apiRef');

      const colApi: ColumnApi = {
        getColumnFromField,
        getAllColumns,
        getColumnIndex,
        getColumnPosition,
        getVisibleColumns,
        getColumnsMeta,
        updateColumn,
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
