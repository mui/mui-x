import * as React from 'react';
import { SCROLLING } from '../constants/eventsConstants';
import { ScrollParams } from '../hooks';
import { ApiRef } from '../models';

type ScrollDirection = 'left' | 'right';

interface ScrollAreaProps {
  scrollDirection: ScrollDirection;
  apiRef: ApiRef;
}
export const ScrollArea: React.FC<ScrollAreaProps> = React.memo(
  ({ scrollDirection, apiRef }: ScrollAreaProps) => {
    const cssClass = `MuiDataGrid-scrollArea ${
      scrollDirection === 'left' ? 'MuiDataGrid-scrollArea-left' : 'MuiDataGrid-scrollArea-right'
    }`;
    const scrollStep = scrollDirection === 'left' ? -5 : 5;
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
        apiRef.current.scroll({
          left: currentScrollPosition.current!.left + scrollStep,
          top: currentScrollPosition.current!.top,
        }),
      [currentScrollPosition, scrollStep, apiRef],
    );

    apiRef.current.subscribeEvent(SCROLLING, setCurrentScrollPosition);

    return <div className={cssClass} onDragOver={handleDragOver} />;
  },
);
ScrollArea.displayName = 'ScrollArea';
