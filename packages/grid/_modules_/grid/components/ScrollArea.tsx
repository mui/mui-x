import * as React from 'react';
import { COL_REORDER_START, COL_REORDER_STOP, SCROLLING } from '../constants/eventsConstants';
import { ScrollParams, useApiEventHandler } from '../hooks';
import { ApiRef } from '../models';
import { ApiContext } from './api-context';

type ScrollDirection = 'left' | 'right';

interface ScrollAreaProps {
  scrollDirection: ScrollDirection;
}
export const ScrollArea: React.FC<ScrollAreaProps> = React.memo(
  ({ scrollDirection }: ScrollAreaProps) => {
    const api = React.useContext(ApiContext);
    const cursorPossitionX = React.useRef<number | null>(null);
    const cssClass = `MuiDataGrid-scrollArea ${
      scrollDirection === 'left' ? 'MuiDataGrid-scrollArea-left' : 'MuiDataGrid-scrollArea-right'
    }`;
    const [isDragging, setIsDragging] = React.useState<boolean>(false);
    const scrollStep = React.useRef<number>(2);
    const scrollStepMultiplier = 3;
    const currentScrollPosition = React.useRef<ScrollParams | null>({
      left: 0,
      top: 0,
    });

    const setCurrentScrollPosition = React.useCallback(
      (scrollPosition) => {
        currentScrollPosition.current = scrollPosition;
      },
      [currentScrollPosition],
    );

    const handleDragOver = React.useCallback(
      (event) => {
        if (cursorPossitionX.current !== null) {
          scrollStep.current += event.clientX - cursorPossitionX.current;
        }

        cursorPossitionX.current = event.clientX;

        api!.current.scroll({
          left: currentScrollPosition.current!.left + scrollStep.current * scrollStepMultiplier,
          top: currentScrollPosition.current!.top,
        });
      },
      [currentScrollPosition, scrollStep, api],
    );

    const toggleIsDragging = React.useCallback(() => {
      setIsDragging(!isDragging);
    }, [isDragging]);

    useApiEventHandler(api as ApiRef, SCROLLING, setCurrentScrollPosition);
    useApiEventHandler(api as ApiRef, COL_REORDER_START, toggleIsDragging);
    useApiEventHandler(api as ApiRef, COL_REORDER_STOP, toggleIsDragging);

    return isDragging ? <div className={cssClass} onDragOver={handleDragOver} /> : null;
  },
);
ScrollArea.displayName = 'ScrollArea';
