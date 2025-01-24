import { RefObject } from '@mui/x-internals/types';
import { GridApiCommon, useGridApiRef as useCommunityGridApiRef } from '@mui/x-data-grid';
import { GridApiPremium } from '../../models/gridApiPremium';

export const useGridApiRef = useCommunityGridApiRef as <
  Api extends GridApiCommon = GridApiPremium,
>() => RefObject<Api>;
