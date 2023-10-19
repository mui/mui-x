import * as React from 'react';
import { useGridSelector, useGridApiContext } from '@mui/x-data-grid';
import type { GridMainRowsProps } from '@mui/x-data-grid/internals';
import type { GridApiPro } from '../models';
import { gridVisiblePinnedColumnsSelector } from '../hooks';

export function GridMainRows(props: GridMainRowsProps) {
  const apiRef = useGridApiContext<GridApiPro>();
  const visiblePinnedColumns = useGridSelector(apiRef, gridVisiblePinnedColumnsSelector);

  React.useEffect(() => {
    props.virtualScroller.setVisiblePinnedColumns(visiblePinnedColumns);
  }, [visiblePinnedColumns]);

  return props.virtualScroller.getRows();
}
