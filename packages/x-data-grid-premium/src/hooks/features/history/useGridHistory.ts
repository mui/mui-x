'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { isObjectEmpty } from '@mui/x-internals/isObjectEmpty';
import debounce from '@mui/utils/debounce';
import {
  useGridEvent,
  useGridApiMethod,
  type GridStateInitializer,
  isUndoShortcut,
  isRedoShortcut,
  runIf,
  useGridNativeEventListener,
} from '@mui/x-data-grid-pro/internals';
import type { GridEvents } from '@mui/x-data-grid-pro';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type {
  GridHistoryApi,
  GridHistoryState,
  GridHistoryItem,
  GridHistoryEventHandler,
} from './gridHistoryInterfaces';
import {
  gridHistoryCurrentPositionSelector,
  gridHistoryStackSelector,
  gridHistoryCanUndoSelector,
  gridHistoryCanRedoSelector,
} from './gridHistorySelectors';
import { createDefaultHistoryHandlers } from './defaultHistoryHandlers';

export const historyStateInitializer: GridStateInitializer = (state) => {
  return {
    ...state,
    history: {
      stack: [],
      currentPosition: -1,
      enabled: false,
    },
  };
};

export const useGridHistory = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'columns'
    | 'isCellEditable'
    | 'dataSource'
    | 'historyStackSize'
    | 'historyEventHandlers'
    | 'historyValidationEvents'
    | 'onUndo'
    | 'onRedo'
  >,
) => {
  const { historyStackSize, onUndo, onRedo, historyValidationEvents } = props;

  // Use default history events if none provided
  const historyEventHandlers = React.useMemo(() => {
    if (props.historyEventHandlers && !isObjectEmpty(props.historyEventHandlers)) {
      return props.historyEventHandlers;
    }
    return createDefaultHistoryHandlers(apiRef, {
      dataSource: props.dataSource,
      columns: props.columns,
      isCellEditable: props.isCellEditable,
    });
  }, [apiRef, props.columns, props.isCellEditable, props.dataSource, props.historyEventHandlers]);

  const isEnabled = React.useMemo(
    () => historyStackSize > 0 && !isObjectEmpty(historyEventHandlers),
    [historyStackSize, historyEventHandlers],
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
  // - 'waiting-replay': after undo/redo handler is done, the validation event is triggered again (as undo/redo is changing the state).
  //   In this hook we want to skip the replayed event.
  const operationStateRef = React.useRef<'idle' | 'in-progress' | 'waiting-replay'>('idle');

  // History event unsubscribers
  const eventUnsubscribersRef = React.useRef<(() => void)[]>([]);
  // Validation event unsubscribers
  const validationEventUnsubscribersRef = React.useRef<(() => void)[]>([]);

  const updateHistoryState = React.useCallback(
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

  const addToStack = React.useCallback(
    (item: GridHistoryItem) => {
      const currentPosition = gridHistoryCurrentPositionSelector(apiRef);
      let newStack = [...gridHistoryStackSelector(apiRef)];

      // If we're not at the end of the stack, truncate forward history
      if (currentPosition < newStack.length - 1) {
        newStack = newStack.slice(0, currentPosition + 1);
      }

      // Add the new item
      newStack.push(item);

      // If stack exceeds size, remove oldest items
      if (newStack.length > historyStackSize) {
        newStack = newStack.slice(newStack.length - historyStackSize);
      }

      updateHistoryState({
        stack: newStack,
        currentPosition: newStack.length - 1,
      });
    },
    [apiRef, updateHistoryState, historyStackSize],
  );

  const clear = React.useCallback(() => {
    updateHistoryState({
      stack: [],
      currentPosition: -1,
    });
  }, [updateHistoryState]);

  const clearUndoItems = React.useCallback(() => {
    const stack = gridHistoryStackSelector(apiRef);
    const currentPosition = gridHistoryCurrentPositionSelector(apiRef);

    // If we're at the end of the stack (no redo items), clear everything
    if (currentPosition >= stack.length - 1) {
      clear();
    } else {
      updateHistoryState({
        stack: stack.slice(currentPosition + 1),
        currentPosition: -1,
      });
    }
  }, [apiRef, clear, updateHistoryState]);

  const clearRedoItems = React.useCallback(() => {
    const stack = gridHistoryStackSelector(apiRef);
    const currentPosition = gridHistoryCurrentPositionSelector(apiRef);
    updateHistoryState({
      stack: stack.slice(0, currentPosition + 1),
    });
  }, [apiRef, updateHistoryState]);

  const canUndo = React.useCallback(() => gridHistoryCanUndoSelector(apiRef), [apiRef]);
  const canRedo = React.useCallback(() => gridHistoryCanRedoSelector(apiRef), [apiRef]);

  const validateStackItems = React.useCallback(() => {
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

    const stack = gridHistoryStackSelector(apiRef);
    const currentPosition = gridHistoryCurrentPositionSelector(apiRef);

    if (historyStackSize === 0) {
      if (stack.length > 0) {
        clear();
      }
      return;
    }

    if (stack.length === 0) {
      return;
    }

    const newStack = [...stack];

    // Redo check
    if (currentPosition + 1 < newStack.length) {
      const item = newStack[currentPosition + 1];
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
      const item = newStack[currentPosition];
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
  }, [apiRef, historyEventHandlers, historyStackSize, clear, clearUndoItems, clearRedoItems]);

  const debouncedValidateStackItems = React.useMemo(
    () => debounce(validateStackItems, 0),
    [validateStackItems],
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

      updateHistoryState({
        currentPosition: operation === 'undo' ? currentPosition - 1 : currentPosition + 1,
      });

      apiRef.current.publishEvent(operation, { eventName, data });
      // If there are no validations in the current setup, skip calling it and change the operation state to idle
      if (isValidationNeeded) {
        validateStackItems();
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
      updateHistoryState,
      validateStackItems,
    ],
  );

  const undo = React.useCallback(async (): Promise<boolean> => {
    if (!canUndo()) {
      return false;
    }

    const stack = gridHistoryStackSelector(apiRef);
    const currentPosition = gridHistoryCurrentPositionSelector(apiRef);
    return apply(stack[currentPosition], 'undo');
  }, [apiRef, apply, canUndo]);

  const redo = React.useCallback(async (): Promise<boolean> => {
    if (!canRedo()) {
      return false;
    }

    const stack = gridHistoryStackSelector(apiRef);
    const currentPosition = gridHistoryCurrentPositionSelector(apiRef);
    return apply(stack[currentPosition + 1], 'redo');
  }, [apiRef, apply, canRedo]);

  const historyApi: GridHistoryApi['history'] = {
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
  };

  useGridApiMethod(apiRef, { history: historyApi } as GridHistoryApi, 'public');

  const handleKeyDown = React.useCallback(
    async (event: React.KeyboardEvent<HTMLElement>) => {
      if (!isUndoShortcut(event) && !isRedoShortcut(event)) {
        return;
      }

      const action = isUndoShortcut(event)
        ? apiRef.current.history.undo
        : apiRef.current.history.redo;
      event.preventDefault();
      event.stopPropagation();

      await action();
    },
    [apiRef],
  );

  useGridNativeEventListener(
    apiRef,
    () => apiRef.current.rootElementRef.current,
    'keydown',
    runIf(isEnabled, handleKeyDown),
  );

  useGridEvent(apiRef, 'undo', onUndo);
  useGridEvent(apiRef, 'redo', onRedo);

  React.useEffect(() => {
    updateHistoryState({
      enabled: isEnabled,
    });
  }, [isEnabled, updateHistoryState]);

  React.useEffect(() => {
    if (!isValidationNeeded) {
      return () => {};
    }

    historyValidationEvents.forEach((eventName) => {
      validationEventUnsubscribersRef.current.push(
        apiRef.current.subscribeEvent(eventName, debouncedValidateStackItems),
      );
    });

    return () => {
      validationEventUnsubscribersRef.current.forEach((unsubscribe) => unsubscribe());
      validationEventUnsubscribersRef.current = [];
    };
  }, [apiRef, isValidationNeeded, historyValidationEvents, debouncedValidateStackItems]);

  React.useEffect(() => {
    if (historyStackSize === 0) {
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
          addToStack({ eventName, data });
        }
      });

      eventUnsubscribersRef.current.push(unsubscribe);
    });

    return () => {
      eventUnsubscribersRef.current.forEach((unsubscribe) => unsubscribe());
      eventUnsubscribersRef.current = [];
    };
  }, [apiRef, historyEventHandlers, historyStackSize, addToStack]);

  // If the stack size is changed and it is smaller than the current stack size, clear the stack
  React.useEffect(() => {
    const currentStackSize = gridHistoryStackSelector(apiRef).length;
    if (currentStackSize > historyStackSize) {
      clear();
    }
  }, [apiRef, historyStackSize, clear]);
};
