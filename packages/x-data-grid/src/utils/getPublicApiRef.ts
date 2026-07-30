import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiCommon } from '../models/api/gridApiCommon';

export function getPublicApiRef<PrivateApi extends GridPrivateApiCommon>(
  apiRef: RefObject<PrivateApi>,
) {
  return { current: apiRef.current.getPublicApi() } as RefObject<
    ReturnType<PrivateApi['getPublicApi']>
  >;
}
