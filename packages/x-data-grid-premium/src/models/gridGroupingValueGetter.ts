import { RefObject } from '@mui/x-internals/types';
import { GridValidRowModel, GridColDef, GridKeyValue } from '@mui/x-data-grid-pro';
import { GridApiPremium } from './gridApiPremium';

export type GridGroupingValueGetter<
  R extends GridValidRowModel = GridValidRowModel,
  TValue = never,
> = (
  value: TValue,
  row: R,
  column: GridColDef<R>,
  apiRef: RefObject<GridApiPremium>,
) => GridKeyValue | null | undefined;
