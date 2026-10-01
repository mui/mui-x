'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { Draggable } from '@base-ui/react/draggable';

const dialogDragKind = Draggable.createKind<undefined>('scheduler-dialog');

const getDeltas = (location: Draggable.LocationHistory) => {
  const deltaX = location.current.input.clientX - location.initial.input.clientX;
  const deltaY = location.current.input.clientY - location.initial.input.clientY;
  return { deltaX, deltaY };
};

/**
 * Lets the user move a dialog by dragging it.
 * Spread `draggableProps` on a `Draggable.Root` that renders the dialog element, attach `elementRef`
 * to that element, and render a `Draggable.Handle` inside it where the drag should start.
 * The dialog moves through a `transform` on the element: call `resetDrag` to clear the offset,
 * for example when the dialog repositions. A canceled drag puts the dialog back where it was.
 */
export function useDraggableDialog() {
  // The ref of the element the dialog moves, which is also the element that renders the root.
  const elementRef = React.useRef<HTMLDivElement>(null);
  const offset = React.useRef({ x: 0, y: 0 });

  const setTransform = (transform: string) => {
    const element = elementRef.current;
    if (element) {
      element.style.transform = transform;
    }
  };

  const resetDrag = useStableCallback(() => {
    offset.current = { x: 0, y: 0 };
    setTransform('none');
  });

  const draggableProps: Draggable.Root.Props = {
    kind: dialogDragKind,
    // The header shows the same cursor at rest.
    dragCursor: 'move',
    onMove: ({ location }) => {
      const { deltaX, deltaY } = getDeltas(location);
      setTransform(`translate(${offset.current.x + deltaX}px, ${offset.current.y + deltaY}px)`);
    },
    onMoveEnd: ({ location, canceled }) => {
      const { deltaX, deltaY } = getDeltas(location);

      if (!canceled) {
        offset.current.x += deltaX;
        offset.current.y += deltaY;
      }
      setTransform(`translate(${offset.current.x}px, ${offset.current.y}px)`);
    },
  };

  return { elementRef, resetDrag, draggableProps };
}
