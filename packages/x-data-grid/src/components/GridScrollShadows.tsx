'use client';
import { styled } from '@mui/system';
import * as React from 'react';
import {
  gridDimensionsSelector,
  gridPinnedColumnsSelector,
  useGridEvent,
  useGridSelector,
} from '../hooks';
import { gridPinnedRowsSelector } from '../hooks/features/rows/gridRowsSelector';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../models/props/DataGridProps';
import { GridEventListener } from '../models/events';
import { vars } from '../constants/cssVariables';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';

interface GridScrollShadowsProps {
  position: 'vertical' | 'horizontal';
}

type OwnerState = Pick<DataGridProcessedProps, 'classes'> & {
  position: 'vertical' | 'horizontal';
};

const ScrollShadow = styled('div')<{ ownerState: OwnerState }>({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  transition: vars.transition(['box-shadow'], { duration: vars.transitions.duration.short }),
  variants: [
    {
      props: { position: 'vertical' },
      style: {
        top: 'var(--DataGrid-topContainerHeight)',
        bottom:
          'calc(var(--DataGrid-bottomContainerHeight) + var(--DataGrid-hasScrollX) * var(--DataGrid-scrollbarSize))',
        boxShadow:
          'inset 0 5px 5px -5px rgba(0,0,0,calc(var(--hasScrollStart) * .18)), inset 0 -5px 5px -5px rgba(0,0,0,calc(var(--hasScrollEnd) * .18))',
      },
    },
    {
      props: { position: 'horizontal' },
      style: {
        left: 'var(--DataGrid-leftPinnedWidth)',
        right:
          'calc(var(--DataGrid-rightPinnedWidth) + var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize))',
        boxShadow:
          'inset 5px 0 5px -5px rgba(0,0,0,calc(var(--hasScrollStart) * .18)), inset -5px 0 5px -5px rgba(0,0,0,calc(var(--hasScrollEnd) * .18))',
      },
    },
  ],
});

function GridScrollShadows(props: GridScrollShadowsProps) {
  const { position } = props;
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes, position };
  const ref = React.useRef<HTMLDivElement>(null);
  const apiRef = useGridPrivateApiContext();
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  const pinnedRows = useGridSelector(apiRef, gridPinnedRowsSelector);
  const pinnedColumns = useGridSelector(apiRef, gridPinnedColumnsSelector);
  const initialScrollable =
    position === 'vertical'
      ? dimensions.hasScrollY && pinnedRows?.bottom?.length > 0
      : dimensions.hasScrollX &&
        pinnedColumns?.right?.length !== undefined &&
        pinnedColumns?.right?.length > 0;

  const updateScrollShadowVisibility = (scrollPosition: number) => {
    const maxScroll =
      dimensions.contentSize[position === 'vertical' ? 'height' : 'width'] -
      dimensions.viewportInnerSize[position === 'vertical' ? 'height' : 'width'];
    const hasPinnedStart =
      position === 'vertical'
        ? pinnedRows?.top?.length > 0
        : pinnedColumns?.left?.length !== undefined && pinnedColumns?.left?.length > 0;
    const hasPinnedEnd =
      position === 'vertical'
        ? pinnedRows?.bottom?.length > 0
        : pinnedColumns?.right?.length !== undefined && pinnedColumns?.right?.length > 0;

    ref.current!.style.setProperty(
      '--hasScrollStart',
      hasPinnedStart && scrollPosition > 0 ? '1' : '0',
    );
    ref.current!.style.setProperty(
      '--hasScrollEnd',
      hasPinnedEnd && scrollPosition < maxScroll ? '1' : '0',
    );
  };

  const handleScrolling: GridEventListener<'scrollPositionChange'> = (scrollParams) => {
    updateScrollShadowVisibility(scrollParams[position === 'vertical' ? 'top' : 'left']);
  };

  const handleColumnResizeStop: GridEventListener<'columnResizeStop'> = () => {
    if (position === 'horizontal') {
      updateScrollShadowVisibility(apiRef.current.virtualScrollerRef?.current?.scrollLeft || 0);
    }
  };

  useGridEvent(apiRef, 'scrollPositionChange', handleScrolling);
  useGridEvent(apiRef, 'columnResizeStop', handleColumnResizeStop);

  return (
    <ScrollShadow
      ownerState={ownerState}
      ref={ref}
      style={
        {
          '--hasScrollStart': 0,
          '--hasScrollEnd': initialScrollable ? '1' : '0',
        } as React.CSSProperties
      }
    />
  );
}

export { GridScrollShadows };
