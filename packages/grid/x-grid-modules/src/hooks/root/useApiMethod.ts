import * as React from 'react';
import { GridApi, GridApiRef } from '../../models/api';
import { useLogger } from '../utils';

export function useApiMethod(apiRef: GridApiRef, apiMethods: Partial<GridApi>, apiName: string) {
  const logger = useLogger('useApiMethod');

  React.useEffect(() => {
    if (apiRef && apiRef.current) {
      let hasMethodsInstalled = true;

      Object.keys(apiMethods).forEach((methodName) => {
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
}
