'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { Draggable } from '@base-ui/react/draggable';
import { schedulerDragKind } from './schedulerDrag';

/**
 * Toggles `data-drag-active` on the element while a Scheduler drag runs, so an
 * overlay can mute its pointer-enabled children through CSS without re-rendering.
 * Re-applied on every render, so an element remounting mid-drag keeps the mark; a drag
 * already running when the hook mounts is never marked.
 */
export function useElementDragMarker(ref: React.RefObject<Element | null>): void {
  const manager = Draggable.useDragDropManager();
  const draggingRef = React.useRef(false);

  useIsoLayoutEffect(() => {
    if (draggingRef.current) {
      ref.current?.setAttribute('data-drag-active', '');
    }
  });

  React.useEffect(
    () =>
      manager.registerMonitor(() => ({
        accept: schedulerDragKind,
        onMoveStart: () => {
          draggingRef.current = true;
          ref.current?.setAttribute('data-drag-active', '');
        },
        onMoveEnd: () => {
          draggingRef.current = false;
          ref.current?.removeAttribute('data-drag-active');
        },
      })),
    [manager, ref],
  );
}
