'use client';
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/system';
import { fastMemo } from '@mui/x-internals/fastMemo';
import { RefObject } from '@mui/x-internals/types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { DataGridProcessedProps } from '../models/props/DataGridProps';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass, gridClasses } from '../constants';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridEvent } from '../hooks/utils/useGridEvent';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import {
  gridDimensionsSelector,
  gridColumnsTotalWidthSelector,
} from '../hooks/features/dimensions/gridDimensionsSelectors';
import { gridDensityFactorSelector } from '../hooks/features/density/densitySelector';
import { GridScrollParams } from '../models/params/gridScrollParams';
import { GridEventListener } from '../models/events';
import { useTimeout } from '../hooks/utils/useTimeout';
import { getTotalHeaderHeight } from '../hooks/features/columns/gridColumnsUtils';
import { createSelector } from '../utils/createSelector';
import { gridRowsMetaSelector } from '../hooks/features/rows/gridRowsMetaSelector';

const CLIFF = 1;
const SLOP = 1.5;

interface ScrollAreaProps {
  scrollDirection: 'left' | 'right' | 'up' | 'down';
  scrollPosition: RefObject<GridScrollParams>;
}

type OwnerState = Omit<DataGridProcessedProps, 'rows'> & Pick<ScrollAreaProps, 'scrollDirection'>;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { scrollDirection, classes } = ownerState;

  const slots = {
    root: ['scrollArea', `scrollArea--${scrollDirection}`],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridScrollAreaRawRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ScrollArea',
  overridesResolver: (props, styles) => [
    { [`&.${gridClasses['scrollArea--left']}`]: styles['scrollArea--left'] },
    { [`&.${gridClasses['scrollArea--right']}`]: styles['scrollArea--right'] },
    { [`&.${gridClasses['scrollArea--up']}`]: styles['scrollArea--up'] },
    { [`&.${gridClasses['scrollArea--down']}`]: styles['scrollArea--down'] },
    styles.scrollArea,
  ],
})<{ ownerState: OwnerState }>(() => ({
  position: 'absolute',
  zIndex: 101,
  // Horizontal scroll areas
  [`&.${gridClasses['scrollArea--left']}`]: {
    top: 0,
    left: 0,
    width: 20,
    bottom: 0,
  },
  [`&.${gridClasses['scrollArea--right']}`]: {
    top: 0,
    right: 0,
    width: 20,
    bottom: 0,
  },
  // Vertical scroll areas
  [`&.${gridClasses['scrollArea--up']}`]: {
    top: 0,
    left: 0,
    right: 0,
    height: 20,
  },
  [`&.${gridClasses['scrollArea--down']}`]: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
  },
}));

const offsetSelector = createSelector(
  gridDimensionsSelector,
  (dimensions, direction: ScrollAreaProps['scrollDirection']) => {
    if (direction === 'left') {
      return dimensions.leftPinnedWidth;
    }
    if (direction === 'right') {
      return dimensions.rightPinnedWidth + (dimensions.hasScrollX ? dimensions.scrollbarSize : 0);
    }
    // For vertical scroll areas, we don't need horizontal offset
    return 0;
  },
);

function GridScrollAreaWrapper(props: ScrollAreaProps) {
  const apiRef = useGridApiContext();
  const [dragDirection, setDragDirection] = React.useState<'horizontal' | 'vertical' | 'none'>(
    'none',
  );

  // Listen for both column and row drag events
  useGridEvent(apiRef, 'columnHeaderDragStart', () => setDragDirection('horizontal'));
  useGridEvent(apiRef, 'columnHeaderDragEnd', () => setDragDirection('none'));
  useGridEvent(apiRef, 'rowDragStart', () => setDragDirection('vertical'));
  useGridEvent(apiRef, 'rowDragEnd', () => setDragDirection('none'));

  if (dragDirection === 'none') {
    return null;
  }

  if (dragDirection === 'horizontal') {
    return <GridHorizontalScrollAreaContent {...props} />;
  }

  return <GridVerticalScrollAreaContent {...props} />;
}

function GridHorizontalScrollAreaContent(props: ScrollAreaProps) {
  const { scrollDirection, scrollPosition } = props;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const apiRef = useGridApiContext();
  const timeout = useTimeout();
  const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const sideOffset = useGridSelector(apiRef, offsetSelector, scrollDirection);

  const getCanScrollMore = () => {
    const dimensions = gridDimensionsSelector(apiRef);
    if (scrollDirection === 'left') {
      // Only render if the user has not reached yet the start of the list
      return scrollPosition.current.left > 0;
    }

    if (scrollDirection === 'right') {
      // Only render if the user has not reached yet the end of the list
      const maxScrollLeft = columnsTotalWidth - dimensions.viewportInnerSize.width;
      return scrollPosition.current.left < maxScrollLeft;
    }

    return false;
  };

  const { columnHeaderHeight, headerFilterHeight, listView, columnGroupHeaderHeight } =
    useGridRootProps();

  const totalHeaderHeight = getTotalHeaderHeight(apiRef, {
    columnHeaderHeight,
    headerFilterHeight,
    listView,
    columnGroupHeaderHeight,
  });

  const headerHeight = Math.floor(columnHeaderHeight * densityFactor);

  const style: React.CSSProperties = {
    height: headerHeight,
    top: totalHeaderHeight - headerHeight,
    ...(scrollDirection === 'left' ? { left: sideOffset } : {}),
    ...(scrollDirection === 'right' ? { right: sideOffset } : {}),
  };

  const handleDragOver = useEventCallback((event: React.DragEvent<HTMLDivElement>) => {
    let offset: number;

    // Prevents showing the forbidden cursor
    event.preventDefault();

    if (scrollDirection === 'left') {
      offset = event.clientX - rootRef.current!.getBoundingClientRect().right;
    } else if (scrollDirection === 'right') {
      offset = Math.max(1, event.clientX - rootRef.current!.getBoundingClientRect().left);
    } else {
      throw new Error('MUI X: Wrong drag direction');
    }

    offset = (offset - CLIFF) * SLOP + CLIFF;

    // Avoid freeze and inertia.
    timeout.start(0, () => {
      apiRef.current.scroll({
        left: scrollPosition.current.left + offset,
        top: scrollPosition.current.top,
      });
    });
  });

  return (
    <GridScrollAreaContent
      {...props}
      ref={rootRef}
      getCanScrollMore={getCanScrollMore}
      style={style}
      handleDragOver={handleDragOver}
    />
  );
}

function GridVerticalScrollAreaContent(props: ScrollAreaProps) {
  const { scrollDirection, scrollPosition } = props;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const apiRef = useGridApiContext();
  const timeout = useTimeout();
  const rowsMeta = useGridSelector(apiRef, gridRowsMetaSelector);

  const getCanScrollMore = () => {
    const dimensions = gridDimensionsSelector(apiRef);
    if (scrollDirection === 'up') {
      // Only render if the user has not reached yet the top of the list
      return scrollPosition.current.top > 0;
    }

    if (scrollDirection === 'down') {
      // Only render if the user has not reached yet the bottom of the list
      const totalRowsHeight = rowsMeta.currentPageTotalHeight || 0;
      const maxScrollTop =
        totalRowsHeight -
        dimensions.viewportInnerSize.height -
        (dimensions.hasScrollX ? dimensions.scrollbarSize : 0);
      return scrollPosition.current.top < maxScrollTop;
    }

    return false;
  };

  const { columnHeaderHeight, headerFilterHeight, listView, columnGroupHeaderHeight } =
    useGridRootProps();
  const totalHeaderHeight = getTotalHeaderHeight(apiRef, {
    columnHeaderHeight,
    headerFilterHeight,
    listView,
    columnGroupHeaderHeight,
  });

  const style: React.CSSProperties = {
    top: scrollDirection === 'up' ? totalHeaderHeight : undefined,
    bottom: scrollDirection === 'down' ? 0 : undefined,
  };

  const handleDragOver = useEventCallback((event: React.DragEvent<HTMLDivElement>) => {
    let offset: number;

    // Prevents showing the forbidden cursor
    event.preventDefault();

    if (scrollDirection === 'up') {
      offset = event.clientY - rootRef.current!.getBoundingClientRect().bottom;
    } else if (scrollDirection === 'down') {
      offset = Math.max(1, event.clientY - rootRef.current!.getBoundingClientRect().top);
    } else {
      throw new Error('MUI X: Wrong drag direction');
    }

    offset = (offset - CLIFF) * SLOP + CLIFF;

    // Avoid freeze and inertia.
    timeout.start(0, () => {
      apiRef.current.scroll({
        left: scrollPosition.current.left,
        top: scrollPosition.current.top + offset,
      });
    });
  });

  return (
    <GridScrollAreaContent
      {...props}
      ref={rootRef}
      getCanScrollMore={getCanScrollMore}
      style={style}
      handleDragOver={handleDragOver}
    />
  );
}

interface GridScrollAreaContentProps extends ScrollAreaProps {
  getCanScrollMore: () => boolean;
  style: React.CSSProperties;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
}

const GridScrollAreaContent = forwardRef(function GridScrollAreaContent(
  props: GridScrollAreaContentProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { scrollDirection, getCanScrollMore, style, handleDragOver } = props;
  const apiRef = useGridApiContext();

  const [canScrollMore, setCanScrollMore] = React.useState<boolean>(getCanScrollMore);

  const { rows, ...rootProps } = useGridRootProps();
  const ownerState = { ...rootProps, scrollDirection };
  const classes = useUtilityClasses(ownerState);

  const handleScrolling: GridEventListener<'scrollPositionChange'> = () => {
    setCanScrollMore(getCanScrollMore);
  };

  useGridEvent(apiRef, 'scrollPositionChange', handleScrolling);

  if (!canScrollMore) {
    return null;
  }

  return (
    <GridScrollAreaRawRoot
      ref={ref}
      className={classes.root}
      ownerState={ownerState}
      onDragOver={handleDragOver}
      style={style}
    />
  );
});

export const GridScrollArea = fastMemo(GridScrollAreaWrapper);
