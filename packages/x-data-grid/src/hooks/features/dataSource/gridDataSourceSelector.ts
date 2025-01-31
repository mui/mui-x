import type { GridPaginationModel } from '../../../models';
import { gridFilterModelSelector } from '../filter/gridFilterSelector';
import { gridSortModelSelector } from '../sorting/gridSortingSelector';
import { gridPaginationModelSelector } from '../pagination/gridPaginationSelector';
import { createSelector } from '../../../utils/createSelector';

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
