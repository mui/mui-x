import type { GridPrivateApiCommunity } from '../models/api/gridApiCommunity';

export function getPublicApiRef<PrivateApi extends GridPrivateApiCommunity>(
  apiRef: React.MutableRefObject<PrivateApi>,
) {
  return { current: apiRef.current.getPublicApi() } as React.MutableRefObject<
    ReturnType<PrivateApi['getPublicApi']>
  >;
}
