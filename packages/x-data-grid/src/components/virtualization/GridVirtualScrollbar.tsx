'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { gridDimensionsSelector, useGridSelector } from '../../hooks';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';

type Position = 'vertical' | 'horizontal';
type OwnerState = DataGridProcessedProps;
type GridVirtualScrollbarProps = {
  position: Position;
  scrollPosition: React.RefObject<{
    left: number;
    top: number;
  }>;
};

const useUtilityClasses = (ownerState: OwnerState, position: Position) => {
  const { classes } = ownerState;

  const slots = {
    root: ['scrollbar', `scrollbar--${position}`],
    content: ['scrollbarContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

// In macOS Safari and Gnome Web, scrollbars are overlaid and don't affect the layout. So we consider
// their size to be 0px throughout all the calculations, but the floating scrollbar container does need
// to appear and have a real size. We set it to 14px because it seems like an acceptable value and we
// don't have a method to find the required size for scrollbars on those platforms.
export const scrollbarSizeCssExpression = 'calc(max(var(--DataGrid-scrollbarSize), 14px))';

const Scrollbar = styled('div', {
  slot: 'internal',
  shouldForwardProp: undefined,
})({
  position: 'absolute',
  display: 'inline-block',
  zIndex: 60,
  '&:hover': {
    zIndex: 70,
  },
  '--size': scrollbarSizeCssExpression,
});

const ScrollbarVertical = styled(Scrollbar, {
  slot: 'internal',
})({
  width: 'var(--size)',
  height:
    'calc(var(--DataGrid-hasScrollY) * (100% - var(--DataGrid-headersTotalHeight) - var(--DataGrid-hasScrollX) * var(--DataGrid-scrollbarSize)))',
  overflowY: 'auto',
  overflowX: 'hidden',
  // Disable focus-visible style, it's a scrollbar.
  outline: 0,
  '& > div': {
    width: 'var(--size)',
  },
  top: 'var(--DataGrid-headersTotalHeight)',
  right: 0,
});

const ScrollbarHorizontal = styled(Scrollbar, {
  slot: 'internal',
})({
  width:
    'calc(var(--DataGrid-hasScrollX) * (100% - var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize)))',
  height: 'var(--size)',
  overflowY: 'hidden',
  overflowX: 'auto',
  // Disable focus-visible style, it's a scrollbar.
  outline: 0,
  '& > div': {
    height: 'var(--size)',
  },
  bottom: 0,
});

export const ScrollbarCorner = styled(Scrollbar, {
  slot: 'internal',
})({
  width: 'var(--size)',
  height: 'var(--size)',
  right: 0,
  bottom: 0,
  overflow: 'scroll',
  '@media print': {
    display: 'none',
  },
});

const GridVirtualScrollbar = forwardRef<HTMLDivElement, GridVirtualScrollbarProps>(
  function GridVirtualScrollbar(props, ref) {
    const apiRef = useGridPrivateApiContext();
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps, props.position);
    const dimensions = useGridSelector(apiRef, gridDimensionsSelector);

    const propertyDimension = props.position === 'vertical' ? 'height' : 'width';

    const scrollbarInnerSize =
      props.position === 'horizontal'
        ? dimensions.minimumSize.width
        : dimensions.minimumSize.height - dimensions.headersTotalHeight;

    const Container = props.position === 'vertical' ? ScrollbarVertical : ScrollbarHorizontal;

    const scrollbarInnerStyle = React.useMemo(
      () => ({
        [propertyDimension]: `${scrollbarInnerSize}px`,
      }),
      [propertyDimension, scrollbarInnerSize],
    );

    return (
      <Container
        ref={ref}
        className={classes.root}
        tabIndex={-1}
        aria-hidden="true"
        // tabIndex does not prevent focus with a mouse click, throwing a console error
        // https://github.com/mui/mui-x/issues/16706
        onFocus={(event) => {
          event.target.blur();
        }}
      >
        <div className={classes.content} style={scrollbarInnerStyle} />
      </Container>
    );
  },
);

export { GridVirtualScrollbar };
