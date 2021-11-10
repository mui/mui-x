import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { EventListenerOptions } from '../../utils/EventManager';
import { MuiEvent } from '../../models/muiEvent';
import { GridEventListener } from '../../models/gridEventListener';

/**
 * Signal to the underlying logic what version of the public component API
 * of the data grid is exposed.
 */
export enum GridSignature {
  DataGrid = 'DataGrid',
  DataGridPro = 'DataGridPro',
}

export function useGridApiEventHandler<Params, Event extends MuiEvent>(
  apiRef: GridApiRef,
  eventName: string,
  handler?: GridEventListener<Params, Event>,
  options?: EventListenerOptions,
) {
  const subscription = React.useRef<(() => void) | null>(null);
  const handlerRef = React.useRef<GridEventListener<Params, Event> | undefined>();
  handlerRef.current = handler;

  if (!subscription.current && handlerRef.current) {
    const enhancedHandler: GridEventListener<Params, Event> = (params, event, details) => {
      if (!event.defaultMuiPrevented) {
        handlerRef.current?.(params, event, details);
      }
    };

    subscription.current = apiRef.current.subscribeEvent<Params, Event>(
      eventName,
      enhancedHandler,
      options,
    );
  } else if (!handlerRef.current && subscription.current) {
    subscription.current();
    subscription.current = null;
  }

  React.useEffect(() => {
    if (!subscription.current && handlerRef.current) {
      const enhancedHandler: GridEventListener<Params, Event> = (params, event, details) => {
        if (!event.defaultMuiPrevented) {
          handlerRef.current?.(params, event, details);
        }
      };

      subscription.current = apiRef.current.subscribeEvent<Params, Event>(
        eventName,
        enhancedHandler,
        options,
      );
    }

    return () => {
      subscription.current?.();
      subscription.current = null;
    };
  }, [apiRef, eventName, options]);
}

const optionsSubscriberOptions: EventListenerOptions = { isFirst: true };

export function useGridApiOptionHandler<Params, Event extends MuiEvent>(
  apiRef: GridApiRef,
  eventName: string,
  handler?: GridEventListener<Params, Event>,
) {
  // Validate that only one per event name?
  useGridApiEventHandler<Params, Event>(apiRef, eventName, handler, optionsSubscriberOptions);
}
