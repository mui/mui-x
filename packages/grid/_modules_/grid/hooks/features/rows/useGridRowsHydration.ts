import * as React from 'react';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEvents } from '../../../models/events/gridEvents';
import { useGridState } from '../../utils/useGridState';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridRowsHydrationApi } from '../../../models/api/gridRowsHydrationApi';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { getCurrentPageRows } from '../../utils/useCurrentPageRows';
import { GridPreProcessingGroup } from '../../core/preProcessing';
import { GridEventListener } from '../../../models/events/gridEventListener';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridRowId } from '../../../models/gridRows';
import {
  GridRowHeightParams,
  GridRowHeightReturnValue,
} from '../../../models/params/gridRowParams';

/**
 * @requires useGridRowGroupsPreProcessing (method)
 * @requires useGridPageSize (method)
 * @requires useGridPage (method)
 */
export const useGridRowsHydration = (
  apiRef: GridApiRef,
  props: Pick<DataGridProcessedProps, 'getRowHeight' | 'pagination' | 'paginationMode'>,
): void => {
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const rowsHeightCollection = React.useRef(new Map<GridRowId, number>());

  const hydrateRowsMeta = React.useCallback(
    (getRowHeight?: (params: GridRowHeightParams) => GridRowHeightReturnValue) => {
      const { rows } = getCurrentPageRows(apiRef.current.state, {
        pagination: props.pagination,
        paginationMode: props.paginationMode,
      });

      setGridState((state) => {
        const positions: number[] = [];
        const totalHeight = rows.reduce((acc: number, row) => {
          positions.push(acc);
          let targetRowHeight = state.density?.rowHeight;

          if (getRowHeight) {
            // Default back to base rowHeight if getRowHeight returns null or undefined.
            targetRowHeight =
              getRowHeight({ ...row.model, densityFactor: state.density?.factor }) ||
              state.density?.rowHeight;
          }

          const heights = apiRef.current.unstable_applyPreProcessors(
            GridPreProcessingGroup.rowHeight,
            { base: targetRowHeight }, // We use an object to make simple to check if a size was already added or not
            row,
          ) as Record<string, number>;

          const finalRowHeight = Object.values(heights).reduce((acc2, value) => acc2 + value, 0);
          rowsHeightCollection.current.set(row.id, finalRowHeight);

          return acc + finalRowHeight;
        }, 0);

        return {
          ...state,
          rows: {
            ...state.rows,
            meta: { totalHeight, positions },
          },
        };
      });
      forceUpdate();
    },
    [apiRef, props.pagination, props.paginationMode, setGridState, forceUpdate],
  );

  const handlePreProcessorRegister = React.useCallback<
    GridEventListener<GridEvents.preProcessorRegister>
  >(
    (name) => {
      if (name === GridPreProcessingGroup.rowHeight) {
        hydrateRowsMeta(props.getRowHeight);
      }
    },
    [hydrateRowsMeta, props.getRowHeight],
  );

  const getTargetRowHeight = (rowId: GridRowId): number =>
    rowsHeightCollection.current.get(rowId) || gridState.density.rowHeight;

  // The effect is used to build the rows meta data - totalHeight and positions.
  // Because of variable row height this is needed for the virtualization
  React.useEffect(() => {
    hydrateRowsMeta(props.getRowHeight);
  }, [
    gridState.density,
    gridState.filter,
    gridState.pagination,
    gridState.sorting,
    props.getRowHeight,
    hydrateRowsMeta,
  ]);

  useGridApiEventHandler(apiRef, GridEvents.preProcessorRegister, handlePreProcessorRegister);

  const rowsHydrationApi: GridRowsHydrationApi = {
    unstable_getTargetRowHeight: getTargetRowHeight,
  };

  useGridApiMethod(apiRef, rowsHydrationApi, 'GridRowsHydrationApi');
};
