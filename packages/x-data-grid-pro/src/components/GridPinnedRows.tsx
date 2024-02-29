import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
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

export function GridPinnedRows({ position, virtualScroller, ...other }: GridPinnedRowsProps) {
  const classes = useUtilityClasses();
  const apiRef = useGridPrivateApiContext();

  const renderContext = useGridSelector(apiRef, gridRenderContextSelector);
  const pinnedRowsData = useGridSelector(apiRef, gridPinnedRowsSelector);
  const rows = pinnedRowsData[position];

  const pinnedRows = virtualScroller.getRows({
    position,
    rows,
    renderContext: React.useMemo(
      () => ({
        firstRowIndex: 0,
        lastRowIndex: rows.length,
        firstColumnIndex: renderContext.firstColumnIndex,
        lastColumnIndex: renderContext.lastColumnIndex,
      }),
      [rows, renderContext.firstColumnIndex, renderContext.lastColumnIndex],
    ),
  });

  return (
    <div
      {...other}
      className={clsx(classes.root, other.className, gridClasses[`pinnedRows--${position}`])}
      role="presentation"
    >
      {pinnedRows}
    </div>
  );
}
