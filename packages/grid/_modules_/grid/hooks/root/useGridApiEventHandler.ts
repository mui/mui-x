import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { useLogger } from '../utils/useLogger';

export function useGridApiEventHandler(
  apiRef: GridApiRef,
  eventName: string,
  handler?: (...args: any) => void,
  isFirst?: boolean,
) {
  const logger = useLogger('useGridApiEventHandler');

  React.useEffect(() => {
    if (handler && eventName) {
      if (isFirst) {
        return apiRef.current.subscribeFirst(eventName, handler);
      }
      return apiRef.current.subscribeEvent(eventName, handler);
    }

    return undefined;
  }, [apiRef, logger, eventName, handler, isFirst]);
}

export function useGridApiOptionHandler(
  apiRef: GridApiRef,
  eventName: string,
  handler?: (...args: any) => void,
) {
  // Validate that only one per event name?
  useGridApiEventHandler(apiRef, eventName, handler, true);
}
