import * as React from 'react';
import type { VirtualScroller } from '../hooks/features/virtualization/useGridVirtualScroller';

export interface GridMainRowsProps extends React.HTMLAttributes<HTMLDivElement> {
  virtualScroller: VirtualScroller;
}

const GridMainRows = React.forwardRef<HTMLDivElement, GridMainRowsProps>(function GridMainRows(
  props,
  _ref,
) {
  return props.virtualScroller.getRows();
});

export { GridMainRows };
