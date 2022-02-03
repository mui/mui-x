import { GridStateApi } from './gridStateApi';
import { GridStatePro } from '../gridStatePro';
import { GridColumnPinningApi } from './gridColumnPinningApi';
import { GridApiCommon } from './gridApiCommon';
import { GridDetailPanelApi } from './gridDetailPanelApi';
import type { GridRowGroupingApi } from '../../hooks';

type GridStateApiUntyped = { [key in keyof GridStateApi<any>]: any };

/**
 * The api of `DataGridPro`.
 * TODO: Move to `x-data-grid-pro` folder
 */
export interface GridApiPro
  extends Omit<GridApiCommon, keyof GridStateApiUntyped>,
    GridStateApi<GridStatePro>,
    GridRowGroupingApi,
    GridColumnPinningApi,
    GridDetailPanelApi {}
