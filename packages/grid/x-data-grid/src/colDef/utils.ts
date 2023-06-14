import { GetApplyFilterFnV7, GetApplyFilterFnLegacy, GridFilterOperator } from '../models';
import { GetApplyQuickFilterFnV7, GetApplyQuickFilterFnLegacy } from '../models/colDef/gridColDef';

export function convertFilterV7ToLegacy(fn: GetApplyFilterFnV7): GetApplyFilterFnLegacy {
  return (filterItem, column) => {
    const filterFn = fn(filterItem, column);
    if (!filterFn) {
      return filterFn;
    }
    return (cellParams, apiRef): boolean => {
      return filterFn(cellParams.value, cellParams.row, column, apiRef);
    };
  };
}

export function convertLegacyOperators(
  ops: Omit<GridFilterOperator, 'getApplyFilterFn'>[],
): GridFilterOperator[] {
  return ops.map((op) => {
    return {
      ...op,
      getApplyFilterFn: convertFilterV7ToLegacy(op.getApplyFilterFnV7!),
    };
  });
}

export function convertQuickFilterV7ToLegacy(
  fn: GetApplyQuickFilterFnV7,
): GetApplyQuickFilterFnLegacy<any, any, any> {
  return (filterItem, column, apiRef) => {
    const filterFn = fn(filterItem, column, apiRef);
    if (!filterFn) {
      return filterFn;
    }
    return (cellParams): boolean => {
      return filterFn(cellParams.value, cellParams.row, column, apiRef);
    };
  };
}
