'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import debounce from '@mui/utils/debounce';
import {
  useGridEvent,
  useGridApiMethod,
  GridStateInitializer,
  isUndoShortcut,
  isRedoShortcut,
  runIf,
} from '@mui/x-data-grid-pro/internals';
import type { GridEvents, GridEventListener } from '@mui/x-data-grid-pro';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import {
  GridHistoryApi,
  GridHistoryState,
  GridHistoryItem,
  GridHistoryEventHandler,
} from './gridHistoryInterfaces';
import {
  gridHistoryCurrentPositionSelector,
  gridHistoryQueueSelector,
  gridHistoryCanUndoSelector,
  gridHistoryCanRedoSelector,
} from './gridHistorySelectors';
import { createDefaultHistoryHandlers } from './defaultHistoryHandlers';

export const historyStateInitializer: GridStateInitializer = (state) => {
  return {
    ...state,
    history: {
      queue: [],
      currentPosition: -1,
    },
  };
};

export const useGridHistory = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    'historyQueueSize' | 'historyEvents' | 'onUndo' | 'onRedo'
  >,
) => {
  const { historyQueueSize, onUndo, onRedo } = props;

  const queue = gridHistoryQueueSelector(apiRef);
  const currentPosition = gridHistoryCurrentPositionSelector(apiRef);

  // Use default history events if none provided
  const historyEvents = React.useMemo(() => {
    if (props.historyEvents && props.historyEvents.size > 0) {
      return props.historyEvents;
    }
    return createDefaultHistoryHandlers(apiRef);
  }, [apiRef, props.historyEvents]);

  // Internal flag to prevent recursion, since undo/redo triggers the same event that is being handled to store the history item
  const isUndoRedoInProgressRef = React.useRef(false);

  // History event unsubscribers
  const eventUnsubscribersRef = React.useRef<(() => void)[]>([]);

  const setHistoryState = React.useCallback(
    (newState: Partial<GridHistoryState>) => {
      apiRef.current.setState((state) => ({
        ...state,
        history: {
          ...state.history,
          ...newState,
        },
      }));
    },
    [apiRef],
  );

  const addToQueue = React.useCallback(
    (item: GridHistoryItem) => {
      let newQueue = [...queue];

      // If we're not at the end of the queue, truncate forward history
      if (currentPosition < newQueue.length - 1) {
        newQueue = newQueue.slice(0, currentPosition + 1);
      }

      // Add the new item
      newQueue.push(item);

      // If queue exceeds size, remove oldest items
      if (newQueue.length > historyQueueSize) {
        newQueue = newQueue.slice(newQueue.length - historyQueueSize);
      }

      setHistoryState({
        queue: newQueue,
        currentPosition: newQueue.length - 1,
      });
    },
    [queue, currentPosition, setHistoryState, historyQueueSize],
  );

  const clearUndoItems = React.useCallback(() => {
    setHistoryState({
      queue: queue.slice(0, currentPosition + 1),
      currentPosition: -1,
    });
  }, [queue, currentPosition, setHistoryState]);

  const clearRedoItems = React.useCallback(() => {
    setHistoryState({
      queue: queue.slice(currentPosition + 1),
    });
  }, [queue, currentPosition, setHistoryState]);

  const clear = React.useCallback(() => {
    setHistoryState({
      queue: [],
      currentPosition: -1,
    });
  }, [setHistoryState]);

  const canUndo = React.useCallback(() => gridHistoryCanUndoSelector(apiRef), [apiRef]);
  const canRedo = React.useCallback(() => gridHistoryCanRedoSelector(apiRef), [apiRef]);

  const apply = React.useCallback(
    async (item: GridHistoryItem, operation: 'undo' | 'redo') => {
      isUndoRedoInProgressRef.current = true;

      const clearMethod = operation === 'undo' ? clearUndoItems : clearRedoItems;

      const { eventName, data } = item;
      const handler = historyEvents.get(eventName);

      if (!handler) {
        // If the handler is not found, it means tha we are updating the handlers map, so we can igore this request
        return false;
      }

      const isValid = handler.validate(data, operation);

      // The data is validated every time state change event happens.
      // We can get into a situation where the operation is not valid at this point only with the direct state updates.
      if (!isValid) {
        // Clear history and return false
        clearMethod();
        return false;
      }

      // Execute the operation
      await handler[operation](data);

      setHistoryState({
        currentPosition: operation === 'undo' ? currentPosition - 1 : currentPosition + 1,
      });
      apiRef.current.publishEvent(operation, { eventName, data });
      return true;
    },
    [apiRef, currentPosition, historyEvents, clearUndoItems, clearRedoItems, setHistoryState],
  );

  const undo = React.useCallback(async (): Promise<boolean> => {
    if (!canUndo()) {
      return false;
    }

    return apply(queue[currentPosition], 'undo');
  }, [currentPosition, queue, apply, canUndo]);

  const redo = React.useCallback(async (): Promise<boolean> => {
    if (!canRedo()) {
      return false;
    }

    return apply(queue[currentPosition + 1], 'redo');
  }, [currentPosition, queue, apply, canRedo]);

  const historyApi: GridHistoryApi['history'] = {
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
  };

  useGridApiMethod(apiRef, { history: historyApi } as GridHistoryApi, 'public');

  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    async (params, event) => {
      // Only handle shortcuts if history is enabled
      if (historyQueueSize === 0) {
        return;
      }

      // Check for undo shortcut
      if (isUndoShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();

        await apiRef.current.history.undo();
        return;
      }

      // Check for redo shortcut
      if (isRedoShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();

        await apiRef.current.history.redo();
        return;
      }
    },
    [apiRef, historyQueueSize],
  );

  const validateQueueItems = React.useCallback<GridEventListener<'stateChange'>>(() => {
    if (historyQueueSize === 0) {
      if (queue.length > 0) {
        clear();
      }
      return;
    }

    if (queue.length === 0) {
      return;
    }

    const newQueue = [...queue];

    // Undo check
    if (currentPosition >= 0) {
      const item = newQueue[currentPosition];
      const handler = historyEvents.get(item.eventName);
      if (!handler) {
        clearUndoItems();
      } else {
        const isValid = handler.validate(item.data, 'undo');
        if (!isValid) {
          clearUndoItems();
        }
      }
    }
    // Redo check
    if (currentPosition + 1 < newQueue.length) {
      const item = newQueue[currentPosition + 1];
      const handler = historyEvents.get(item.eventName);
      if (!handler) {
        clearRedoItems();
      } else {
        const isValid = handler.validate(item.data, 'redo');
        if (!isValid) {
          clearRedoItems();
        }
      }
    }
  }, [
    currentPosition,
    queue,
    historyEvents,
    historyQueueSize,
    clear,
    clearUndoItems,
    clearRedoItems,
  ]);

  const debouncedValidateQueueItems = React.useMemo(
    () => debounce(validateQueueItems, 0),
    [validateQueueItems],
  );

  useGridEvent(apiRef, 'cellKeyDown', runIf(historyQueueSize > 0, handleCellKeyDown));
  useGridEvent(apiRef, 'stateChange', runIf(historyQueueSize > 0, debouncedValidateQueueItems));
  useGridEvent(apiRef, 'undo', onUndo);
  useGridEvent(apiRef, 'redo', onRedo);

  React.useEffect(() => {
    if (historyQueueSize === 0) {
      return () => {};
    }

    // Subscribe to all events in the map
    historyEvents.forEach((handler: GridHistoryEventHandler, eventName: GridEvents) => {
      const unsubscribe = apiRef.current.subscribeEvent(eventName, (...params: any[]) => {
        // Don't store if the event was triggered by undo/redo
        if (isUndoRedoInProgressRef.current) {
          isUndoRedoInProgressRef.current = false;
          return;
        }

        const data = handler.store(...params);
        addToQueue({ eventName, data });
      });

      eventUnsubscribersRef.current.push(unsubscribe);
    });

    return () => {
      eventUnsubscribersRef.current.forEach((unsubscribe) => unsubscribe());
      eventUnsubscribersRef.current = [];
    };
  }, [apiRef, historyEvents, historyQueueSize, addToQueue]);
};
