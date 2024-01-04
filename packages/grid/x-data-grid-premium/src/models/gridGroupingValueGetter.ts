import {
  // GridRowId,
  // GridRowModel,
  GridValidRowModel,
  // GridGroupNode,
  GridColDef,
  GridKeyValue,
} from '@mui/x-data-grid-pro';
import { GridApiPremium } from './gridApiPremium';

export type GridGroupingValueGetter<R extends GridValidRowModel = GridValidRowModel> = (
  value: any,
  row: R,
  column: GridColDef<R>,
  apiRef: React.MutableRefObject<GridApiPremium>,
) => GridKeyValue | null | undefined;
