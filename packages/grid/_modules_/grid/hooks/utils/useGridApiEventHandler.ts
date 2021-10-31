import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridEventListener, GridEvents, GridEventsStr } from '../../models/events';
import { EventListenerOptions } from '../../utils/EventManager';

/**
 * Signal to the underlying logic what version of the public component API
 * of the data grid is exposed.
 */
export enum GridSignature {
  DataGrid = 'DataGrid',
  DataGridPro = 'DataGridPro',
}

export function useGridApiEventHandler<E extends GridEventsStr>(
  apiRef: GridApiRef,
  eventName: E,
  handler?: GridEventListener<E>,
  options?: EventListenerOptions,
) {
  const subscription = React.useRef<(() => void) | null>(null);
  const handlerRef = React.useRef<GridEventListener<E> | undefined>();
  handlerRef.current = handler;

  if (!subscription.current && handlerRef.current) {
    const enhancedHandler: GridEventListener<E> = (params, event, details) => {
      if (!event.defaultMuiPrevented) {
        handlerRef.current?.(params, event, details);
      }
    };

    subscription.current = apiRef.current.subscribeEvent(eventName, enhancedHandler, options);
  } else if (!handlerRef.current && subscription.current) {
    subscription.current();
    subscription.current = null;
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

    return () => {
      subscription.current?.();
      subscription.current = null;
    };
  }, [apiRef, eventName, options]);
}

const optionsSubscriberOptions: EventListenerOptions = { isFirst: true };

export function useGridApiOptionHandler<E extends GridEvents>(
  apiRef: GridApiRef,
  eventName: E,
  handler?: GridEventListener<E>,
) {
  // Validate that only one per event name?
  useGridApiEventHandler(apiRef, eventName, handler, optionsSubscriberOptions);
}
