'use client';
import * as React from 'react';
import clsx from 'clsx';
import useEventCallback from '@mui/utils/useEventCallback';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/system';
import { fastMemo } from '@mui/x-internals/fastMemo';
import { RefObject } from '@mui/x-internals/types';
import { DataGridProcessedProps } from '../models/props/DataGridProps';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass, gridClasses } from '../constants';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridApiEventHandler } from '../hooks/utils/useGridApiEventHandler';
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

const CLIFF = 1;
const SLOP = 1.5;

interface ScrollAreaProps {
  scrollDirection: 'left' | 'right';
  scrollPosition: RefObject<GridScrollParams>;
}

type OwnerState = DataGridProcessedProps & Pick<ScrollAreaProps, 'scrollDirection'>;

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
    styles.scrollArea,
  ],
})<{ ownerState: OwnerState }>(() => ({
  position: 'absolute',
  top: 0,
  zIndex: 101,
  width: 20,
  bottom: 0,
  [`&.${gridClasses['scrollArea--left']}`]: {
    left: 0,
  },
  [`&.${gridClasses['scrollArea--right']}`]: {
    right: 0,
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
    return 0;
  },
);

function GridScrollAreaWrapper(props: ScrollAreaProps) {
  const apiRef = useGridApiContext();
  const [dragging, setDragging] = React.useState<boolean>(false);

  useGridApiEventHandler(apiRef, 'columnHeaderDragStart', () => setDragging(true));
  useGridApiEventHandler(apiRef, 'columnHeaderDragEnd', () => setDragging(false));

  if (!dragging) {
    return null;
  }

  return <GridScrollAreaContent {...props} />;
}

function GridScrollAreaContent(props: ScrollAreaProps) {
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

  const [canScrollMore, setCanScrollMore] = React.useState<boolean>(getCanScrollMore);

  const rootProps = useGridRootProps();
  const ownerState = { ...rootProps, scrollDirection };
  const classes = useUtilityClasses(ownerState);
  const totalHeaderHeight = getTotalHeaderHeight(apiRef, rootProps);
  const headerHeight = Math.floor(rootProps.columnHeaderHeight * densityFactor);

  const style: React.CSSProperties = {
    height: headerHeight,
    top: totalHeaderHeight - headerHeight,
  };

  if (scrollDirection === 'left') {
    style.left = sideOffset;
  } else if (scrollDirection === 'right') {
    style.right = sideOffset;
  }

  const handleScrolling: GridEventListener<'scrollPositionChange'> = () => {
    setCanScrollMore(getCanScrollMore);
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

  useGridApiEventHandler(apiRef, 'scrollPositionChange', handleScrolling);

  if (!canScrollMore) {
    return null;
  }

  return (
    <GridScrollAreaRawRoot
      ref={rootRef}
      className={clsx(classes.root)}
      ownerState={ownerState}
      onDragOver={handleDragOver}
      style={style}
    />
  );
}

export const GridScrollArea = fastMemo(GridScrollAreaWrapper);
