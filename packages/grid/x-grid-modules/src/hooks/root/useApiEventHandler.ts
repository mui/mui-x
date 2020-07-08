import { useEffect } from 'react';
import { useLogger } from '../utils';
import { GridApiRef } from '../../models/api';

export const useApiEventHandler = (
  apiRef: GridApiRef,
  eventName: string,
  handler?: (args: any) => void,
) => {
  const logger = useLogger('useApiEventHandler');

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (apiRef && apiRef.current && handler && eventName) {
      return apiRef.current!.registerEvent(eventName, handler);
    }
  }, [apiRef, logger, eventName, handler]);
};
