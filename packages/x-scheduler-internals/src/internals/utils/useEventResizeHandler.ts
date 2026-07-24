'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import type { SchedulerEventSide } from '../../models';

/**
 * Native drag-and-drop resize for calendar events. The host picks this or the pointer-based resize
 * ({@link useEventPointerResizeHandler}) via `enabled`.
 */
export function useEventResizeHandler(
  parameters: useEventResizeHandler.Parameters,
): useEventResizeHandler.ReturnValue {
  const { ref, side, enabled, getDragData } = parameters;

  const state: useEventResizeHandler.State = React.useMemo(
    () => ({ start: side === 'start', end: side === 'end' }),
    [side],
  );

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
  }, [ref, enabled, side, getDragData]);

  return { state };
}

export namespace useEventResizeHandler {
  export interface State {
    /**
     * Whether the resize handler is targeting the start date of the event.
     */
    start: boolean;
    /**
     * Whether the resize handler is targeting the end date of the event.
     */
    end: boolean;
  }

  export interface PublicParameters {
    /**
     * The date to edit when dragging the resize handler.
     */
    side: SchedulerEventSide;
  }

  export interface Parameters extends PublicParameters {
    /**
     * The ref to the event's resize handler root element.
     */
    ref: React.RefObject<HTMLDivElement | null>;
    /**
     * Whether to attach the native drag-and-drop listeners (false when the side is clipped or the
     * pointer interaction is active).
     */
    enabled: boolean;
    /**
     * Gets the drag data.
     * @param {{ clientX: number, clientY: number }} input The input object provided by the drag and drop library for the current event.
     * @returns {any} The shared drag data.
     */
    getDragData: (input: { clientX: number; clientY: number }) => any;
  }

  export interface ReturnValue {
    /**
     * The state to pass to the useRenderElement hook.
     */
    state: State;
  }
}
