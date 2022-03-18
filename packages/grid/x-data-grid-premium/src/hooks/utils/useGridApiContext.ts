import * as React from 'react';
import { GridApiCommon, useGridApiContext as useCommunityGridApiContext } from '@mui/x-data-grid';
import { GridApiPremium } from '../../models/gridApiPremium';

export const useGridApiContext = useCommunityGridApiContext as <
  GridApi extends GridApiCommon = GridApiPremium,
>() => React.MutableRefObject<GridApi>;
