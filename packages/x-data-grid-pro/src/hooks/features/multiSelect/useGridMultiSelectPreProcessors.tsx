'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { throttle, type Cancelable } from '@mui/x-internals/throttle';
import { fastArrayCompare } from '@mui/x-internals/fastArrayCompare';
import {
  type GridStateColDef,
  type GridPipeProcessor,
  useGridRegisterPipeProcessor,
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

const createMultiSelectCache = (): GridMultiSelectInternalCache => {
  const dragSubscribers = new Map<string, Set<(width: number) => void>>();
  const metricsByField = new Map<string, GridMultiSelectOverflowMetrics>();
  const metricsSubscribers = new Map<
    string,
    Set<(metrics: GridMultiSelectOverflowMetrics | null) => void>
  >();
  const notifyMetrics = (field: string, metrics: GridMultiSelectOverflowMetrics | null) => {
    metricsSubscribers.get(field)?.forEach((cb) => cb(metrics));
  };
  return {
    subscribeDrag(field, callback) {
      let bucket = dragSubscribers.get(field);
      if (!bucket) {
        bucket = new Set();
        dragSubscribers.set(field, bucket);
      }
      bucket.add(callback);
      return () => {
        const current = dragSubscribers.get(field);
        if (!current) {
          return;
        }
        current.delete(callback);
        if (current.size === 0) {
          dragSubscribers.delete(field);
        }
      };
    },
    broadcast(field, width) {
      dragSubscribers.get(field)?.forEach((cb) => cb(width));
    },
    getOverflowMetrics(field) {
      return metricsByField.get(field) ?? null;
    },
    setOverflowMetrics(field, next) {
      // Skip no-op updates so subscribed cells don't re-render on every measurer ResizeObserver tick.
      const prev = metricsByField.get(field);
      if (
        prev &&
        prev.gap === next.gap &&
        fastArrayCompare(prev.overflowChipWidths, next.overflowChipWidths)
      ) {
        return;
      }
      metricsByField.set(field, next);
      notifyMetrics(field, next);
    },
    deleteOverflowMetrics(field) {
      if (!metricsByField.has(field)) {
        return;
      }
      metricsByField.delete(field);
      notifyMetrics(field, null);
    },
    subscribeOverflowMetrics(field, callback) {
      let bucket = metricsSubscribers.get(field);
      if (!bucket) {
        bucket = new Set();
        metricsSubscribers.set(field, bucket);
      }
      bucket.add(callback);
      return () => {
        const current = metricsSubscribers.get(field);
        if (!current) {
          return;
        }
        current.delete(callback);
        if (current.size === 0) {
          metricsSubscribers.delete(field);
        }
      };
    },
    teardown() {
      dragSubscribers.clear();
      metricsSubscribers.clear();
      metricsByField.clear();
    },
  };
};

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
    apiRef.current.caches.multiSelect = createMultiSelectCache();
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
        const stateColumn = column as GridStateColDef;
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
        // Spread `userColumn` (not `column`) — `column` already has string defaults baked in.
        newLookup[field] = {
          ...GRID_MULTI_SELECT_COL_DEF,
          ...userColumn,
          field,
          renderHeader: composedRenderHeader,
          ...(stateColumn.hasBeenResized && {
            width: stateColumn.width,
            flex: stateColumn.flex,
          }),
        };
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
