import type { RefObject } from '@mui/x-internals/types';
import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import type { GridApiPremium } from './gridApiPremium';

export type GridPastedValueParser<
  R extends GridValidRowModel = GridValidRowModel,
  V = any,
  F = V,
> = (
  value: string,
  row: R,
  column: GridColDef<R, V, F>,
  apiRef: RefObject<GridApiPremium>,
) => V | undefined;
