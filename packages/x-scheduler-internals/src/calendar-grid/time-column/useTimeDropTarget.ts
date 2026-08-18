'use client';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import type { SchedulerEvent, TemporalSupportedObject } from '../../models';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { useLinearTimeDropTarget } from '../../internals/utils/useLinearTimeDropTarget';
import type { CalendarGridTimeColumnContext } from './CalendarGridTimeColumnContext';

const sources = {
  move: 'CalendarGridTimeEvent',
  resize: 'CalendarGridTimeEventResizeHandler',
  fixedDuration: 'CalendarGridDayEvent',
  external: 'StandaloneEvent',
} as const;

export function useTimeDropTarget(parameters: useTimeDropTarget.Parameters) {
  const { start, end, addPropertiesToDroppedEvent } = parameters;
  const store = useEventCalendarStoreContext();

  return useLinearTimeDropTarget({
    axis: 'vertical',
    timeScale: { type: 'continuous', start, end },
    constrainEventToTimeAxis: true,
    sources,
    surfaceType: 'time-grid',
    getFixedDurationInMinutes: () => schedulerEventSelectors.defaultEventDuration(store.state),
    addPropertiesToDroppedEvent,
  });
}

export namespace useTimeDropTarget {
  export interface Parameters {
    /**
     * The data and time at which the column starts.
     */
    start: TemporalSupportedObject;
    /**
     * The data and time at which the column ends.
     */
    end: TemporalSupportedObject;
    /**
     * Add properties to the event dropped in the column before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }

  export interface ReturnValue extends Pick<
    CalendarGridTimeColumnContext,
    'getCursorPositionInElementMs' | 'getDateAtPointer'
  > {}
}
