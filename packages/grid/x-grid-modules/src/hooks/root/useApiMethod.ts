import { GridApi } from '../../models';
import { useEffect } from 'react';
import { useLogger } from '../utils';
import { GridApiRef } from '../../models';

export const useApiMethod = (apiRef: GridApiRef, apiMethods: Partial<GridApi>, apiName: string) => {
  const logger = useLogger('useApiMethod');

  useEffect(() => {
    if (apiRef && apiRef.current) {
      let hasMethodsInstalled = true;

      Object.keys(apiMethods).forEach(methodName => {
        if (!apiRef.current!.hasOwnProperty(methodName)) {
          hasMethodsInstalled = false;
        }
      });

      if (!hasMethodsInstalled) {
        logger.debug(`Adding ${apiName} to apiRef`);
        apiRef.current = Object.assign(apiRef.current, apiMethods) as GridApi;
      }
    }
  }, [apiRef, apiMethods, logger, apiName]);
};
