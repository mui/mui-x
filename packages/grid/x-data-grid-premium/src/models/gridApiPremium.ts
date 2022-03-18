import { GridApiCommon, GridStateApi, GridStatePersistenceApi } from '@mui/x-data-grid';
import { GridColumnPinningApi, GridDetailPanelApi } from '@mui/x-data-grid-pro';
import { GridInitialStatePremium, GridStatePremium } from './gridStatePremium';
import type { GridRowGroupingApi } from '../hooks';

type GridStateApiUntyped = {
  [key in keyof (GridStateApi<any> & GridStatePersistenceApi<any>)]: any;
};

/**
 * The api of `DataGridPro`.
 */
export interface GridApiPremium
  extends Omit<GridApiCommon, keyof GridStateApiUntyped>,
    GridStateApi<GridStatePremium>,
    GridStatePersistenceApi<GridInitialStatePremium>,
    GridColumnPinningApi,
    GridDetailPanelApi,
    GridRowGroupingApi {}
