import * as React from 'react';
import { GridVirtualScroller } from './virtualization/GridVirtualScroller';
import { GridVirtualScrollerContent } from './virtualization/GridVirtualScrollerContent';
import { GridVirtualScrollerRenderZone } from './virtualization/GridVirtualScrollerRenderZone';
import { useGridVirtualScroller } from '../hooks/features/virtualization/useGridVirtualScroller';
import { GridOverlays } from './base/GridOverlays';

interface DataGridVirtualScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  disableVirtualization?: boolean;
}

const DataGridVirtualScroller = React.forwardRef<HTMLDivElement, DataGridVirtualScrollerProps>(
  function DataGridVirtualScroller(props, ref) {
    const { className, disableVirtualization, ...other } = props;

    const { getRootProps, getContentProps, getRenderZoneProps, getRows } = useGridVirtualScroller({
      ref,
      disableVirtualization,
    });

    return (
      <GridVirtualScroller className={className} {...getRootProps(other)}>
        <GridVirtualScrollerContent {...getContentProps()}>
          <GridOverlays />
          <GridVirtualScrollerRenderZone {...getRenderZoneProps()}>
            {getRows()}
          </GridVirtualScrollerRenderZone>
        </GridVirtualScrollerContent>
      </GridVirtualScroller>
    );
  },
);

export { DataGridVirtualScroller };
