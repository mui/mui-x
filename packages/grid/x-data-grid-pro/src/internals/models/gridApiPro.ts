import { GridApiCommon, GridApiRef, GridStateApi } from '@mui/x-data-grid';
import { GridStatePro } from './gridStatePro';
import type { GridColumnPinningApi } from '../hooks/features/columnPinning';
import type { GridRowGroupingApi } from '../hooks/features/rowGrouping';

type GridStateApiUntyped = { [key in keyof GridStateApi<any>]: any };

/**
 * The api of `DataGridPro`.
 */
export interface GridApiPro
  extends Omit<GridApiCommon, keyof GridStateApiUntyped>,
    GridStateApi<GridStatePro>,
    GridRowGroupingApi,
    GridColumnPinningApi {}

/**
 * The full grid API.
 * @deprecated Use `GridApiCommunity` or `GridApiPro` instead.
 */
export interface GridApi extends GridApiPro {}

/**
 * The reference storing the api of the Pro-plan grid.
 */
export type GridApiRefPro = GridApiRef<GridApiPro>;
