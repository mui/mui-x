import * as React from 'react';
import { useGridSelector, useGridApiContext } from '@mui/x-data-grid';
import type { GridMainRowsProps } from '@mui/x-data-grid/internals';
import type { GridApiPro } from '../models';
import { gridVisiblePinnedColumnsSelector } from '../hooks';

const GridMainRows = React.forwardRef<HTMLDivElement, GridMainRowsProps>(function GridMainRows(
  props,
  _ref,
) {
  const apiRef = useGridApiContext<GridApiPro>();
  const visiblePinnedColumns = useGridSelector<
    GridApiPro,
    ReturnType<typeof gridVisiblePinnedColumnsSelector>
  >(apiRef, gridVisiblePinnedColumnsSelector);

  React.useEffect(() => {
    props.virtualScroller.setVisiblePinnedColumns(visiblePinnedColumns);
  }, [visiblePinnedColumns]);

  return props.virtualScroller.getRows();
});

export { GridMainRows };
