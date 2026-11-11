'use client';
import * as React from 'react';
import {
  schedulerDayEventMoveKind,
  schedulerDayEventResizeKind,
  schedulerTimeEventMoveKind,
  schedulerExternalEventKind,
} from '../../internals/utils/schedulerDrag';
import type { SchedulerEvent } from '../../models';
import type { BaseTemporal } from '../../internals/utils/base-temporal';
import { getDayNumber } from '../../internals/utils/plain-date-utils/plainDate';
import {
  addDaysOnWallClock,
  getEndOfDayMs,
  moveTimestampToPlainDate,
  toEpochMs,
  toLocalDayNumber,
} from '../../internals/utils/plain-date-utils/timeZone';
import { SchedulerDropTarget } from '../../internals/utils/SchedulerDropTarget';

const acceptedKinds = [
  schedulerDayEventMoveKind,
  schedulerDayEventResizeKind,
  schedulerTimeEventMoveKind,
  schedulerExternalEventKind,
];

export function DayCellDropTarget(props: DayCellDropTarget.Props) {
  const { value, addPropertiesToDroppedEvent, render } = props;

  // Feature hooks
  const getEventDropDates: SchedulerDropTarget.GetEventDropDates = ({ source, timezone }) => {
    // Move an external event into the Day Grid
    if (schedulerExternalEventKind.matches(source)) {
      // The first instant of the day of the cell in the display timezone.
      return { start: toEpochMs(value, 0, timezone) };
    }

    // Days are compared as plain dates, and each date moves on the wall clock of the display
    // timezone.
    // Move a Day Grid Event within the Day Grid, or a Time Grid Event into it
    if (schedulerDayEventMoveKind.matches(source) || schedulerTimeEventMoveKind.matches(source)) {
      const data = source.dragData;
      if (!data) {
        return undefined;
      }
      // The day under the grab point.
      const grabbedDayNumber =
        'draggedDay' in data
          ? getDayNumber(data.draggedDay)
          : toLocalDayNumber(data.start + data.initialCursorPositionInEventMs, timezone);
      const dayCount = getDayNumber(value) - grabbedDayNumber;
      return {
        start: addDaysOnWallClock(data.start, dayCount, timezone),
        end: addDaysOnWallClock(data.end, dayCount, timezone),
      };
    }

    // Resize a Day Grid Event
    if (schedulerDayEventResizeKind.matches(source)) {
      const data = source.dragData;
      if (!data) {
        return undefined;
      }
      if (data.side === 'start') {
        const order = getDayNumber(value) - toLocalDayNumber(data.end, timezone);
        if (order > 0) {
          return undefined;
        }

        // The new start keeps its time of day, unless it moves to the day of the end.
        const newStart =
          order === 0
            ? toEpochMs(value, 0, timezone)
            : moveTimestampToPlainDate(data.start, value, timezone);
        return { start: newStart, end: data.end };
      }

      if (data.side === 'end') {
        const order = getDayNumber(value) - toLocalDayNumber(data.start, timezone);
        if (order < 0) {
          return undefined;
        }

        // The new end keeps its time of day, unless it moves to the day of the start.
        const newEnd =
          order === 0
            ? getEndOfDayMs(toEpochMs(value, 0, timezone), timezone)
            : moveTimestampToPlainDate(data.end, value, timezone);
        return { start: data.start, end: newEnd };
      }
    }

    return undefined;
  };

  return (
    <SchedulerDropTarget
      surfaceType="day-grid"
      getEventDropDates={getEventDropDates}
      accept={acceptedKinds}
      addPropertiesToDroppedEvent={addPropertiesToDroppedEvent}
      render={render}
    />
  );
}

export namespace DayCellDropTarget {
  export interface Props extends Parameters {
    render: React.ReactElement;
  }

  export interface Parameters {
    /**
     * The day of the cell, read in the display timezone.
     */
    value: BaseTemporal.PlainDate;
    /**
     * Add properties to the event dropped in the cell before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }
}
