import * as React from 'react';
import { GridApiCommunity } from '../models/api/gridApiCommunity';
import { GetApplyFilterFnV7, GetApplyFilterFnLegacy, GridFilterOperator } from '../models';
import { GetApplyQuickFilterFnV7, GetApplyQuickFilterFnLegacy } from '../models/colDef/gridColDef';

/**
 * A global API ref, for v7-to-legacy converter
 */
export const GLOBAL_API_REF = {
  current: null as null | React.MutableRefObject<GridApiCommunity>,
};

/**
 * A tagger to determine if the filter is internal or custom user-supplied.
 * To be a valid internal filter, the v7 function *must* be defined/redefined at
 * the same time as the legacy one.
 * https://github.com/mui/mui-x/pull/9254#discussion_r1231095551
 */
export function tagInternalFilter<T>(fn: T): T {
  (fn as any).isInternal = true;
  return fn;
}

export function isInternalFilter(fn: Function | undefined): boolean {
  return fn !== undefined && (fn as any).isInternal === true;
}

export function convertFilterV7ToLegacy(fn: GetApplyFilterFnV7): GetApplyFilterFnLegacy {
  return tagInternalFilter((filterItem, column) => {
    const filterFn = fn(filterItem, column);
    if (!filterFn) {
      return filterFn;
    }
    return (cellParams): boolean => {
      return filterFn(cellParams.value, cellParams.row, column, GLOBAL_API_REF.current!);
    };
  });
}

export function convertLegacyOperators(
  ops: Omit<GridFilterOperator, 'getApplyFilterFn'>[],
): GridFilterOperator[] {
  return ops.map((op) => {
    return {
      ...op,
      getApplyFilterFn: convertFilterV7ToLegacy(op.getApplyFilterFnV7!),
      getApplyFilterFnV7: tagInternalFilter(op.getApplyFilterFnV7!),
    };
  });
}

export function convertQuickFilterV7ToLegacy(
  fn: GetApplyQuickFilterFnV7,
): GetApplyQuickFilterFnLegacy<any, any, any> {
  return tagInternalFilter((filterItem, column, apiRef) => {
    const filterFn = fn(filterItem, column, apiRef);
    if (!filterFn) {
      return filterFn;
    }
    return (cellParams): boolean => {
      return filterFn(cellParams.value, cellParams.row, column, apiRef);
    };
  });
}
