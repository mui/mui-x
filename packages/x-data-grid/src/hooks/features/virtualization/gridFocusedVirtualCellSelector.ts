import { createSelectorMemoized } from '../../../utils/createSelector';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { gridRenderContextSelector } from './gridVirtualizationSelectors';
import { gridFocusCellSelector } from '../focus';
import { gridExpandedSortedRowEntriesSelector } from '../filter';
import { gridPaginationRowRangeSelector } from '../pagination';

export const gridFocusedVirtualCellSelector = createSelectorMemoized(
  gridRenderContextSelector,
  gridFocusCellSelector,
  gridVisibleColumnDefinitionsSelector,
  gridExpandedSortedRowEntriesSelector,
  gridPaginationRowRangeSelector,
  (renderContext, focusedCell, visibleColumns) => ({
    renderContext,
    focusedCell,
    visibleColumns,
  }),
);
