import { GridApiCommon, GridStateApi, GridStatePersistenceApi } from '@mui/x-data-grid';
import { GridInitialStatePro, GridStatePro } from './gridStatePro';
import type { GridColumnPinningApi } from '../hooks/features/columnPinning';
import type { GridRowGroupingApi } from '../hooks/features/rowGrouping';

type GridStateApiUntyped = {
  [key in keyof (GridStateApi<any> & GridStatePersistenceApi<any>)]: any;
};

/**
 * The api of `DataGridPro`.
 */
export interface GridApiPro
  extends Omit<GridApiCommon, keyof GridStateApiUntyped>,
    GridStateApi<GridStatePro>,
    GridStatePersistenceApi<GridInitialStatePro>,
    GridRowGroupingApi,
    GridColumnPinningApi {}
