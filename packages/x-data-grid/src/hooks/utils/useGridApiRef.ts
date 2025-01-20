import { ApiRef, useRef } from '@mui/x-internals/apiRef';
import { GridApiCommon } from '../../models';
import { GridApiCommunity } from '../../models/api/gridApiCommunity';

/**
 * Hook that instantiate a [[GridApiRef]].
 */
export const useGridApiRef = <Api extends GridApiCommon = GridApiCommunity>(): ApiRef<Api> =>
  useRef<Api>({} as Api);
