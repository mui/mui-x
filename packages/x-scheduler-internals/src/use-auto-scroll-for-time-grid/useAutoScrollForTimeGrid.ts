'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import {
  schedulerTimeEventMoveKind,
  schedulerTimeEventResizeKind,
  schedulerExternalEventKind,
} from '../internals/utils/schedulerDrag';

export function useAutoScrollForTimeGrid(ref: React.RefObject<HTMLElement | null>): void {
  const manager = Draggable.useManager();
  React.useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }

    return manager.registerViewport(element, () => ({
      accept: [
        schedulerTimeEventMoveKind,
        schedulerTimeEventResizeKind,
        schedulerExternalEventKind,
      ],
      overflowMargin: { top: 160, bottom: 160 },
      onDragScroll: ({ direction }, details) => {
        if (direction === 'horizontal') {
          details.cancel();
        }
      },
    }));
  }, [manager, ref]);
}
