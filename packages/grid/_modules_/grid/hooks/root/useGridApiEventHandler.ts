import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { useLogger } from '../utils/useLogger';

export function useGridApiEventHandler(
  apiRef: GridApiRef,
  eventName: string,
  handler?: (...args: any) => void,
  options?: { isFirst?: boolean },
) {
  const logger = useLogger('useGridApiEventHandler');

  React.useEffect(() => {
    if (handler && eventName) {
      return apiRef.current.subscribeEvent(eventName, handler, options);
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
