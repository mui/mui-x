import * as React from 'react';
import { GridVirtualScroller } from './virtualization/GridVirtualScroller';
import { GridVirtualScrollerContent } from './virtualization/GridVirtualScrollerContent';
import { GridVirtualScrollerRenderZone } from './virtualization/GridVirtualScrollerRenderZone';
import { useGridVirtualScroller } from '../hooks/features/virtualization/useGridVirtualScroller';
import { GridOverlays } from './base/GridOverlays';
import { GridHeaders } from './GridHeaders';

export interface DataGridVirtualScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  ref: React.Ref<HTMLDivElement>;
  disableVirtualization: boolean;
  ColumnHeadersProps?: Record<string, any>;
}

const DataGridVirtualScroller = React.forwardRef<HTMLDivElement, DataGridVirtualScrollerProps>(
  function DataGridVirtualScroller(props, ref) {
    const { className, disableVirtualization, ColumnHeadersProps, ...other } = props;

    const { getRootProps, getContentProps, getRenderZoneProps, getRows } = useGridVirtualScroller({
      ref,
      disableVirtualization,
    });

    const contentProps = getContentProps();

    return (
      <GridVirtualScroller className={className} {...getRootProps(other)}>
        <GridHeaders contentProps={contentProps} ColumnHeadersProps={ColumnHeadersProps} />
        <GridOverlays />
        <GridVirtualScrollerContent {...contentProps}>
          <GridVirtualScrollerRenderZone {...getRenderZoneProps()}>
            {getRows()}
          </GridVirtualScrollerRenderZone>
        </GridVirtualScrollerContent>
      </GridVirtualScroller>
    );
  },
);

export { DataGridVirtualScroller };
