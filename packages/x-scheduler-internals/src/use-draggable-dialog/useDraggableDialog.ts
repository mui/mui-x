'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import { DragLocationHistory } from '@atlaskit/pragmatic-drag-and-drop/types';

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
  const offset = React.useRef({ x: 0, y: 0 });

  const resetDrag = React.useCallback(() => {
    offset.current = { x: 0, y: 0 };
    const element = elementRef.current;
    if (element) {
      mutateStyle('none');
    }
  }, [elementRef, mutateStyle]);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return undefined;
    }

    return draggable({
      element,
      dragHandle: handleRef.current || undefined,
      canDrag: ({ input }) => {
        const target = document.elementFromPoint(input.clientX, input.clientY);
        return !target?.closest('input, textarea, select, [contenteditable="true"]');
      },
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
      },
      onDragStart: () => {
        preventUnhandled.start();
        element.setAttribute('data-dragging', 'true');
      },
      onDrag: ({ location }) => {
        const { deltaX, deltaY } = getDeltas(location);

        const x = offset.current.x + deltaX;
        const y = offset.current.y + deltaY;

        const currentElement = elementRef.current;
        if (currentElement) {
          const transform = `translate(${x}px, ${y}px)`;
          mutateStyle(transform);
        }
      },
      onDrop: ({ location }) => {
        preventUnhandled.stop();
        element.removeAttribute('data-dragging');

        const { deltaX, deltaY } = getDeltas(location);

        offset.current.x += deltaX;
        offset.current.y += deltaY;
      },
    });
  }, [elementRef, mutateStyle, handleRef]);

  return resetDrag;
}
