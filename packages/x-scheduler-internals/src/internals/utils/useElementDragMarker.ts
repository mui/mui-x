'use client';
import * as React from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

/**
 * Toggles `data-dragging` on the element while a pragmatic element drag is in progress,
 * letting an overlay mute its pointer-enabled children through CSS without re-rendering.
 * Watched from drag start — the store placeholder only exists after a drop target's
 * first dragover, too late for a gesture starting over the overlay. A drag already
 * running when the element mounts is not observed.
 */
export function useElementDragMarker(ref: React.RefObject<Element | null>): void {
  React.useEffect(
    () =>
      monitorForElements({
        onDragStart: () => ref.current?.setAttribute('data-dragging', ''),
        onDrop: () => ref.current?.removeAttribute('data-dragging'),
      }),
    [ref],
  );
}
