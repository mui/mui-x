import { GridStateApi } from './gridStateApi';
import { GridStatePro } from '../gridStatePro';
import { GridRowGroupingApi } from '../../hooks';
import { GridColumnPinningApi } from './gridColumnPinningApi';
import { GridApiCommon } from './gridApiCommon';

type GridStateApiUntyped = { [key in keyof GridStateApi<any>]: any };

/**
 * The api of `DataGridPro`.
 * TODO: Move to `x-data-grid-pro` folder
 */
export interface GridApiPro
  extends Omit<GridApiCommon, keyof GridStateApiUntyped>,
    GridStateApi<GridStatePro>,
    GridRowGroupingApi,
    GridColumnPinningApi {}
