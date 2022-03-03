import { GridApiCommon, GridSortModelParams as GridSortModelParamsUntyped } from '@mui/x-data-grid';
import { GridApiPro } from './gridApiPro';

/**
 * Object passed as parameter of the column sorted event.
 */
export type GridSortModelParams<Api extends GridApiCommon = GridApiPro> =
  GridSortModelParamsUntyped<Api>;
