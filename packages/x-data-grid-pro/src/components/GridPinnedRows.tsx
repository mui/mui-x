import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass, gridClasses, useGridSelector } from '@mui/x-data-grid';
import {
  GridPinnedRowsProps,
  gridPinnedRowsSelector,
  gridRenderContextSelector,
  useGridPrivateApiContext,
} from '@mui/x-data-grid/internals';

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

  return (
    <div className={clsx(classes.root, gridClasses[`pinnedRows--${position}`])} role="presentation">
      {pinnedRows}
    </div>
  );
}
