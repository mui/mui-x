import { RefObject } from '@mui/x-internals/types';
import { GridApiCommon, useGridApiContext as useCommunityGridApiContext } from '@mui/x-data-grid';
import { GridApiPremium } from '../../models/gridApiPremium';

export const useGridApiContext: <Api extends GridApiCommon = GridApiPremium>() => RefObject<Api> =
  useCommunityGridApiContext;
