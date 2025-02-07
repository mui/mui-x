import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import {
  getDataGridUtilityClass,
  gridClasses,
  gridRowsLoadingSelector,
  useGridSelector,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid-pro';
import {
  GridPinnedRowsProps,
  gridPinnedRowsSelector,
  gridRenderContextSelector,
  GRID_ID_AUTOGENERATED,
} from '@mui/x-data-grid-pro/internals';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { GridAggregationRowOverlay } from './GridAggregationRowOverlay';
import { gridAggregationLookupSelector } from '../hooks/features/aggregation/gridAggregationSelectors';

const useUtilityClasses = () => {
  const slots = {
    root: ['pinnedRows'],
  };
  return composeClasses(slots, getDataGridUtilityClass, {});
};

export function GridPinnedRows({ position, virtualScroller }: GridPinnedRowsProps) {
  const classes = useUtilityClasses();
  const apiRef = useGridPrivateApiContext();

  const renderContext = useGridSelector(apiRef, gridRenderContextSelector);
  const pinnedRowsData = useGridSelector(apiRef, gridPinnedRowsSelector);
  const aggregationLookup = useGridSelector(apiRef, gridAggregationLookupSelector);
  const isLoading = useGridSelector(apiRef, gridRowsLoadingSelector);
  const rows = pinnedRowsData[position];

  const pinnedRenderContext = React.useMemo(
    () => ({
      firstRowIndex: 0,
      lastRowIndex: rows.length,
      firstColumnIndex: renderContext.firstColumnIndex,
      lastColumnIndex: renderContext.lastColumnIndex,
    }),
    [rows, renderContext.firstColumnIndex, renderContext.lastColumnIndex],
  );

  if (rows.length === 0) {
    return null;
  }

  const pinnedRows = virtualScroller.getRows({
    position,
    rows,
    renderContext: pinnedRenderContext,
  });

  const isAggregationRow =
    position === 'bottom' && rows.length === 1 && rows[0].model[GRID_ID_AUTOGENERATED];

  const isAggregationRowEmpty = (Object.values(aggregationLookup[GRID_ROOT_GROUP_ID]) || []).every(
    ({ value }) => value === '',
  );

  if (isAggregationRow && isAggregationRowEmpty && !isLoading) {
    return null;
  }

  return (
    <div className={clsx(classes.root, gridClasses[`pinnedRows--${position}`])} role="presentation">
      {pinnedRows}
      {isAggregationRow && isLoading && <GridAggregationRowOverlay />}
    </div>
  );
}
