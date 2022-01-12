import * as React from 'react';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEvents } from '../../../models/events/gridEvents';
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
import { useGridSelector } from '../../utils/useGridSelector';
import {
  gridDensityRowHeightSelector,
  gridDensityFactorSelector,
} from '../density/densitySelector';
import { gridFilterStateSelector } from '../filter/gridFilterSelector';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { gridSortingStateSelector } from '../sorting/gridSortingSelector';

/**
 * @requires useGridRowGroupsPreProcessing (method)
 * @requires useGridPageSize (method)
 * @requires useGridPage (method)
 */
export const useGridRowsHydration = (
  apiRef: GridApiRef,
  props: Pick<DataGridProcessedProps, 'getRowHeight' | 'pagination' | 'paginationMode'>,
): void => {
  const rowsHeightLookup = React.useRef<{ [key: GridRowId]: number }>({});
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const filter = useGridSelector(apiRef, gridFilterStateSelector);
  const pagination = useGridSelector(apiRef, gridPaginationSelector);
  const sorting = useGridSelector(apiRef, gridSortingStateSelector);

  const hydrateRowsMeta = React.useCallback(
    (getRowHeight?: (params: GridRowHeightParams) => GridRowHeightReturnValue) => {
      const { rows } = getCurrentPageRows(apiRef.current.state, {
        pagination: props.pagination,
        paginationMode: props.paginationMode,
      });

      apiRef.current.setState((state) => {
        const positions: number[] = [];
        const totalHeight = rows.reduce((acc: number, row) => {
          positions.push(acc);
          let targetRowHeight = gridDensityRowHeightSelector(state);

          if (getRowHeight) {
            // Default back to base rowHeight if getRowHeight returns null or undefined.
            targetRowHeight =
              getRowHeight({ ...row, densityFactor: gridDensityFactorSelector(state) }) ||
              gridDensityRowHeightSelector(state);
          }

          const heights = apiRef.current.unstable_applyPreProcessors(
            GridPreProcessingGroup.rowHeight,
            { base: targetRowHeight }, // We use an object to make simple to check if a size was already added or not
            row,
          ) as Record<string, number>;

          const finalRowHeight = Object.values(heights).reduce((acc2, value) => acc2 + value, 0);
          rowsHeightLookup.current[row.id] = finalRowHeight;

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
      apiRef.current.forceUpdate();
    },
    [apiRef, props.pagination, props.paginationMode],
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
    rowsHeightLookup.current[rowId] || rowHeight;

  // The effect is used to build the rows meta data - totalHeight and positions.
  // Because of variable row height this is needed for the virtualization
  React.useEffect(() => {
    hydrateRowsMeta(props.getRowHeight);
  }, [rowHeight, filter, pagination, sorting, props.getRowHeight, hydrateRowsMeta]);

  useGridApiEventHandler(apiRef, GridEvents.preProcessorRegister, handlePreProcessorRegister);

  const rowsHydrationApi: GridRowsHydrationApi = {
    unstable_getTargetRowHeight: getTargetRowHeight,
  };

  useGridApiMethod(apiRef, rowsHydrationApi, 'GridRowsHydrationApi');
};
