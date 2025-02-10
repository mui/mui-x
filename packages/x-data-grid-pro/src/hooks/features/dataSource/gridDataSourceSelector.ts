import { RefObject } from '@mui/x-internals/types';
import { createSelector } from '@mui/x-data-grid/internals';
import type { GridRowId } from '@mui/x-data-grid';
import { GridApiPro } from '../../../models/gridApiPro';

export const gridDataSourceStateSelector = (apiRef: RefObject<GridApiPro>) =>
  apiRef.current.state.dataSource;

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
