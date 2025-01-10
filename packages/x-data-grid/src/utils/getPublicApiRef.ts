import type { GridPrivateApiCommunity } from '../models/api/gridApiCommunity';

export function getPublicApiRef<PrivateApi extends GridPrivateApiCommunity>(
  apiRef: React.RefObject<PrivateApi>,
) {
  return { current: apiRef.current.getPublicApi() } as React.RefObject<
    ReturnType<PrivateApi['getPublicApi']>
  >;
}
