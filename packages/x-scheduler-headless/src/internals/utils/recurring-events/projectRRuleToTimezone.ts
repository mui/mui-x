import { TemporalSupportedObject, TemporalTimezone } from '../../../base-ui-copy/types';
import { Adapter } from '../../../use-adapter/useAdapter.types';
import {
  RecurringEventByDayValue,
  SchedulerProcessedEventRecurrenceRule,
  RecurringEventWeekDayCode,
} from '../../../models';
import { getWeekDayCode, NOT_LOCALIZED_WEEK_DAYS_INDEXES, tokenizeByDay } from './internal-utils';

/**
 * Projects a recurrence rule to a different timezone.
 * This is a derived representation intended for UI purposes only
 */
export function projectRRuleToTimezone(
  adapter: Adapter,
  rrule: SchedulerProcessedEventRecurrenceRule,
  targetTimezone: TemporalTimezone,
  seriesStartDataTimezone: TemporalSupportedObject,
): SchedulerProcessedEventRecurrenceRule {
  let nextRule = rrule;

  if (rrule.until) {
    nextRule = {
      ...nextRule,
      until: adapter.setTimezone(rrule.until, targetTimezone),
    };
  }

  if (rrule.byDay?.length) {
    if (rrule.freq === 'WEEKLY') {
      nextRule = {
        ...nextRule,
        byDay: projectWeeklyByDay(adapter, rrule.byDay, seriesStartDataTimezone, targetTimezone),
      };
    }

    // Monthly BYDAY with ordinals (e.g. 1MO, -1FR) is intentionally NOT projected.
    // Ordinals represent a calendar position in the event timezone and do not map
    // to a stable or meaningful rule in the display timezone.
    // Keeping the original rule avoids misleading UI representations.
  }

  return nextRule;
}

// Project weekly byDay values using a real occurrence anchored to the series start.
// We build an actual date in the event dataTimezone and then project it to the target
// timezone to determine the correct weekday, preserving DST and day-crossing behavior.
function projectWeeklyByDay(
  adapter: Adapter,
  byDay: RecurringEventByDayValue[],
  seriesStartDataTimezone: TemporalSupportedObject,
  targetTimezone: TemporalTimezone,
): RecurringEventWeekDayCode[] {
  const startDayCode = getWeekDayCode(adapter, seriesStartDataTimezone);
  const startDayIndex = NOT_LOCALIZED_WEEK_DAYS_INDEXES.get(startDayCode)!;

  const projected = byDay.map((value) => {
    const { code } = tokenizeByDay(value);
    const targetIndex = NOT_LOCALIZED_WEEK_DAYS_INDEXES.get(code)!;

    const delta = (((targetIndex - startDayIndex) % 7) + 7) % 7;

    const occurrenceDataTz = adapter.addDays(seriesStartDataTimezone, delta);

    const occurrenceDisplayTz = adapter.setTimezone(occurrenceDataTz, targetTimezone);

    return getWeekDayCode(adapter, occurrenceDisplayTz);
  });

  return Array.from(new Set(projected));
}
