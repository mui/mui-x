import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
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
>(privateApiRef: React.RefObject<PrivateApi>, apiMethods: T, visibility: V) {
  const isFirstRender = React.useRef(true);

  useEnhancedEffect(() => {
    isFirstRender.current = false;
    privateApiRef.current.register(visibility, apiMethods);
  }, [privateApiRef, visibility, apiMethods]);

  if (isFirstRender.current) {
    privateApiRef.current.register(visibility, apiMethods);
  }
}
