import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createRow,
  GridOptions,
  RowData,
  RowId,
  RowModel,
  Rows,
  RowsProp,
  GridApiRef,
} from '../../models';
import { useLogger } from '../utils/useLogger';
import { useRafUpdate } from '../utils';
import {
  ROWS_UPDATED,
  SCROLLING_START,
  SCROLLING_STOP,
  SORT_MODEL_UPDATED,
} from '../../constants/eventsConstants';
import { useApiMethod } from './useApiMethod';
import { useApiEventHandler } from './useApiEventHandler';
import { RowApi } from '../../models/api/rowApi';

type IdLookup = { [key: string]: number };

export const useRows = (
  options: GridOptions,
  rows: RowsProp,
  initialised: boolean,
  apiRef: GridApiRef,
): RowModel[] => {
  const logger = useLogger('useRows');
  const rowModels = useMemo(() => rows.map((r) => createRow(r)), [rows]);
  const [rowModelsState, setRowModelsState] = useState<RowModel[]>(rowModels);
  const [, forceUpdate] = useState();
  const [rafUpdate] = useRafUpdate(() => forceUpdate((p: any) => !p));

  const idLookupRef = useRef({});
  const rowModelsRef = useRef<RowModel[]>(rowModels);
  const isScrollingRef = useRef<boolean>(false);
  const isSortedRef = useRef<boolean>(false);

  const setIsScrolling = useCallback(
    (v: boolean) => {
      isScrollingRef.current = v;
    },
    [isScrollingRef],
  );

  const updateAllRows = useCallback(
    (allNewRows: RowModel[]) => {
      logger.debug(`updating all rows, new length ${allNewRows.length}`);
      idLookupRef.current = allNewRows.reduce((lookup, row, index) => {
        lookup[row.id] = index;
        return lookup;
      }, {} as IdLookup);
      rowModelsRef.current = allNewRows;
      if (!isScrollingRef.current) {
        logger.info(`Setting row models to new rows with length ${allNewRows.length}`);
        setRowModelsState((p) => allNewRows);
      }
    },
    [logger, idLookupRef, rowModelsRef, setRowModelsState],
  );

  useEffect(() => {
    logger.info('Updating Rows.');
    isScrollingRef.current = false;
    updateAllRows(rowModels);
  }, [rows, logger, rowModels, updateAllRows]);

  const getRowsLookup = useCallback(() => idLookupRef.current as IdLookup, [idLookupRef]);
  const getRowIndexFromId = useCallback((id: RowId): number => getRowsLookup()[id], [
    getRowsLookup,
  ]);
  const getRowIdFromRowIndex = useCallback(
    (index: number): RowId => Object.entries(getRowsLookup())[index][0],
    [getRowsLookup],
  );
  const getRowFromId = useCallback(
    (id: RowId): RowModel => rowModelsRef.current[getRowIndexFromId(id)],
    [rowModelsRef, getRowIndexFromId],
  );

  const updateRowModels = useCallback(
    (updates: Partial<RowModel>[]) => {
      logger.debug(`updating ${updates.length} row models`);
      const addedRows: RowModel[] = [];
      updates.forEach((partialRow) => {
        if (partialRow.id == null) {
          throw new Error('Material-UI: All rows need an id.');
        }
        const idx = getRowIndexFromId(partialRow.id);
        if (idx == null) {
          // New row?
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
    },
    [apiRef, updateAllRows, rafUpdate, getRowIndexFromId, logger],
  );

  const updateRowData = useCallback(
    (updates: RowData[]) => {
      logger.debug(`updating rows data`);

      // we removes duplicate updates. A server can batch updates, and send several updates for the same row in one fn call.
      const uniqUpdates = updates.reduce((uniq, update) => {
        uniq[update.id] = uniq[update.id] != null ? { ...uniq[update.id], ...update } : update;
        return uniq;
      }, {} as { [id: string]: any });

      const rowModelUpdates = Object.values<RowData>(uniqUpdates).map((partialRow) => {
        const oldRow = getRowFromId(partialRow.id!);
        if (!oldRow) {
          return createRow(partialRow);
        }
        return { ...oldRow, data: { ...oldRow.data, ...partialRow } };
      });
      return updateRowModels(rowModelUpdates);
    },
    [updateRowModels, logger, getRowFromId],
  );

  const onSortModelUpdated = useCallback(
    (sortModel: any[]) => {
      isSortedRef.current = sortModel.length > 0;
    },
    [isSortedRef],
  );

  const getRowModels = useCallback(() => rowModelsRef.current, [rowModelsRef]);
  const getRowsCount = useCallback(() => rowModelsRef.current.length, [rowModelsRef]);
  const getAllRowIds = useCallback(() => rowModelsRef.current.map((r) => r.id), [rowModelsRef]);
  const setRowModels = useCallback((rowsParam: Rows) => updateAllRows(rowsParam), [updateAllRows]);

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

  useApiMethod(apiRef, rowApi, 'RowApi');

  const startScrollingHandler = useCallback(() => setIsScrolling(true), [setIsScrolling]);
  const stopScrollingHandler = useCallback(() => setIsScrolling(false), [setIsScrolling]);

  useApiEventHandler(apiRef, SCROLLING_START, startScrollingHandler);
  useApiEventHandler(apiRef, SCROLLING_STOP, stopScrollingHandler);
  useApiEventHandler(apiRef, SORT_MODEL_UPDATED, onSortModelUpdated);

  return rowModelsState;
};
