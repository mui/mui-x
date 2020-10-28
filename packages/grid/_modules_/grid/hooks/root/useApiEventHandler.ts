import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { useLogger } from '../utils/useLogger';

export function useApiEventHandler(
  apiRef: ApiRef,
  eventName: string,
  handler?: (args: any) => void,
) {
  const logger = useLogger('useApiEventHandler');

  React.useEffect(() => {
    if (handler && eventName) {
      return apiRef.current.subscribeEvent(eventName, handler);
    }

    return undefined;
  }, [apiRef, logger, eventName, handler]);
}
