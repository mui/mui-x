import { GridColumnVisibilityModel } from '../../hooks/features/columns/gridColumnsInterfaces';
import type { GridColumnsManagementProps } from './GridColumnsManagement';

export const checkColumnVisibilityModelsSame = (
  a: GridColumnVisibilityModel,
  b: GridColumnVisibilityModel,
) => {
  // Filter `false` values only, as `true` and not having a key are the same
  const aFalseValues = new Set(Object.keys(a).filter((key) => a[key] === false));
  const bFalseValues = new Set(Object.keys(b).filter((key) => b[key] === false));
  if (aFalseValues.size !== bFalseValues.size) {
    return false;
  }

  let result = true;
  aFalseValues.forEach((key) => {
    if (!bFalseValues.has(key)) {
      result = false;
    }
  });
  return result;
};

export const defaultSearchPredicate: NonNullable<GridColumnsManagementProps['searchPredicate']> = (
  column,
  searchValue,
) => (column.headerName || column.field).toLowerCase().indexOf(searchValue) > -1;
