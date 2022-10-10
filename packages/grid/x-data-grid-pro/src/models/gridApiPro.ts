import { GridApiCommon } from '@mui/x-data-grid';
import { GridInitialStatePro, GridStatePro } from './gridStatePro';
import type { GridColumnPinningApi, GridDetailPanelApi, GridRowPinningApi } from '../hooks';

/**
 * The api of `DataGridPro`.
 */
export interface GridApiPro
  extends GridApiCommon<GridStatePro, GridInitialStatePro>,
    GridColumnPinningApi,
    GridDetailPanelApi,
    GridRowPinningApi {}
