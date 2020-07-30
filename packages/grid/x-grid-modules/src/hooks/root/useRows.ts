import * as React from 'react';
import {
  createRow,
  GridOptions,
  RowData,
  RowId,
  RowModel,
  Rows,
  RowsProp,
  ApiRef,
} from '../../models';
import { useLogger } from '../utils/useLogger';
import { useRafUpdate } from '../utils';
import {
  ROWS_UPDATED,
  SCROLLING_START,
  SCROLLING_STOP,
  COLUMNS_SORTING_CHANGE,
} from '../../constants/eventsConstants';
import { useApiMethod } from './useApiMethod';
import { useApiEventHandler } from './useApiEventHandler';
import { RowApi } from '../../models/api/rowApi';

type IdLookup = { [key: string]: number };

export const useRows = (
  options: GridOptions,
  rows: RowsProp,
  initialised: boolean,
  apiRef: ApiRef,
): RowModel[] => {
  const logger = useLogger('useRows');
  const rowModels = React.useMemo(() => rows.map((r) => createRow(r)), [rows]);
  const [rowModelsState, setRowModelsState] = React.useState<RowModel[]>(rowModels);
  const [, forceUpdate] = React.useState();
  const [rafUpdate] = useRafUpdate(() => forceUpdate((p: any) => !p));

  const idLookupRef = React.useRef({});
  const rowModelsRef = React.useRef<RowModel[]>(rowModels);
  const isScrollingRef = React.useRef<boolean>(false);
  const isSortedRef = React.useRef<boolean>(false);

  const setIsScrolling = React.useCallback(
    (v: boolean) => {
      isScrollingRef.current = v;
    },
    [isScrollingRef],
  );

  const updateAllRows = React.useCallback(
    (allNewRows: RowModel[]) => {
      logger.debug(`updating all rows, new length ${allNewRows.length}`);
      idLookupRef.current = allNewRows.reduce((lookup, row, index) => {
        lookup[row.id] = index;
        return lookup;
      }, {} as IdLookup);
      rowModelsRef.current = allNewRows;
      if (!isScrollingRef.current) {
        logger.info(`Setting row models to new rows with length ${allNewRows.length}`);
        setRowModelsState(() => allNewRows);
      }
    },
    [logger, idLookupRef, rowModelsRef, setRowModelsState],
  );

  React.useEffect(() => {
    logger.info('Updating Rows.');
    isScrollingRef.current = false;
    updateAllRows(rowModels);
  }, [rows, logger, rowModels, updateAllRows]);

  const getRowsLookup = React.useCallback(() => idLookupRef.current as IdLookup, [idLookupRef]);
  const getRowIndexFromId = React.useCallback((id: RowId): number => getRowsLookup()[id], [
    getRowsLookup,
  ]);
  const getRowIdFromRowIndex = React.useCallback(
    (index: number): RowId => Object.entries(getRowsLookup())[index][0],
    [getRowsLookup],
  );
  const getRowFromId = React.useCallback(
    (id: RowId): RowModel => rowModelsRef.current[getRowIndexFromId(id)],
    [rowModelsRef, getRowIndexFromId],
  );

  const updateRowModels = React.useCallback(
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

  const updateRowData = React.useCallback(
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

  const onSortModelUpdated = React.useCallback(
    ({ sortModel }: any) => {
      isSortedRef.current = sortModel.length > 0;
    },
    [isSortedRef],
  );

  const getRowModels = React.useCallback(() => rowModelsRef.current, [rowModelsRef]);
  const getRowsCount = React.useCallback(() => rowModelsRef.current.length, [rowModelsRef]);
  const getAllRowIds = React.useCallback(() => rowModelsRef.current.map((r) => r.id), [
    rowModelsRef,
  ]);
  const setRowModels = React.useCallback((rowsParam: Rows) => updateAllRows(rowsParam), [
    updateAllRows,
  ]);

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

  const startScrollingHandler = React.useCallback(() => setIsScrolling(true), [setIsScrolling]);
  const stopScrollingHandler = React.useCallback(() => setIsScrolling(false), [setIsScrolling]);

  useApiEventHandler(apiRef, SCROLLING_START, startScrollingHandler);
  useApiEventHandler(apiRef, SCROLLING_STOP, stopScrollingHandler);
  useApiEventHandler(apiRef, COLUMNS_SORTING_CHANGE, onSortModelUpdated);

  return rowModelsState;
};
