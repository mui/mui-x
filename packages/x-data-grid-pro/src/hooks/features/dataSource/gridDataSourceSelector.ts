import {
  GridPaginationModel,
  gridFilterModelSelector,
  gridSortModelSelector,
  gridPaginationModelSelector,
  gridColumnLookupSelector,
  GridRowId,
} from '@mui/x-data-grid';
import { createSelector, createSelectorV8 } from '@mui/x-data-grid/internals';
import { GridStatePro } from '../../../models/gridStatePro';

const computeStartEnd = (paginationModel: GridPaginationModel) => {
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize - 1;
  return { start, end };
};

type GridStateProWithRowGrouping = GridStatePro & {
  rowGrouping?: {
    model: string[];
  };
};

const EMPTY_ARRAY: string[] = [];

const gridRowGroupingModelSelector = (state: GridStateProWithRowGrouping) =>
  state.rowGrouping?.model ?? EMPTY_ARRAY;

export const gridRowGroupingSanitizedModelSelector = createSelector(
  gridRowGroupingModelSelector,
  gridColumnLookupSelector,
  (model, columnsLookup) => model.filter((field) => !!columnsLookup[field]),
);

export const gridGetRowsParamsSelector = createSelector(
  gridFilterModelSelector,
  gridSortModelSelector,
  gridPaginationModelSelector,
  gridRowGroupingModelSelector,
  gridRowGroupingSanitizedModelSelector,
  (filterModel, sortModel, paginationModel, rowGroupingModel) => {
    return {
      groupKeys: [],
      groupFields: rowGroupingModel,
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

export const gridDataSourceLoadingIdSelector = createSelectorV8(
  gridDataSourceStateSelector,
  (dataSource, id: GridRowId) => dataSource.loading[id] ?? false,
);

export const gridDataSourceErrorsSelector = createSelector(
  gridDataSourceStateSelector,
  (dataSource) => dataSource.errors,
);

export const gridDataSourceErrorSelector = createSelectorV8(
  gridDataSourceStateSelector,
  (dataSource, id: GridRowId) => dataSource.errors[id],
);
