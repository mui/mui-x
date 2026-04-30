'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { throttle, type Cancelable } from '@mui/x-internals/throttle';
import {
  type GridStateColDef,
  type GridPipeProcessor,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid/internals';
import { useGridEvent } from '@mui/x-data-grid';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GRID_MULTI_SELECT_COL_DEF } from '../../../colDef/gridMultiSelectColDef';
import type { GridMultiSelectInternalCache } from './gridMultiSelectInterfaces';

const RESIZE_THROTTLE_MS = 32;

const createMultiSelectCache = (): GridMultiSelectInternalCache => {
  const subscribers = new Map<string, Set<(width: number) => void>>();
  return {
    subscribeDrag(field, callback) {
      let bucket = subscribers.get(field);
      if (!bucket) {
        bucket = new Set();
        subscribers.set(field, bucket);
      }
      bucket.add(callback);
      return () => {
        const current = subscribers.get(field);
        if (!current) {
          return;
        }
        current.delete(callback);
        if (current.size === 0) {
          subscribers.delete(field);
        }
      };
    },
    broadcast(field, width) {
      subscribers.get(field)?.forEach((cb) => cb(width));
    },
    teardown() {
      subscribers.clear();
    },
  };
};

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
        // Spread `userColumn` (not `column`) — `column` already has string defaults baked in.
        newLookup[field] = {
          ...GRID_MULTI_SELECT_COL_DEF,
          ...userColumn,
          field,
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
