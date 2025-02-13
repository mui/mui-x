import { createSelector, createRootSelector } from '@mui/x-data-grid/internals';
import type { GridRowId } from '@mui/x-data-grid';
import { GridStatePro } from '../../../models/gridStatePro';

export const gridDataSourceStateSelector = createRootSelector(
  (state: GridStatePro) => state.dataSource,
);

export const gridDataSourceLoadingSelector = createSelector(
  gridDataSourceStateSelector,
  (dataSource) => dataSource.loading,
);

export const gridDataSourceLoadingIdSelector = createSelector(
  gridDataSourceStateSelector,
  (dataSource, id: GridRowId) => dataSource.loading[id] ?? false,
);

export const gridDataSourceErrorsSelector = createSelector(
  gridDataSourceStateSelector,
  (dataSource) => dataSource.errors,
);

export const gridDataSourceErrorSelector = createSelector(
  gridDataSourceStateSelector,
  (dataSource, id: GridRowId) => dataSource.errors[id],
);
