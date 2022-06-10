import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridRowsMetaApi } from '../../../models/api/gridRowsMetaApi';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
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
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridRegisterPipeApplier } from '../../core/pipeProcessing';

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
  props: Pick<
    DataGridProcessedProps,
    'getRowHeight' | 'getEstimatedRowHeight' | 'getRowSpacing' | 'pagination' | 'paginationMode'
  >,
): void => {
  const { getRowHeight: getRowHeightProp, getRowSpacing, getEstimatedRowHeight } = props;
  const rowsHeightLookup = React.useRef<{
    [key: GridRowId]: {
      isResized: boolean;
      sizes: Record<string, number>;
      autoHeight: boolean; // Determines if the row has dynamic height
      needsFirstMeasurement: boolean; // Determines if the row was never measured. If true, use the estimated height as row height.
    };
  }>({});

  // Inspired by https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/utils/CellSizeAndPositionManager.js
  const lastMeasuredRowIndex = React.useRef(-1);
  const hasRowWithAutoHeight = React.useRef(false);
  const rowHeightFromDensity = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const filterState = useGridSelector(apiRef, gridFilterStateSelector);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const sortingState = useGridSelector(apiRef, gridSortingStateSelector);
  const currentPage = useGridVisibleRows(apiRef, props);

  const hydrateRowsMeta = React.useCallback(() => {
    hasRowWithAutoHeight.current = false;

    const densityFactor = gridDensityFactorSelector(
      apiRef.current.state,
      apiRef.current.instanceId,
    );

    const positions: number[] = [];
    const currentPageTotalHeight = currentPage.rows.reduce((acc, row) => {
      positions.push(acc);

      if (!rowsHeightLookup.current[row.id]) {
        rowsHeightLookup.current[row.id] = {
          sizes: { base: rowHeightFromDensity },
          isResized: false,
          autoHeight: false,
          needsFirstMeasurement: true, // Assume all rows will need to be measured by default
        };
      }

      const { isResized, needsFirstMeasurement, sizes } = rowsHeightLookup.current[row.id];
      let baseRowHeight = rowHeightFromDensity;
      const existingBaseRowHeight = sizes.base;

      if (isResized) {
        // Do not recalculate resized row height and use the value from the lookup
        baseRowHeight = existingBaseRowHeight;
      } else if (getRowHeightProp) {
        const rowHeightFromUser = getRowHeightProp({ ...row, densityFactor });

        if (rowHeightFromUser === 'auto') {
          if (needsFirstMeasurement) {
            const estimatedRowHeight = getEstimatedRowHeight
              ? getEstimatedRowHeight({ ...row, densityFactor })
              : rowHeightFromDensity;

            // If the row was not measured yet use the estimated row height
            baseRowHeight = estimatedRowHeight ?? rowHeightFromDensity;
          } else {
            baseRowHeight = existingBaseRowHeight;
          }

          hasRowWithAutoHeight.current = true;
          rowsHeightLookup.current[row.id].autoHeight = true;
        } else {
          // Default back to base rowHeight if getRowHeight returns null or undefined.
          baseRowHeight = rowHeightFromUser ?? rowHeightFromDensity;
          rowsHeightLookup.current[row.id].needsFirstMeasurement = false;
          rowsHeightLookup.current[row.id].autoHeight = false;
        }
      } else {
        rowsHeightLookup.current[row.id].needsFirstMeasurement = false;
      }

      // We use an object to make simple to check if a height is already added or not
      const initialHeights: Record<string, number> = { base: baseRowHeight };

      if (getRowSpacing) {
        const indexRelativeToCurrentPage = apiRef.current.getRowIndexRelativeToVisibleRows(row.id);

        const spacing = getRowSpacing({
          ...row,
          isFirstVisible: indexRelativeToCurrentPage === 0,
          isLastVisible: indexRelativeToCurrentPage === currentPage.rows.length - 1,
          indexRelativeToCurrentPage,
        });

        initialHeights.spacingTop = spacing.top ?? 0;
        initialHeights.spacingBottom = spacing.bottom ?? 0;
      }

      const processedSizes = apiRef.current.unstable_applyPipeProcessors(
        'rowHeight',
        initialHeights,
        row,
      ) as Record<string, number>;

      rowsHeightLookup.current[row.id].sizes = processedSizes;

      const finalRowHeight = Object.values(processedSizes).reduce((acc2, value) => acc2 + value, 0);
      return acc + finalRowHeight;
    }, 0);

    apiRef.current.setState((state) => {
      return {
        ...state,
        rowsMeta: {
          currentPageTotalHeight,
          positions,
        },
      };
    });

    if (!hasRowWithAutoHeight.current) {
      // No row has height=auto, so all rows are already measured
      lastMeasuredRowIndex.current = Infinity;
    }

    apiRef.current.forceUpdate();
  }, [
    apiRef,
    currentPage.rows,
    rowHeightFromDensity,
    getRowHeightProp,
    getRowSpacing,
    getEstimatedRowHeight,
  ]);

  const getRowHeight = React.useCallback<GridRowsMetaApi['unstable_getRowHeight']>(
    (rowId) => {
      const height = rowsHeightLookup.current[rowId];
      return height ? height.sizes.base : rowHeightFromDensity;
    },
    [rowHeightFromDensity],
  );

  const getRowInternalSizes = (rowId: GridRowId): Record<string, number> | undefined =>
    rowsHeightLookup.current[rowId]?.sizes;

  const setRowHeight = React.useCallback<GridRowsMetaApi['unstable_setRowHeight']>(
    (id: GridRowId, height: number) => {
      rowsHeightLookup.current[id].sizes.base = height;
      rowsHeightLookup.current[id].isResized = true;
      rowsHeightLookup.current[id].needsFirstMeasurement = false;
      hydrateRowsMeta();
    },
    [hydrateRowsMeta],
  );

  const storeMeasuredRowHeight = React.useCallback<
    GridRowsMetaApi['unstable_storeRowHeightMeasurement']
  >(
    (id, height) => {
      if (!rowsHeightLookup.current[id] || !rowsHeightLookup.current[id].autoHeight) {
        return;
      }

      // Only trigger hydration if the value is different, otherwise we trigger a loop
      const needsHydration = rowsHeightLookup.current[id].sizes.base !== height;

      rowsHeightLookup.current[id].needsFirstMeasurement = false;
      rowsHeightLookup.current[id].sizes.base = height;

      if (needsHydration) {
        hydrateRowsMeta();
      }
    },
    [hydrateRowsMeta],
  );

  const rowHasAutoHeight = React.useCallback<GridRowsMetaApi['unstable_rowHasAutoHeight']>((id) => {
    return rowsHeightLookup.current[id]?.autoHeight || false;
  }, []);

  const getLastMeasuredRowIndex = React.useCallback<
    GridRowsMetaApi['unstable_getLastMeasuredRowIndex']
  >(() => {
    return lastMeasuredRowIndex.current;
  }, []);

  const setLastMeasuredRowIndex = React.useCallback<
    GridRowsMetaApi['unstable_setLastMeasuredRowIndex']
  >((index) => {
    if (hasRowWithAutoHeight.current) {
      lastMeasuredRowIndex.current = index;
    }
  }, []);

  // The effect is used to build the rows meta data - currentPageTotalHeight and positions.
  // Because of variable row height this is needed for the virtualization
  React.useEffect(() => {
    hydrateRowsMeta();
  }, [rowHeightFromDensity, filterState, paginationState, sortingState, hydrateRowsMeta]);

  useGridRegisterPipeApplier(apiRef, 'rowHeight', hydrateRowsMeta);

  const rowsMetaApi: GridRowsMetaApi = {
    unstable_getLastMeasuredRowIndex: getLastMeasuredRowIndex,
    unstable_setLastMeasuredRowIndex: setLastMeasuredRowIndex,
    unstable_rowHasAutoHeight: rowHasAutoHeight,
    unstable_getRowHeight: getRowHeight,
    unstable_getRowInternalSizes: getRowInternalSizes,
    unstable_setRowHeight: setRowHeight,
    unstable_storeRowHeightMeasurement: storeMeasuredRowHeight,
  };

  useGridApiMethod(apiRef, rowsMetaApi, 'GridRowsMetaApi');
};
