import * as React from 'react';
import { GridPrivateApiCommon } from '../../models/api/gridApiCommon';

export function useGridApiMethod<
  PrivateApi extends GridPrivateApiCommon,
  T extends Partial<PrivateApi>,
>(
  privateApiRef: React.MutableRefObject<PrivateApi>,
  apiMethods: T,
  visibility: 'public' | 'private',
) {
  const apiMethodsRef = React.useRef(apiMethods);
  const [apiMethodsNames] = React.useState(Object.keys(apiMethods));

  const installMethods = React.useCallback(() => {
    if (!privateApiRef.current) {
      return;
    }
    apiMethodsNames.forEach((methodName) => {
      privateApiRef.current.register(visibility, {
        [methodName]: (...args: any[]) =>
          apiMethodsRef.current[methodName as keyof GridPrivateApiCommon](...args),
      });
    });
  }, [apiMethodsNames, privateApiRef, visibility]);

  React.useEffect(() => {
    apiMethodsRef.current = apiMethods;
  }, [apiMethods]);

  React.useEffect(() => {
    installMethods();
  }, [installMethods]);

  installMethods();
}
