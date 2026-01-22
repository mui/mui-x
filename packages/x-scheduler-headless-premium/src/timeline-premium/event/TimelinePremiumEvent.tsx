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
import { useTimelinePremiumStoreContext } from '../../use-timeline-premium-store-context';
import { useTimelinePremiumEventRowContext } from '../event-row/TimelinePremiumEventRowContext';
import { TimelinePremiumEventCssVars } from './TimelinePremiumEventCssVars';
import { TimelinePremiumEventContext } from './TimelinePremiumEventContext';
import { timelinePremiumViewSelectors } from '../../timeline-premium-selectors';

export const TimelinePremiumEvent = React.forwardRef(function TimelinePremiumEvent(
  componentProps: TimelinePremiumEvent.Props,
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
  const store = useTimelinePremiumStoreContext();
  const { getCursorPositionInElementMs } = useTimelinePremiumEventRowContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Selector hooks
  const viewConfig = useStore(store, timelinePremiumViewSelectors.config);

  // Feature hooks
  const getSharedDragData: TimelinePremiumEventContext['getSharedDragData'] = useStableCallback(
    (input) => {
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
    },
  );

  const getDragData = useStableCallback((input) => ({
    ...getSharedDragData(input),
    source: 'TimelinePremiumEvent',
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
        [TimelinePremiumEventCssVars.xPosition]: `${position * 100}%`,
        [TimelinePremiumEventCssVars.width]: `${duration * 100}%`,
      }) as React.CSSProperties,
    [position, duration],
  );

  const props = { style };

  const contextValue: TimelinePremiumEventContext = React.useMemo(
    () => ({ ...draggableEventContextValue, getSharedDragData }),
    [draggableEventContextValue, getSharedDragData],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref, buttonRef],
    props: [props, elementProps, getButtonProps],
  });

  return (
    <TimelinePremiumEventContext.Provider value={contextValue}>
      {element}
      {preview.element}
    </TimelinePremiumEventContext.Provider>
  );
});

export namespace TimelinePremiumEvent {
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
    source: 'TimelinePremiumEvent';
  }
}
