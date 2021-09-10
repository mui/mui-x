import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridRowApi } from '../../../models/api/gridRowApi';
import {
  checkGridRowIdIsValid,
  GridRowModel,
  GridRowModelUpdate,
  GridRowId,
  GridRowsProp,
  GridRowIdGetter,
  GridRowData,
} from '../../../models/gridRows';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridState } from '../core/useGridState';
import { InternalGridRowsState } from './gridRowsState';
import { useGridStateInit } from '../../utils/useGridStateInit';

function getGridRowId(
  rowData: GridRowData,
  getRowId?: GridRowIdGetter,
  detailErrorMessage?: string,
): GridRowId {
  const id = getRowId ? getRowId(rowData) : rowData.id;
  checkGridRowIdIsValid(id, rowData, detailErrorMessage);
  return id;
}

export function convertGridRowsPropToState(
  rows: GridRowsProp,
  totalRowCount?: number,
  rowIdGetter?: GridRowIdGetter,
): InternalGridRowsState {
  const state: InternalGridRowsState = {
    idRowsLookup: {},
    allRows: [],
    totalRowCount: totalRowCount && totalRowCount > rows.length ? totalRowCount : rows.length,
  };

  rows.forEach((rowData) => {
    const id = getGridRowId(rowData, rowIdGetter);
    state.allRows.push(id);
    state.idRowsLookup[id] = rowData;
  });

  return state;
}

/**
 * @requires useGridSorting (method)
 * TODO: Impossible priority - useGridSorting also needs to be after useGridRows (which causes all the existence check for apiRef.current.apiRef.current.getSortedRowIds)
 */
export const useGridRows = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'rows' | 'getRowId' | 'rowCount'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridRows');
  const internalRowsState = React.useRef() as React.MutableRefObject<InternalGridRowsState>;

  useGridStateInit(apiRef, (state) => {
    internalRowsState.current = convertGridRowsPropToState(
      props.rows,
      props.rowCount,
      props.getRowId,
    );

    return { ...state, rows: internalRowsState.current };
  });

  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const updateTimeout = React.useRef<any>();

  const delayedForceUpdate = React.useCallback(
    (preUpdateCallback?: Function) => {
      if (updateTimeout.current == null) {
        updateTimeout.current = setTimeout(() => {
          logger.debug(`Updating component`);
          updateTimeout.current = null;
          if (preUpdateCallback) {
            preUpdateCallback();
          }
          forceUpdate();
        }, 100);
      }
    },
    [logger, forceUpdate],
  );

  const getRowIndexFromId = React.useCallback(
    (id: GridRowId): number => {
      if (apiRef.current.getSortedRowIds) {
        return apiRef.current.getSortedRowIds().indexOf(id);
      }
      return apiRef.current.state.rows.allRows.indexOf(id);
    },
    [apiRef],
  );
  const getRowIdFromRowIndex = React.useCallback(
    (index: number): GridRowId => {
      if (apiRef.current.getSortedRowIds) {
        return apiRef.current.getSortedRowIds()[index];
      }
      return apiRef.current.state.rows.allRows[index];
    },
    [apiRef],
  );
  const getRow = React.useCallback(
    (id: GridRowId): GridRowModel | null => apiRef.current.state.rows.idRowsLookup[id] ?? null,
    [apiRef],
  );

  const setRowsState = React.useCallback(
    (
      rows: GridRowModel[] | readonly GridRowModel[],
      rowCount: GridComponentProps['rowCount'],
      getRowId: GridComponentProps['getRowId'],
      waitBeforeUpdate: boolean,
    ) => {
      logger.debug(`updating all rows, new length ${rows.length}`);

      if (internalRowsState.current.allRows.length > 0) {
        apiRef.current.publishEvent(GridEvents.rowsClear);
      }

      internalRowsState.current = convertGridRowsPropToState(rows, rowCount, getRowId);

      setGridState((state) => ({ ...state, rows: internalRowsState.current }));

      if (waitBeforeUpdate) {
        delayedForceUpdate(() => apiRef.current.publishEvent(GridEvents.rowsSet));
      } else {
        forceUpdate();
        apiRef.current.publishEvent(GridEvents.rowsSet);
      }
    },
    [apiRef, logger, setGridState, forceUpdate, delayedForceUpdate],
  );

  const setRows = React.useCallback<GridRowApi['setRows']>(
    (rows) => setRowsState(rows, props.rowCount, props.getRowId, true),
    [setRowsState, props.rowCount, props.getRowId],
  );

  const updateRows = React.useCallback(
    (updates: GridRowModelUpdate[]) => {
      // we removes duplicate updates. A server can batch updates, and send several updates for the same row in one fn call.
      const uniqUpdates = updates.reduce((acc, update) => {
        const id = getGridRowId(
          update,
          props.getRowId,
          'A row was provided without id when calling updateRows():',
        );
        acc[id] = acc[id] != null ? { ...acc[id!], ...update } : update;
        return acc;
      }, {} as { [id: string]: GridRowModel });

      const addedRows: GridRowModel[] = [];
      const deletedRowIds: GridRowId[] = [];

      let updatedLookup: null | {} = null;
      Object.entries<GridRowModel>(uniqUpdates).forEach(([id, partialRow]) => {
        // eslint-disable-next-line no-underscore-dangle
        if (partialRow._action === 'delete') {
          deletedRowIds.push(id);
          return;
        }

        const oldRow = getRow(id);
        if (!oldRow) {
          addedRows.push(partialRow);
          return;
        }

        if (!updatedLookup) {
          updatedLookup = { ...internalRowsState.current.idRowsLookup };
        }

        updatedLookup[id] = {
          ...oldRow,
          ...partialRow,
        };
      });
      if (updatedLookup) {
        internalRowsState.current.idRowsLookup = updatedLookup;
        setGridState((state) => ({ ...state, rows: { ...internalRowsState.current } }));
      }

      if (deletedRowIds.length > 0 || addedRows.length > 0) {
        deletedRowIds.forEach((id) => {
          delete internalRowsState.current.idRowsLookup[id];
        });
        const newRows = [
          ...Object.values<GridRowModel>(internalRowsState.current.idRowsLookup),
          ...addedRows,
        ];
        setRows(newRows);
      }
      delayedForceUpdate(() => apiRef.current.publishEvent(GridEvents.rowsUpdate));
    },
    [apiRef, delayedForceUpdate, getRow, props.getRowId, setGridState, setRows],
  );

  const getRowModels = React.useCallback(
    () =>
      new Map(
        apiRef.current.state.rows.allRows.map((id) => [
          id,
          apiRef.current.state.rows.idRowsLookup[id],
        ]),
      ),
    [apiRef],
  );
  const getRowsCount = React.useCallback(() => apiRef.current.state.rows.totalRowCount, [apiRef]);
  const getAllRowIds = React.useCallback(() => apiRef.current.state.rows.allRows, [apiRef]);

  React.useEffect(() => {
    return () => clearTimeout(updateTimeout!.current);
  }, []);

  // The effect do not track any value defined synchronously during the 1st render by hooks called after `useGridSorting`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setRowsState(props.rows, props.rowCount, props.getRowId, false);
  }, [setRowsState, props.rows, props.rowCount, props.getRowId]);

  const rowApi: GridRowApi = {
    getRowIndex: getRowIndexFromId,
    getRowIdFromRowIndex,
    getRow,
    getRowModels,
    getRowsCount,
    getAllRowIds,
    setRows,
    updateRows,
  };
  useGridApiMethod(apiRef, rowApi, 'GridRowApi');
};
