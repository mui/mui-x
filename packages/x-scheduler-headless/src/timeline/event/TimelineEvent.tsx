'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui-components/utils/useStableCallback';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps, NonNativeButtonProps } from '../../base-ui-copy/utils/types';
import { useButton } from '../../base-ui-copy/utils/useButton';
import { SchedulerEventId, SchedulerEventOccurrence, TemporalSupportedObject } from '../../models';
import { useAdapter } from '../../use-adapter';
import { useTimelineStoreContext } from '../../use-timeline-store-context';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import { useTimelineEventRowContext } from '../event-row/TimelineEventRowContext';
import { useDraggableEvent } from '../../utils/useDraggableEvent';
import { TimelineEventCssVars } from './TimelineEventCssVars';
import { useElementPositionInCollection } from '../../utils/useElementPositionInCollection';
import { TimelineEventContext } from './TimelineEventContext';

export const TimelineEvent = React.forwardRef(function TimelineEvent(
  componentProps: TimelineEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    start,
    end,
    eventId,
    occurrenceKey,
    renderDragPreview,
    isDraggable,
    nativeButton = false,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Expose a real `interactive` prop
  // to control whether the event should behave like a button
  const isInteractive = true;

  // Context hooks
  const adapter = useAdapter();
  const store = useTimelineStoreContext();
  const {
    start: rowStart,
    end: rowEnd,
    getCursorPositionInElementMs,
  } = useTimelineEventRowContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Feature hooks
  const getSharedDragData: TimelineEventContext['getSharedDragData'] = useStableCallback(
    (input) => {
      const offsetBeforeRowStart = Math.max(adapter.getTime(rowStart) - start.timestamp, 0);
      const event = schedulerEventSelectors.processedEvent(store.state, eventId)!;

      const originalOccurrence: SchedulerEventOccurrence = {
        ...event,
        key: occurrenceKey,
        id: eventId,
        start,
        end,
      };

      const offsetInsideRow = getCursorPositionInElementMs({ input, elementRef: ref });
      return {
        eventId,
        occurrenceKey,
        originalOccurrence,
        start: start.value,
        end: end.value,
        initialCursorPositionInEventMs: offsetBeforeRowStart + offsetInsideRow,
      };
    },
  );

  const getDragData = useStableCallback((input) => ({
    ...getSharedDragData(input),
    source: 'TimelineEvent',
  }));

  const {
    state,
    preview,
    contextValue: draggableEventContextValue,
  } = useDraggableEvent({
    ref,
    start,
    end,
    occurrenceKey,
    eventId,
    isDraggable,
    renderDragPreview,
    getDragData,
    collectionStart: rowStart,
    collectionEnd: rowEnd,
  });

  const { getButtonProps, buttonRef } = useButton({
    disabled: !isInteractive,
    native: nativeButton,
  });

  const { position, duration } = useElementPositionInCollection({
    start,
    end,
    collectionStart: rowStart,
    collectionEnd: rowEnd,
  });

  // Rendering hooks
  const style = React.useMemo(
    () =>
      ({
        [TimelineEventCssVars.xPosition]: `${position * 100}%`,
        [TimelineEventCssVars.width]: `${duration * 100}%`,
      }) as React.CSSProperties,
    [position, duration],
  );

  const props = { style };

  const contextValue: TimelineEventContext = React.useMemo(
    () => ({ ...draggableEventContextValue, getSharedDragData }),
    [draggableEventContextValue, getSharedDragData],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref, buttonRef],
    props: [props, elementProps, getButtonProps],
  });

  return (
    <TimelineEventContext.Provider value={contextValue}>
      {element}
      {preview.element}
    </TimelineEventContext.Provider>
  );
});

export namespace TimelineEvent {
  export interface State extends useDraggableEvent.State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>,
      NonNativeButtonProps,
      useDraggableEvent.PublicParameters {}

  export interface SharedDragData {
    eventId: SchedulerEventId;
    occurrenceKey: string;
    originalOccurrence: SchedulerEventOccurrence;
    start: TemporalSupportedObject;
    end: TemporalSupportedObject;
    initialCursorPositionInEventMs: number;
  }

  export interface DragData extends SharedDragData {
    source: 'TimelineEvent';
  }
}
