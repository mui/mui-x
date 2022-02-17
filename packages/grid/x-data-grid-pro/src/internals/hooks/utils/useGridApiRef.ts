import * as React from 'react';
import { GridApiCommon, useGridApiRef as useCommunityGridApiRef } from '@mui/x-data-grid';
import { GridApiPro } from '../../models/gridApiPro';

export const useGridApiRef = useCommunityGridApiRef as <
  Api extends GridApiCommon = GridApiPro,
>() => React.MutableRefObject<Api>;
