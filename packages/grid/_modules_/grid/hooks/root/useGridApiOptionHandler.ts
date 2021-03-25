import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { useLogger } from '../utils/useLogger';

export function useGridApiOptionHandler(
  apiRef: GridApiRef,
  eventName: string,
  handler?: (...args: any) => void,
) {
  const logger = useLogger('useGridApiOptionHandler');

  React.useEffect(() => {
    if (handler && eventName) {
      return apiRef.current.subscribeEvent(eventName, handler);
    }

    return undefined;
  }, [apiRef, logger, eventName, handler]);
}
