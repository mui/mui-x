import * as React from 'react';
import { GridApiCommon } from '../../models/api/gridApiCommon';

export function useGridApiMethod<Api extends GridApiCommon, T extends Partial<Api>>(
  apiRef: React.MutableRefObject<Api>,
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
        apiRef.current[methodName as keyof GridApiCommon] = (...args: any[]) =>
          apiMethodsRef.current[methodName as keyof GridApiCommon](...args);
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
