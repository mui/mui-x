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

/**
 * Scrolls the element vertically while a time grid event, a time grid resize handle or an external
 * event is dragged near its edges, or up to 160px beyond them once the drag has entered the element.
 * A drag that moves further than that has to enter the element again.
 * It registers the element with the drag engine, so it needs a `Draggable.Provider` above the
 * component that calls it. Use it when the element that scrolls is not rendered by a
 * `Draggable.Viewport` you control.
 */
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
