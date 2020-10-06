import * as React from 'react';
import { COL_REORDER_START, COL_REORDER_STOP, SCROLLING } from '../constants/eventsConstants';
import { ScrollParams, useApiEventHandler } from '../hooks';
import { ApiContext } from './api-context';

type ScrollDirection = 'left' | 'right';

interface ScrollAreaProps {
  scrollDirection: ScrollDirection;
}
export const ScrollArea: React.FC<ScrollAreaProps> = React.memo(
  ({ scrollDirection }: ScrollAreaProps) => {
    const api = React.useContext(ApiContext);
    const cssClass = `MuiDataGrid-scrollArea ${
      scrollDirection === 'left' ? 'MuiDataGrid-scrollArea-left' : 'MuiDataGrid-scrollArea-right'
    }`;
    const [isDragging, setIsDragging] = React.useState<boolean>(false);
    const scrollStep = scrollDirection === 'left' ? -10 : 10;
    const currentScrollPosition = React.useRef<ScrollParams | null>({
      left: 0,
      top: 0,
    });

    const setCurrentScrollPosition = React.useCallback(
      (scrollPoition) => {
        currentScrollPosition.current = scrollPoition;
      },
      [currentScrollPosition],
    );

    const handleDragOver = React.useCallback(
      () =>
        api!.current.scroll({
          left: currentScrollPosition.current!.left + scrollStep,
          top: currentScrollPosition.current!.top,
        }),
      [currentScrollPosition, scrollStep, api],
    );

    const toggleIsDragging = React.useCallback(() => {
      setIsDragging(!isDragging);
    }, [isDragging]);

    if (api) {
      useApiEventHandler(api, SCROLLING, setCurrentScrollPosition);
      useApiEventHandler(api, COL_REORDER_START, toggleIsDragging);
      useApiEventHandler(api, COL_REORDER_STOP, toggleIsDragging);
    }

    return <>{isDragging && <div className={cssClass} onDragOver={handleDragOver} />}</>;
  },
);
ScrollArea.displayName = 'ScrollArea';
