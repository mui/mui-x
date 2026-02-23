import { TemporalTimezone } from '../../../base-ui-copy/types';
import { processDate } from '../../../process-date';
import {
  SchedulerProcessedEventRecurrenceRule,
  RecurringEventWeekDayCode,
  SchedulerEventOccurrence,
  SchedulerProcessedEvent,
  TemporalSupportedObject,
} from '../../../models';
import { Adapter } from '../../../use-adapter';
import { getDateKey, getOccurrenceEnd, mergeDateAndTime } from '../date-utils';
import {
  dayInWeek,
  getRemainingOccurrences,
  getEventDurationInDays,
  getWeekDayCode,
  nthWeekdayOfMonth,
  NOT_LOCALIZED_WEEK_DAYS_INDEXES,
  parsesByDayForMonthlyFrequency,
  parsesByDayForWeeklyFrequency,
  startOfRRuleWeek,
} from './internal-utils';

/**
 * Max attempts to find a valid monthly occurrence.
 * Some months don't have day 29, 30, or 31, so we may need to skip months to find a valid date.
 * We're guaranteed to find a valid occurrence within 12 attempts (a full year).
 */
const MONTHLY_MAX_ATTEMPTS = 12;

/**
 * Max attempts to find a valid yearly occurrence.
 * Normally leap years repeat every 4 years, but century years not divisible by 400 are skipped
 * (e.g. 2100, 2200, 2300). This creates up to 8 consecutive non-leap years around such centuries
 * (e.g. 2097–2103). Using 8 guarantees we always find the next leap year regardless of interval.
 **/
const YEARLY_MAX_ATTEMPTS = 8;

/**
 * Expands a recurring event into concrete occurrences within a visible range.
 */
class RecurringEventExpander {
  private readonly dataTimezone: SchedulerProcessedEvent['dataTimezone'];

  private readonly rule: SchedulerProcessedEventRecurrenceRule;

  /*
   * Day anchor for RRULE math (BYDAY/COUNT), always in data timezone.
   */
  private readonly seriesStartDay: TemporalSupportedObject;

  /*
   * Represents the original DTSTART wall-time (HH:mm) in the event/data timezone
   * It is used to build occurrence instants via mergeDateAndTime().
   */
  private readonly dtStartInDataTz: TemporalSupportedObject;

  private readonly scanFirstDay: TemporalSupportedObject;

  private readonly scanLastDay: TemporalSupportedObject;

  private readonly interval: number;

  private readonly exDateKeys: Set<string>;

  private readonly untilBoundary: TemporalSupportedObject | null;

  /** The later of seriesStart and scanFirstDay */
  private readonly minDate: TemporalSupportedObject;

  // Weekly-specific: sorted weekday codes
  private sortedWeekDayCodes: RecurringEventWeekDayCode[] | null = null;

  // Monthly-specific: byDay (e.g., "2nd Tuesday") or byMonthDay (e.g., "the 15th")
  private monthlyByDay: { ord: number; code: RecurringEventWeekDayCode } | null = null;

  private monthlyTargetDay: number = 0;

  // Yearly-specific: target month and day
  private yearlyTargetMonth: number = 0;

  private yearlyTargetDay: number = 0;

  constructor(
    private readonly adapter: Adapter,
    private readonly event: SchedulerProcessedEvent,
    private readonly displayTimezone: TemporalTimezone,
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
  ) {
    // Important:
    // Occurrences are always computed in dataTimezone to avoid DST issues
    // DisplayTimezone is applied only for presentation purposes

    this.dataTimezone = event.dataTimezone;
    this.rule = this.dataTimezone.rrule!;
    this.dtStartInDataTz = adapter.setTimezone(
      this.dataTimezone.start.value,
      this.dataTimezone.timezone,
    );
    this.seriesStartDay = adapter.startOfDay(
      adapter.setTimezone(this.dataTimezone.start.value, this.dataTimezone.timezone),
    );
    this.interval = Math.max(1, this.rule.interval ?? 1);

    const dataTz = this.dataTimezone.timezone;
    const visibleStartDataTz = adapter.startOfDay(adapter.setTimezone(start, dataTz));
    const visibleEndDataTz = adapter.startOfDay(adapter.setTimezone(end, dataTz));

    // Adjust scan range to catch multi-day events starting before visible range
    const eventDuration = getEventDurationInDays(adapter, event);
    this.scanFirstDay = adapter.startOfDay(adapter.addDays(visibleStartDataTz, 1 - eventDuration));
    this.scanLastDay = adapter.startOfDay(visibleEndDataTz);

    // Pre-compute boundaries and exclusions
    this.exDateKeys = new Set(this.dataTimezone.exDates?.map((d) => getDateKey(d, adapter)));
    this.untilBoundary = this.rule.until ? adapter.startOfDay(this.rule.until) : null;
    this.minDate = adapter.isBefore(this.seriesStartDay, this.scanFirstDay)
      ? this.scanFirstDay
      : this.seriesStartDay;

    // Initialize frequency-specific data
    this.initializeFrequencyData();
  }

  private initializeFrequencyData(): void {
    const hasCount = typeof this.rule.count === 'number' && this.rule.count > 0;
    const hasUntil = !!this.rule.until;
    if (hasCount && hasUntil) {
      throw new Error('MUI: The recurring rule cannot have both the count and until properties.');
    }

    switch (this.rule.freq) {
      case 'WEEKLY': {
        const byDayCodes = parsesByDayForWeeklyFrequency(this.rule.byDay) ?? [
          getWeekDayCode(this.adapter, this.dtStartInDataTz),
        ];
        this.sortedWeekDayCodes = byDayCodes.toSorted(
          (a, b) =>
            NOT_LOCALIZED_WEEK_DAYS_INDEXES.get(a)! - NOT_LOCALIZED_WEEK_DAYS_INDEXES.get(b)!,
        );
        break;
      }
      case 'MONTHLY': {
        if (this.rule.byDay?.length && this.rule.byMonthDay?.length) {
          throw new Error(
            'MUI: The monthly recurrences cannot have both the byDay and the byMonthDay properties.',
          );
        }

        if (this.rule.byDay?.length) {
          this.monthlyByDay = parsesByDayForMonthlyFrequency(this.rule.byDay);
        } else {
          this.monthlyTargetDay = this.rule.byMonthDay?.length
            ? this.rule.byMonthDay[0]
            : this.adapter.getDate(this.seriesStartDay);
        }
        break;
      }
      case 'YEARLY': {
        // Only exact "same month + same day" recurrence is supported.
        // Any use of BYMONTH, BYMONTHDAY, BYDAY, or multiple values is not allowed.
        if (this.rule.byMonth?.length || this.rule.byMonthDay?.length || this.rule.byDay?.length) {
          throw new Error(
            'MUI: The yearly recurrences only support exact same date recurrence (month/day of DTSTART).',
          );
        }

        this.yearlyTargetMonth = this.adapter.getMonth(this.seriesStartDay);
        this.yearlyTargetDay = this.adapter.getDate(this.seriesStartDay);
        break;
      }
      default:
        // DAILY needs no special initialization
        break;
    }
  }

  /**
   * Adds an occurrence to the result array if not excluded
   */
  private addOccurrence(
    occurrences: SchedulerEventOccurrence[],
    day: TemporalSupportedObject,
  ): void {
    const dateKey = getDateKey(day, this.adapter);
    if (this.exDateKeys.has(dateKey)) {
      return;
    }

    const occurrenceStartOriginal = mergeDateAndTime(this.adapter, day, this.dtStartInDataTz);
    const occurrenceEndOriginal = getOccurrenceEnd({
      adapter: this.adapter,
      event: this.event,
      occurrenceStart: occurrenceStartOriginal,
    });

    const occurrenceStartDisplayTimezone = this.adapter.setTimezone(
      occurrenceStartOriginal,
      this.displayTimezone,
    );
    const occurrenceEndDisplayTimezone = this.adapter.setTimezone(
      occurrenceEndOriginal,
      this.displayTimezone,
    );
    occurrences.push({
      ...this.event,
      key: `${this.event.id}::${dateKey}`,
      dataTimezone: {
        ...this.event.dataTimezone,
        start: processDate(occurrenceStartOriginal, this.adapter),
        end: processDate(occurrenceEndOriginal, this.adapter),
        timezone: this.event.dataTimezone.timezone,
      },
      displayTimezone: {
        ...this.event.displayTimezone,
        start: processDate(occurrenceStartDisplayTimezone, this.adapter),
        end: processDate(occurrenceEndDisplayTimezone, this.adapter),
        timezone: this.event.displayTimezone.timezone,
      },
    });
  }

  /**
   * Finds the first occurrence in or after the scan range.
   */
  private findFirstOccurrence(): TemporalSupportedObject | null {
    switch (this.rule.freq) {
      case 'DAILY': {
        const daysDiff = this.adapter.differenceInDays(this.scanFirstDay, this.seriesStartDay);
        const skipDays = daysDiff > 0 ? Math.floor(daysDiff / this.interval) * this.interval : 0;
        let first = this.adapter.addDays(this.seriesStartDay, skipDays);

        if (this.adapter.isBefore(first, this.scanFirstDay)) {
          first = this.adapter.addDays(first, this.interval);
        }

        return first;
      }
      case 'WEEKLY': {
        // NOTE: For RRULE expansion we use RRULE week start (Monday),
        // not adapter.startOfWeek() which is locale-driven and can start on Sunday.
        const seriesWeekStart = startOfRRuleWeek(this.adapter, this.seriesStartDay);
        const scanWeekStart = startOfRRuleWeek(this.adapter, this.scanFirstDay);

        const weeksDiff = this.adapter.differenceInWeeks(scanWeekStart, seriesWeekStart);
        const skipWeeks = weeksDiff > 0 ? Math.floor(weeksDiff / this.interval) * this.interval : 0;
        const startingWeek = this.adapter.addWeeks(seriesWeekStart, skipWeeks);

        let first = this.findFirstInWeek(startingWeek, this.minDate);
        if (first === null) {
          first = this.findFirstInWeek(
            this.adapter.addWeeks(startingWeek, this.interval),
            this.seriesStartDay,
          );
        }

        return first;
      }
      case 'MONTHLY': {
        const seriesMonth = this.adapter.startOfMonth(this.seriesStartDay);
        const scanMonth = this.adapter.startOfMonth(this.scanFirstDay);
        const monthsDiff = this.adapter.differenceInMonths(scanMonth, seriesMonth);
        const skipMonths =
          monthsDiff > 0 ? Math.floor(monthsDiff / this.interval) * this.interval : 0;
        const startingMonth = this.adapter.addMonths(seriesMonth, skipMonths);

        return this.findFirstInMonth(startingMonth, this.minDate);
      }
      case 'YEARLY': {
        const seriesYear = this.adapter.startOfYear(this.seriesStartDay);
        const scanYear = this.adapter.startOfYear(this.scanFirstDay);
        const yearsDiff = this.adapter.differenceInYears(scanYear, seriesYear);
        const skipYears = yearsDiff > 0 ? Math.floor(yearsDiff / this.interval) * this.interval : 0;
        const startingYear = this.adapter.addYears(seriesYear, skipYears);

        return this.findFirstInYear(startingYear, this.minDate);
      }
      default:
        throw new Error(
          `MUI: Unknown frequency ${this.rule.freq}. Expected: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY".`,
        );
    }
  }

  private getNextOccurrence(current: TemporalSupportedObject): TemporalSupportedObject | null {
    switch (this.rule.freq) {
      case 'DAILY': {
        return this.adapter.addDays(current, this.interval);
      }
      case 'WEEKLY': {
        // NOTE: Use RRULE week boundaries instead of locale weeks (always starts on Monday), otherwise BYDAY like SU+TU can go backwards.
        const weekStart = startOfRRuleWeek(this.adapter, current);
        const currentIndex = this.sortedWeekDayCodes!.indexOf(
          getWeekDayCode(this.adapter, current),
        );

        // Check remaining days in current week
        for (let i = currentIndex + 1; i < this.sortedWeekDayCodes!.length; i += 1) {
          const candidate = dayInWeek(this.adapter, weekStart, this.sortedWeekDayCodes![i]);
          if (!this.adapter.isBefore(candidate, this.seriesStartDay)) {
            return candidate;
          }
        }

        // Move to next interval week
        return this.findFirstInWeek(
          this.adapter.addWeeks(weekStart, this.interval),
          this.seriesStartDay,
        );
      }
      case 'MONTHLY': {
        const nextMonth = this.adapter.addMonths(this.adapter.startOfMonth(current), this.interval);
        return this.findFirstInMonth(nextMonth, this.seriesStartDay);
      }
      case 'YEARLY': {
        const nextYear = this.adapter.addYears(this.adapter.startOfYear(current), this.interval);
        return this.findFirstInYear(nextYear, this.seriesStartDay);
      }
      default:
        return null;
    }
  }

  private findFirstInWeek(
    weekStart: TemporalSupportedObject,
    minDate: TemporalSupportedObject,
  ): TemporalSupportedObject | null {
    for (const code of this.sortedWeekDayCodes!) {
      const candidate = dayInWeek(this.adapter, weekStart, code);
      if (!this.adapter.isBefore(candidate, minDate)) {
        return candidate;
      }
    }
    return null;
  }

  private findFirstInMonth(
    monthStart: TemporalSupportedObject,
    minDate: TemporalSupportedObject,
  ): TemporalSupportedObject | null {
    let month = monthStart;
    for (let i = 0; i < MONTHLY_MAX_ATTEMPTS; i += 1) {
      let candidate: TemporalSupportedObject | null;
      if (this.monthlyByDay !== null) {
        // Monthly by weekday (e.g., "2nd Tuesday of the month")
        candidate = nthWeekdayOfMonth(
          this.adapter,
          month,
          this.monthlyByDay.code,
          this.monthlyByDay.ord,
        );
      } else if (this.monthlyTargetDay <= this.adapter.getDaysInMonth(month)) {
        // Monthly by day of month (e.g., "the 15th")
        candidate = this.adapter.startOfDay(this.adapter.setDate(month, this.monthlyTargetDay));
      } else {
        candidate = null;
      }

      if (candidate && !this.adapter.isBefore(candidate, minDate)) {
        return candidate;
      }
      month = this.adapter.addMonths(month, this.interval);
    }
    return null;
  }

  private findFirstInYear(
    yearStart: TemporalSupportedObject,
    minDate: TemporalSupportedObject,
  ): TemporalSupportedObject | null {
    // Assumes yearStart is at or after minDate's year so that YEARLY_MAX_ATTEMPTS (8)
    // is sufficient to span the worst-case gap of 8 consecutive non-leap years (e.g. 2097–2103).
    let year = yearStart;
    for (let i = 0; i < YEARLY_MAX_ATTEMPTS; i += 1) {
      const monthAnchor = this.adapter.setMonth(
        this.adapter.startOfYear(year),
        this.yearlyTargetMonth,
      );
      if (this.yearlyTargetDay <= this.adapter.getDaysInMonth(monthAnchor)) {
        const candidate = this.adapter.startOfDay(
          this.adapter.setDate(monthAnchor, this.yearlyTargetDay),
        );
        if (!this.adapter.isBefore(candidate, minDate)) {
          return candidate;
        }
      }
      year = this.adapter.addYears(year, this.interval);
    }
    return null;
  }

  /**
   * Expands the recurring event into concrete occurrences.
   */
  public expand(): SchedulerEventOccurrence[] {
    const firstOccurrence = this.findFirstOccurrence();

    // Initialize COUNT tracking if needed
    let remainingCount = this.rule.count ?? Infinity;
    if (this.rule.count !== undefined && firstOccurrence !== null) {
      const dayBeforeFirst = this.adapter.addDays(firstOccurrence, -1);
      if (!this.adapter.isBefore(dayBeforeFirst, this.seriesStartDay)) {
        remainingCount = getRemainingOccurrences(
          this.adapter,
          this.rule,
          this.seriesStartDay,
          dayBeforeFirst,
          this.rule.count,
        );
      }
    }

    // Iterate through occurrences
    const occurrences: SchedulerEventOccurrence[] = [];
    let currentDay = firstOccurrence;

    while (currentDay !== null) {
      // The occurrence is beyond the visible range.
      if (this.adapter.isAfter(currentDay, this.scanLastDay)) {
        break;
      }

      // The occurrence is beyond the UNTIL boundary.
      if (this.untilBoundary !== null && this.adapter.isAfter(currentDay, this.untilBoundary)) {
        break;
      }

      // The recurrence event has ended.
      if (this.rule.count !== undefined && remainingCount <= 0) {
        break;
      }

      remainingCount -= 1;

      // Add occurrence if within scan range and not excluded
      if (!this.adapter.isBefore(currentDay, this.scanFirstDay)) {
        this.addOccurrence(occurrences, currentDay);
      }

      currentDay = this.getNextOccurrence(currentDay);
    }

    return occurrences;
  }
}

/**
 * Expands a recurring event into concrete occurrences within the visible range.
 * Uses direct occurrence computation instead of day-by-day iteration.
 * Honors COUNT/UNTIL boundaries and EXDATE exclusions.
 */
export function getRecurringEventOccurrencesForVisibleDays(
  event: SchedulerProcessedEvent,
  start: TemporalSupportedObject,
  end: TemporalSupportedObject,
  adapter: Adapter,
  displayTimezone: TemporalTimezone,
): SchedulerEventOccurrence[] {
  return new RecurringEventExpander(adapter, event, displayTimezone, start, end).expand();
}
