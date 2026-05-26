'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { throttle, type Cancelable } from '@mui/x-internals/throttle';
import { fastArrayCompare } from '@mui/x-internals/fastArrayCompare';
import {
  type GridStateColDef,
  type GridPipeProcessor,
  useGridRegisterPipeProcessor,
  COLUMNS_DIMENSION_PROPERTIES,
} from '@mui/x-data-grid/internals';
import { useGridEvent } from '@mui/x-data-grid';
import type { GridColumnHeaderParams } from '@mui/x-data-grid';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GRID_MULTI_SELECT_COL_DEF } from '../../../colDef/gridMultiSelectColDef';
import { GridMultiSelectMeasurer } from '../../../components/cell/GridMultiSelectMeasurer';
import type {
  GridMultiSelectInternalCache,
  GridMultiSelectOverflowMetrics,
} from './gridMultiSelectInterfaces';

const RESIZE_THROTTLE_MS = 32;

// Dimensions are resolved/resized on the processed column state, so they must not be
// overwritten by the static multiSelect defaults.
const DIMENSION_KEYS = new Set<string>(COLUMNS_DIMENSION_PROPERTIES);

class GridMultiSelectCache implements GridMultiSelectInternalCache {
  private dragSubscribers = new Map<string, Set<(width: number) => void>>();

  private metricsByField = new Map<string, GridMultiSelectOverflowMetrics>();

  private metricsSubscribers = new Map<
    string,
    Set<(metrics: GridMultiSelectOverflowMetrics | null) => void>
  >();

  private notifyMetrics = (field: string, metrics: GridMultiSelectOverflowMetrics | null) => {
    this.metricsSubscribers.get(field)?.forEach((cb) => cb(metrics));
  };

  public subscribeDrag = (field: string, callback: (width: number) => void) => {
    let bucket = this.dragSubscribers.get(field);
    if (!bucket) {
      bucket = new Set();
      this.dragSubscribers.set(field, bucket);
    }
    bucket.add(callback);
    return () => {
      const current = this.dragSubscribers.get(field);
      if (!current) {
        return;
      }
      current.delete(callback);
      if (current.size === 0) {
        this.dragSubscribers.delete(field);
      }
    };
  };

  public broadcast = (field: string, width: number) => {
    this.dragSubscribers.get(field)?.forEach((cb) => cb(width));
  };

  public getOverflowMetrics = (field: string) => {
    return this.metricsByField.get(field) ?? null;
  };

  public setOverflowMetrics = (field: string, next: GridMultiSelectOverflowMetrics) => {
    // Skip no-op updates so subscribed cells don't re-render on every measurer ResizeObserver tick.
    const prev = this.metricsByField.get(field);
    if (
      prev &&
      prev.gap === next.gap &&
      fastArrayCompare(prev.overflowChipWidths, next.overflowChipWidths)
    ) {
      return;
    }
    this.metricsByField.set(field, next);
    this.notifyMetrics(field, next);
  };

  public deleteOverflowMetrics = (field: string) => {
    if (!this.metricsByField.has(field)) {
      return;
    }
    this.metricsByField.delete(field);
    this.notifyMetrics(field, null);
  };

  public subscribeOverflowMetrics = (
    field: string,
    callback: (metrics: GridMultiSelectOverflowMetrics | null) => void,
  ) => {
    let bucket = this.metricsSubscribers.get(field);
    if (!bucket) {
      bucket = new Set();
      this.metricsSubscribers.set(field, bucket);
    }
    bucket.add(callback);
    return () => {
      const current = this.metricsSubscribers.get(field);
      if (!current) {
        return;
      }
      current.delete(callback);
      if (current.size === 0) {
        this.metricsSubscribers.delete(field);
      }
    };
  };

  public teardown = () => {
    this.dragSubscribers.clear();
    this.metricsSubscribers.clear();
    this.metricsByField.clear();
  };
}

const renderMultiSelectHeaderDefault = (params: GridColumnHeaderParams) => (
  <React.Fragment>
    {params.colDef.headerName ?? params.field}
    <GridMultiSelectMeasurer field={params.field} />
  </React.Fragment>
);

export const useGridMultiSelectPreProcessors = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: DataGridProProcessedProps,
) => {
  const userColumnsLookup = React.useMemo(
    () => new Map(props.columns.map((col) => [col.field, col])),
    [props.columns],
  );

  // Single per-grid drag broadcaster keeps the EventManager listener count O(1)
  // even when many multiSelect cells are visible.
  if (!apiRef.current.caches.multiSelect) {
    apiRef.current.caches.multiSelect = new GridMultiSelectCache();
  }
  const cache = apiRef.current.caches.multiSelect;

  const throttledByFieldRef = React.useRef(
    new Map<string, ((width: number) => void) & Cancelable>(),
  );

  useGridEvent(apiRef, 'columnResize', (params) => {
    if (params.colDef.type !== 'multiSelect') {
      return;
    }
    const { field } = params.colDef;
    let throttled = throttledByFieldRef.current.get(field);
    if (!throttled) {
      throttled = throttle((width: number) => cache.broadcast(field, width), RESIZE_THROTTLE_MS);
      throttledByFieldRef.current.set(field, throttled);
    }
    throttled(params.width);
  });

  useGridEvent(apiRef, 'columnResizeStop', () => {
    throttledByFieldRef.current.forEach((t) => t.clear());
    throttledByFieldRef.current.clear();
  });

  React.useEffect(() => {
    const throttles = throttledByFieldRef.current;
    return () => {
      throttles.forEach((t) => t.clear());
      throttles.clear();
      cache.teardown();
    };
  }, [cache]);

  const applyMultiSelectDefaults = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const { lookup } = columnsState;

      let newLookup: typeof lookup | null = null;
      const fields = Object.keys(lookup);
      for (let i = 0; i < fields.length; i += 1) {
        const field = fields[i];
        const column = lookup[field];
        if (column.type !== 'multiSelect') {
          continue;
        }
        if (newLookup === null) {
          newLookup = { ...lookup };
        }
        const userColumn = userColumnsLookup.get(field);
        // Wrap the user's renderHeader (if any) so the per-column measurer is mounted
        // regardless of customization. The measurer is hidden absolutely and does not
        // displace the user's content.
        const userRenderHeader = userColumn?.renderHeader;
        const composedRenderHeader = userRenderHeader
          ? (params: GridColumnHeaderParams) => (
              <React.Fragment>
                {userRenderHeader(params)}
                <GridMultiSelectMeasurer field={params.field} />
              </React.Fragment>
            )
          : renderMultiSelectHeaderDefault;
        // Start from the processed column state to keep dimensions, `hasBeenResized` and other
        // computed props. `column` carries string-type defaults (multiSelect isn't a core column
        // type), so overlay multiSelect defaults for keys the user didn't set, except dimensions
        // whose resolved/resized values already live on `column`.
        const merged = { ...column } as GridStateColDef;
        let defaultKey: keyof typeof GRID_MULTI_SELECT_COL_DEF;
        for (defaultKey in GRID_MULTI_SELECT_COL_DEF) {
          if (!DIMENSION_KEYS.has(defaultKey) && (userColumn as any)?.[defaultKey] === undefined) {
            (merged as any)[defaultKey] = GRID_MULTI_SELECT_COL_DEF[defaultKey];
          }
        }
        merged.renderHeader = composedRenderHeader;
        newLookup[field] = merged;
      }

      if (newLookup === null) {
        return columnsState;
      }

      return { ...columnsState, lookup: newLookup };
    },
    [userColumnsLookup],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', applyMultiSelectDefaults);
};
