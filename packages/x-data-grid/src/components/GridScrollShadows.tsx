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

const ScrollShadow = styled('div')<{ ownerState: OwnerState }>(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  transition: vars.transition(['box-shadow'], { duration: vars.transitions.duration.short }),
  '--length': '5px',
  '--length-end': 'calc(var(--length) * -1)',
  '--opacity': theme.palette.mode === 'dark' ? '0.8' : '0.18',
  '--blur': 'var(--length)',
  '--spread': 'calc(var(--length) * -1)',
  '--color-start': 'rgba(0, 0, 0, calc(var(--hasScrollStart) * var(--opacity)))',
  '--color-end': 'rgba(0, 0, 0, calc(var(--hasScrollEnd) * var(--opacity)))',
  variants: [
    {
      props: { position: 'vertical' },
      style: {
        top: 'var(--DataGrid-topContainerHeight)',
        bottom:
          'calc(var(--DataGrid-bottomContainerHeight) + var(--DataGrid-hasScrollX) * var(--DataGrid-scrollbarSize))',
        boxShadow:
          'inset 0 var(--length) var(--blur) var(--spread) var(--color-start), inset 0 var(--length-end) var(--blur) var(--spread) var(--color-end)',
      },
    },
    {
      props: { position: 'horizontal' },
      style: {
        left: 'var(--DataGrid-leftPinnedWidth)',
        right:
          'calc(var(--DataGrid-rightPinnedWidth) + var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize))',
        boxShadow:
          'inset var(--length) 0 var(--blur) var(--spread) var(--color-start), inset var(--length-end) 0 var(--blur) var(--spread) var(--color-end)',
      },
    },
  ],
}));

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
    if (!ref.current) {
      return;
    }
    const scroll = Math.round(scrollPosition);
    const maxScroll = Math.round(
      dimensions.contentSize[position === 'vertical' ? 'height' : 'width'] -
        dimensions.viewportInnerSize[position === 'vertical' ? 'height' : 'width'],
    );
    const hasPinnedStart =
      position === 'vertical'
        ? pinnedRows?.top?.length > 0
        : pinnedColumns?.left?.length !== undefined && pinnedColumns?.left?.length > 0;
    const hasPinnedEnd =
      position === 'vertical'
        ? pinnedRows?.bottom?.length > 0
        : pinnedColumns?.right?.length !== undefined && pinnedColumns?.right?.length > 0;
    ref.current.style.setProperty('--hasScrollStart', hasPinnedStart && scroll > 0 ? '1' : '0');
    ref.current.style.setProperty('--hasScrollEnd', hasPinnedEnd && scroll < maxScroll ? '1' : '0');
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
