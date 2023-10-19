import * as React from 'react';
import type { VirtualScroller } from '../hooks/features/virtualization/useGridVirtualScroller';

export interface GridPinnedRowsProps extends React.HTMLAttributes<HTMLDivElement> {
  position: 'top' | 'bottom';
  virtualScroller: VirtualScroller;
}

export function GridPinnedRows(_props: GridPinnedRowsProps) {
  return null;
}
