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
    const { rows } = getCurrentPageRows(apiRef.current.state, {
      pagination,
      paginationMode,
    });

    apiRef.current.setState((state) => {
      const positions: number[] = [];
      const densityFactor = gridDensityFactorSelector(state);
      const currentRowHeight = gridDensityRowHeightSelector(state);
      const currentPageTotalHeight = rows.reduce((acc: number, row) => {
        positions.push(acc);
        let targetRowHeight = currentRowHeight;

        if (getRowHeight) {
          // Default back to base rowHeight if getRowHeight returns null or undefined.
          targetRowHeight = getRowHeight({ ...row, densityFactor }) ?? currentRowHeight;
        }

        rowsHeightLookup.current[row.id] = targetRowHeight;

        return acc + targetRowHeight;
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

  const rowsMetaApi: GridRowsMetaApi = {
    unstable_getRowHeight: getTargetRowHeight,
  };

  useGridApiMethod(apiRef, rowsMetaApi, 'GridRowsMetaApi');
};
