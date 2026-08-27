'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

/**
 * Toggles `data-drag-active` on the element while a pragmatic element drag runs, so an
 * overlay can mute its pointer-enabled children through CSS without re-rendering.
 * Re-applied on every render, so an element remounting mid-drag keeps the mark; a drag
 * already running when the hook mounts is never marked — its `onDragStart` predates
 * the monitor.
 */
export function useElementDragMarker(ref: React.RefObject<Element | null>): void {
  const draggingRef = React.useRef(false);

  useIsoLayoutEffect(() => {
    if (draggingRef.current) {
      ref.current?.setAttribute('data-drag-active', '');
    }
  });

  React.useEffect(
    () =>
      monitorForElements({
        onDragStart: () => {
          draggingRef.current = true;
          ref.current?.setAttribute('data-drag-active', '');
        },
        onDrop: () => {
          draggingRef.current = false;
          ref.current?.removeAttribute('data-drag-active');
        },
      }),
    [ref],
  );
}
