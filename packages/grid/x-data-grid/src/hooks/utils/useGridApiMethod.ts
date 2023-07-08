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

  const installMethods = React.useCallback(() => {
    Object.keys(apiMethodsRef.current).forEach((methodName) => {
      if (!privateApiRef.current.hasOwnProperty(methodName)) {
        privateApiRef.current.register(visibility, {
          [methodName]: (...args: any[]) => {
            const fn = (apiMethodsRef.current as any)[methodName] as Function;
            return fn(...args);
          },
        });
      }
    });
  }, [privateApiRef, visibility]);

  React.useEffect(() => {
    apiMethodsRef.current = apiMethods;
  }, [apiMethods]);

  React.useEffect(() => {
    installMethods();
  }, [installMethods]);

  installMethods();
}
