import { RefObject } from '@mui/x-internals/types';
import type { GridRowId, GridRowModel } from '../gridRows';
import { GridColDef } from '../colDef';

/**
 * Get the cell aggregation result
 * @param {GridRowId} id The row id
 * @param {string} field The field
 * @returns { { position: 'footer' | 'inline'; value: any } | null } The cell aggregation result
 */
export type GetCellAggregationResultFn = (
  id: GridRowId,
  field: string,
) => {
  position: 'footer' | 'inline';
  value: any;
  formattedValue?: any;
} | null;

export type SortValueGetterFn = (id: GridRowId, field: string) => any;
export type FilterValueGetterFn = (row: GridRowModel, colDef: GridColDef) => any;

export interface GridAggregationInternalHooks<Api, Props> {
  useCellAggregationResult: GetCellAggregationResultFn;
  /**
   * @param {RefObject<Api>} apiRef The API reference
   * @returns {SortValueGetterFn} The function to get the value to sort by
   */
  useSortValueGetter: (apiRef: RefObject<Api>) => SortValueGetterFn;
  useFilterValueGetter: (apiRef: RefObject<Api>, props: Props) => FilterValueGetterFn;
}
