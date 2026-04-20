import type { RefObject } from '@mui/x-internals/types';
import type { GridValidRowModel, GridColDef, GridKeyValue } from '@mui/x-data-grid-pro';
import type { GridApiPremium } from './gridApiPremium';

/**
 * Function signature for setting a grouping value on a row.
 * This is the inverse operation of GridGroupingValueGetter.
 *
 * @param {GridKeyValue | null | undefined} groupingValue The grouping value to set
 * @param {R} row The row to update
 * @param {GridColDef<R>} column The column definition
 * @param {RefObject<GridApiPremium>} apiRef Reference to the grid API
 * @returns {R} The updated row with the new grouping value applied
 */
export type GridGroupingValueSetter<R extends GridValidRowModel = GridValidRowModel> = (
  groupingValue: GridKeyValue | null | undefined,
  row: R,
  column: GridColDef<R>,
  apiRef: RefObject<GridApiPremium>,
) => R;
