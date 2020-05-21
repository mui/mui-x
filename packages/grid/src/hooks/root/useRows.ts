import { createRow, GridOptions, RowData, RowId, RowModel, Rows, RowsProp } from '../../models';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLogger } from '../utils/useLogger';
import { useRafUpdate } from '../utils';
import { GridApi, RowApi } from '../../models/gridApi';
import { GridApiRef } from '../../grid';
import { ROWS_UPDATED, SCROLLING_START, SCROLLING_STOP, SORT_MODEL_UPDATED } from '../../constants/eventsConstants';

type IdLookup = { [key: string]: number };

export const useRows = (options: GridOptions, rows: RowsProp, initialised: boolean, apiRef: GridApiRef): RowModel[] => {
  const logger = useLogger('useRows');
  const rowModels = useMemo(() => rows.map(r => createRow(r)), [rows]);
  const [rowModelsState, setRowModelsState] = useState<RowModel[]>(rowModels);
  const [, forceUpdate] = useState();
  const [rafUpdate] = useRafUpdate(() => forceUpdate((p: any) => !p));

  const idLookupRef = useRef({});
  const rowModelsRef = useRef<RowModel[]>(rowModels);
  const isScrollingRef = useRef<boolean>(false);
  const isSortedRef = useRef<boolean>(false);

  const setIsScrolling = (v: boolean) => (isScrollingRef.current = v);

  const updateAllRows = (allNewRows: RowModel[]) => {
    logger.debug('updating all rows...');
    idLookupRef.current = allNewRows.reduce((lookup, row, index) => {
      lookup[row.id] = index;
      return lookup;
    }, {} as IdLookup);
    rowModelsRef.current = allNewRows;
    if (!isScrollingRef.current) {
      setRowModelsState(allNewRows);
    }
  };

  useEffect(() => {
    logger.debug('Rows updated.');
    updateAllRows(rowModels);
  }, [rows]);

  const getRowsLookup = () => idLookupRef.current as IdLookup;
  const getRowIndexFromId = (id: RowId): number => getRowsLookup()[id];
  const getRowIdFromRowIndex = (index: number): RowId => Object.entries(getRowsLookup())[index][0];
  const getRowFromId = (id: RowId): RowModel => rowModelsRef.current[getRowIndexFromId(id)];

  const updateRowModels = (updates: Partial<RowModel>[]) => {
    logger.debug(`updating row models`, updates);
    const addedRows: RowModel[] = [];
    updates.forEach(partialRow => {
      if (partialRow.id == null) {
        throw new Error(`All rows need an id.`);
      }
      const idx = getRowIndexFromId(partialRow.id);
      if (idx == null) {
        //New row?
        addedRows.push(partialRow as RowModel);
        return;
      }
      Object.assign(rowModelsRef.current[idx], partialRow);
    });

    if (!isScrollingRef.current && !isSortedRef.current) {
      rafUpdate();
    }

    if (addedRows.length > 0) {
      const newRows = [...rowModelsRef.current, ...addedRows];
      updateAllRows(newRows);
    }

    if (apiRef.current) {
      apiRef.current.emit(ROWS_UPDATED, rowModelsRef.current);
    }
  };

  const updateRowData = (updates: RowData[]) => {
    logger.debug(`updating rows data`);

    //we removes duplicate updates. A server can batch updates, and send several updates for the same row in one fn call.
    const uniqUpdates = updates.reduce((uniq, update) => {
      uniq[update.id] = uniq[update.id] != null ? { ...uniq[update.id], ...update } : update;
      return uniq;
    }, {} as { [id: string]: any });

    const rowModelUpdates = Object.values<RowData>(uniqUpdates).map(partialRow => {
      const oldRow = getRowFromId(partialRow.id!);
      if (!oldRow) {
        return createRow(partialRow);
      } else {
        return { ...oldRow, data: { ...oldRow.data, ...partialRow } };
      }
    });
    return updateRowModels(rowModelUpdates);
  };

  const onSortModelUpdated = (sortModel: any[]) => {
    isSortedRef.current = sortModel.length > 0;
  };

  const getRowModels = () => rowModelsRef.current;
  const getRowsCount = () => rowModelsRef.current.length;
  const getAllRowIds = () => rowModelsRef.current.map(r => r.id);
  const setRowModels = (rows: Rows) => updateAllRows(rows);

  useEffect(() => {
    if (apiRef && apiRef.current) {
      logger.debug('Adding row api to apiRef');

      const rowApi: RowApi = {
        getRowIndexFromId,
        getRowIdFromRowIndex,
        getRowFromId,
        updateRowModels,
        updateRowData,
        getRowModels,
        getRowsCount,
        getAllRowIds,
        setRowModels,
      };

      apiRef.current = Object.assign(apiRef.current, rowApi) as GridApi;

      //We stop updating the grid while we scroll.
      const startScrollingHandler = () => setIsScrolling(true);
      const stopScrollingHandler = () => setIsScrolling(false);

      apiRef.current.on(SCROLLING_START, startScrollingHandler);
      apiRef.current.on(SCROLLING_STOP, stopScrollingHandler);
      apiRef.current.on(SORT_MODEL_UPDATED, onSortModelUpdated);

      return () => {
        apiRef.current?.removeListener(SCROLLING_START, startScrollingHandler);
        apiRef.current?.removeListener(SCROLLING_STOP, stopScrollingHandler);
      };
    }
  }, [apiRef]);

  return rowModelsState;
};
