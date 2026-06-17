'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useEventResizeHandler } from '../../internals/utils/useEventResizeHandler';
import { useEventPointerResizeHandler } from '../../internals/utils/useEventPointerResizeHandler';
import { isResizeHandlerEnabled } from '../../internals/utils/resize-utils';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { schedulerOccurrencePlaceholderSelectors } from '../../scheduler-selectors';
import { useCalendarGridTimeColumnContext } from '../time-column/CalendarGridTimeColumnContext';
import { useCalendarGridTimeEventContext } from '../time-event/CalendarGridTimeEventContext';
import type { CalendarGridTimeEvent } from '../time-event/CalendarGridTimeEvent';
import { SchedulerEventSide } from '../../models';

// Time grid events are never all-day, so a resize must keep them that way.
function addPropertiesToResizedEvent() {
  return { allDay: false as const };
}

export const CalendarGridTimeEventResizeHandler = React.forwardRef(
  function CalendarGridTimeEventResizeHandler(
    componentProps: CalendarGridTimeEventResizeHandler.Props,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const {
      // Rendering props
      className,
      render,
      style,
      // Internal props
      side,
      interaction = 'native',
      // Props forwarded to the DOM element
      ...elementProps
    } = componentProps;

    // Context hooks
    const contextValue = useCalendarGridTimeEventContext();
    const { getDateAtPointer } = useCalendarGridTimeColumnContext();
    const store = useSchedulerStoreContext();

    // Ref hooks
    const ref = React.useRef<HTMLDivElement>(null);

    const isPointerInteraction = interaction === 'pointer';

    // Feature hooks
    const getDragData = useStableCallback((input) => ({
      ...contextValue.getSharedDragData(input),
      source: 'CalendarGridTimeEventResizeHandler',
      side,
    }));

    // Pointer-resize session: from the placeholder when sizing a new event, otherwise from the
    // event's shared drag data.
    const getResizeSession = useStableCallback((): useEventPointerResizeHandler.ResizeSession => {
      const placeholder = schedulerOccurrencePlaceholderSelectors.value(store.state);
      if (placeholder?.type === 'creation') {
        return {
          kind: 'creation',
          start: placeholder.start,
          end: placeholder.end,
          resourceId: placeholder.resourceId,
        };
      }

      // The pointer maps directly to a date, so the grab offset isn't needed: call without an input.
      const data = contextValue.getSharedDragData();
      return {
        kind: 'event',
        start: data.start,
        end: data.end,
        eventId: data.eventId,
        occurrenceKey: data.occurrenceKey,
        originalOccurrence: data.originalOccurrence,
        resourceId: data.originalOccurrence.resource ?? null,
      };
    });

    // Computed once and passed to whichever resize handler is active.
    const enabled = isResizeHandlerEnabled({
      side,
      doesEventStartBeforeCollectionStart: contextValue.doesEventStartBeforeCollectionStart,
      doesEventEndAfterCollectionEnd: contextValue.doesEventEndAfterCollectionEnd,
    });

    const { state } = useEventResizeHandler({
      ref,
      side,
      enabled: enabled && !isPointerInteraction,
      getDragData,
      canDrag: contextValue.canDrag,
    });

    useEventPointerResizeHandler({
      ref,
      side,
      enabled: enabled && isPointerInteraction,
      surfaceType: 'time-grid',
      getDateAtPointer,
      getResizeSession,
      addPropertiesToResizedEvent,
    });

    return useRenderElement('div', componentProps, {
      enabled,
      state,
      ref: [forwardedRef, ref],
      props: [elementProps],
    });
  },
);

export namespace CalendarGridTimeEventResizeHandler {
  export interface State extends useEventResizeHandler.State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>, useEventResizeHandler.PublicParameters {}

  export interface DragData extends CalendarGridTimeEvent.SharedDragData {
    source: 'CalendarGridTimeEventResizeHandler';
    side: SchedulerEventSide;
  }
}
