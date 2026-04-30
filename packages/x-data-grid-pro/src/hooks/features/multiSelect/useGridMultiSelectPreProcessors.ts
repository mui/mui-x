'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
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

type DragSubscribers = Map<string, Set<(width: number) => void>>;

const createMultiSelectCache = (): GridMultiSelectInternalCache & {
  subscribers: DragSubscribers;
} => {
  const subscribers: DragSubscribers = new Map();
  return {
    subscribers,
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

  // Single per-grid drag-resize broadcaster. Replaces per-cell `columnResize`
  // subscriptions to avoid the EventEmitter listener leak warning when many
  // multiSelect cells are visible.
  if (!apiRef.current.caches.multiSelect) {
    apiRef.current.caches.multiSelect = createMultiSelectCache();
  }
  const subscribers = (
    apiRef.current.caches.multiSelect as ReturnType<typeof createMultiSelectCache>
  ).subscribers;

  const throttleTimersRef = React.useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const pendingWidthsRef = React.useRef(new Map<string, number>());

  useGridEvent(apiRef, 'columnResize', (params) => {
    if (params.colDef.type !== 'multiSelect') {
      return;
    }
    const { field } = params.colDef;
    pendingWidthsRef.current.set(field, params.width);
    if (throttleTimersRef.current.has(field)) {
      return;
    }
    const timer = setTimeout(() => {
      throttleTimersRef.current.delete(field);
      const width = pendingWidthsRef.current.get(field);
      pendingWidthsRef.current.delete(field);
      if (width === undefined) {
        return;
      }
      subscribers.get(field)?.forEach((cb) => cb(width));
    }, RESIZE_THROTTLE_MS);
    throttleTimersRef.current.set(field, timer);
  });

  useGridEvent(apiRef, 'columnResizeStop', () => {
    throttleTimersRef.current.forEach((timer) => clearTimeout(timer));
    throttleTimersRef.current.clear();
    pendingWidthsRef.current.clear();
    // The `columnWidth` prop change in each cell triggers its `useEffect` for the
    // final sub-pixel-accurate `getBoundingClientRect` read.
  });

  React.useEffect(() => {
    const timers = throttleTimersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

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
        // Apply multiSelect defaults, then user's explicit props.
        // We use userColumn (not column) because column already has string defaults baked in.
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
