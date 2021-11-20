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

  React.useEffect(() => {
    if (handler) {
      const enhancedHandler: GridEventListener<Params, Event> = (params, event, details) => {
        if (!event.defaultMuiPrevented) {
          handler?.(params, event, details);
        }
      };

      subscription.current = apiRef.current.subscribeEvent<Params, Event>(
        eventName,
        enhancedHandler,
        options,
      );
    }

    return () => {
      if (subscription.current) {
        subscription.current?.();
        subscription.current = null;
      }
    };
  }, [apiRef, eventName, handler, options]);
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
