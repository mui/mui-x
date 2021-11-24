import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridRowApi } from '../../../models/api/gridRowApi';
import {
  checkGridRowIdIsValid,
  GridRowModel,
  GridRowId,
  GridRowsProp,
  GridRowIdGetter,
  GridRowTreeNodeConfig,
} from '../../../models/gridRows';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridState } from '../../utils/useGridState';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { GridRowsState } from './gridRowsState';
import {
  gridRowCountSelector,
  gridRowsLookupSelector,
  gridRowTreeSelector,
  gridRowIdsSelector,
} from './gridRowsSelector';
import { GridSignature, useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridRowGroupParams } from '../../core/rowGroupsPerProcessing';

interface GridRowsInternalCacheState {
  value: GridRowGroupParams;

  /**
   * The value of the properties used by the grouping when the internal cache was created
   * We are storing it instead of accessing it directly when storing the cache to avoid synchronization issues
   */
  props: Pick<GridComponentProps, 'rowCount' | 'getRowId'>;

  /**
   * The rows as they were the last time all the rows have been updated at once
   * It is used to avoid processing several time the same set of rows
   */
  rowsBeforePartialUpdates: GridRowsProp;
}

interface GridRowsInternalCache {
  state: GridRowsInternalCacheState;
  timeout: NodeJS.Timeout | null;
  lastUpdateMs: number;
}

function getGridRowId(
  rowModel: GridRowModel,
  getRowId?: GridRowIdGetter,
  detailErrorMessage?: string,
): GridRowId {
  const id = getRowId ? getRowId(rowModel) : rowModel.id;
  checkGridRowIdIsValid(id, rowModel, detailErrorMessage);
  return id;
}

interface ConvertGridRowsPropToStateParams {
  prevState: GridRowsInternalCacheState;
  props?: Pick<GridComponentProps, 'rowCount' | 'getRowId'>;
  rows?: GridRowsProp;
}

const convertGridRowsPropToState = ({
  prevState,
  rows,
  props: inputProps,
}: ConvertGridRowsPropToStateParams): GridRowsInternalCacheState => {
  const props = inputProps ?? prevState.props;

  let value: GridRowGroupParams;
  if (rows) {
    value = {
      idRowsLookup: {},
      ids: [],
    };
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const id = getGridRowId(row, props.getRowId);
      value.idRowsLookup[id] = row;
      value.ids.push(id);
    }
  } else {
    value = prevState.value;
  }

  return {
    value,
    props,
    rowsBeforePartialUpdates: rows ?? prevState.rowsBeforePartialUpdates,
  };
};

const getRowsStateFromCache = (
  rowsCache: GridRowsInternalCache,
  apiRef: GridApiRef,
): GridRowsState => {
  const {
    props: { rowCount: propRowCount = 0 },
    value,
  } = rowsCache.state;

  const groupingResponse = apiRef.current.unstable_groupRows(value);

  const dataTopLevelRowCount = Object.values(groupingResponse.tree).filter(
    (node) => node.parent == null,
  ).length;
  const totalRowCount =
    propRowCount > groupingResponse.ids.length ? propRowCount : groupingResponse.ids.length;
  const totalTopLevelRowCount =
    propRowCount > dataTopLevelRowCount ? propRowCount : dataTopLevelRowCount;

  return { ...groupingResponse, totalRowCount, totalTopLevelRowCount };
};

/**
 * @requires useGridRowGroupsPreProcessing (method)
 */
export const useGridRows = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'rows' | 'getRowId' | 'rowCount' | 'throttleRowsMs' | 'signature'
  >,
): void => {
  if (process.env.NODE_ENV !== 'production') {
    // Freeze rows for immutability
    Object.freeze(props.rows);
  }

  const logger = useGridLogger(apiRef, 'useGridRows');
  const rowsCache = React.useRef<GridRowsInternalCache>({
    state: {
      value: {
        idRowsLookup: {},
        ids: [],
      },
      props: {
        rowCount: undefined,
        getRowId: undefined,
      },
      rowsBeforePartialUpdates: [],
    },
    timeout: null,
    lastUpdateMs: 0,
  });

  useGridStateInit(apiRef, (state) => {
    rowsCache.current.state = convertGridRowsPropToState({
      rows: props.rows,
      props: {
        rowCount: props.rowCount,
        getRowId: props.getRowId,
      },
      prevState: rowsCache.current.state,
    });
    rowsCache.current.lastUpdateMs = Date.now();

    return { ...state, rows: getRowsStateFromCache(rowsCache.current, apiRef) };
  });

  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const getRow = React.useCallback<GridRowApi['getRow']>(
    (id) => gridRowsLookupSelector(apiRef.current.state)[id] ?? null,
    [apiRef],
  );

  const throttledRowsChange = React.useCallback(
    (newState: GridRowsInternalCacheState, throttle: boolean) => {
      const run = () => {
        rowsCache.current.timeout = null;
        rowsCache.current.lastUpdateMs = Date.now();
        setGridState((state) => ({
          ...state,
          rows: getRowsStateFromCache(rowsCache.current, apiRef),
        }));
        apiRef.current.publishEvent(GridEvents.rowsSet);
        forceUpdate();
      };

      if (rowsCache.current.timeout) {
        clearTimeout(rowsCache.current.timeout);
      }

      rowsCache.current.state = newState;
      rowsCache.current.timeout = null;

      if (!throttle) {
        run();
        return;
      }

      const throttleRemainingTimeMs =
        props.throttleRowsMs - (Date.now() - rowsCache.current.lastUpdateMs);
      if (throttleRemainingTimeMs > 0) {
        rowsCache.current.timeout = setTimeout(run, throttleRemainingTimeMs);
        return;
      }

      run();
    },
    [apiRef, forceUpdate, setGridState, rowsCache, props.throttleRowsMs],
  );

  const setRows = React.useCallback<GridRowApi['setRows']>(
    (rows) => {
      logger.debug(`Updating all rows, new length ${rows.length}`);
      throttledRowsChange(
        convertGridRowsPropToState({ rows, prevState: rowsCache.current.state }),
        true,
      );
    },
    [logger, throttledRowsChange],
  );

  const updateRows = React.useCallback<GridRowApi['updateRows']>(
    (updates) => {
      if (props.signature === GridSignature.DataGrid && updates.length > 1) {
        // TODO: Add test with direct call to `apiRef.current.updateRows` in DataGrid after enabling the `apiRef` on the free plan.
        throw new Error(
          [
            "MUI: You can't update several rows at once in `apiRef.current.updateRows` on the DataGrid.",
            'You need to upgrade to the DataGridPro component to unlock this feature.',
          ].join('\n'),
        );
      }

      // we removes duplicate updates. A server can batch updates, and send several updates for the same row in one fn call.
      const uniqUpdates = new Map<GridRowId, GridRowModel>();

      updates.forEach((update) => {
        const id = getGridRowId(
          update,
          props.getRowId,
          'A row was provided without id when calling updateRows():',
        );

        if (uniqUpdates.has(id)) {
          uniqUpdates.set(id, { ...uniqUpdates.get(id), ...update });
        } else {
          uniqUpdates.set(id, update);
        }
      });

      const deletedRowIds: GridRowId[] = [];

      const newStateValue: GridRowGroupParams = {
        idRowsLookup: { ...rowsCache.current.state.value.idRowsLookup },
        ids: [...rowsCache.current.state.value.ids],
      };

      uniqUpdates.forEach((partialRow, id) => {
        // eslint-disable-next-line no-underscore-dangle
        if (partialRow._action === 'delete') {
          delete newStateValue.idRowsLookup[id];
          deletedRowIds.push(id);
          return;
        }

        const oldRow = apiRef.current.getRow(id);
        if (!oldRow) {
          newStateValue.idRowsLookup[id] = partialRow;
          newStateValue.ids.push(id);
          return;
        }

        newStateValue.idRowsLookup[id] = { ...apiRef.current.getRow(id), ...partialRow };
      });

      if (deletedRowIds.length > 0) {
        newStateValue.ids = newStateValue.ids.filter((id) => !deletedRowIds.includes(id));
      }

      const state: GridRowsInternalCacheState = {
        ...rowsCache.current.state,
        value: newStateValue,
      };

      throttledRowsChange(state, true);
    },
    [apiRef, props.getRowId, throttledRowsChange, props.signature],
  );

  const getRowModels = React.useCallback<GridRowApi['getRowModels']>(() => {
    const allRows = gridRowIdsSelector(apiRef.current.state);
    const idRowsLookup = gridRowsLookupSelector(apiRef.current.state);

    return new Map(allRows.map((id) => [id, idRowsLookup[id]]));
  }, [apiRef]);

  const getRowsCount = React.useCallback<GridRowApi['getRowsCount']>(
    () => gridRowCountSelector(apiRef.current.state),
    [apiRef],
  );

  const getAllRowIds = React.useCallback<GridRowApi['getAllRowIds']>(
    () => gridRowIdsSelector(apiRef.current.state),
    [apiRef],
  );

  const setRowChildrenExpansion = React.useCallback<GridRowApi['setRowChildrenExpansion']>(
    (id, isExpanded) => {
      const currentNode = apiRef.current.getRowNode(id);
      if (!currentNode) {
        throw new Error(`MUI: No row with id #${id} found`);
      }
      const newNode: GridRowTreeNodeConfig = { ...currentNode, childrenExpanded: isExpanded };
      setGridState((state) => {
        return {
          ...state,
          rows: {
            ...state.rows,
            tree: { ...state.rows.tree, [id]: newNode },
          },
        };
      });
      forceUpdate();
      apiRef.current.publishEvent(GridEvents.rowExpansionChange, newNode);
    },
    [apiRef, setGridState, forceUpdate],
  );

  const getRowNode = React.useCallback<GridRowApi['getRowNode']>(
    (id) => gridRowTreeSelector(apiRef.current.state)[id] ?? null,
    [apiRef],
  );

  React.useEffect(() => {
    return () => {
      if (rowsCache.current.timeout !== null) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        clearTimeout(rowsCache.current.timeout);
      }
    };
  }, []);

  // The effect do not track any value defined synchronously during the 1st render by hooks called after `useGridRows`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // The new rows have already been applied (most likely in the `GridEvents.rowGroupsPreProcessingChange` listener)
    if (rowsCache.current.state.rowsBeforePartialUpdates === props.rows) {
      return;
    }

    logger.debug(`Updating all rows, new length ${props.rows.length}`);
    throttledRowsChange(
      convertGridRowsPropToState({
        rows: props.rows,
        props: { rowCount: props.rowCount, getRowId: props.getRowId },
        prevState: rowsCache.current.state,
      }),
      false,
    );
  }, [props.rows, props.rowCount, props.getRowId, logger, throttledRowsChange]);

  const handleGroupRows = React.useCallback(() => {
    logger.info(`Row grouping pre-processing have changed, regenerating the row tree`);

    let rows: GridRowsProp | undefined;
    if (rowsCache.current.state.rowsBeforePartialUpdates === props.rows) {
      // The `props.rows` has not changed since the last row grouping
      // We can keep the potential updates stored in `inputRowsAfterUpdates` on the new grouping
      rows = undefined;
    } else {
      // The `props.rows` has changed since the last row grouping
      // We must use the new `props.rows` on the new grouping
      // This occurs because this event is triggered before the `useEffect` on the rows when both the grouping pre-processing and the rows changes on the same render
      rows = props.rows;
    }
    throttledRowsChange(
      convertGridRowsPropToState({
        rows,
        props: { rowCount: props.rowCount, getRowId: props.getRowId },
        prevState: rowsCache.current.state,
      }),
      false,
    );
  }, [logger, throttledRowsChange, props.rowCount, props.getRowId, props.rows]);

  useGridApiEventHandler(apiRef, GridEvents.rowGroupsPreProcessingChange, handleGroupRows);

  const rowApi: GridRowApi = {
    getRow,
    getRowModels,
    getRowsCount,
    getAllRowIds,
    setRows,
    updateRows,
    setRowChildrenExpansion,
    getRowNode,
  };

  useGridApiMethod(apiRef, rowApi, 'GridRowApi');
};
