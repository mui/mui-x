import { RefObject } from '@mui/x-internals/types';
import { GridApiCommon, useGridApiRef as useCommunityGridApiRef } from '@mui/x-data-grid';
import { GridApiPremium } from '../../models/gridApiPremium';

export const useGridApiRef: <
  Api extends GridApiCommon = GridApiPremium,
>() => RefObject<Api | null> = useCommunityGridApiRef;
