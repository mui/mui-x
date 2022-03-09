import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridRowsMetaApi } from '../../../models/api/gridRowsMetaApi';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { getCurrentPageRows } from '../../utils/useCurrentPageRows';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridRowId } from '../../../models/gridRows';
import { useGridSelector } from '../../utils/useGridSelector';
import {
  gridDensityRowHeightSelector,
  gridDensityFactorSelector,
} from '../density/densitySelector';
import { gridFilterStateSelector } from '../filter/gridFilterSelector';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { gridSortingStateSelector } from '../sorting/gridSortingSelector';
import { GridEventListener } from '../../../models/events/gridEventListener';
import { GridEvents } from '../../../models/events/gridEvents';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

export const rowsMetaStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  rowsMeta: {
    currentPageTotalHeight: 0,
    positions: [],
  },
});

/**
 * @requires useGridPageSize (method)
 * @requires useGridPage (method)
 */
export const useGridRowsMeta = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<DataGridProcessedProps, 'getRowHeight' | 'pagination' | 'paginationMode'>,
): void => {
  const { getRowHeight, pagination, paginationMode } = props;
  const rowsHeightLookup = React.useRef<{
    [key: GridRowId]: { value: number; isResized: boolean };
  }>({});
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const filterState = useGridSelector(apiRef, gridFilterStateSelector);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const sortingState = useGridSelector(apiRef, gridSortingStateSelector);

  const hydrateRowsMeta = React.useCallback(() => {
    const { rows } = getCurrentPageRows(apiRef, {
      pagination,
      paginationMode,
    });

    apiRef.current.setState((state) => {
      const positions: number[] = [];
      const densityFactor = gridDensityFactorSelector(state, apiRef.current.instanceId);
      const currentRowHeight = gridDensityRowHeightSelector(state, apiRef.current.instanceId);
      const currentPageTotalHeight = rows.reduce((acc: number, row) => {
        positions.push(acc);
        let baseRowHeight: number;

        const isResized =
          (rowsHeightLookup.current[row.id] && rowsHeightLookup.current[row.id].isResized) || false;

        if (isResized) {
          // do not recalculate resized row height and use the value from the lookup
          baseRowHeight = rowsHeightLookup.current[row.id].value;
        } else {
          baseRowHeight = currentRowHeight;

          if (getRowHeight) {
            // Default back to base rowHeight if getRowHeight returns null or undefined.
            baseRowHeight = getRowHeight({ ...row, densityFactor }) ?? currentRowHeight;
          }
        }

        const heights = apiRef.current.unstable_applyPreProcessors(
          'rowHeight',
          { base: baseRowHeight }, // We use an object to make simple to check if a size was already added or not
          row,
        ) as Record<string, number>;

        const finalRowHeight = Object.values(heights).reduce((acc2, value) => acc2 + value, 0);

        rowsHeightLookup.current[row.id] = {
          value: baseRowHeight,
          isResized,
        };

        return acc + finalRowHeight;
      }, 0);

      return {
        ...state,
        rowsMeta: { currentPageTotalHeight, positions },
      };
    });
    apiRef.current.forceUpdate();
  }, [apiRef, pagination, paginationMode, getRowHeight]);

  const getTargetRowHeight = (rowId: GridRowId): number =>
    rowsHeightLookup.current[rowId]?.value || rowHeight;

  const setRowHeight = React.useCallback<GridRowsMetaApi['unstable_setRowHeight']>(
    (id: GridRowId, height: number) => {
      rowsHeightLookup.current[id] = {
        value: height,
        isResized: true,
      };
      hydrateRowsMeta();
    },
    [hydrateRowsMeta],
  );

  // The effect is used to build the rows meta data - currentPageTotalHeight and positions.
  // Because of variable row height this is needed for the virtualization
  React.useEffect(() => {
    hydrateRowsMeta();
  }, [rowHeight, filterState, paginationState, sortingState, hydrateRowsMeta]);

  const handlePreProcessorRegister = React.useCallback<
    GridEventListener<GridEvents.preProcessorRegister>
  >(
    (name) => {
      if (name !== 'rowHeight') {
        return;
      }
      hydrateRowsMeta();
    },
    [hydrateRowsMeta],
  );

  useGridApiEventHandler(apiRef, GridEvents.preProcessorRegister, handlePreProcessorRegister);

  const rowsMetaApi: GridRowsMetaApi = {
    unstable_getRowHeight: getTargetRowHeight,
    unstable_setRowHeight: setRowHeight,
  };

  useGridApiMethod(apiRef, rowsMetaApi, 'GridRowsMetaApi');
};
