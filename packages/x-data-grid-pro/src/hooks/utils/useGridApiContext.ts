import { RefObject } from '@mui/x-internals/types';
import { GridApiCommon, useGridApiContext as useCommunityGridApiContext } from '@mui/x-data-grid';
import { GridApiPro } from '../../models/gridApiPro';

export const useGridApiContext: <Api extends GridApiCommon = GridApiPro>() => RefObject<Api> =
  useCommunityGridApiContext;
