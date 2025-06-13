import { gridFilterModelSelector } from '../filter/gridFilterSelector';
import { gridSortModelSelector } from '../sorting/gridSortingSelector';
import { gridPaginationModelSelector } from '../pagination/gridPaginationSelector';
import { createSelector } from '../../../utils/createSelector';

export const gridGetRowsParamsSelector = createSelector(
  gridFilterModelSelector,
  gridSortModelSelector,
  gridPaginationModelSelector,
  (filterModel, sortModel, paginationModel) => ({
    groupKeys: [],
    paginationModel,
    sortModel,
    filterModel,
    start: paginationModel.page * paginationModel.pageSize,
    end: paginationModel.page * paginationModel.pageSize + paginationModel.pageSize - 1,
  }),
);
