import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { useLogger } from '../utils/useLogger';

export function useGridApiEventHandler(
  apiRef: ApiRef,
  eventName: string,
  handler?: (args: any) => void,
) {
  const logger = useLogger('useGridApiEventHandler');

  React.useEffect(() => {
    if (handler && eventName) {
      return apiRef.current.subscribeEvent(eventName, handler);
    }

    return undefined;
  }, [apiRef, logger, eventName, handler]);
}
