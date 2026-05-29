'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import type { useDraggableEvent } from './useDraggableEvent';
import { SchedulerEventSide } from '../../models';

export function useEventResizeHandler(
  parameters: useEventResizeHandler.Parameters,
): useEventResizeHandler.ReturnValue {
  const {
    ref,
    side,
    getDragData,
    canDrag,
    contextValue: { doesEventStartBeforeCollectionStart, doesEventEndAfterCollectionEnd },
  } = parameters;

  const enabled =
    (side === 'start' && !doesEventStartBeforeCollectionStart) ||
    (side === 'end' && !doesEventEndAfterCollectionEnd);

  const canDragStable = useStableCallback(() => canDrag?.() ?? true);

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
      canDrag: () => canDragStable(),
      getInitialData: ({ input }) => getDragData(input),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
      },
    });
  }, [ref, enabled, side, getDragData, canDragStable]);

  return { state, enabled };
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
     * Gets the drag data.
     * @param {{ clientX: number, clientY: number }} input The input object provided by the drag and drop library for the current event.
     * @returns {any} The shared drag data.
     */
    getDragData: (input: { clientX: number; clientY: number }) => any;
    /**
     * Called when a resize drag is about to start. Returning `false` aborts the attempt.
     * Defaults to always allowing the drag.
     */
    canDrag?: () => boolean;
    /**
     * The context value from the event component wrapping the resize handler.
     */
    contextValue: useDraggableEvent.ContextValue;
  }

  export interface ReturnValue {
    /**
     * The state to pass to the useRenderElement hook.
     */
    state: State;
    /**
     * Whether the resize handler is enabled.
     */
    enabled: boolean;
  }
}
