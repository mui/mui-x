'use client';
import * as React from 'react';
import {
  schedulerTimeEventMoveKind,
  schedulerTimeEventResizeKind,
  schedulerDayEventMoveKind,
  schedulerExternalEventKind,
} from '../../internals/utils/schedulerDrag';
import type { SchedulerEvent } from '../../models';
import { useCalendarGridTimeColumnContext } from './CalendarGridTimeColumnContext';
import { SchedulerDropTarget } from '../../internals/utils/SchedulerDropTarget';
import {
  getLinearEventDropDates,
  getLinearPointerDate,
} from '../../internals/utils/getLinearEventDropDates';
import type { LinearDropSurface } from '../../internals/utils/getLinearEventDropDates';
import {
  getTimelineAxisDurationMs,
  timelineAxisOffsetToTimestamp,
} from '../../internals/utils/timeline-axis';
import type { TimelineAxis } from '../../internals/utils/timeline-axis';
import { toLocalDayNumber } from '../../internals/utils/plain-date-utils/timeZone';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';

const acceptedKinds = [
  schedulerTimeEventMoveKind,
  schedulerTimeEventResizeKind,
  schedulerDayEventMoveKind,
  schedulerExternalEventKind,
];

/**
 * The date at a position of a time column, from 0 at its top to 1 at its bottom.
 * The column renders a wall-clock axis, which keeps every hour on DST days.
 */
export function getTimeColumnTimestampAt(axis: TimelineAxis, fraction: number) {
  const clampedFraction = Math.max(0, Math.min(1, fraction));
  // The axis maps its full duration to the next day's window start.
  if (clampedFraction === 1) {
    return axis.end;
  }
  return timelineAxisOffsetToTimestamp(
    axis,
    Math.round(getTimelineAxisDurationMs(axis) * clampedFraction),
  );
}

export function TimeColumnDropTarget(props: TimeColumnDropTarget.Props) {
  const { addPropertiesToDroppedEvent, render } = props;
  const { axis } = useCalendarGridTimeColumnContext();
  const { start, end, timezone } = axis;

  // Context hooks
  const store = useEventCalendarStoreContext();

  // The offsets are the time elapsed since the start of the column. On DST days, it differs from
  // the wall-clock time the column renders.
  const surface: LinearDropSurface = {
    axis: 'y',
    durationMs: end - start,
    fractionToOffsetMs: (fraction) => getTimeColumnTimestampAt(axis, fraction) - start,
    offsetToDate: (offsetMs) => start + offsetMs,
    dateToOffset: (date) => date - start,
    bounds: { start, end },
    // An event that already crosses midnight moves freely.
    isMoveBounded: (eventStart, eventEnd) =>
      toLocalDayNumber(eventStart, timezone) === toLocalDayNumber(eventEnd, timezone),
  };

  const getEventDropDates: SchedulerDropTarget.GetEventDropDates = ({ source, target }) => {
    // Move a Day Grid Event into the Time Grid
    if (schedulerDayEventMoveKind.matches(source)) {
      const newStart = getLinearPointerDate({ target, surface });
      return {
        start: newStart,
        end: newStart + schedulerEventSelectors.defaultEventDuration(store.state) * 60_000,
      };
    }

    // Move or resize a Time Grid Event, or drop an external event
    return getLinearEventDropDates({
      source,
      target,
      surface,
      moveKind: schedulerTimeEventMoveKind,
      resizeKind: schedulerTimeEventResizeKind,
    });
  };

  return (
    <SchedulerDropTarget
      surfaceType="time-grid"
      getEventDropDates={getEventDropDates}
      accept={acceptedKinds}
      addPropertiesToDroppedEvent={addPropertiesToDroppedEvent}
      render={render}
    />
  );
}

export namespace TimeColumnDropTarget {
  export interface Props {
    render: React.ReactElement;
    /**
     * Add properties to the event dropped in the column before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }
}
