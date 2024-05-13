import {
  GridPaginationModel,
  gridFilterModelSelector,
  gridSortModelSelector,
  gridPaginationModelSelector,
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
      // TODO: Implement with `rowGrouping`
      groupFields: [],
      paginationModel,
      sortModel,
      filterModel,
      ...computeStartEnd(paginationModel),
    };
  },
);

export const gridServerSideDataStateSelector = (state: GridStatePro) => state.serverSideData;

export const gridServerSideDataLoadingSelector = createSelector(
  gridServerSideDataStateSelector,
  (serverSideData) => serverSideData.loading,
);

export const gridServerSideDataErrorsSelector = createSelector(
  gridServerSideDataStateSelector,
  (serverSideData) => serverSideData.errors,
);
