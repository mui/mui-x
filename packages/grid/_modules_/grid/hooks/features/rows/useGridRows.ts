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
import { useLogger } from '../../utils/useLogger';
import { useGridState } from '../core/useGridState';
import { getInitialGridRowState, InternalGridRowsState } from './gridRowsState';
import { useGridSelector } from '../core/useGridSelector';
import { gridRowsStateSelector } from './gridRowsSelector';

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
    ...getInitialGridRowState(),
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
  const logger = useLogger('useGridRows');
  const [, setGridState, updateComponent] = useGridState(apiRef);
  const stateRows = useGridSelector(apiRef, gridRowsStateSelector);
  const updateTimeout = React.useRef<any>();

  const forceUpdate = React.useCallback(
    (preUpdateCallback?: Function) => {
      if (updateTimeout.current == null) {
        updateTimeout.current = setTimeout(() => {
          logger.debug(`Updating component`);
          updateTimeout.current = null;
          if (preUpdateCallback) {
            preUpdateCallback();
          }
          updateComponent();
        }, 100);
      }
    },
    [logger, updateComponent],
  );

  const internalRowsState = React.useRef<InternalGridRowsState>(stateRows);

  React.useEffect(() => {
    return () => clearTimeout(updateTimeout!.current);
  }, []);

  React.useEffect(() => {
    setGridState((state) => {
      internalRowsState.current = convertGridRowsPropToState(
        props.rows,
        props.rowCount,
        props.getRowId,
      );

      return { ...state, rows: internalRowsState.current };
    });
  }, [props.getRowId, props.rows, props.rowCount, setGridState]);

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

  const setRows = React.useCallback(
    (allNewRows: GridRowModel[]) => {
      logger.debug(`updating all rows, new length ${allNewRows.length}`);

      if (internalRowsState.current.allRows.length > 0) {
        apiRef.current.publishEvent(GridEvents.rowsClear);
      }

      const allRows: GridRowId[] = [];
      const idRowsLookup = allNewRows.reduce((acc, row) => {
        const id = getGridRowId(row, props.getRowId);
        acc[id] = row;
        allRows.push(id);
        return acc;
      }, {});

      const totalRowCount =
        props.rowCount && props.rowCount > allRows.length ? props.rowCount : allRows.length;

      internalRowsState.current = { idRowsLookup, allRows, totalRowCount };

      setGridState((state) => ({ ...state, rows: internalRowsState.current }));

      forceUpdate(() => apiRef.current.publishEvent(GridEvents.rowsSet));
    },
    [logger, setGridState, forceUpdate, apiRef, props.getRowId, props.rowCount],
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
      forceUpdate(() => apiRef.current.publishEvent(GridEvents.rowsUpdate));
    },
    [apiRef, forceUpdate, getRow, props.getRowId, setGridState, setRows],
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
