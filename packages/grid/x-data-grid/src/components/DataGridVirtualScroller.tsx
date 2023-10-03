import * as React from 'react';
import { GridVirtualScroller } from './virtualization/GridVirtualScroller';
import { GridVirtualScrollerContent } from './virtualization/GridVirtualScrollerContent';
import { GridVirtualScrollerRenderZone } from './virtualization/GridVirtualScrollerRenderZone';
import { useGridVirtualScroller } from '../hooks/features/virtualization/useGridVirtualScroller';
import { GridOverlays } from './base/GridOverlays';

const DataGridVirtualScroller = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function DataGridVirtualScroller(props, ref) {
  const { className, ...other } = props;

  const { getRootProps, getContentProps, getRenderZoneProps, getRows } = useGridVirtualScroller({
    ref,
  });

  return (
    <GridVirtualScroller className={className} {...getRootProps(other)}>
      <GridOverlays />
      <GridVirtualScrollerContent {...getContentProps()}>
        <GridVirtualScrollerRenderZone {...getRenderZoneProps()}>
          {getRows()}
        </GridVirtualScrollerRenderZone>
      </GridVirtualScrollerContent>
    </GridVirtualScroller>
  );
});

export { DataGridVirtualScroller };
