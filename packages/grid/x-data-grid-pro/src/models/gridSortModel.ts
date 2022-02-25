import { GridApiCommon } from '@mui/x-data-grid';
import {
  GridComparatorFn as GridComparatorFnUntyped,
  GridSortCellParams as GridSortCellParamsUntyped,
} from '@mui/x-data-grid/internals';
import { GridApiPro } from './gridApiPro';

export type GridComparatorFn<Api extends GridApiCommon = GridApiPro> = GridComparatorFnUntyped<Api>;

export type GridSortCellParams<Api extends GridApiCommon = GridApiPro> =
  GridSortCellParamsUntyped<Api>;
