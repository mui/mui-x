'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useStore } from '@base-ui/utils/store';
import type {
  BaseUIComponentProps,
  NonNativeButtonProps,
} from '@mui/x-scheduler-internals/base-ui-copy';
import { useButton, useRenderElement } from '@mui/x-scheduler-internals/base-ui-copy';
import type {
  SchedulerEventId,
  SchedulerEventOccurrence,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import {
  useDraggableEvent,
  generateOccurrenceFromEvent,
  useElementPositionInCollection,
} from '@mui/x-scheduler-internals/internals';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { useTimelineGridEventRowContext } from '../event-row/TimelineGridEventRowContext';
import { TimelineGridEventCssVars } from './TimelineGridEventCssVars';
import { TimelineGridEventContext } from './TimelineGridEventContext';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';
import { TimelineGridEventDataAttributes } from './TimelineGridEventDataAttributes';
import { dateToTimelineAxisOffsetMs } from '../../internals/utils/timeline-axis';

const overflowStateAttributesMapping = {
  startingBeforeEdge: (value: boolean) =>
    value ? { [TimelineGridEventDataAttributes.startingBeforeEdge]: '' } : null,
  endingAfterEdge: (value: boolean) =>
    value ? { [TimelineGridEventDataAttributes.endingAfterEdge]: '' } : null,
};

export const TimelineGridEvent = React.forwardRef(function TimelineGridEvent(
  componentProps: TimelineGridEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
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
  const adapter = useAdapterContext();
  const store = useEventTimelinePremiumStoreContext();
  const { hasFocus: rowHasFocus, getCursorPositionInElementMs } = useTimelineGridEventRowContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Selector hooks
  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);

  // Feature hooks
  const getSharedDragData: TimelineGridEventContext['getSharedDragData'] = useStableCallback(
    (input) => {
      // Measured on the axis so it stays consistent with the cursor offsets when a
      // trimmed hour window compresses the days.
      const offsetBeforeRowStart = Math.max(
        -dateToTimelineAxisOffsetMs(adapter, presetConfig, start.value),
        0,
      );
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
    source: 'TimelineGridEvent',
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
    collectionStart: presetConfig.start,
    collectionEnd: presetConfig.end,
  });

  const { getButtonProps, buttonRef } = useButton({
    disabled: !isInteractive,
    native: nativeButton,
    tabIndex: rowHasFocus ? 0 : -1,
  });

  const { position, duration, startingBeforeEdge, endingAfterEdge } =
    useElementPositionInCollection({
      start,
      end,
      collectionStart: presetConfig.start,
      collectionEnd: presetConfig.end,
      dayStartMinute: presetConfig.dayStartMinute,
      dayEndMinute: presetConfig.dayEndMinute,
    });

  const mergedState = { ...state, startingBeforeEdge, endingAfterEdge };

  const contextValue: TimelineGridEventContext = React.useMemo(
    () => ({ ...draggableEventContextValue, getSharedDragData }),
    [draggableEventContextValue, getSharedDragData],
  );

  const element = useRenderElement('div', componentProps, {
    state: mergedState,
    ref: [forwardedRef, ref, buttonRef],
    props: [
      elementProps,
      {
        style: {
          [TimelineGridEventCssVars.xPosition]: `${position * 100}%`,
          [TimelineGridEventCssVars.width]: `${duration * 100}%`,
        } as React.CSSProperties,
      },
      { [TimelineGridEventDataAttributes.occurrenceKey]: occurrenceKey } as Record<string, string>,
      getButtonProps,
    ],
    stateAttributesMapping: overflowStateAttributesMapping,
  });

  return (
    <TimelineGridEventContext.Provider value={contextValue}>
      {element}
      {preview.element}
    </TimelineGridEventContext.Provider>
  );
});

export namespace TimelineGridEvent {
  export interface State extends useDraggableEvent.State {
    startingBeforeEdge: boolean;
    endingAfterEdge: boolean;
  }

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
    /**
     * Cursor offset from the event start, in axis milliseconds.
     */
    initialCursorPositionInEventMs: number;
  }

  export interface DragData extends SharedDragData {
    source: 'TimelineGridEvent';
  }
}
