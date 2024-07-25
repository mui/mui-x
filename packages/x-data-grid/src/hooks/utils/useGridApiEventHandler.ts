import * as React from 'react';
import { EventListenerOptions } from '@mui/x-internals/EventManager';
import { GridEventListener, GridEvents } from '../../models/events';
import { UnregisterToken, CleanupTracking } from '../../utils/cleanupTracking/CleanupTracking';
import { TimerBasedCleanupTracking } from '../../utils/cleanupTracking/TimerBasedCleanupTracking';
import { FinalizationRegistryBasedCleanupTracking } from '../../utils/cleanupTracking/FinalizationRegistryBasedCleanupTracking';
import type { GridApiCommon } from '../../models';

/**
 * Signal to the underlying logic what version of the public component API
 * of the data grid is exposed.
 */
enum GridSignature {
  DataGrid = 'DataGrid',
  DataGridPro = 'DataGridPro',
  DataGridPremium = 'DataGridPremium',
}

interface RegistryContainer {
  registry: CleanupTracking | null;
}

// We use class to make it easier to detect in heap snapshots by name
class ObjectToBeRetainedByReact {}

// Based on https://github.com/Bnaya/use-dispose-uncommitted/blob/main/src/finalization-registry-based-impl.ts
// Check https://github.com/facebook/react/issues/15317 to get more information
export function createUseGridApiEventHandler(registryContainer: RegistryContainer) {
  let cleanupTokensCounter = 0;

  return function useGridApiEventHandler<Api extends GridApiCommon, E extends GridEvents>(
    apiRef: React.MutableRefObject<Api>,
    eventName: E,
    handler?: GridEventListener<E>,
    options?: EventListenerOptions,
  ) {
    if (registryContainer.registry === null) {
      registryContainer.registry =
        typeof FinalizationRegistry !== 'undefined'
          ? new FinalizationRegistryBasedCleanupTracking()
          : new TimerBasedCleanupTracking();
    }

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

      registryContainer.registry.register(
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
        registryContainer.registry.unregister(cleanupTokenRef.current);
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

      if (cleanupTokenRef.current && registryContainer.registry) {
        // If the effect was called, it means that this render was committed
        // so we can trust the cleanup function to remove the listener.
        registryContainer.registry.unregister(cleanupTokenRef.current);
        cleanupTokenRef.current = null;
      }

      return () => {
        subscription.current?.();
        subscription.current = null;
      };
    }, [apiRef, eventName, options]);
  };
}

const registryContainer: RegistryContainer = { registry: null };

// TODO: move to @mui/x-data-grid/internals
// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_resetCleanupTracking = () => {
  registryContainer.registry?.reset();
  registryContainer.registry = null;
};

export const useGridApiEventHandler = createUseGridApiEventHandler(registryContainer);

const optionsSubscriberOptions: EventListenerOptions = { isFirst: true };

export function useGridApiOptionHandler<Api extends GridApiCommon, E extends GridEvents>(
  apiRef: React.MutableRefObject<Api>,
  eventName: E,
  handler?: GridEventListener<E>,
) {
  // Validate that only one per event name?
  useGridApiEventHandler(apiRef, eventName, handler, optionsSubscriberOptions);
}

export { GridSignature };
