import { GetApplyQuickFilterFnV7, GetApplyQuickFilterFnLegacy } from '../models/colDef/gridColDef';

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
