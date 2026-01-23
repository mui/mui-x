'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useStore } from '@base-ui/utils/store';
import {
  useButton,
  useRenderElement,
  BaseUIComponentProps,
  NonNativeButtonProps,
} from '@mui/x-scheduler-headless/base-ui-copy';
import {
  SchedulerEventId,
  SchedulerEventOccurrence,
  TemporalSupportedObject,
} from '@mui/x-scheduler-headless/models';
import {
  useDraggableEvent,
  generateOccurrenceFromEvent,
  useElementPositionInCollection,
} from '@mui/x-scheduler-headless/internals';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { useEventTimelinePremiumEventRowContext } from '../event-row/EventTimelinePremiumEventRowContext';
import { EventTimelinePremiumEventCssVars } from './EventTimelinePremiumEventCssVars';
import { EventTimelinePremiumEventContext } from './EventTimelinePremiumEventContext';
import { eventTimelinePremiumViewSelectors } from '../../event-timeline-premium-selectors';

export const EventTimelinePremiumEvent = React.forwardRef(function EventTimelinePremiumEvent(
  componentProps: EventTimelinePremiumEvent.Props,
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
  const store = useEventTimelinePremiumStoreContext();
  const { getCursorPositionInElementMs } = useEventTimelinePremiumEventRowContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Selector hooks
  const viewConfig = useStore(store, eventTimelinePremiumViewSelectors.config);

  // Feature hooks
  const getSharedDragData: EventTimelinePremiumEventContext['getSharedDragData'] =
    useStableCallback((input) => {
      const offsetBeforeRowStart = Math.max(adapter.getTime(viewConfig.start) - start.timestamp, 0);
      const event = schedulerEventSelectors.processedEvent(store.state, eventId)!;

      const originalOccurrence = generateOccurrenceFromEvent({
        event,
        eventId,
        occurrenceKey,
        start,
        end,
      });

      const offsetInsideRow = getCursorPositionInElementMs({ input, elementRef: ref });
      return {
        eventId,
        occurrenceKey,
        originalOccurrence,
        start: start.value,
        end: end.value,
        initialCursorPositionInEventMs: offsetBeforeRowStart + offsetInsideRow,
      };
    });

  const getDragData = useStableCallback((input) => ({
    ...getSharedDragData(input),
    source: 'EventTimelinePremiumEvent',
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
    collectionStart: viewConfig.start,
    collectionEnd: viewConfig.end,
  });

  const { getButtonProps, buttonRef } = useButton({
    disabled: !isInteractive,
    native: nativeButton,
  });

  const { position, duration } = useElementPositionInCollection({
    start,
    end,
    collectionStart: viewConfig.start,
    collectionEnd: viewConfig.end,
  });

  // Rendering hooks
  const style = React.useMemo(
    () =>
      ({
        [EventTimelinePremiumEventCssVars.xPosition]: `${position * 100}%`,
        [EventTimelinePremiumEventCssVars.width]: `${duration * 100}%`,
      }) as React.CSSProperties,
    [position, duration],
  );

  const props = { style };

  const contextValue: EventTimelinePremiumEventContext = React.useMemo(
    () => ({ ...draggableEventContextValue, getSharedDragData }),
    [draggableEventContextValue, getSharedDragData],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref, buttonRef],
    props: [props, elementProps, getButtonProps],
  });

  return (
    <EventTimelinePremiumEventContext.Provider value={contextValue}>
      {element}
      {preview.element}
    </EventTimelinePremiumEventContext.Provider>
  );
});

export namespace EventTimelinePremiumEvent {
  export interface State extends useDraggableEvent.State {}

  export interface Props
    extends
      BaseUIComponentProps<'div', State>,
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
    source: 'EventTimelinePremiumEvent';
  }
}
