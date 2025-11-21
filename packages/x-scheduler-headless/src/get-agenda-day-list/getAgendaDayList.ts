'use client';
import { diffIn } from '../use-adapter/useAdapter';
import { getDayList } from '../get-day-list';
import {
  SchedulerProcessedDate,
  SchedulerValidDate,
  SchedulerProcessedEvent,
  SchedulerResourceId,
} from '../models';
import { innerGetEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';
import { AGENDA_MAX_HORIZON_DAYS } from '../constants';
import { TemporalAdapter } from '../base-ui-copy/types';

/**
 * Agenda-specific function that builds the day list starting at `date`
 * If `showEmptyDays` is false, it extends the range forward until it fills `amount` days that contain events (up to a horizon limit)
 */
export function getAgendaDayList(
  parameters: GetAgendaDayListParameters,
): GetAgendaDayListReturnValue {
  const {
    adapter,
    start,
    amount,
    excludeWeekends,
    showEmptyDays,
    events,
    visibleResources,
    resourceParentIds,
  } = parameters;

  // 1) First chunk of days
  let accumulatedDays = getDayList({
    adapter,
    start,
    end: adapter.addDays(start, amount),
    excludeWeekends,
  });

  // Compute occurrences for the current accumulated range
  let occurrenceMap = innerGetEventOccurrencesGroupedByDay({
    adapter,
    days: accumulatedDays,
    events,
    visibleResources,
    resourceParentIds,
  });

  const hasEvents = (day: SchedulerProcessedDate) => (occurrenceMap.get(day.key)?.length ?? 0) > 0;

  // 2) If we show empty days, just return the amount days
  if (showEmptyDays) {
    return accumulatedDays;
  }

  // 3) If we hide empty days, keep extending forward in blocks until we fill `amount` days with events
  let daysWithEvents = accumulatedDays.filter(hasEvents).slice(0, amount);

  while (daysWithEvents.length < amount) {
    // Stop if the calendar span already reaches the horizon
    const first = accumulatedDays[0]?.value;
    const last = accumulatedDays[accumulatedDays.length - 1]?.value;

    if (first && last) {
      const spanDays =
        diffIn(adapter, adapter.startOfDay(last), adapter.startOfDay(first), 'days') + 1;

      // Hard stop to avoid scanning too far into the future
      if (spanDays >= AGENDA_MAX_HORIZON_DAYS) {
        break;
      }
    }

    // Extend forward by one more chunk and recompute occurrences over the accumulated range
    const nextStart = adapter.addDays(
      accumulatedDays[accumulatedDays.length - 1]?.value ?? start,
      1,
    );

    const more = getDayList({
      adapter,
      start: nextStart,
      end: adapter.addDays(nextStart, amount),
      excludeWeekends,
    });

    accumulatedDays = accumulatedDays.concat(more);

    occurrenceMap = innerGetEventOccurrencesGroupedByDay({
      adapter,
      days: accumulatedDays,
      events,
      visibleResources,
      resourceParentIds,
    });

    daysWithEvents = accumulatedDays.filter(hasEvents).slice(0, amount);
  }

  return daysWithEvents;
}

export interface GetAgendaDayListParameters {
  /**
   * The adapter used to manipulate the date.
   */
  adapter: TemporalAdapter;
  /**
   * The start of the range to generate the day list from.
   */
  start: SchedulerValidDate;
  /**
   * The amount of days to generate.
   */
  amount: number;
  /**
   * Whether to exclude weekends (Saturday and Sunday) from the returned days.
   * @default false
   */
  excludeWeekends: boolean;
  /**
   * Whether empty days are shown.
   */
  showEmptyDays: boolean;
  /**
   * TODO: Remove
   */
  events: SchedulerProcessedEvent[];
  /**
   * TODO: Remove
   */
  visibleResources: Map<SchedulerResourceId, boolean>;
  /**
   * TODO: Remove
   */
  resourceParentIds: Map<SchedulerResourceId, SchedulerResourceId | null>;
}

export type GetAgendaDayListReturnValue = SchedulerProcessedDate[];
