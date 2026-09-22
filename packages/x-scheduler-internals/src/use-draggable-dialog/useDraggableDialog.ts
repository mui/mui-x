'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { Draggable } from '@base-ui/react/draggable';
import type { DragLocationHistory } from '@base-ui/react/draggable';

const dialogDragKind = Draggable.createKind<undefined>('scheduler-dialog');

const getDeltas = (location: DragLocationHistory) => {
  const deltaX = location.current.input.clientX - location.initial.input.clientX;
  const deltaY = location.current.input.clientY - location.initial.input.clientY;
  return { deltaX, deltaY };
};

export function useDraggableDialog(
  elementRef: React.RefObject<HTMLElement | null>,
  handleRef: React.RefObject<HTMLElement | null>,
  mutateStyle: (style: string) => void,
) {
  const manager = Draggable.useDragDropManager();
  const offset = React.useRef({ x: 0, y: 0 });

  const resetDrag = useStableCallback(() => {
    offset.current = { x: 0, y: 0 };
    const element = elementRef.current;
    if (element) {
      mutateStyle('none');
    }
  });

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return undefined;
    }

    return manager.registerDraggable(element, () => ({
      kind: dialogDragKind,
      dragHandle: handleRef,
      dragPreview: { disabled: true },
      onMoveStart: () => {
        element.setAttribute('data-dragging', 'true');
      },
      onMove: ({ location }) => {
        const { deltaX, deltaY } = getDeltas(location);

        const x = offset.current.x + deltaX;
        const y = offset.current.y + deltaY;

        const currentElement = elementRef.current;
        if (currentElement) {
          const transform = `translate(${x}px, ${y}px)`;
          mutateStyle(transform);
        }
      },
      onMoveEnd: ({ location, canceled }) => {
        element.removeAttribute('data-dragging');

        const { deltaX, deltaY } = getDeltas(location);

        if (!canceled) {
          offset.current.x += deltaX;
          offset.current.y += deltaY;
        }
        mutateStyle(`translate(${offset.current.x}px, ${offset.current.y}px)`);
      },
    }));
  }, [manager, elementRef, mutateStyle, handleRef]);

  return resetDrag;
}
