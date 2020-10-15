import * as React from 'react';
import { COL_REORDER_START, COL_REORDER_STOP, SCROLLING } from '../constants/eventsConstants';
import { ScrollParams, useApiEventHandler } from '../hooks';
import { ApiRef } from '../models';
import { classnames } from '../utils';
import { ApiContext } from './api-context';

const CLIFF = 1;
const SLOP = 1.5;

interface ScrollAreaProps {
  scrollDirection: 'left' | 'right';
}

export const ScrollArea = React.memo(function ScrollArea(props: ScrollAreaProps) {
  const { scrollDirection } = props;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const api = React.useContext(ApiContext);
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
      let offset;

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
