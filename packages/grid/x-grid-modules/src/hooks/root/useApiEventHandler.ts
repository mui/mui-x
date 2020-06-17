import { useEffect } from 'react';
import { useLogger } from '../utils';
import { GridApiRef } from '../../models';

export const useApiEventHandler = (apiRef: GridApiRef, eventName: string, handler?: (args: any) => void) => {
  const logger = useLogger('useApiEventHandler');

  useEffect(() => {
    if (apiRef && apiRef.current && handler && eventName) {
      return apiRef.current!.registerEvent(eventName, handler);
    }
  }, [apiRef, logger, eventName, handler]);
};
