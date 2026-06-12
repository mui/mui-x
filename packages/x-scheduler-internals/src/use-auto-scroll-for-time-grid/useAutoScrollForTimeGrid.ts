'use client';
import * as React from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { unsafeOverflowAutoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element';

const OVERFLOW_PX = 160;

export function useAutoScrollForTimeGrid(ref: React.RefObject<HTMLElement | null>): void {
  React.useEffect(() => {
    const element = ref.current;
    if (!element || process.env.NODE_ENV === 'test') {
      return undefined;
    }

    const cleanupMain = autoScrollForElements({
      element,
      getAllowedAxis: () => 'vertical',
      getConfiguration: () => ({ maxScrollSpeed: 'standard' }),
    });

    const cleanupOverflow = unsafeOverflowAutoScrollForElements({
      element,
      getOverflow: () => ({
        forTopEdge: { top: OVERFLOW_PX },
        forBottomEdge: { bottom: OVERFLOW_PX },
      }),
      getAllowedAxis: () => 'vertical',
      getConfiguration: () => ({ maxScrollSpeed: 'standard' }),
    });

    return () => {
      cleanupMain();
      cleanupOverflow();
    };
  }, [ref]);
}
