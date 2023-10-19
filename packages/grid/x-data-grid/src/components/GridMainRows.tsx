import * as React from 'react';
import type { VirtualScroller } from '../hooks/features/virtualization/useGridVirtualScroller';

export interface GridMainRowsProps extends React.HTMLAttributes<HTMLDivElement> {
  virtualScroller: VirtualScroller;
}

export function GridMainRows(props: GridMainRowsProps) {
  return props.virtualScroller.getRows();
}
