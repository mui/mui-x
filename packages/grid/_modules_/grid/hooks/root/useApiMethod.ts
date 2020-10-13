import * as React from 'react';
import { ApiRef, GridApi } from '../../models/api';
import { useLogger } from '../utils';

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
          return apiMethodsRef.current[methodName](...args);
        }
      }
    });
  }, [apiMethods, apiName, apiRef, logger]);
}
