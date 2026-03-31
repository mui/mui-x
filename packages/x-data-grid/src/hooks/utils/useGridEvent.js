'use client';
import * as React from 'react';
import { TimerBasedCleanupTracking } from '../../utils/cleanupTracking/TimerBasedCleanupTracking';
import { FinalizationRegistryBasedCleanupTracking } from '../../utils/cleanupTracking/FinalizationRegistryBasedCleanupTracking';
// Based on https://github.com/Bnaya/use-dispose-uncommitted/blob/main/src/finalization-registry-based-impl.ts
// Check https://github.com/facebook/react/issues/15317 to get more information
// We use class to make it easier to detect in heap snapshots by name
class ObjectToBeRetainedByReact {
    static create() {
        return new ObjectToBeRetainedByReact();
    }
}
const registryContainer = {
    current: createRegistry(),
};
let cleanupTokensCounter = 0;
export function useGridEvent(apiRef, eventName, handler, options) {
    const objectRetainedByReact = React.useState(ObjectToBeRetainedByReact.create)[0];
    const subscription = React.useRef(null);
    const handlerRef = React.useRef(null);
    handlerRef.current = handler;
    const cleanupTokenRef = React.useRef(null);
    if (!subscription.current && handlerRef.current) {
        const enhancedHandler = (params, event, details) => {
            // Check for the existence of the event once more to avoid Safari 26 issue
            // https://github.com/mui/mui-x/issues/20159
            if (event && !event.defaultMuiPrevented) {
                handlerRef.current?.(params, event, details);
            }
        };
        subscription.current = apiRef.current.subscribeEvent(eventName, enhancedHandler, options);
        cleanupTokensCounter += 1;
        cleanupTokenRef.current = { cleanupToken: cleanupTokensCounter };
        registryContainer.current.register(objectRetainedByReact, // The callback below will be called once this reference stops being retained
        () => {
            subscription.current?.();
            subscription.current = null;
            cleanupTokenRef.current = null;
        }, cleanupTokenRef.current);
    }
    else if (!handlerRef.current && subscription.current) {
        subscription.current();
        subscription.current = null;
        if (cleanupTokenRef.current) {
            registryContainer.current.unregister(cleanupTokenRef.current);
            cleanupTokenRef.current = null;
        }
    }
    React.useEffect(() => {
        if (!subscription.current && handlerRef.current) {
            const enhancedHandler = (params, event, details) => {
                // Check for the existence of the event once more to avoid Safari 26 issue
                // https://github.com/mui/mui-x/issues/20159
                if (event && !event.defaultMuiPrevented) {
                    handlerRef.current?.(params, event, details);
                }
            };
            subscription.current = apiRef.current.subscribeEvent(eventName, enhancedHandler, options);
        }
        if (cleanupTokenRef.current && registryContainer.current) {
            // If the effect was called, it means that this render was committed
            // so we can trust the cleanup function to remove the listener.
            registryContainer.current.unregister(cleanupTokenRef.current);
            cleanupTokenRef.current = null;
        }
        return () => {
            subscription.current?.();
            subscription.current = null;
        };
    }, [apiRef, eventName, options]);
}
const OPTIONS_IS_FIRST = { isFirst: true };
export function useGridEventPriority(apiRef, eventName, handler) {
    useGridEvent(apiRef, eventName, handler, OPTIONS_IS_FIRST);
}
// TODO: move to @mui/x-data-grid/internals
// eslint-disable-next-line @typescript-eslint/naming-convention
export function unstable_resetCleanupTracking() {
    registryContainer.current?.reset();
    registryContainer.current = createRegistry();
}
// eslint-disable-next-line @typescript-eslint/naming-convention
export const internal_registryContainer = registryContainer;
function createRegistry() {
    return typeof FinalizationRegistry !== 'undefined'
        ? new FinalizationRegistryBasedCleanupTracking()
        : new TimerBasedCleanupTracking();
}
