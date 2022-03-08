import * as React from 'react';
import { GridApiCommon, GridPrivateApiCommon } from '../../models/api/gridApiCommon';

export function useGridApiMethod<Api extends GridApiCommon, T extends Partial<Api>>(
  apiRef: React.MutableRefObject<Api>,
  apiMethods: T,
  // TODO: Remove `apiName
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  apiName: string,
) {
  const apiMethodsRef = React.useRef(apiMethods);
  const [apiMethodsNames] = React.useState(() => Object.keys(apiMethods));

  const installMethods = React.useCallback(() => {
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

export const useGridRegisterMethods = <
  PublicApi extends GridApiCommon,
  PrivateApi extends GridPrivateApiCommon,
  V extends 'public' | 'private',
  T extends V extends 'public' ? Partial<PublicApi> : Partial<PrivateApi>,
>(
  apiRef: React.MutableRefObject<PublicApi & PrivateApi>,
  visibility: V,
  apiMethods: T,
) => {
  const apiMethodsRef = React.useRef(apiMethods);

  const installMethods = React.useCallback(() => {
    apiRef.current.register(visibility, apiMethodsRef);
  }, [visibility, apiRef]);

  React.useEffect(() => {
    apiMethodsRef.current = apiMethods;
  }, [apiMethods]);

  React.useEffect(() => {
    installMethods();
  }, [installMethods]);

  installMethods();
};
