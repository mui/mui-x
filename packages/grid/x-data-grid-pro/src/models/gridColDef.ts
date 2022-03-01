import {
  GridApiCommon,
  GridActionsColDef as GridActionsColDefUntyped,
  GridColDef as GridColDefUntyped,
  GridColTypeDef as GridColTypeDefUntyped,
  GridColumns as GridColumnsUntyped,
  GridEnrichedColDef as GridEnrichedColDefUntyped,
  GridStateColDef as GridStateColDefUntyped,
  GridDefaultRowModel,
} from '@mui/x-data-grid';
import { GridApiPro } from './gridApiPro';

export type GridColumns<Api extends GridApiCommon = GridApiPro> = GridColumnsUntyped<Api>;

/**
 * Column Definition interface.
 */
export type GridColDef<
  R extends GridDefaultRowModel = GridDefaultRowModel,
  V = any,
  F = V,
  Api extends GridApiCommon = GridApiPro,
> = GridColDefUntyped<R, V, F, Api>;

export type GridActionsColDef<Api extends GridApiCommon = GridApiPro> =
  GridActionsColDefUntyped<Api>;

export type GridEnrichedColDef<
  R extends GridDefaultRowModel = GridDefaultRowModel,
  V = any,
  F = V,
  Api extends GridApiCommon = GridApiPro,
> = GridEnrichedColDefUntyped<R, V, F, Api>;

export type GridColTypeDef<Api extends GridApiCommon = GridApiPro> = GridColTypeDefUntyped<Api>;

export type GridStateColDef<
  R extends GridDefaultRowModel = GridDefaultRowModel,
  V = any,
  F = V,
  Api extends GridApiCommon = GridApiPro,
> = GridStateColDefUntyped<R, V, F, Api>;
