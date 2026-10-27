'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useStore } from '@base-ui/utils/store';
import type { BaseUIComponentProps, NonNativeButtonProps } from '@base-ui/react/internals/types';
import { useButton } from '@base-ui/react/internals/use-button';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type {
  SchedulerEventId,
  SchedulerEventOccurrence,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import {
  useDraggableEvent,
  useOriginalOccurrence,
  computeElementPositionInCollection,
  timestampToTimelineAxisOffsetMs,
} from '@mui/x-scheduler-internals/internals';
import type { useElementPositionInCollection } from '@mui/x-scheduler-internals/internals';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { useTimelineGridEventRowContext } from '../event-row/TimelineGridEventRowContext';
import { TimelineGridEventCssVars } from './TimelineGridEventCssVars';
import { TimelineGridEventContext } from './TimelineGridEventContext';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';
import type { useEventDependencyDropTarget } from './useEventDependencyDropTarget';
import { TimelineGridEventDataAttributes } from './TimelineGridEventDataAttributes';

const useNoEventDropTarget = (_parameters: useEventDependencyDropTarget.Parameters) => false;

const extraStateAttributesMapping = {
  startingBeforeEdge: (value: boolean) =>
    value ? { [TimelineGridEventDataAttributes.startingBeforeEdge]: '' } : null,
  endingAfterEdge: (value: boolean) =>
    value ? { [TimelineGridEventDataAttributes.endingAfterEdge]: '' } : null,
  dependencyDropTarget: (value: boolean) =>
    value ? { [TimelineGridEventDataAttributes.dependencyDropTarget]: '' } : null,
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
    dataTimezone,
    eventId,
    occurrenceKey,
    renderDragPreview,
    isDraggable,
    elementPosition: elementPositionProp,
    nativeButton = false,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Expose a real `interactive` prop
  // to control whether the event should behave like a button
  const isInteractive = true;

  // Context hooks
  const store = useEventTimelinePremiumStoreContext();
  const {
    resourceId: rowResourceId,
    hasFocus: rowHasFocus,
    getCursorPositionInElementMs,
  } = useTimelineGridEventRowContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Selector hooks
  const config = useStore(store, eventTimelinePremiumPresetSelectors.config);

  // The feature is frozen at store construction, so the hook is the same on every render.
  const useEventDropTarget =
    // eslint-disable-next-line react-compiler/react-compiler
    store.state.dependenciesFeature?.useEventDropTarget ?? useNoEventDropTarget;

  // Feature hooks
  const getOriginalOccurrence = useOriginalOccurrence({
    eventId,
    occurrenceKey,
    start,
    end,
    dataTimezone,
  });

  const getSharedDragData: TimelineGridEventContext['getSharedDragData'] = useStableCallback(
    (input) => {
      // Measured on the axis so it stays consistent with the cursor offsets when a
      // trimmed hour window compresses the days.
      const offsetBeforeRowStart = Math.max(
        -timestampToTimelineAxisOffsetMs(config.axis, start.timestamp),
        0,
      );
      const offsetInsideRow = getCursorPositionInElementMs({ input, elementRef: ref });
      return {
        eventId,
        occurrenceKey,
        originalOccurrence: getOriginalOccurrence(),
        start: start.timestamp,
        end: end.timestamp,
        initialCursorPositionInEventMs: offsetBeforeRowStart + offsetInsideRow,
        sourceResourceId: rowResourceId,
      };
    },
  );

  const getDragData = useStableCallback((input) => ({
    ...getSharedDragData(input),
    source: 'TimelineGridEvent',
  }));

  const elementPosition = React.useMemo(
    () =>
      elementPositionProp ??
      computeElementPositionInCollection({
        start,
        end,
        collection: config.axis,
        durationMs: config.durationMs,
      }),
    [config, elementPositionProp, end, start],
  );
  const { position, duration, startingBeforeEdge, endingAfterEdge } = elementPosition;

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
    position: elementPosition,
  });

  const { getButtonProps, buttonRef } = useButton({
    disabled: !isInteractive,
    native: nativeButton,
    tabIndex: rowHasFocus ? 0 : -1,
  });

  // eslint-disable-next-line react-compiler/react-compiler
  const dependencyDropTarget = useEventDropTarget({
    ref,
    eventId,
    occurrenceKey,
    resourceId: rowResourceId,
  });

  const mergedState = {
    ...state,
    startingBeforeEdge,
    endingAfterEdge,
    dependencyDropTarget,
  };

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
    stateAttributesMapping: extraStateAttributesMapping,
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
    dependencyDropTarget: boolean;
  }

  export interface Props
    extends
      BaseUIComponentProps<'div', State>,
      NonNativeButtonProps,
      useDraggableEvent.PublicParameters,
      Pick<useOriginalOccurrence.Parameters, 'dataTimezone'> {
    elementPosition?: useElementPositionInCollection.ReturnValue;
  }

  export interface SharedDragData {
    eventId: SchedulerEventId;
    occurrenceKey: string;
    originalOccurrence: SchedulerEventOccurrence;
    /**
     * The start of the occurrence, as a timestamp in milliseconds.
     */
    start: number;
    /**
     * The end of the occurrence, as a timestamp in milliseconds.
     */
    end: number;
    /**
     * Cursor offset from the event start, in axis milliseconds.
     */
    initialCursorPositionInEventMs: number;
    /**
     * The id of the resource row the occurrence was dragged from.
     */
    sourceResourceId: SchedulerResourceId;
  }

  export interface DragData extends SharedDragData {
    source: 'TimelineGridEvent';
  }
}
