import { createSelector, createRootSelector } from '@mui/x-data-grid/internals';
export const gridDataSourceStateSelector = createRootSelector((state) => state.dataSource);
export const gridDataSourceLoadingSelector = createSelector(gridDataSourceStateSelector, (dataSource) => dataSource.loading);
export const gridDataSourceLoadingIdSelector = createSelector(gridDataSourceStateSelector, (dataSource, id) => dataSource.loading[id] ?? false);
export const gridDataSourceErrorsSelector = createSelector(gridDataSourceStateSelector, (dataSource) => dataSource.errors);
export const gridDataSourceErrorSelector = createSelector(gridDataSourceStateSelector, (dataSource, id) => dataSource.errors[id]);
