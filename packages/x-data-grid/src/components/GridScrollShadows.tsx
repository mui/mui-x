'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import { useRtl } from '@mui/system/RtlProvider';
import composeClasses from '@mui/utils/composeClasses';
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
import {
  gridHasScrollXSelector,
  gridHasScrollYSelector,
} from '../hooks/features/dimensions/gridDimensionsSelectors';
import { getDataGridUtilityClass } from '../constants';

interface GridScrollShadowsProps {
  position: 'vertical' | 'horizontal';
}

type OwnerState = Pick<DataGridProcessedProps, 'classes'> & {
  position: 'vertical' | 'horizontal';
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, position } = ownerState;

  const slots = {
    root: ['scrollShadow', `scrollShadow--${position}`],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const ScrollShadow = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ScrollShadow',
  overridesResolver: (props, styles) => [styles.root, styles[props.position]],
})<{ ownerState: OwnerState }>(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  transition: vars.transition(['box-shadow'], { duration: vars.transitions.duration.short }),
  '--length': theme.palette.mode === 'dark' ? '8px' : '6px',
  '--length-inverse': 'calc(var(--length) * -1)',
  '--opacity': theme.palette.mode === 'dark' ? '0.7' : '0.18',
  '--blur': 'var(--length)',
  '--spread': 'calc(var(--length) * -1)',
  '--color': '0, 0, 0',
  '--color-start': 'rgba(var(--color), calc(var(--hasScrollStart) * var(--opacity)))',
  '--color-end': 'rgba(var(--color), calc(var(--hasScrollEnd) * var(--opacity)))',
  variants: [
    {
      props: { position: 'vertical' },
      style: {
        top: 'var(--DataGrid-topContainerHeight)',
        bottom:
          'calc(var(--DataGrid-bottomContainerHeight) + var(--DataGrid-hasScrollX) * var(--DataGrid-scrollbarSize))',
        boxShadow:
          'inset 0 var(--length) var(--blur) var(--spread) var(--color-start), inset 0 var(--length-inverse) var(--blur) var(--spread) var(--color-end)',
      },
    },
    {
      props: { position: 'horizontal' },
      style: {
        left: 'var(--DataGrid-leftPinnedWidth)',
        right:
          'calc(var(--DataGrid-rightPinnedWidth) + var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize))',
        boxShadow:
          'inset var(--length) 0 var(--blur) var(--spread) var(--color-start), inset var(--length-inverse) 0 var(--blur) var(--spread) var(--color-end)',
      },
    },
  ],
}));

function GridScrollShadows(props: GridScrollShadowsProps) {
  const { position } = props;
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes, position };
  const classes = useUtilityClasses(ownerState);
  const ref = React.useRef<HTMLDivElement>(null);
  const apiRef = useGridPrivateApiContext();
  const hasScrollX = useGridSelector(apiRef, gridHasScrollXSelector);
  const hasScrollY = useGridSelector(apiRef, gridHasScrollYSelector);
  const pinnedRows = useGridSelector(apiRef, gridPinnedRowsSelector);
  const pinnedColumns = useGridSelector(apiRef, gridPinnedColumnsSelector);
  const initialScrollable =
    position === 'vertical'
      ? hasScrollY && pinnedRows?.bottom?.length > 0
      : hasScrollX &&
        pinnedColumns?.right?.length !== undefined &&
        pinnedColumns?.right?.length > 0;
  const isRtl = useRtl();

  const updateScrollShadowVisibility = React.useCallback(
    (scrollPosition: number) => {
      if (!ref.current) {
        return;
      }
      // Math.abs to convert negative scroll position (RTL) to positive
      const scroll = Math.abs(Math.round(scrollPosition));
      const dimensions = gridDimensionsSelector(apiRef);
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
      const scrollIsNotAtStart = isRtl ? scroll < maxScroll : scroll > 0;
      const scrollIsNotAtEnd = isRtl ? scroll > 0 : scroll < maxScroll;
      ref.current.style.setProperty(
        '--hasScrollStart',
        hasPinnedStart && scrollIsNotAtStart ? '1' : '0',
      );
      ref.current.style.setProperty('--hasScrollEnd', hasPinnedEnd && scrollIsNotAtEnd ? '1' : '0');
    },
    [pinnedRows, pinnedColumns, isRtl, position, apiRef],
  );

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

  React.useEffect(() => {
    updateScrollShadowVisibility(
      (position === 'horizontal'
        ? apiRef.current.virtualScrollerRef?.current?.scrollLeft
        : apiRef.current.virtualScrollerRef?.current?.scrollTop) ?? 0,
    );
  }, [updateScrollShadowVisibility, apiRef, position]);

  return (
    <ScrollShadow
      className={classes.root}
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
