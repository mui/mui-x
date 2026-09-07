import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiCommon } from '../models/api/gridApiCommon';

const publicApiRefCache = new WeakMap<GridPrivateApiCommon, Readonly<RefObject<unknown>>>();

export function getPublicApiRef<PrivateApi extends GridPrivateApiCommon>(
  apiRef: RefObject<PrivateApi>,
) {
  const privateApi = apiRef.current;
  let publicApiRef = publicApiRefCache.get(privateApi);
  if (!publicApiRef) {
    // The ref is cached per grid instance and getter-based so that `publishEvent`
    // (called for every grid event) doesn't allocate, and so that consumers cannot
    // re-point the grid's internal ref through it.
    publicApiRef = {
      get current() {
        return privateApi.getPublicApi();
      },
    };
    publicApiRefCache.set(privateApi, publicApiRef);
  }
  return publicApiRef as Readonly<RefObject<ReturnType<PrivateApi['getPublicApi']>>>;
}
