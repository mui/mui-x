import type { TemporalSupportedObject, TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type {
  RecurringEventByDayValue,
  SchedulerProcessedEventRecurrenceRule,
  RecurringEventWeekDayCode,
} from '@mui/x-scheduler-internals/models';
import { getWeekDayCode, NOT_LOCALIZED_WEEK_DAYS_INDEXES, tokenizeByDay } from './internal-utils';
import { computeMonthlyOrdinal } from './computeMonthlyOrdinal';

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

    // A MONTHLY ordinal BYDAY (e.g. 1MO, -1FR) on the series start's own position follows the
    // start into the target timezone, so the dialog reads it back as the preset it was picked
    // from. Other ordinals are kept as-is: a calendar position in one timezone does not map to
    // a stable one in another.
    if (rrule.freq === 'MONTHLY') {
      const startValue = getMonthlyByDayValue(adapter, seriesStartDataTimezone);
      if (rrule.byDay.includes(startValue)) {
        const startTargetValue = getMonthlyByDayValue(
          adapter,
          adapter.setTimezone(seriesStartDataTimezone, targetTimezone),
        );
        nextRule = {
          ...nextRule,
          byDay: Array.from(
            new Set(rrule.byDay.map((value) => (value === startValue ? startTargetValue : value))),
          ),
        };
      }
    }
  }

  // A MONTHLY BYMONTHDAY on the series start's own day follows the start into the target
  // timezone, so the dialog reads it back as the preset it was picked from. Other values
  // are kept as-is for the same reason as the ordinals.
  if (rrule.freq === 'MONTHLY' && rrule.byMonthDay?.length) {
    const startDataDay = adapter.getDate(seriesStartDataTimezone);
    if (rrule.byMonthDay.includes(startDataDay)) {
      const startTargetDay = adapter.getDate(
        adapter.setTimezone(seriesStartDataTimezone, targetTimezone),
      );
      nextRule = {
        ...nextRule,
        byMonthDay: Array.from(
          new Set(rrule.byMonthDay.map((day) => (day === startDataDay ? startTargetDay : day))),
        ),
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

/** The ordinal BYDAY value (e.g. 1MO, -1FR) of a date's own position in its month. */
function getMonthlyByDayValue(
  adapter: Adapter,
  date: TemporalSupportedObject,
): RecurringEventByDayValue {
  return `${computeMonthlyOrdinal(adapter, date)}${getWeekDayCode(adapter, date)}` as RecurringEventByDayValue;
}
