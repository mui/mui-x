import { createSelectorMemoized } from '@base-ui/utils/store';
import { EventCalendarState as State } from '../use-event-calendar';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '../scheduler-selectors';
import { eventCalendarPreferenceSelectors } from './eventCalendarPreferenceSelectors';
import { innerGetEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';
import { SchedulerProcessedDate } from '../models';
import { AGENDA_MAX_HORIZON_DAYS, AGENDA_VIEW_DAYS_AMOUNT } from '../constants';
import { getDayList } from '../get-day-list';

export const eventCalendarAgendaSelectors = {
  visibleDays: createSelectorMemoized(
    (state: State) => state.adapter,
    schedulerOtherSelectors.visibleDate,
    schedulerOtherSelectors.displayTimezone,
    eventCalendarPreferenceSelectors.showWeekends,
    eventCalendarPreferenceSelectors.showEmptyDaysInAgenda,
    schedulerEventSelectors.processedEventList,
    schedulerResourceSelectors.visibleMap,
    schedulerOtherSelectors.plan,
    (
      adapter,
      visibleDate,
      displayTimezone,
      showWeekends,
      showEmptyDaysInAgenda,
      events,
      visibleResources,
      plan,
    ) => {
      const amount = AGENDA_VIEW_DAYS_AMOUNT;

      // 1) First chunk of days
      let accumulatedDays = getDayList({
        adapter,
        start: visibleDate,
        end: adapter.addDays(visibleDate, amount - 1),
        excludeWeekends: !showWeekends,
      });

      // Compute occurrences for the current accumulated range
      let occurrenceMap = innerGetEventOccurrencesGroupedByDay({
        adapter,
        days: accumulatedDays,
        events,
        visibleResources,
        displayTimezone,
        plan,
      });

      const hasEvents = (day: SchedulerProcessedDate) =>
        (occurrenceMap.get(day.key)?.length ?? 0) > 0;

      // 2) If we show empty days, just return the amount days
      if (showEmptyDaysInAgenda) {
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
            adapter.differenceInDays(adapter.startOfDay(last), adapter.startOfDay(first)) + 1;

          // Hard stop to avoid scanning too far into the future
          if (spanDays >= AGENDA_MAX_HORIZON_DAYS) {
            break;
          }
        }

        // Extend forward by one more chunk and recompute occurrences over the accumulated range
        const nextStart = adapter.addDays(last ?? visibleDate, 1);

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
          plan,
        });

        daysWithEvents = accumulatedDays.filter(hasEvents).slice(0, amount);
      }

      return daysWithEvents;
    },
  ),
};
