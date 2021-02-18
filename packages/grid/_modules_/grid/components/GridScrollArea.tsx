import * as React from 'react';
import {
  GRID_COL_REORDER_START,
  GRID_COL_REORDER_STOP,
  GRID_SCROLLING,
} from '../constants/eventsConstants';
import { useGridApiEventHandler } from '../hooks/root/useGridApiEventHandler';
import { GridApiRef } from '../models/api/gridApiRef';
import { GridScrollParams } from '../models/params/gridScrollParams';
import { classnames } from '../utils/classnames';
import { GridApiContext } from './GridApiContext';

const CLIFF = 1;
const SLOP = 1.5;

interface ScrollAreaProps {
  scrollDirection: 'left' | 'right';
}

export const GridScrollArea = React.memo(function GridScrollArea(props: ScrollAreaProps) {
  const { scrollDirection } = props;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const api = React.useContext(GridApiContext);
  const timeout = React.useRef<number>();
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

  useGridApiEventHandler(api as GridApiRef, GRID_SCROLLING, handleScrolling);
  useGridApiEventHandler(api as GridApiRef, GRID_COL_REORDER_START, toggleDragging);
  useGridApiEventHandler(api as GridApiRef, GRID_COL_REORDER_STOP, toggleDragging);

  return dragging ? (
    <div
      ref={rootRef}
      className={classnames('MuiDataGrid-scrollArea', `MuiDataGrid-scrollArea-${scrollDirection}`)}
      onDragOver={handleDragOver}
    />
  ) : null;
});
