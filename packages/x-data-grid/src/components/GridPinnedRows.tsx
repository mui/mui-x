import type { VirtualScroller } from '../hooks/features/virtualization/useGridVirtualScroller';

export interface GridPinnedRowsProps {
  position: 'top' | 'bottom';
  virtualScroller: VirtualScroller;
}

export function GridPinnedRows(_: GridPinnedRowsProps) {
  return null;
}
