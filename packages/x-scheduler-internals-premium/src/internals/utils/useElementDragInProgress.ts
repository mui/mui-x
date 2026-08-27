'use client';
import * as React from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

/**
 * Whether any element drag (event move or resize, terminal, external) is in progress.
 * Watched from drag start — the store placeholder is only set once a drop target gets
 * its first dragover, too late for overlays that must free the pointer for the gesture.
 */
export function useElementDragInProgress(): boolean {
  const [dragging, setDragging] = React.useState(false);
  React.useEffect(
    () =>
      monitorForElements({
        onDragStart: () => setDragging(true),
        onDrop: () => setDragging(false),
      }),
    [],
  );
  return dragging;
}
