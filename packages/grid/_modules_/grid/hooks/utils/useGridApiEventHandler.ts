import * as React from 'react';
import { GridEventListener, GridEventsStr } from '../../models/events';
import { UnregisterToken, CleanupTracking } from '../../utils/cleanupTracking/CleanupTracking';
import { EventListenerOptions } from '../../utils/EventManager';
import { TimerBasedCleanupTracking } from '../../utils/cleanupTracking/TimerBasedCleanupTracking';
import { FinalizationRegistryBasedCleanupTracking } from '../../utils/cleanupTracking/FinalizationRegistryBasedCleanupTracking';
import { GridApiCommon } from '../../models';

/**
 * Signal to the underlying logic what version of the public component API
 * of the data grid is exposed.
 */
export enum GridSignature {
  DataGrid = 'DataGrid',
  DataGridPro = 'DataGridPro',
}

// We use class to make it easier to detect in heap snapshots by name
class ObjectToBeRetainedByReact {}

// Based on https://github.com/Bnaya/use-dispose-uncommitted/blob/main/src/finalization-registry-based-impl.ts
// Check https://github.com/facebook/react/issues/15317 to get more information
export function createUseGridApiEventHandler(registry: CleanupTracking) {
  let cleanupTokensCounter = 0;

  return function useGridApiEventHandler<Api extends GridApiCommon, E extends GridEventsStr>(
    apiRef: React.MutableRefObject<Api>,
    eventName: E,
    handler?: GridEventListener<E>,
    options?: EventListenerOptions,
  ) {
    const [objectRetainedByReact] = React.useState(new ObjectToBeRetainedByReact());
    const subscription = React.useRef<(() => void) | null>(null);
    const handlerRef = React.useRef<GridEventListener<E> | undefined>();
    handlerRef.current = handler;
    const cleanupTokenRef = React.useRef<UnregisterToken | null>(null);

    if (!subscription.current && handlerRef.current) {
      const enhancedHandler: GridEventListener<E> = (params, event, details) => {
        if (!event.defaultMuiPrevented) {
          handlerRef.current?.(params, event, details);
        }
      };

      subscription.current = apiRef.current.subscribeEvent(eventName, enhancedHandler, options);

      cleanupTokensCounter += 1;
      cleanupTokenRef.current = { cleanupToken: cleanupTokensCounter };

      registry.register(
        objectRetainedByReact, // The callback below will be called once this reference stops being retained
        () => {
          subscription.current?.();
          subscription.current = null;
          cleanupTokenRef.current = null;
        },
        cleanupTokenRef.current,
      );
    } else if (!handlerRef.current && subscription.current) {
      subscription.current();
      subscription.current = null;

      if (cleanupTokenRef.current) {
        registry.unregister(cleanupTokenRef.current);
        cleanupTokenRef.current = null;
      }
    }

    React.useEffect(() => {
      if (!subscription.current && handlerRef.current) {
        const enhancedHandler: GridEventListener<E> = (params, event, details) => {
          if (!event.defaultMuiPrevented) {
            handlerRef.current?.(params, event, details);
          }
        };

        subscription.current = apiRef.current.subscribeEvent(eventName, enhancedHandler, options);
      }

      if (cleanupTokenRef.current && registry) {
        // If the effect was called, it means that this render was committed
        // so we can trust the cleanup function to remove the listener.
        registry.unregister(cleanupTokenRef.current);
        cleanupTokenRef.current = null;
      }

      return () => {
        subscription.current?.();
        subscription.current = null;
      };
    }, [apiRef, eventName, options]);
  };
}

let registry: CleanupTracking;

if (process.env.NODE_ENV === 'test') {
  // Use the timer-based implementation when testing
  registry = new TimerBasedCleanupTracking();
} else {
  registry =
    typeof FinalizationRegistry !== 'undefined'
      ? new FinalizationRegistryBasedCleanupTracking()
      : new TimerBasedCleanupTracking();
}

export const useGridApiEventHandler = createUseGridApiEventHandler(registry);

const optionsSubscriberOptions: EventListenerOptions = { isFirst: true };

export function useGridApiOptionHandler<Api extends GridApiCommon, E extends GridEventsStr>(
  apiRef: React.MutableRefObject<Api>,
  eventName: E,
  handler?: GridEventListener<E>,
) {
  // Validate that only one per event name?
  useGridApiEventHandler(apiRef, eventName, handler, optionsSubscriberOptions);
}
