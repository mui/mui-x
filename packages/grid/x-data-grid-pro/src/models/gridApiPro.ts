import { GridApiCommon, GridStateApi, GridStatePersistenceApi } from '@mui/x-data-grid';
import {
  GridApiCommonUntyped,
  GridPrivateApiCommon,
  GridPrivateApiCommonUntyped,
  GridStatePrivateApi,
  GridCorePrivateApi,
} from '@mui/x-data-grid/internals';
import { GridInitialStatePro, GridStatePro } from './gridStatePro';
import type { GridColumnPinningApi, GridRowGroupingApi, GridDetailPanelApi } from '../hooks';

/**
 * The api of `DataGridPro`.
 */
export interface GridApiPro
  extends Omit<GridApiCommon, keyof GridApiCommonUntyped>,
    GridStateApi<GridStatePro>,
    GridStatePersistenceApi<GridInitialStatePro>,
    GridRowGroupingApi,
    GridColumnPinningApi,
    GridDetailPanelApi {}

export interface GridPrivateApiPro
  extends Omit<GridPrivateApiCommon, keyof GridPrivateApiCommonUntyped>,
    GridStatePrivateApi<GridStatePro>,
    GridCorePrivateApi<GridApiPro, GridPrivateApiPro> {}

export interface GridInternalApiPro extends GridApiPro, GridPrivateApiPro {}
