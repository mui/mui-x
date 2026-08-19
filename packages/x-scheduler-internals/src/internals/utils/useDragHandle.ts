'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';

/**
 * Registers a drag-handle element: a draggable that only carries drag data, with the
 * native preview disabled. For handles whose gesture is handled elsewhere (a monitor,
 * a drop target) — draggables with their own lifecycle keep registering directly.
 */
export function useDragHandle(parameters: {
  ref: React.RefObject<HTMLElement | null>;
  enabled: boolean;
  getDragData: (input: { clientX: number; clientY: number }) => Record<string, unknown>;
}) {
  const { ref, enabled, getDragData } = parameters;

  React.useEffect(() => {
    if (!ref.current || !enabled) {
      return undefined;
    }

    return draggable({
      element: ref.current,
      getInitialData: ({ input }) => getDragData(input),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
      },
    });
  }, [ref, enabled, getDragData]);
}
