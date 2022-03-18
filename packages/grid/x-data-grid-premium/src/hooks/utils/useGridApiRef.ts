import * as React from 'react';
import { GridApiCommon, useGridApiRef as useCommunityGridApiRef } from '@mui/x-data-grid';
import { GridApiPremium } from '../../models/gridApiPremium';

export const useGridApiRef = useCommunityGridApiRef as <
  Api extends GridApiCommon = GridApiPremium,
>() => React.MutableRefObject<Api>;
