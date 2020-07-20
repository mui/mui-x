import * as React from 'react';
import { useLogger } from '../utils';
import { ApiRef } from '../../models/api';

export function useApiEventHandler(
  apiRef: ApiRef,
  eventName: string,
  handler?: (args: any) => void,
) {
  const logger = useLogger('useApiEventHandler');

  React.useEffect(() => {
    if (apiRef && apiRef.current && handler && eventName) {
      return apiRef.current!.registerEvent(eventName, handler);
    }

    return undefined;
  }, [apiRef, logger, eventName, handler]);
}
