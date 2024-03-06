import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { GridRowEntry, getDataGridUtilityClass, gridClasses, useGridSelector } from '@mui/x-data-grid';
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
  const apiRef = useGridPrivateApiContext();
  const pinnedRowsData = useGridSelector(apiRef, gridPinnedRowsSelector);
  const rows = pinnedRowsData[position];

  if (rows.length === 0) {
    return null;
  }

  return (
    <GridPinnedRowsImpl position={position} virtualScroller={virtualScroller} rows={rows} />
  );
}

function GridPinnedRowsImpl({ position, virtualScroller, rows }: GridPinnedRowsProps & { rows: GridRowEntry[] }) {
  const classes = useUtilityClasses();
  const apiRef = useGridPrivateApiContext();
  const renderContext = useGridSelector(apiRef, gridRenderContextSelector);

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
      className={clsx(classes.root, gridClasses[`pinnedRows--${position}`])}
      role="presentation"
    >
      {pinnedRows}
    </div>
  );
}
