import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass, gridClasses, useGridSelector } from '@mui/x-data-grid';
import {
  GridPinnedRowsProps,
  gridPinnedRowsSelector,
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

  const pinnedRowsData = useGridSelector(apiRef, gridPinnedRowsSelector);
  const rows = pinnedRowsData[position];

  const pinnedRenderContext = React.useMemo(
    () => ({
      firstRowIndex: 0,
      lastRowIndex: rows.length,
      firstColumnIndex: -1,
      lastColumnIndex: -1,
    }),
    [rows],
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
