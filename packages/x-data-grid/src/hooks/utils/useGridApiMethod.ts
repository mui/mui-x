import { RefObject } from '@mui/x-internals/types';
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
>(privateApiRef: RefObject<PrivateApi>, apiMethods: T, visibility: V) {
  // Register synchronously so that apiRef.current always exposes the latest methods
  // during the current render. This avoids stale callbacks being used in code that
  // reads from apiRef.current while rendering.
  // related issue: https://github.com/mui/mui-x/issues/19732
  privateApiRef.current.register(visibility, apiMethods);

  // Also register in an effect to ensure the latest methods are set after commit
  // in environments where synchronous registration might be skipped (e.g., SSR quirks).
  useEnhancedEffect(() => {
    privateApiRef.current.register(visibility, apiMethods);
  }, [privateApiRef, visibility, apiMethods]);
}
