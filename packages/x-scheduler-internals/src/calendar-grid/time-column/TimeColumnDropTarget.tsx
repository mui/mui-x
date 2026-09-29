'use client';
import * as React from 'react';
import {
  schedulerTimeEventMoveKind,
  schedulerTimeEventResizeKind,
  schedulerDayEventMoveKind,
  schedulerExternalEventKind,
} from '../../internals/utils/schedulerDrag';
import { useAdapterContext } from '../../use-adapter-context';
import type { SchedulerEvent } from '../../models';
import { useCalendarGridTimeColumnContext } from './CalendarGridTimeColumnContext';
import { SchedulerDropTarget } from '../../internals/utils/SchedulerDropTarget';
import {
  getLinearEventDropDates,
  getLinearPointerDate,
} from '../../internals/utils/getLinearEventDropDates';
import type { LinearDropSurface } from '../../internals/utils/getLinearEventDropDates';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';

const acceptedKinds = [
  schedulerTimeEventMoveKind,
  schedulerTimeEventResizeKind,
  schedulerDayEventMoveKind,
  schedulerExternalEventKind,
];

export function TimeColumnDropTarget(props: TimeColumnDropTarget.Props) {
  const { addPropertiesToDroppedEvent, render } = props;
  const { start, end } = useCalendarGridTimeColumnContext();

  // Context hooks
  const adapter = useAdapterContext();
  const store = useEventCalendarStoreContext();

  const surface: LinearDropSurface = {
    axis: 'y',
    durationMs: adapter.getTime(end) - adapter.getTime(start),
    offsetToDate: (offsetMs) => adapter.addMilliseconds(start, offsetMs),
    dateToOffset: (date) => adapter.getTime(date) - adapter.getTime(start),
    bounds: { start, end },
  };

  const getEventDropDates: SchedulerDropTarget.GetEventDropDates = ({ source, target }) => {
    // Move a Day Grid Event into the Time Grid
    if (schedulerDayEventMoveKind.matches(source)) {
      const newStartDate = getLinearPointerDate({ target, surface });
      return {
        start: newStartDate,
        end: adapter.addMinutes(
          newStartDate,
          schedulerEventSelectors.defaultEventDuration(store.state),
        ),
      };
    }

    // Move or resize a Time Grid Event, or drop an external event
    return getLinearEventDropDates({
      adapter,
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
