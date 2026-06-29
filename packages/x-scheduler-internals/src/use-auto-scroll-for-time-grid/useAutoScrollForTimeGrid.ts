'use client';
import * as React from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { unsafeOverflowAutoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element';
import { buildIsValidDropTarget } from '../build-is-valid-drop-target/buildIsValidDropTarget';

const OVERFLOW_PX = 160;

// Only event drags should autoscroll the grid; other element drags (e.g. the dialog) carry no `source`.
const canAutoScrollForDrag = buildIsValidDropTarget([
  'CalendarGridTimeEvent',
  'CalendarGridTimeEventResizeHandler',
  'StandaloneEvent',
]);

export function useAutoScrollForTimeGrid(ref: React.RefObject<HTMLElement | null>): void {
  React.useEffect(() => {
    const element = ref.current;
    if (!element || process.env.NODE_ENV === 'test') {
      return undefined;
    }

    const cleanupMain = autoScrollForElements({
      element,
      canScroll: ({ source }) => canAutoScrollForDrag(source.data),
      getAllowedAxis: () => 'vertical',
      getConfiguration: () => ({ maxScrollSpeed: 'standard' }),
    });

    const cleanupOverflow = unsafeOverflowAutoScrollForElements({
      element,
      canScroll: ({ source }) => canAutoScrollForDrag(source.data),
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
