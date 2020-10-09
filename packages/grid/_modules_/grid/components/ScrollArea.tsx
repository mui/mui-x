import * as React from 'react';
import { COL_REORDER_START, COL_REORDER_STOP, SCROLLING } from '../constants/eventsConstants';
import { ScrollParams, useApiEventHandler } from '../hooks';
import { ApiRef } from '../models';
import { classnames } from '../utils';
import { ApiContext } from './api-context';

interface ScrollAreaProps {
  scrollDirection: 'left' | 'right';
}

export const ScrollArea = React.memo(function ScrollArea(props: ScrollAreaProps) {
  const { scrollDirection } = props;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const api = React.useContext(ApiContext);
  const rafRef = React.useRef(0);
  const timeout = React.useRef<number>();
  const [dragging, setDragging] = React.useState<boolean>(false);
  const scrollPosition = React.useRef<ScrollParams>({
    left: 0,
    top: 0,
  });

  const handleScrolling = React.useCallback((newScrollPosition) => {
    scrollPosition.current = newScrollPosition;
  }, []);

  const handleDragOver = React.useCallback(
    (event) => {
      let diff;

      if (scrollDirection === 'left') {
        diff = event.clientX - rootRef.current!.getBoundingClientRect().right;
      } else if (scrollDirection === 'right') {
        diff = Math.max(1, event.clientX - rootRef.current!.getBoundingClientRect().left);
      } else {
        throw new Error('wrong dir');
      }

      diff = (diff - 1) * 1.5 + 1;

      // Throttle, max 60 Hz
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        // Wait for the frame to pain before updating the scroll position
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          api!.current.scroll({
            left: scrollPosition.current.left + diff,
            top: scrollPosition.current.top,
          });
        });
      });
    },
    [scrollDirection, api],
  );

  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeout.current);
    };
  }, []);

  const toggleDragging = React.useCallback(() => {
    setDragging((prevdragging) => !prevdragging);
  }, []);

  useApiEventHandler(api as ApiRef, SCROLLING, handleScrolling);
  useApiEventHandler(api as ApiRef, COL_REORDER_START, toggleDragging);
  useApiEventHandler(api as ApiRef, COL_REORDER_STOP, toggleDragging);

  return dragging ? (
    <div
      ref={rootRef}
      className={classnames('MuiDataGrid-scrollArea', `MuiDataGrid-scrollArea-${scrollDirection}`)}
      onDragOver={handleDragOver}
    />
  ) : null;
});
