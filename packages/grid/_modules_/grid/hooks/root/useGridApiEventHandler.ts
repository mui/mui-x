import * as React from 'react';
import { MuiEvent } from '../../models/gridOptions';
import { GridApiRef } from '../../models/api/gridApiRef';
import { useLogger } from '../utils/useLogger';
import { GridApi } from '../../models/api/gridApi';

// TODO: Remove once [[GridApi]] cycle dependency is fixed
/**
 * Callback details.
 */
export interface GridCallbackDetails {
  api?: GridApi;
}

/**
 * Signature enum.
 */
export enum Signature {
  DataGrid = 'DataGrid',
  XGrid = 'XGrid',
}

export function useGridApiEventHandler(
  apiRef: GridApiRef,
  eventName: string,
  handler?: (...args: any) => void,
  options?: { isFirst?: boolean },
) {
  const logger = useLogger('useGridApiEventHandler');

  React.useEffect(() => {
    if (handler && eventName) {
      const enhancedHandler = (
        params: any,
        event: MuiEvent<React.SyntheticEvent | DocumentEventMap[keyof DocumentEventMap] | {}>,
        details: GridCallbackDetails,
      ) => {
        if (!event.defaultMuiPrevented) {
          handler(params, event, details);
        }
      };
      return apiRef.current.subscribeEvent(eventName, enhancedHandler, options);
    }

    return undefined;
  }, [apiRef, logger, eventName, handler, options]);
}

const optionsSubscriberOptions = { isFirst: true };
export function useGridApiOptionHandler(
  apiRef: GridApiRef,
  eventName: string,
  handler?: (...args: any) => void,
) {
  // Validate that only one per event name?
  useGridApiEventHandler(apiRef, eventName, handler, optionsSubscriberOptions);
}
