import { GridValidRowModel, GridColDef, GridKeyValue } from '@mui/x-data-grid-pro';
import { GridApiPremium } from './gridApiPremium';

export type GridGroupingValueGetter<
  R extends GridValidRowModel = GridValidRowModel,
  TValue = never,
> = (
  value: TValue,
  row: R,
  column: GridColDef<R>,
  apiRef: React.MutableRefObject<GridApiPremium>,
) => GridKeyValue | null | undefined;
