import * as React from 'react';
import { GridPrivateApiCommon } from '../../models/api/gridApiCommon';

type GetPublicApiType<PrivateApi> = PrivateApi extends { getPublicApi: () => infer PublicApi }
  ? PublicApi
  : never;

export function useGridApiMethod<
  PrivateApi extends GridPrivateApiCommon,
  PublicApi extends GetPublicApiType<PrivateApi>,
  PrivateOnlyApi extends Omit<PrivateApi, keyof PublicApi>,
  V extends 'public' | 'private',
  T extends V extends 'public' ? Partial<PublicApi> : Partial<PrivateOnlyApi>,
>(privateApiRef: React.MutableRefObject<PrivateApi>, apiMethods: T, visibility: V) {
  const apiMethodsRef = React.useRef(apiMethods);
  const [apiMethodsNames] = React.useState(Object.keys(apiMethods) as Array<keyof T>);

  const installMethods = React.useCallback(() => {
    if (!privateApiRef.current) {
      return;
    }
    apiMethodsNames.forEach((methodName) => {
      if (!privateApiRef.current.hasOwnProperty(methodName)) {
        privateApiRef.current.register(visibility, {
          [methodName]: (...args: any[]) => {
            const fn = apiMethodsRef.current[methodName] as Function;
            return fn(...args);
          },
        });
      }
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
