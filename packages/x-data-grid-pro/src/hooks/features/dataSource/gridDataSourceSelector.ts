import {
  GridPaginationModel,
  gridFilterModelSelector,
  gridSortModelSelector,
  gridPaginationModelSelector,
  GridRowId,
} from '@mui/x-data-grid';
import { createSelector } from '@mui/x-data-grid/internals';
import { GridStatePro } from '../../../models/gridStatePro';

const computeStartEnd = (paginationModel: GridPaginationModel) => {
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize - 1;
  return { start, end };
};

export const gridGetRowsParamsSelector = createSelector(
  gridFilterModelSelector,
  gridSortModelSelector,
  gridPaginationModelSelector,
  (filterModel, sortModel, paginationModel) => {
    return {
      groupKeys: [],
      paginationModel,
      sortModel,
      filterModel,
      ...computeStartEnd(paginationModel),
    };
  },
);

export const gridDataSourceStateSelector = (state: GridStatePro) => state.dataSource;

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
