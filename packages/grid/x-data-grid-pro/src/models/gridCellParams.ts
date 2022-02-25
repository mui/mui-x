import {
  GridApiCommon,
  GridCellParams as GridCellParamsUntyped,
  GridRenderCellParams as GridRenderCellParamsUntyped,
  GridRenderEditCellParams as GridRenderEditCellParamsUntyped,
  GridValueFormatterParams as GridValueFormatterParamsUntyped,
  GridValueGetterFullParams as GridValueGetterFullParamsUntyped,
  GridValueGetterParams as GridValueGetterParamsUntyped,
} from '@mui/x-data-grid';
import { GridApiPro } from './gridApiPro';

/**
 * Object passed as parameter in the column [[GridColDef]] cell renderer.
 */
export type GridCellParams<
  V = any,
  R = any,
  F = V,
  Api extends GridApiCommon = GridApiPro,
> = GridCellParamsUntyped<V, R, F, Api>;

/**
 * GridCellParams containing api.
 */
export type GridRenderCellParams<
  V = any,
  R = any,
  F = V,
  Api extends GridApiCommon = GridApiPro,
> = GridRenderCellParamsUntyped<V, R, F, Api>;

/**
 * GridEditCellProps containing api.
 */
export type GridRenderEditCellParams<Api extends GridApiCommon = GridApiPro> =
  GridRenderEditCellParamsUntyped<Api>;

/**
 * Parameters passed to `colDef.valueGetter`.
 */
export type GridValueGetterParams<
  V = any,
  R = any,
  Api extends GridApiCommon = GridApiPro,
> = GridValueGetterParamsUntyped<V, R, Api>;

/**
 * @deprecated Use `GridValueGetterParams` instead.
 */
export type GridValueGetterFullParams<
  V = any,
  R = any,
  Api extends GridApiCommon = GridApiPro,
> = GridValueGetterFullParamsUntyped<V, R, Api>;

/**
 * Object passed as parameter in the column [[GridColDef]] value formatter callback.
 */
export type GridValueFormatterParams<Api extends GridApiCommon = GridApiPro> =
  GridValueFormatterParamsUntyped<Api>;
