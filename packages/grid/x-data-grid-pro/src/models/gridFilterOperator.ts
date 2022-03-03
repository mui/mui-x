import {
  GridApiCommon,
  GridDefaultRowModel,
  GridFilterOperator as GridFilterOperatorUntyped,
} from '@mui/x-data-grid';
import { GridApiPro } from './gridApiPro';

/**
 * Filter operator definition interface.
 */
export type GridFilterOperator<
  R extends GridDefaultRowModel = GridDefaultRowModel,
  V = any,
  F = V,
  Api extends GridApiCommon = GridApiPro,
> = GridFilterOperatorUntyped<R, V, F, Api>;
