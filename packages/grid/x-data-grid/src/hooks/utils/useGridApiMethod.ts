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

  /* eslint-disable react-hooks/exhaustive-deps */
  const installMethods = React.useCallback(() => {
    Object.keys(apiMethodsRef.current).forEach((methodName) => {
      privateApiRef.current.register(visibility, {
        [methodName]: apiMethodsRef.current[methodName as keyof typeof apiMethods],
      });
    });
  }, [privateApiRef, visibility, apiMethods]);
  /* eslint-enable react-hooks/exhaustive-deps */

  React.useEffect(() => {
    apiMethodsRef.current = apiMethods;
  }, [apiMethods]);

  React.useEffect(installMethods, [installMethods]);

  installMethods();
}
