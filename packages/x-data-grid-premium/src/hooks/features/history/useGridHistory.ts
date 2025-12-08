'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { isObjectEmpty } from '@mui/x-internals/isObjectEmpty';
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
      enabled: false,
    },
  };
};

export const useGridHistory = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'dataSource'
    | 'historyQueueSize'
    | 'historyEventHandlers'
    | 'historyValidationEvents'
    | 'onUndo'
    | 'onRedo'
  >,
) => {
  const { historyQueueSize, onUndo, onRedo, historyValidationEvents } = props;

  // Use default history events if none provided
  const historyEventHandlers = React.useMemo(() => {
    if (props.historyEventHandlers && !isObjectEmpty(props.historyEventHandlers)) {
      return props.historyEventHandlers;
    }
    return createDefaultHistoryHandlers(apiRef, {
      dataSource: props.dataSource,
    });
  }, [apiRef, props.dataSource, props.historyEventHandlers]);

  const isEnabled = React.useMemo(
    () => historyQueueSize > 0 && !isObjectEmpty(historyEventHandlers),
    [historyQueueSize, historyEventHandlers],
  );

  const isValidationNeeded = React.useMemo(
    () =>
      isEnabled &&
      historyValidationEvents.length > 0 &&
      Object.values(historyEventHandlers).some(
        (handler: GridHistoryEventHandler<any>) => handler.validate,
      ),
    [isEnabled, historyEventHandlers, historyValidationEvents],
  );

  // Internal ref to track undo/redo operation state
  // - 'idle': everything is done
  // - 'in-progress': during async undo/redo handler execution (skip validation and prevent the state change by other events)
  // - 'waiting-replay': after undo/redo handler is done, the same event is triggered again (as undo/redo is doing the same thing).
  //   In this hook we need to skip that event and we track that by subscribing to the state change event to cover all custom event handlers as well.
  const operationStateRef = React.useRef<'idle' | 'in-progress' | 'waiting-replay'>('idle');

  // History event unsubscribers
  const eventUnsubscribersRef = React.useRef<(() => void)[]>([]);
  // Validation event unsubscribers
  const validationEventUnsubscribersRef = React.useRef<(() => void)[]>([]);

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
      const currentPosition = gridHistoryCurrentPositionSelector(apiRef);
      let newQueue = [...gridHistoryQueueSelector(apiRef)];

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
    [apiRef, setHistoryState, historyQueueSize],
  );

  const clear = React.useCallback(() => {
    setHistoryState({
      queue: [],
      currentPosition: -1,
    });
  }, [setHistoryState]);

  const clearUndoItems = React.useCallback(() => {
    const queue = gridHistoryQueueSelector(apiRef);
    const currentPosition = gridHistoryCurrentPositionSelector(apiRef);

    // If we're at the end of the queue (no redo items), clear everything
    if (currentPosition >= queue.length - 1) {
      clear();
    } else {
      setHistoryState({
        queue: queue.slice(currentPosition + 1),
        currentPosition: -1,
      });
    }
  }, [apiRef, clear, setHistoryState]);

  const clearRedoItems = React.useCallback(() => {
    const queue = gridHistoryQueueSelector(apiRef);
    const currentPosition = gridHistoryCurrentPositionSelector(apiRef);
    setHistoryState({
      queue: queue.slice(currentPosition + 1),
    });
  }, [apiRef, setHistoryState]);

  const canUndo = React.useCallback(() => gridHistoryCanUndoSelector(apiRef), [apiRef]);
  const canRedo = React.useCallback(() => gridHistoryCanRedoSelector(apiRef), [apiRef]);

  const validateQueueItems = React.useCallback(() => {
    /**
     * When:
     * - idle: continue with the validation
     * - in-progress: skip the validation and don't change the state
     * - waiting-replay: skip the validation this time and reset the state to idle
     */
    if (operationStateRef.current !== 'idle') {
      if (operationStateRef.current === 'waiting-replay') {
        operationStateRef.current = 'idle';
      }
      return;
    }

    const queue = gridHistoryQueueSelector(apiRef);
    const currentPosition = gridHistoryCurrentPositionSelector(apiRef);

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

    // Redo check
    if (currentPosition + 1 < newQueue.length) {
      const item = newQueue[currentPosition + 1];
      const handler = historyEventHandlers[item.eventName];
      if (!handler) {
        clearRedoItems();
      } else {
        const isValid = handler.validate ? handler.validate(item.data, 'redo') : true;
        if (!isValid) {
          clearRedoItems();
        }
      }
    }

    // Undo check
    if (currentPosition >= 0) {
      const item = newQueue[currentPosition];
      const handler = historyEventHandlers[item.eventName];
      if (!handler) {
        clearUndoItems();
      } else {
        const isValid = handler.validate ? handler.validate(item.data, 'undo') : true;
        if (!isValid) {
          clearUndoItems();
        }
      }
    }
  }, [apiRef, historyEventHandlers, historyQueueSize, clear, clearUndoItems, clearRedoItems]);

  const debouncedValidateQueueItems = React.useMemo(
    () => debounce(validateQueueItems, 0),
    [validateQueueItems],
  );

  const apply = React.useCallback(
    async (item: GridHistoryItem, operation: 'undo' | 'redo') => {
      const currentPosition = gridHistoryCurrentPositionSelector(apiRef);

      const clearMethod = operation === 'undo' ? clearUndoItems : clearRedoItems;

      const { eventName, data } = item;
      const handler = historyEventHandlers[eventName];

      if (!handler) {
        // If the handler is not found, it means tha we are updating the handlers map, so we can igore this request
        return false;
      }

      const isValid = handler.validate ? handler.validate(data, operation) : true;

      // The data is validated every time state change event happens.
      // We can get into a situation where the operation is not valid at this point only with the direct state updates.
      if (!isValid) {
        // Clear history and return false
        clearMethod();
        return false;
      }

      // Execute the operation
      operationStateRef.current = 'in-progress';
      await handler[operation](data);
      operationStateRef.current = 'waiting-replay';

      setHistoryState({
        currentPosition: operation === 'undo' ? currentPosition - 1 : currentPosition + 1,
      });

      apiRef.current.publishEvent(operation, { eventName, data });
      if (isValidationNeeded) {
        validateQueueItems();
      } else {
        operationStateRef.current = 'idle';
      }
      return true;
    },
    [
      apiRef,
      isValidationNeeded,
      historyEventHandlers,
      clearUndoItems,
      clearRedoItems,
      setHistoryState,
      validateQueueItems,
    ],
  );

  const undo = React.useCallback(async (): Promise<boolean> => {
    if (!canUndo()) {
      return false;
    }

    const queue = gridHistoryQueueSelector(apiRef);
    const currentPosition = gridHistoryCurrentPositionSelector(apiRef);
    return apply(queue[currentPosition], 'undo');
  }, [apiRef, apply, canUndo]);

  const redo = React.useCallback(async (): Promise<boolean> => {
    if (!canRedo()) {
      return false;
    }

    const queue = gridHistoryQueueSelector(apiRef);
    const currentPosition = gridHistoryCurrentPositionSelector(apiRef);
    return apply(queue[currentPosition + 1], 'redo');
  }, [apiRef, apply, canRedo]);

  const historyApi: GridHistoryApi['history'] = {
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
  };

  useGridApiMethod(apiRef, { history: historyApi } as GridHistoryApi, 'public');

  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    async (_, event: React.KeyboardEvent<HTMLElement>) => {
      // Only handle shortcuts if history is enabled
      if (!isEnabled) {
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
    [apiRef, isEnabled],
  );

  useGridEvent(apiRef, 'cellKeyDown', runIf(historyQueueSize > 0, handleCellKeyDown));
  useGridEvent(apiRef, 'undo', onUndo);
  useGridEvent(apiRef, 'redo', onRedo);

  React.useEffect(() => {
    setHistoryState({
      enabled: isEnabled,
    });
  }, [isEnabled, setHistoryState]);

  React.useEffect(() => {
    if (!isValidationNeeded) {
      return () => {};
    }

    historyValidationEvents.forEach((eventName) => {
      validationEventUnsubscribersRef.current.push(
        apiRef.current.subscribeEvent(eventName, debouncedValidateQueueItems),
      );
    });

    return () => {
      validationEventUnsubscribersRef.current.forEach((unsubscribe) => unsubscribe());
      validationEventUnsubscribersRef.current = [];
    };
  }, [apiRef, isValidationNeeded, historyValidationEvents, debouncedValidateQueueItems]);

  React.useEffect(() => {
    if (historyQueueSize === 0) {
      return () => {};
    }

    const events = Object.keys(historyEventHandlers) as GridEvents[];
    // Subscribe to all events in the map
    events.forEach((eventName) => {
      const handler = historyEventHandlers[eventName];
      const unsubscribe = apiRef.current.subscribeEvent(eventName, (...params: any[]) => {
        // Don't store if the event was triggered by undo/redo
        if (operationStateRef.current !== 'idle') {
          return;
        }

        const data = handler.store(...params);
        if (data !== null) {
          addToQueue({ eventName, data });
        }
      });

      eventUnsubscribersRef.current.push(unsubscribe);
    });

    return () => {
      eventUnsubscribersRef.current.forEach((unsubscribe) => unsubscribe());
      eventUnsubscribersRef.current = [];
    };
  }, [apiRef, historyEventHandlers, historyQueueSize, addToQueue]);
};
