import * as React from 'react';
import { MuiEvent } from '../../models/muiEvent';
import { GridApiRef } from '../../models/api/gridApiRef';
import { useGridLogger } from '../utils/useGridLogger';
import { GridCallbackDetails } from '../../models/api/gridCallbackDetails';

/**
 * Signal to the underlying logic what version of the public component API
 * of the data grid is exposed.
 */
export enum GridSignature {
  DataGrid = 'DataGrid',
  DataGridPro = 'DataGridPro',
}

export function useGridApiEventHandler(
  apiRef: GridApiRef,
  eventName: string,
  handler?: (...args: any) => void,
  options?: { isFirst?: boolean },
) {
  const logger = useGridLogger(apiRef, 'useGridApiEventHandler');

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
