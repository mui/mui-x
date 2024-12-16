import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { ResizeObserver } from '../../../utils/ResizeObserver';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridRowsMetaApi, GridRowsMetaPrivateApi } from '../../../models/api/gridRowsMetaApi';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { eslintUseValue } from '../../../utils/utils';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridRowEntry } from '../../../models/gridRows';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridDensityFactorSelector } from '../density/densitySelector';
import { gridFilterModelSelector } from '../filter/gridFilterSelector';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { gridSortModelSelector } from '../sorting/gridSortingSelector';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridRegisterPipeApplier } from '../../core/pipeProcessing';
import { gridPinnedRowsSelector } from './gridRowsSelector';
import { gridDimensionsSelector } from '../dimensions/gridDimensionsSelectors';
import { getValidRowHeight, getRowHeightWarning } from './gridRowsUtils';
import type { HeightEntry } from './gridRowsMetaInterfaces';

/* eslint-disable no-underscore-dangle */

export const rowsMetaStateInitializer: GridStateInitializer = (state, props, apiRef) => {
  apiRef.current.caches.rowsMeta = {
    heights: new Map(),
  };

  return {
    ...state,
    rowsMeta: {
      currentPageTotalHeight: 0,
      positions: [],
    },
  };
};

/**
 * @requires useGridPageSize (method)
 * @requires useGridPage (method)
 */
export const useGridRowsMeta = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'getRowHeight'
    | 'getEstimatedRowHeight'
    | 'getRowSpacing'
    | 'pagination'
    | 'paginationMode'
    | 'rowHeight'
  >,
): void => {
  const { getRowHeight: getRowHeightProp, getRowSpacing, getEstimatedRowHeight } = props;
  const heightCache = apiRef.current.caches.rowsMeta.heights;

  const lastMeasuredRowIndex = React.useRef(-1);
  const hasRowWithAutoHeight = React.useRef(false);
  const isHeightMetaValid = React.useRef(false);

  const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const currentPage = useGridVisibleRows(apiRef, props);
  const pinnedRows = useGridSelector(apiRef, gridPinnedRowsSelector);
  const rowHeight = useGridSelector(
    apiRef,
    () => gridDimensionsSelector(apiRef.current.state).rowHeight,
  );

  const getRowHeightEntry: GridRowsMetaPrivateApi['getRowHeightEntry'] = (rowId) => {
    let entry = heightCache.get(rowId);
    if (entry === undefined) {
      entry = {
        content: rowHeight,
        spacingTop: 0,
        spacingBottom: 0,
        detail: 0,
        autoHeight: false,
        needsFirstMeasurement: true,
      };
      heightCache.set(rowId, entry);
    }
    return entry;
  };

  const processHeightEntry = React.useCallback(
    (row: GridRowEntry) => {
      // HACK: rowHeight trails behind the most up-to-date value just enough to
      // mess the initial rowsMeta hydration :/
      const baseRowHeight = gridDimensionsSelector(apiRef.current.state).rowHeight;
      eslintUseValue(rowHeight);

      const entry = apiRef.current.getRowHeightEntry(row.id);

      if (!getRowHeightProp) {
        entry.content = baseRowHeight;
        entry.needsFirstMeasurement = false;
      } else {
        const rowHeightFromUser = getRowHeightProp({ ...row, densityFactor });

        if (rowHeightFromUser === 'auto') {
          if (entry.needsFirstMeasurement) {
            const estimatedRowHeight = getEstimatedRowHeight
              ? getEstimatedRowHeight({ ...row, densityFactor })
              : baseRowHeight;

            // If the row was not measured yet use the estimated row height
            entry.content = estimatedRowHeight ?? baseRowHeight;
          }

          hasRowWithAutoHeight.current = true;
          entry.autoHeight = true;
        } else {
          // Default back to base rowHeight if getRowHeight returns invalid value.
          entry.content = getValidRowHeight(rowHeightFromUser, baseRowHeight, getRowHeightWarning);
          entry.needsFirstMeasurement = false;
          entry.autoHeight = false;
        }
      }

      if (getRowSpacing) {
        const indexRelativeToCurrentPage = apiRef.current.getRowIndexRelativeToVisibleRows(row.id);

        const spacing = getRowSpacing({
          ...row,
          isFirstVisible: indexRelativeToCurrentPage === 0,
          isLastVisible: indexRelativeToCurrentPage === currentPage.rows.length - 1,
          indexRelativeToCurrentPage,
        });

        entry.spacingTop = spacing.top ?? 0;
        entry.spacingBottom = spacing.bottom ?? 0;
      } else {
        entry.spacingTop = 0;
        entry.spacingBottom = 0;
      }

      apiRef.current.unstable_applyPipeProcessors('rowHeight', entry, row) as HeightEntry;

      return entry;
    },
    [
      apiRef,
      currentPage.rows.length,
      getRowHeightProp,
      getEstimatedRowHeight,
      rowHeight,
      getRowSpacing,
      densityFactor,
    ],
  );

  const hydrateRowsMeta = React.useCallback(() => {
    hasRowWithAutoHeight.current = false;

    pinnedRows.top.forEach(processHeightEntry);
    pinnedRows.bottom.forEach(processHeightEntry);

    const positions: number[] = [];
    const currentPageTotalHeight = currentPage.rows.reduce((acc, row) => {
      positions.push(acc);

      const entry = processHeightEntry(row);
      const total = entry.content + entry.spacingTop + entry.spacingBottom + entry.detail;

      return acc + total;
    }, 0);

    if (!hasRowWithAutoHeight.current) {
      // No row has height=auto, so all rows are already measured
      lastMeasuredRowIndex.current = Infinity;
    }

    apiRef.current.setState((state) => {
      return {
        ...state,
        rowsMeta: {
          currentPageTotalHeight,
          positions,
        },
      };
    });

    isHeightMetaValid.current = true;
  }, [apiRef, pinnedRows, currentPage.rows, processHeightEntry]);

  const getRowHeight: GridRowsMetaApi['unstable_getRowHeight'] = (rowId) => {
    return heightCache.get(rowId)?.content ?? rowHeight;
  };

  const storeRowHeightMeasurement: GridRowsMetaApi['unstable_storeRowHeightMeasurement'] = (
    id,
    height,
  ) => {
    const entry = apiRef.current.getRowHeightEntry(id);

    const didChange = entry.content !== height;

    entry.needsFirstMeasurement = false;
    entry.content = height;

    isHeightMetaValid.current &&= !didChange;
  };

  const rowHasAutoHeight: GridRowsMetaPrivateApi['rowHasAutoHeight'] = (id) => {
    return heightCache.get(id)?.autoHeight ?? false;
  };

  const getLastMeasuredRowIndex: GridRowsMetaPrivateApi['getLastMeasuredRowIndex'] = () => {
    return lastMeasuredRowIndex.current;
  };

  const setLastMeasuredRowIndex: GridRowsMetaApi['unstable_setLastMeasuredRowIndex'] = (index) => {
    if (hasRowWithAutoHeight.current && index > lastMeasuredRowIndex.current) {
      lastMeasuredRowIndex.current = index;
    }
  };

  const resetRowHeights: GridRowsMetaApi['resetRowHeights'] = () => {
    heightCache.clear();
    hydrateRowsMeta();
  };

  const resizeObserver = useLazyRef(
    () =>
      new ResizeObserver((entries) => {
        for (let i = 0; i < entries.length; i += 1) {
          const entry = entries[i];
          const height =
            entry.borderBoxSize && entry.borderBoxSize.length > 0
              ? entry.borderBoxSize[0].blockSize
              : entry.contentRect.height;
          const rowId = (entry.target as any).__mui_id;
          apiRef.current.unstable_storeRowHeightMeasurement(rowId, height);
        }
        if (!isHeightMetaValid.current) {
          apiRef.current.requestPipeProcessorsApplication('rowHeight');
        }
      }),
  ).current;

  const observeRowHeight: GridRowsMetaPrivateApi['observeRowHeight'] = (element, rowId) => {
    (element as any).__mui_id = rowId;

    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  };

  useGridRegisterPipeApplier(apiRef, 'rowHeight', hydrateRowsMeta);

  // The effect is used to build the rows meta data - currentPageTotalHeight and positions.
  // Because of variable row height this is needed for the virtualization
  React.useEffect(() => {
    hydrateRowsMeta();
  }, [filterModel, paginationState, sortModel, hydrateRowsMeta]);

  const rowsMetaApi: GridRowsMetaApi = {
    unstable_getRowHeight: getRowHeight,
    unstable_setLastMeasuredRowIndex: setLastMeasuredRowIndex,
    unstable_storeRowHeightMeasurement: storeRowHeightMeasurement,
    resetRowHeights,
  };

  const rowsMetaPrivateApi: GridRowsMetaPrivateApi = {
    hydrateRowsMeta,
    observeRowHeight,
    rowHasAutoHeight,
    getRowHeightEntry,
    getLastMeasuredRowIndex,
  };

  useGridApiMethod(apiRef, rowsMetaApi, 'public');
  useGridApiMethod(apiRef, rowsMetaPrivateApi, 'private');
};
