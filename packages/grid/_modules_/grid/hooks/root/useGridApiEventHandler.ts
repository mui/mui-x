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
      if (options?.isFirst) {
        return apiRef.current.subscribeFirst(eventName, handler);
      }
      return apiRef.current.subscribeEvent(eventName, handler);
    }

    return undefined;
  }, [apiRef, logger, eventName, handler, options]);
}

export function useGridApiOptionHandler(
  apiRef: GridApiRef,
  eventName: string,
  handler?: (...args: any) => void,
) {
  // Validate that only one per event name?
  useGridApiEventHandler(apiRef, eventName, handler, { isFirst: true });
}
