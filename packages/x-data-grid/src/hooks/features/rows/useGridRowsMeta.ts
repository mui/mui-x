import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { ResizeObserver } from '../../../utils/ResizeObserver';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridRowsMetaApi, GridRowsMetaPrivateApi } from '../../../models/api/gridRowsMetaApi';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridRowEntry, GridRowId } from '../../../models/gridRows';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridDensityFactorSelector } from '../density/densitySelector';
import { gridFilterModelSelector } from '../filter/gridFilterSelector';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { gridSortModelSelector } from '../sorting/gridSortingSelector';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridRegisterPipeApplier } from '../../core/pipeProcessing';
import { gridPinnedRowsSelector } from './gridRowsSelector';
import { DATA_GRID_PROPS_DEFAULT_VALUES } from '../../../DataGrid/useDataGridProps';
import type { HeightEntry } from './gridRowsMetaInterfaces';

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
    | 'rowPositionsDebounceMs'
  >,
): void => {
  const { getRowHeight: getRowHeightProp, getRowSpacing, getEstimatedRowHeight } = props;
  const heightCache = apiRef.current.caches.rowsMeta.heights;

  const lastMeasuredRowIndex = React.useRef(-1);
  const hasRowWithAutoHeight = React.useRef(false);

  const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const currentPage = useGridVisibleRows(apiRef, props);
  const pinnedRows = useGridSelector(apiRef, gridPinnedRowsSelector);
  const validRowHeight = getValidRowHeight(
    props.rowHeight,
    DATA_GRID_PROPS_DEFAULT_VALUES.rowHeight,
    rowHeightWarning,
  );
  const rowHeight = Math.floor(validRowHeight * densityFactor);

  const getRowHeightEntry: GridRowsMetaPrivateApi['getRowHeightEntry'] = (rowId) => {
    let entry = heightCache.get(rowId);
    if (entry === undefined) {
      entry = {
        content: rowHeight,
        spacingTop: 0,
        spacingBottom: 0,
        detail: 0,
        isResized: false,
        autoHeight: false,
        needsFirstMeasurement: true, // Assume all rows will need to be measured by default
      };
      heightCache.set(rowId, entry);
    }
    return entry;
  };

  const hydrateRowsMeta = React.useCallback(() => {
    hasRowWithAutoHeight.current = false;

    const processHeightEntry = (row: GridRowEntry) => {
      const entry = apiRef.current.getRowHeightEntry(row.id);

      if (!entry.isResized) {
        if (!getRowHeightProp) {
          entry.needsFirstMeasurement = false;
        } else {
          const rowHeightFromUser = getRowHeightProp({ ...row, densityFactor });

          if (rowHeightFromUser === 'auto') {
            if (entry.needsFirstMeasurement) {
              const estimatedRowHeight = getEstimatedRowHeight
                ? getEstimatedRowHeight({ ...row, densityFactor })
                : rowHeight;

              // If the row was not measured yet use the estimated row height
              entry.content = estimatedRowHeight ?? rowHeight;
            }

            hasRowWithAutoHeight.current = true;
            entry.autoHeight = true;
          } else {
            // Default back to base rowHeight if getRowHeight returns invalid value.
            entry.content = getValidRowHeight(rowHeightFromUser, rowHeight, getRowHeightWarning);
            entry.needsFirstMeasurement = false;
            entry.autoHeight = false;
          }
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
      }

      apiRef.current.unstable_applyPipeProcessors('rowHeight', entry, row) as HeightEntry;

      return entry;
    };

    pinnedRows?.top?.forEach((row) => {
      processHeightEntry(row);
    });

    pinnedRows?.bottom?.forEach((row) => {
      processHeightEntry(row);
    });

    apiRef.current.setState((state) => {
      return {
        ...state,
        rowsMeta: new RowsMeta(currentPage, processHeightEntry),
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
    rowHeight,
    getRowHeightProp,
    getRowSpacing,
    getEstimatedRowHeight,
    pinnedRows,
    densityFactor,
  ]);

  const getRowHeight: GridRowsMetaApi['unstable_getRowHeight'] = (rowId) => {
    return heightCache.get(rowId)?.content ?? rowHeight;
  };

  const setRowHeight: GridRowsMetaApi['unstable_setRowHeight'] = (
    id: GridRowId,
    height: number,
  ) => {
    const entry = apiRef.current.getRowHeightEntry(id);
    entry.content = height;
    entry.isResized = true;
    entry.needsFirstMeasurement = false;
    hydrateRowsMeta();
  };

  const storeMeasuredRowHeight: GridRowsMetaApi['unstable_storeRowHeightMeasurement'] = (
    id,
    height,
  ) => {
    const entry = apiRef.current.getRowHeightEntry(id);

    // Only trigger hydration if the value is different, otherwise we trigger a loop
    const needsHydration = entry.content !== height;

    entry.needsFirstMeasurement = false;
    entry.content = height;

    if (needsHydration) {
      (apiRef.current.state.rowsMeta as RowsMeta).invalidate();
    }
  };

  const rowHasAutoHeight: GridRowsMetaPrivateApi['rowHasAutoHeight'] = (id) => {
    return heightCache.get(id)?.autoHeight || false;
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
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const height =
            entry.borderBoxSize && entry.borderBoxSize.length > 0
              ? entry.borderBoxSize[0].blockSize
              : entry.contentRect.height;
          const rowId = (entry.target as any).__mui_id;
          apiRef.current.unstable_storeRowHeightMeasurement(rowId, height);
        }
      }),
  ).current;

  const observeRowHeight: GridRowsMetaPrivateApi['observeRowHeight'] = (element, rowId) => {
    (element as any).__mui_id = rowId;

    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  };

  // The effect is used to build the rows meta data - currentPageTotalHeight and positions.
  // Because of variable row height this is needed for the virtualization
  React.useEffect(() => {
    hydrateRowsMeta();
  }, [rowHeight, filterModel, paginationState, sortModel, hydrateRowsMeta]);

  useGridRegisterPipeApplier(apiRef, 'rowHeight', hydrateRowsMeta);

  const rowsMetaApi: GridRowsMetaApi = {
    unstable_setLastMeasuredRowIndex: setLastMeasuredRowIndex,
    unstable_getRowHeight: getRowHeight,
    unstable_setRowHeight: setRowHeight,
    unstable_storeRowHeightMeasurement: storeMeasuredRowHeight,
    resetRowHeights,
  };

  const rowsMetaPrivateApi: GridRowsMetaPrivateApi = {
    observeRowHeight,
    rowHasAutoHeight,
    getRowHeightEntry,
    getLastMeasuredRowIndex,
  };

  useGridApiMethod(apiRef, rowsMetaApi, 'public');
  useGridApiMethod(apiRef, rowsMetaPrivateApi, 'private');
};

/**
 * Invalidatable value holder for rows metadata.
 */
class RowsMeta {
  static UNSET = Object.freeze([]) as unknown as number[];

  private _currentPage: ReturnType<typeof useGridVisibleRows>;
  private _processHeightEntry: (id: GridRowEntry) => HeightEntry;
  private _currentPageTotalHeight: number;
  private _positions: number[];

  constructor(
    currentPage: ReturnType<typeof useGridVisibleRows>,
    processHeightEntry: (id: GridRowEntry) => HeightEntry,
  ) {
    this._currentPage = currentPage;
    this._processHeightEntry = processHeightEntry;
    this._currentPageTotalHeight = -1;
    this._positions = RowsMeta.UNSET;
  }

  invalidate() {
    this._currentPageTotalHeight = -1;
    this._positions = RowsMeta.UNSET;
  }

  initialize() {
    const positions: number[] = [];
    const currentPageTotalHeight = this._currentPage.rows.reduce((acc, row) => {
      positions.push(acc);

      const entry = this._processHeightEntry(row);
      const total = entry.content + entry.spacingTop + entry.spacingBottom + entry.detail;

      return acc + total;
    }, 0);

    this._currentPageTotalHeight = currentPageTotalHeight;
    this._positions = positions;
  }

  get currentPageTotalHeight() {
    if (this._currentPageTotalHeight === -1) {
      this.initialize();
    }
    return this._currentPageTotalHeight;
  }

  get positions() {
    if (this._currentPageTotalHeight === -1) {
      this.initialize();
    }
    return this._positions;
  }
}

let warnedOnceInvalidRowHeight = false;
const getValidRowHeight = (
  rowHeightProp: any,
  defaultRowHeight: number,
  warningMessage: string,
) => {
  if (typeof rowHeightProp === 'number' && rowHeightProp > 0) {
    return rowHeightProp;
  }
  if (
    process.env.NODE_ENV !== 'production' &&
    !warnedOnceInvalidRowHeight &&
    typeof rowHeightProp !== 'undefined' &&
    rowHeightProp !== null
  ) {
    console.warn(warningMessage);
    warnedOnceInvalidRowHeight = true;
  }
  return defaultRowHeight;
};

const rowHeightWarning = [
  `MUI X: The \`rowHeight\` prop should be a number greater than 0.`,
  `The default value will be used instead.`,
].join('\n');

const getRowHeightWarning = [
  `MUI X: The \`getRowHeight\` prop should return a number greater than 0 or 'auto'.`,
  `The default value will be used instead.`,
].join('\n');
