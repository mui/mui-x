import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { GridEvents } from '../constants/eventsConstants';
import { useGridApiEventHandler } from '../hooks/root/useGridApiEventHandler';
import { GridApiRef } from '../models/api/gridApiRef';
import { GridScrollParams } from '../models/params/gridScrollParams';
import { useGridApiContext } from '../hooks/root/useGridApiContext';
import { gridClasses } from '../gridClasses';

const CLIFF = 1;
const SLOP = 1.5;

interface ScrollAreaProps {
  scrollDirection: 'left' | 'right';
}

function GridScrollAreaRaw(props: ScrollAreaProps) {
  const { scrollDirection } = props;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const api = useGridApiContext();
  const timeout = React.useRef<any>();
  const [dragging, setDragging] = React.useState<boolean>(false);
  const scrollPosition = React.useRef<GridScrollParams>({
    left: 0,
    top: 0,
  });

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
        throw new Error('wrong dir');
      }

      offset = (offset - CLIFF) * SLOP + CLIFF;

      clearTimeout(timeout.current);
      // Avoid freeze and inertia.
      timeout.current = setTimeout(() => {
        api!.current.scroll({
          left: scrollPosition.current.left + offset,
          top: scrollPosition.current.top,
        });
      });
    },
    [scrollDirection, api],
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  const toggleDragging = React.useCallback(() => {
    setDragging((prevdragging) => !prevdragging);
  }, []);

  useGridApiEventHandler(api as GridApiRef, GridEvents.rowsScroll, handleScrolling);
  useGridApiEventHandler(api as GridApiRef, GridEvents.columnHeaderDragStart, toggleDragging);
  useGridApiEventHandler(api as GridApiRef, GridEvents.columnHeaderDragEnd, toggleDragging);

  return dragging ? (
    <div
      ref={rootRef}
      className={clsx(gridClasses.scrollArea, gridClasses[`scrollArea--${scrollDirection}`])}
      onDragOver={handleDragOver}
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
