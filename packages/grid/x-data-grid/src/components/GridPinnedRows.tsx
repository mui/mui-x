import * as React from 'react';
import type { VirtualScroller } from '../hooks/features/virtualization/useGridVirtualScroller';

export interface GridPinnedRowsProps extends React.HTMLAttributes<HTMLDivElement> {
  position: 'top' | 'bottom';
  virtualScroller: VirtualScroller;
}

const GridPinnedRows = React.forwardRef<HTMLDivElement, GridPinnedRowsProps>(
  function GridPinnedRows(_props, _ref) {
    return null;
  },
);

export { GridPinnedRows };
