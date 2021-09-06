import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApi } from '../../models/api/gridApi';
import {
  GridListener,
  GridSubscribeEventOptions,
  GridValidEvent,
} from '../../utils/eventEmitter/GridEventEmitter';

// TODO: Remove once [[GridApi]] cycle dependency is fixed
/**
 * Callback details.
 */
export interface GridCallbackDetails {
  api?: GridApi;
}

/**
 * Signal to the underlying logic what version of the public component API
 * of the data grid is exposed.
 */
export enum GridSignature {
  DataGrid = 'DataGrid',
  DataGridPro = 'DataGridPro',
}

export function useGridApiEventHandler<Params, Event extends GridValidEvent>(
  apiRef: GridApiRef,
  eventName: string,
  handler?: GridListener<Params, Event>,
  options?: GridSubscribeEventOptions,
) {
  const subscription = React.useRef<(() => void) | null>(null);
  const handlerRef = React.useRef<GridListener<Params, Event> | undefined>();
  handlerRef.current = handler;

  if (!subscription.current && handlerRef.current) {
    const enhancedHandler: GridListener<Params, Event> = (params, event, details) => {
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
    return () => {
      subscription.current?.();
    };
  }, []);
}

const optionsSubscriberOptions: GridSubscribeEventOptions = { isFirst: true };

export function useGridApiOptionHandler<Params, Event extends GridValidEvent>(
  apiRef: GridApiRef,
  eventName: string,
  handler?: GridListener<Params, Event>,
) {
  // Validate that only one per event name?
  useGridApiEventHandler<Params, Event>(apiRef, eventName, handler, optionsSubscriberOptions);
}
