import * as React from 'react';
import { GridApiCommon } from '@mui/x-data-grid/internals';
import { useGridApiContext as useCommunityGridApiContext } from '@mui/x-data-grid/internals/hooks/utils/useGridApiContext';
import { GridApiPro } from '../../models/gridApiPro';

export const useGridApiContext = useCommunityGridApiContext as <
  GridApi extends GridApiCommon = GridApiPro,
>() => React.MutableRefObject<GridApi>;
