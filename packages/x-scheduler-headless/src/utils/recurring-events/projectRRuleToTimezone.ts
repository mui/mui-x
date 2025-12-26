import { TemporalSupportedObject, TemporalTimezone } from '../../base-ui-copy/types';
import { Adapter } from '../../use-adapter/useAdapter.types';
import {
  RecurringEventByDayValue,
  RecurringEventRecurrenceRule,
  RecurringEventWeekDayCode,
} from '../../models';
import {
  getWeekDayCode,
  NOT_LOCALIZED_WEEK_DAYS_INDEXES,
  nthWeekdayOfMonth,
  parsesByDayForMonthlyFrequency,
  tokenizeByDay,
} from './internal-utils';
import { computeMonthlyOrdinal } from './computeMonthlyOrdinal';

/**
 * Projects a recurrence rule to a different timezone.
 * This is a derived representation intended for UI purposes only
 */
export function projectRRuleToTimezone(
  adapter: Adapter,
  rrule: RecurringEventRecurrenceRule,
  targetTimezone: TemporalTimezone,
  seriesStartDataTimezone: TemporalSupportedObject,
): RecurringEventRecurrenceRule {
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

    if (rrule.freq === 'MONTHLY') {
      nextRule = {
        ...nextRule,
        byDay: projectMonthlyByDay(adapter, rrule.byDay, seriesStartDataTimezone, targetTimezone),
      };
    }
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

function projectMonthlyByDay(
  adapter: Adapter,
  byDay: RecurringEventByDayValue[],
  seriesStart: TemporalSupportedObject,
  targetTimezone: TemporalTimezone,
): RecurringEventByDayValue[] {
  // MONTHLY BYDAY currently supports a single ordinal weekday (e.g. 1MO, -1FR)
  const { ord, code } = parsesByDayForMonthlyFrequency(byDay);

  const monthStart = adapter.startOfMonth(seriesStart);
  const occurrence = nthWeekdayOfMonth(adapter, monthStart, code, ord);

  if (!occurrence) {
    return byDay; // fallback to original values if we can't compute the occurrence
  }

  const projected = adapter.setTimezone(occurrence, targetTimezone);
  const projectedCode = getWeekDayCode(adapter, projected);
  const projectedOrdinal = computeMonthlyOrdinal(adapter, projected);

  return [`${projectedOrdinal}${projectedCode}` as RecurringEventByDayValue];
}
