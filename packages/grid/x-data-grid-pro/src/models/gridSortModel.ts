import {
  GridApiCommon,
  GridComparatorFn as GridComparatorFnUntyped,
  GridSortCellParams as GridSortCellParamsUntyped,
} from '@mui/x-data-grid';
import { GridApiPro } from './gridApiPro';

export type GridComparatorFn<
  V = any,
  Api extends GridApiCommon = GridApiPro,
> = GridComparatorFnUntyped<V, Api>;

export type GridSortCellParams<Api extends GridApiCommon = GridApiPro> =
  GridSortCellParamsUntyped<Api>;
