import { createSelectorMemoized } from '@base-ui/utils/store';
import type { EventCalendarState as State } from '../use-event-calendar';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '../scheduler-selectors';
import { eventCalendarPreferenceSelectors } from './eventCalendarPreferenceSelectors';
import { innerGetEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';
import type { SchedulerProcessedDate } from '../models';
import { AGENDA_MAX_HORIZON_DAYS, AGENDA_VIEW_DAYS_AMOUNT } from '../constants';
import { getDayList } from '../get-day-list';

const defaultVisibleDays = createSelectorMemoized(
  (state: State) => state.adapter,
  schedulerOtherSelectors.visibleDate,
  eventCalendarPreferenceSelectors.showWeekends,
  (adapter, visibleDate, showWeekends) =>
    getDayList({
      adapter,
      start: visibleDate,
      end: adapter.addDays(visibleDate, AGENDA_VIEW_DAYS_AMOUNT - 1),
      excludeWeekends: !showWeekends,
    }),
);

export const eventCalendarAgendaSelectors = {
  /**
   * The days the agenda view shows when it does not hide the empty days.
   */
  defaultVisibleDays,
  visibleDays: createSelectorMemoized(
    (state: State) => state.adapter,
    defaultVisibleDays,
    schedulerOtherSelectors.displayTimezone,
    eventCalendarPreferenceSelectors.showWeekends,
    eventCalendarPreferenceSelectors.showEmptyDaysInAgenda,
    schedulerEventSelectors.processedEventList,
    schedulerResourceSelectors.visibleMap,
    schedulerOtherSelectors.recurringEventsPlugin,
    schedulerOtherSelectors.isLoading,
    (
      adapter,
      defaultDays,
      displayTimezone,
      showWeekends,
      showEmptyDaysInAgenda,
      events,
      visibleResources,
      recurringEventsPlugin,
      isLoading,
    ) => {
      const amount = AGENDA_VIEW_DAYS_AMOUNT;

      // 1) First chunk of days
      let accumulatedDays = defaultDays;

      // 2) If we show empty days, just return the amount days
      if (showEmptyDaysInAgenda) {
        return accumulatedDays;
      }

      // Compute occurrences for the current accumulated range
      let occurrenceMap = innerGetEventOccurrencesGroupedByDay({
        adapter,
        days: accumulatedDays,
        events,
        visibleResources,
        displayTimezone,
        recurringEventsPlugin,
      });

      const hasEvents = (day: SchedulerProcessedDate) =>
        (occurrenceMap.get(day.key)?.length ?? 0) > 0;

      // 3) If we hide empty days, keep extending forward in blocks until we fill `amount` days with events
      let daysWithEvents = accumulatedDays.filter(hasEvents).slice(0, amount);

      // While loading, keep the days already known to have events (the lazy loading plugin fetches
      // their range); with none known yet, show the plain days so the skeletons have rows.
      if (isLoading && daysWithEvents.length === 0) {
        return accumulatedDays;
      }

      while (daysWithEvents.length < amount) {
        // Stop if the calendar span already reaches the horizon
        const first = accumulatedDays[0]?.value;
        const last = accumulatedDays[accumulatedDays.length - 1]?.value;

        if (first && last) {
          const spanDays =
            adapter.differenceInDays(adapter.startOfDay(last), adapter.startOfDay(first)) + 1;

          // Hard stop to avoid scanning too far into the future
          if (spanDays >= AGENDA_MAX_HORIZON_DAYS) {
            break;
          }
        }

        // Extend forward by one more chunk and recompute occurrences over the accumulated range
        const nextStart = adapter.addDays(last ?? defaultDays[0].value, 1);

        const more = getDayList({
          adapter,
          start: nextStart,
          end: adapter.addDays(nextStart, amount),
          excludeWeekends: !showWeekends,
        });

        accumulatedDays = accumulatedDays.concat(more);

        occurrenceMap = innerGetEventOccurrencesGroupedByDay({
          adapter,
          days: accumulatedDays,
          events,
          visibleResources,
          displayTimezone,
          recurringEventsPlugin,
        });

        daysWithEvents = accumulatedDays.filter(hasEvents).slice(0, amount);
      }

      return daysWithEvents;
    },
  ),
};
