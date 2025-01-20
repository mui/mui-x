import { ApiRef } from '@mui/x-internals/apiRef';
import type { GridPrivateApiCommunity } from '../models/api/gridApiCommunity';

export function getPublicApiRef<PrivateApi extends GridPrivateApiCommunity>(
  apiRef: ApiRef<PrivateApi>,
) {
  return { current: apiRef.current.getPublicApi() } as ApiRef<
    ReturnType<PrivateApi['getPublicApi']>
  >;
}
