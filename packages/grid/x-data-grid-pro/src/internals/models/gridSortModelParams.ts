import { GridApiCommon } from '@mui/x-data-grid/internals';
import { GridSortModelParams as GridSortModelParamsUntyped } from '@mui/x-data-grid/internals/models/params/gridSortModelParams';
import { GridApiPro } from './gridApiPro';

/**
 * Object passed as parameter of the column sorted event.
 */
export type GridSortModelParams<Api extends GridApiCommon = GridApiPro> =
  GridSortModelParamsUntyped<Api>;
