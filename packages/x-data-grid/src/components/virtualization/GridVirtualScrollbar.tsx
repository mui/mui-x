import * as React from 'react';
import { styled } from '@mui/system';
import {
  unstable_composeClasses as composeClasses,
  unstable_useForkRef as useForkRef,
  unstable_useEventCallback as useEventCallback,
} from '@mui/utils';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useOnMount } from '../../hooks/utils/useOnMount';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { gridDimensionsSelector, useGridSelector } from '../../hooks';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

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

const Scrollbar = styled('div')({
  position: 'absolute',
  display: 'inline-block',
  zIndex: 6,
  '&:hover': {
    zIndex: 7,
  },
  // In macOS Safari and Gnome Web, scrollbars are overlaid and don't affect the layout. So we consider
  // their size to be 0px throughout all the calculations, but the floating scrollbar container does need
  // to appear and have a real size. We set it to 14px because it seems like an acceptable value and we
  // don't have a method to find the required size for scrollbars on those platforms.
  '--size': 'calc(max(var(--DataGrid-scrollbarSize), 14px))',
});

const ScrollbarVertical = styled(Scrollbar)({
  width: 'var(--size)',
  overflowY: 'auto',
  overflowX: 'hidden',
  // Disable focus-visible style, it's a scrollbar.
  outline: 0,
  '& > div': {
    width: 'var(--size)',
  },
  top: 0,
  bottom: 0,
  right: 0,
});

const ScrollbarHorizontal = styled(Scrollbar)({
  height: 'var(--size)',
  overflowY: 'hidden',
  overflowX: 'auto',
  // Disable focus-visible style, it's a scrollbar.
  outline: 0,
  '& > div': {
    height: 'var(--size)',
  },
  bottom: 0,
  left: 0,
});

export const ScrollbarCorner = styled(Scrollbar)({
  width: 'var(--size)',
  height: 'var(--size)',
  bottom: 0,
  right: 0,
  overflow: 'scroll',
});

const GridVirtualScrollbar = forwardRef<HTMLDivElement, GridVirtualScrollbarProps>(
  function GridVirtualScrollbar(props, ref) {
    const apiRef = useGridPrivateApiContext();
    const rootProps = useGridRootProps();
    const isLocked = React.useRef(false);
    const lastPosition = React.useRef(0);
    const scrollbarRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const classes = useUtilityClasses(rootProps, props.position);
    const dimensions = useGridSelector(apiRef, gridDimensionsSelector);

    const propertyDimension = props.position === 'vertical' ? 'height' : 'width';
    const propertyScroll = props.position === 'vertical' ? 'scrollTop' : 'scrollLeft';
    const propertyScrollPosition = props.position === 'vertical' ? 'top' : 'left';

    const scrollbarInnerSize = dimensions.minimumSize[propertyDimension];

    const onScrollerScroll = useEventCallback(() => {
      const scrollbar = scrollbarRef.current;
      const scrollPosition = props.scrollPosition.current;

      if (!scrollbar) {
        return;
      }

      if (scrollPosition[propertyScrollPosition] === lastPosition.current) {
        return;
      }

      lastPosition.current = scrollPosition[propertyScrollPosition];

      if (isLocked.current) {
        isLocked.current = false;
        return;
      }
      isLocked.current = true;

      scrollbar[propertyScroll] = scrollPosition[propertyScrollPosition];
    });

    const onScrollbarScroll = useEventCallback(() => {
      const scroller = apiRef.current.virtualScrollerRef.current!;
      const scrollbar = scrollbarRef.current;

      if (!scrollbar) {
        return;
      }

      if (isLocked.current) {
        isLocked.current = false;
        return;
      }
      isLocked.current = true;

      scroller[propertyScroll] = scrollbar[propertyScroll];
    });

    useOnMount(() => {
      const scroller = apiRef.current.virtualScrollerRef.current!;
      const scrollbar = scrollbarRef.current!;
      const options: AddEventListenerOptions = { passive: true };
      scroller.addEventListener('scroll', onScrollerScroll, options);
      scrollbar.addEventListener('scroll', onScrollbarScroll, options);
      return () => {
        scroller.removeEventListener('scroll', onScrollerScroll, options);
        scrollbar.removeEventListener('scroll', onScrollbarScroll, options);
      };
    });

    React.useEffect(() => {
      const content = contentRef.current!;
      content.style.setProperty(propertyDimension, `${scrollbarInnerSize}px`);
    }, [scrollbarInnerSize, propertyDimension]);

    const Container = props.position === 'vertical' ? ScrollbarVertical : ScrollbarHorizontal;

    // TODO: Check why this is needed
    const listViewStyle =
      props.position === 'vertical' && rootProps.unstable_listView
        ? { bottom: 0, top: 0 }
        : undefined;

    return (
      <Container
        ref={useForkRef(ref, scrollbarRef)}
        className={classes.root}
        style={{
          bottom:
            props.position === 'vertical' && dimensions.hasScrollX ? 'var(--size)' : undefined,
          right:
            props.position === 'horizontal' && dimensions.hasScrollY ? 'var(--size)' : undefined,
          ...listViewStyle,
        }}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div ref={contentRef} className={classes.content} />
      </Container>
    );
  },
);

export { GridVirtualScrollbar };
