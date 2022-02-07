import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
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
import { useGridStateInit } from '../../utils/useGridStateInit';
import { GridEventListener } from '../../../models/events/gridEventListener';
import { GridEvents } from '../../../models/events/gridEvents';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';

/**
 * @requires useGridPageSize (method)
 * @requires useGridPage (method)
 */
export const useGridRowsMeta = (
  apiRef: GridApiRef,
  props: Pick<DataGridProcessedProps, 'getRowHeight' | 'pagination' | 'paginationMode'>,
): void => {
  const { getRowHeight, pagination, paginationMode } = props;
  const rowsHeightLookup = React.useRef<{ [key: GridRowId]: number }>({});
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const filterState = useGridSelector(apiRef, gridFilterStateSelector);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const sortingState = useGridSelector(apiRef, gridSortingStateSelector);

  useGridStateInit(apiRef, (state) => ({
    ...state,
    rowsMeta: {
      currentPageTotalHeight: 0,
      positions: [],
    },
  }));

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
        let baseRowHeight = currentRowHeight;

        if (getRowHeight) {
          // Default back to base rowHeight if getRowHeight returns null or undefined.
          baseRowHeight = getRowHeight({ ...row, densityFactor }) ?? currentRowHeight;
        }

        const heights = apiRef.current.unstable_applyPreProcessors(
          'rowHeight',
          { base: baseRowHeight }, // We use an object to make simple to check if a size was already added or not
          row,
        ) as Record<string, number>;

        const finalRowHeight = Object.values(heights).reduce((acc2, value) => acc2 + value, 0);

        rowsHeightLookup.current[row.id] = baseRowHeight;

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
    rowsHeightLookup.current[rowId] || rowHeight;

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
  };

  useGridApiMethod(apiRef, rowsMetaApi, 'GridRowsMetaApi');
};
