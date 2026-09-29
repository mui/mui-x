'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import {
  schedulerTimeEventMoveKind,
  schedulerTimeEventResizeKind,
  schedulerExternalEventKind,
} from '../internals/utils/schedulerDrag';

const viewportOptions = {
  accept: [schedulerTimeEventMoveKind, schedulerTimeEventResizeKind, schedulerExternalEventKind],
  overflowMargin: { top: 160, bottom: 160 },
};
const getViewportOptions = () => viewportOptions;

export function useAutoScrollForTimeGrid(ref: React.RefObject<HTMLElement | null>): void {
  const manager = Draggable.useManager();
  React.useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }

    // The time grid only overflows vertically. Let native overflow select the axis;
    // canceling horizontal scroll would keep the engine's frame loop engaged.
    return manager.registerViewport(element, getViewportOptions);
  }, [manager, ref]);
}
