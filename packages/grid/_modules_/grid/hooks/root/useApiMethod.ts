import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { GridApi } from '../../models/api/gridApi';
import { useLogger } from '../utils/useLogger';

export function useApiMethod(apiRef: ApiRef, apiMethods: Partial<GridApi>, apiName: string) {
  const logger = useLogger('useApiMethod');

  const apiMethodsRef = React.useRef(apiMethods);

  React.useEffect(() => {
    apiMethodsRef.current = apiMethods;
  }, [apiMethods]);

  React.useEffect(() => {
    if (!apiRef.current.isInitialised) {
      return;
    }

    Object.keys(apiMethods).forEach((methodName) => {
      if (!apiRef.current.hasOwnProperty(methodName)) {
        logger.debug(`Adding ${apiName}.${methodName} to apiRef`);
        apiRef.current[methodName] = (...args) => {
          const start = new Date().getTime();
          const result = apiMethodsRef.current[methodName](...args);
          const end = new Date().getTime();
          if(end - start > 10) {
            console.log(`${methodName} took ${end - start}`);
          }
          return result;
        };
      }
    });
  }, [apiMethods, apiName, apiRef, logger]);
}
