import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApi } from '../../models/api/gridApi';

export function useGridApiMethod<T extends Partial<GridApi>>(
  apiRef: GridApiRef,
  apiMethods: T,
  // TODO: Remove `apiName
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  apiName: string,
) {
  const apiMethodsRef = React.useRef(apiMethods);
  const [apiMethodsNames] = React.useState(Object.keys(apiMethods));

  const installMethods = React.useCallback(() => {
    if (!apiRef.current) {
      return;
    }
    apiMethodsNames.forEach((methodName) => {
      if (!apiRef.current.hasOwnProperty(methodName)) {
        apiRef.current[methodName] = (...args) => apiMethodsRef.current[methodName](...args);
      }
    });
  }, [apiMethodsNames, apiRef]);

  React.useEffect(() => {
    apiMethodsRef.current = apiMethods;
  }, [apiMethods]);

  React.useEffect(() => {
    installMethods();
  }, [installMethods]);

  installMethods();
}
