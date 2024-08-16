import type { VirtualScroller } from '../hooks/features/virtualization/useGridVirtualScroller';

export interface GridPinnedRowsProps {
  position: 'top' | 'bottom';
  virtualScroller: VirtualScroller;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function GridPinnedRows(_: GridPinnedRowsProps) {
  return null;
}
