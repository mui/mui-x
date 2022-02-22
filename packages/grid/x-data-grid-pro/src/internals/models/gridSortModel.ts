import { GridApiCommon } from '@mui/x-data-grid/internals';
import type {
  GridComparatorFn as GridComparatorFnUntyped,
  GridSortCellParams as GridSortCellParamsUntyped,
} from '@mui/x-data-grid/internals/models/gridSortModel';
import { GridApiPro } from './gridApiPro';

export type GridComparatorFn<Api extends GridApiCommon = GridApiPro> = GridComparatorFnUntyped<Api>;

export type GridSortCellParams<Api extends GridApiCommon = GridApiPro> =
  GridSortCellParamsUntyped<Api>;
