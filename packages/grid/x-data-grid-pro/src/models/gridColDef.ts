import {
  GridApiCommon,
  GridActionsColDef as GridActionsColDefUntyped,
  GridColDef as GridColDefUntyped,
  GridColTypeDef as GridColTypeDefUntyped,
  GridColumns as GridColumnsUntyped,
  GridEnrichedColDef as GridEnrichedColDefUntyped,
  GridStateColDef as GridStateColDefUntyped,
} from '@mui/x-data-grid';
import { GridApiPro } from './gridApiPro';

export type GridColumns<Api extends GridApiCommon = GridApiPro> = GridColumnsUntyped<Api>;

/**
 * Column Definition interface.
 */
export type GridColDef<Api extends GridApiCommon = GridApiPro> = GridColDefUntyped<Api>;

export type GridActionsColDef<Api extends GridApiCommon = GridApiPro> =
  GridActionsColDefUntyped<Api>;

export type GridEnrichedColDef<Api extends GridApiCommon = GridApiPro> =
  GridEnrichedColDefUntyped<Api>;

export type GridColTypeDef<Api extends GridApiCommon = GridApiPro> = GridColTypeDefUntyped<Api>;

export type GridStateColDef<Api extends GridApiCommon = GridApiPro> = GridStateColDefUntyped<Api>;
