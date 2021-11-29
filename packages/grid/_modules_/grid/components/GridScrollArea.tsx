import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridEvents } from '../models/events';
import { useGridApiEventHandler } from '../hooks/utils/useGridApiEventHandler';
import { GridScrollParams } from '../models/params/gridScrollParams';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass, gridClasses } from '../gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../GridComponentProps';
import { gridDensityHeaderHeightSelector } from '../hooks/features/density/densitySelector';
import { useGridSelector } from '../hooks/utils/useGridSelector';

const CLIFF = 1;
const SLOP = 1.5;

interface ScrollAreaProps {
  scrollDirection: 'left' | 'right';
}

type OwnerState = ScrollAreaProps & {
  classes?: GridComponentProps['classes'];
};

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
})(() => ({
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

function GridScrollAreaRaw(props: ScrollAreaProps) {
  const { scrollDirection } = props;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const apiRef = useGridApiContext();
  const timeout = React.useRef<any>();
  const [dragging, setDragging] = React.useState<boolean>(false);
  const height = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const scrollPosition = React.useRef<GridScrollParams>({
    left: 0,
    top: 0,
  });

  const rootProps = useGridRootProps();
  const ownerState = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const handleScrolling = React.useCallback((newScrollPosition) => {
    scrollPosition.current = newScrollPosition;
  }, []);

  const handleDragOver = React.useCallback(
    (event) => {
      let offset: number;

      if (scrollDirection === 'left') {
        offset = event.clientX - rootRef.current!.getBoundingClientRect().right;
      } else if (scrollDirection === 'right') {
        offset = Math.max(1, event.clientX - rootRef.current!.getBoundingClientRect().left);
      } else {
        throw new Error('MUI: Wrong drag direction');
      }

      offset = (offset - CLIFF) * SLOP + CLIFF;

      clearTimeout(timeout.current);
      // Avoid freeze and inertia.
      timeout.current = setTimeout(() => {
        apiRef.current.scroll({
          left: scrollPosition.current.left + offset,
          top: scrollPosition.current.top,
        });
      });
    },
    [scrollDirection, apiRef],
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  const toggleDragging = React.useCallback(() => {
    setDragging((prevDragging) => !prevDragging);
  }, []);

  useGridApiEventHandler(apiRef, GridEvents.rowsScroll, handleScrolling);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragStart, toggleDragging);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragEnd, toggleDragging);

  return dragging ? (
    <GridScrollAreaRawRoot
      ref={rootRef}
      className={clsx(classes.root)}
      onDragOver={handleDragOver}
      style={{ height }}
    />
  ) : null;
}

GridScrollAreaRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  scrollDirection: PropTypes.oneOf(['left', 'right']).isRequired,
} as any;

const GridScrollArea = React.memo(GridScrollAreaRaw);

export { GridScrollArea };
