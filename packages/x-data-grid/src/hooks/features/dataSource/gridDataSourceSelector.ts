import { gridFilterModelSelector } from '../filter/gridFilterSelector';
import { removeIncompleteFilterItems } from '../filter/gridFilterUtils';
import { gridSortModelSelector } from '../sorting/gridSortingSelector';
import { gridPaginationModelSelector } from '../pagination/gridPaginationSelector';
import { gridColumnLookupSelector } from '../columns';
import { createSelector } from '../../../utils/createSelector';

export const gridGetRowsParamsSelector = createSelector(
  gridFilterModelSelector,
  gridSortModelSelector,
  gridPaginationModelSelector,
  gridColumnLookupSelector,
  (filterModel, sortModel, paginationModel, columnsLookup) => ({
    groupKeys: [],
    paginationModel,
    sortModel,
    // An item without a value is an incomplete filter, not a constraint. The client-side
    // engine already ignores those, so the server must not be asked to honor them either.
    filterModel: removeIncompleteFilterItems(filterModel, columnsLookup),
    start: paginationModel.page * paginationModel.pageSize,
    end: paginationModel.page * paginationModel.pageSize + paginationModel.pageSize - 1,
  }),
);
