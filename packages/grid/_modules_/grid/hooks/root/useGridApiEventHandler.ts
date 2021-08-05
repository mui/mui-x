import * as React from 'react';
import { MuiEvent } from '../../models/gridOptions';
import { GridApiRef } from '../../models/api/gridApiRef';
import { useLogger } from '../utils/useLogger';
import { useGridSelector } from '../features/core/useGridSelector';
import { optionsSelector } from '../utils/optionsSelector';
import { GridApi } from '../../models/api/gridApi';

// TODO: Remove once [[GridApi]] cycle dependency is fixed
/**
 * Callback details.
 */
export interface MuiCallbackDetails {
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
  const { signature } = useGridSelector(apiRef, optionsSelector);

  React.useEffect(() => {
    if (handler && eventName) {
      const enhancedHandler = (
        params: any,
        event: MuiEvent<React.SyntheticEvent | DocumentEventMap[keyof DocumentEventMap] | {}>,
        details: MuiCallbackDetails = {},
      ) => {
        if (signature === Signature.XGrid) {
          details.api = apiRef.current;
        }

        if (!event.defaultMuiPrevented) {
          handler(params, event, details);
        }
      };
      return apiRef.current.subscribeEvent(eventName, enhancedHandler, options);
    }

    return undefined;
  }, [apiRef, logger, eventName, handler, options, signature]);
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
