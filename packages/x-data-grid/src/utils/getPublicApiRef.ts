import { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiCommunity } from '../models/api/gridApiCommunity';

export function getPublicApiRef<PrivateApi extends GridPrivateApiCommunity>(
  apiRef: RefObject<PrivateApi>,
) {
  return { current: apiRef.current.getPublicApi() } as RefObject<
    ReturnType<PrivateApi['getPublicApi']>
  >;
}
