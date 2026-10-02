import type { RefObject } from '@mui/x-internals/types';
import { useGridApiContext as useCommunityGridApiContext } from '@mui/x-data-grid';
import type { GridApiCommon } from '@mui/x-data-grid';
import type { GridApiPremium } from '../../models/gridApiPremium';

export const useGridApiContext: <Api extends GridApiCommon = GridApiPremium>() => RefObject<Api> =
  useCommunityGridApiContext;
