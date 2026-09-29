'use client';
import {
  schedulerExternalEventKind,
  SchedulerDropTarget,
  dateToTimelineAxisOffsetMs,
  timelineAxisOffsetToDate,
  clampResizedEventEdge,
  roundToDragPrecision,
} from '@mui/x-scheduler-internals/internals';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import {
  EVENT_DRAG_PRECISION_MINUTE,
  EVENT_DRAG_PRECISION_MS,
} from '@mui/x-scheduler-internals/constants';
import { useTimelineGridEventRowContext } from './TimelineGridEventRowContext';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';
import {
  schedulerTimelineEventMoveKind,
  schedulerTimelineEventResizeKind,
} from '../../internals/utils/schedulerTimelineDrag';

const acceptedKinds = [
  schedulerTimelineEventMoveKind,
  schedulerTimelineEventResizeKind,
  schedulerExternalEventKind,
];

export function EventRowDropTarget(props: EventRowDropTarget.Props) {
  const { addPropertiesToDroppedEvent, render } = props;
  const { resourceId } = useTimelineGridEventRowContext();

  // Context hooks
  const adapter = useAdapterContext();
  const store = useEventTimelinePremiumStoreContext();

  // Selector hooks
  const config = useStore(store, eventTimelinePremiumPresetSelectors.config);

  // Cursor offsets are measured in axis milliseconds: with a trimmed hour window the
  // hidden hours take no space, so px↔date conversions go through the axis helpers.
  const collectionDurationMs = config.durationMs;

  const getEventDropDates: SchedulerDropTarget.GetEventDropDates = ({ source, target }) => {
    const cursorOffsetMs = Math.round(collectionDurationMs * target.getSnappedLocalPoint().x);

    const axisOffsetToDate = (offsetMs: number) =>
      timelineAxisOffsetToDate(adapter, config, roundToDragPrecision(offsetMs));

    // Move a Timeline Event within the Timeline
    if (schedulerTimelineEventMoveKind.matches(source)) {
      const data = source.dragData;
      if (!data) {
        return undefined;
      }
      const eventDurationMs = adapter.getTime(data.end) - adapter.getTime(data.start);

      // `cursorOffsetMs - initialCursorPositionInEventMs` reconstructs the *rendered*
      // start edge plus the drag delta. When the real start hides inside the hidden
      // hours, the rendered edge is its window-clamped anchor: carry the hidden
      // remainder over to the new anchor so an unmoved drag maps back to the exact
      // original dates instead of silently snapping the start to the window edge.
      const startAnchor = timelineAxisOffsetToDate(
        adapter,
        config,
        dateToTimelineAxisOffsetMs(adapter, config, data.start),
      );
      const hiddenRemainderMs = adapter.getTime(data.start) - adapter.getTime(startAnchor);

      const newAnchorDate = axisOffsetToDate(cursorOffsetMs - data.initialCursorPositionInEventMs);
      const newStartDate = adapter.addMilliseconds(newAnchorDate, hiddenRemainderMs);

      // The event keeps its real duration even when it spans hidden hours, so the
      // real start and end both shift by the same amount as their rendered anchors.
      const newEndDate = adapter.addMilliseconds(newStartDate, eventDurationMs);

      return { start: newStartDate, end: newEndDate };
    }

    // Resize a Timeline Event
    if (schedulerTimelineEventResizeKind.matches(source)) {
      const data = source.dragData;
      if (!data) {
        return undefined;
      }
      if (data.side === 'start') {
        const cursorDate = axisOffsetToDate(cursorOffsetMs - data.initialCursorPositionInEventMs);

        // Ensure the new start date is not after or too close to the end date.
        return clampResizedEventEdge({
          adapter,
          side: 'start',
          start: data.start,
          end: data.end,
          cursorDate,
          precisionMinute: EVENT_DRAG_PRECISION_MINUTE,
        });
      }

      if (data.side === 'end') {
        // The offset from the grab point to the event end must be measured on the axis:
        // the real duration would overshoot when the event spans hidden hours.
        const eventAxisDurationMs =
          dateToTimelineAxisOffsetMs(adapter, config, data.end) -
          dateToTimelineAxisOffsetMs(adapter, config, data.start);

        const cursorDate = axisOffsetToDate(
          cursorOffsetMs - data.initialCursorPositionInEventMs + eventAxisDurationMs,
        );

        // Ensure the new end date is not before or too close to the start date.
        return clampResizedEventEdge({
          adapter,
          side: 'end',
          start: data.start,
          end: data.end,
          cursorDate,
          precisionMinute: EVENT_DRAG_PRECISION_MINUTE,
        });
      }
    }

    // Move an external event into the Time Grid
    if (schedulerExternalEventKind.matches(source)) {
      // The new event starts at the cursor: cap the offset to the last slot of the
      // axis so a drop on the exact right edge does not create the event on the day
      // after the collection, where it would not be rendered at all.
      const lastStartOffsetMs = collectionDurationMs - EVENT_DRAG_PRECISION_MS;
      return { start: axisOffsetToDate(Math.min(cursorOffsetMs, lastStartOffsetMs)) };
    }

    return undefined;
  };

  return (
    <SchedulerDropTarget
      resourceId={resourceId}
      surfaceType="timeline"
      getEventDropDates={getEventDropDates}
      accept={acceptedKinds}
      addPropertiesToDroppedEvent={addPropertiesToDroppedEvent}
      render={render}
    />
  );
}

export namespace EventRowDropTarget {
  export interface Props {
    render: React.ReactElement;
    /**
     * Add properties to the event dropped in the row before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }
}
