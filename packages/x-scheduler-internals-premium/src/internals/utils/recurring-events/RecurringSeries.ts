import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import {
  addMonthsToDayNumber,
  getSkippedDays,
  getStartOfMonthDayNumber,
  getStartOfWeekDayNumber,
  LAST_SUPPORTED_DAY,
  PlainDate,
  plainDateFromDayNumber,
  toMsInDay,
  toPlainDate,
} from '@mui/x-scheduler-internals/internals';
import type {
  RecurringEventWeekDayCode,
  SchedulerProcessedEvent,
  SchedulerProcessedEventRecurrenceRule,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import {
  NOT_LOCALIZED_WEEK_DAYS_INDEXES,
  parsesByDayForMonthlyFrequency,
  parsesByDayForWeeklyFrequency,
} from './internal-utils';

/**
 * The Gregorian calendar repeats every 400 years, days of the week included.
 * A monthly or yearly rule that matches no month during that cycle never matches.
 */
const MONTHS_PER_GREGORIAN_CYCLE = 12 * 400;

/**
 * The days the timezone skips are looked up by periods of this many days.
 */
const SKIPPED_DAYS_PERIOD = 31;

/**
 * Returns how many steps of `interval` periods visit every period of a cycle of `cycleLength`
 * periods, plus one so that a match skipped in the first period because it is before the minimum
 * date is found again.
 */
function getMaxSearchSteps(cycleLength: number, interval: number): number {
  let divisor = cycleLength;
  let remainder = interval % cycleLength;
  while (remainder !== 0) {
    [divisor, remainder] = [remainder, divisor % remainder];
  }
  return cycleLength / divisor + 1;
}

/**
 * Returns the ISO day of the week (1 for Monday to 7 for Sunday) of a week day code.
 */
function getDayOfWeekFromCode(code: RecurringEventWeekDayCode): number {
  return NOT_LOCALIZED_WEEK_DAYS_INDEXES.get(code)! + 1;
}

/**
 * Returns the Nth `dayOfWeek` of the month starting on `monthStart`.
 * ordinal > 0 → Nth from the start (1..5). ordinal < 0 → Nth from the end (-1 = last).
 * If that occurrence doesn't exist in the month, returns null.
 */
function getNthWeekdayOfMonth(
  monthStart: PlainDate,
  dayOfWeek: number,
  ordinal: number,
): PlainDate | null {
  // Read once, as a date computes its ISO fields when they're read.
  const daysInMonth = monthStart.daysInMonth;
  let day: number;
  if (ordinal > 0) {
    day = 1 + ((dayOfWeek - monthStart.dayOfWeek + 7) % 7) + 7 * (ordinal - 1);
  } else {
    const lastDayOfWeek = ((monthStart.dayOfWeek + daysInMonth - 2) % 7) + 1;
    day = daysInMonth - ((lastDayOfWeek - dayOfWeek + 7) % 7) + 7 * (ordinal + 1);
  }
  return day >= 1 && day <= daysInMonth
    ? plainDateFromDayNumber(monthStart.dayNumber + day - 1)
    : null;
}

/**
 * RFC 5545 weeks start on Monday (WKST=MO) whatever the locale, otherwise BYDAY like SU+TU can go
 * backwards.
 */
function getStartOfRRuleWeek(date: PlainDate): PlainDate {
  return plainDateFromDayNumber(getStartOfWeekDayNumber(date.dayNumber, 1));
}

/**
 * Returns `date` moved forward by `days`, or `null` after the last day BaseTemporal supports, which
 * a rule with a large interval reaches in a few steps.
 */
function addDays(date: PlainDate, days: number): PlainDate | null {
  const dayNumber = date.dayNumber + days;
  return dayNumber > LAST_SUPPORTED_DAY ? null : plainDateFromDayNumber(dayNumber);
}

/**
 * Returns the first day of the month `months` after the one starting on `monthStart`, or `null`
 * after the last year BaseTemporal supports.
 */
function addMonths(monthStart: PlainDate, months: number): PlainDate | null {
  const dayNumber = addMonthsToDayNumber(monthStart.dayNumber, months);
  // `<=` also rejects the NaN of a month count too large to compute.
  return dayNumber <= LAST_SUPPORTED_DAY ? plainDateFromDayNumber(dayNumber) : null;
}

function getStartOfMonth(date: PlainDate): PlainDate {
  return plainDateFromDayNumber(getStartOfMonthDayNumber(date.dayNumber));
}

function getLaterDate(one: PlainDate, two: PlainDate): PlainDate {
  return PlainDate.compare(one, two) < 0 ? two : one;
}

/**
 * Steps through the days the frequency, interval and BY* parts of a rule match, from the first
 * occurrence. Expects a rule validated by `parseRRule()`.
 *
 * A yearly rule has no BY* part, so it matches the day of DTSTART every 12 × INTERVAL months.
 */
class RuleDays {
  /**
   * The step between two periods of the rule, in days, weeks, or months for monthly and yearly
   * rules.
   */
  declare public readonly interval: number;

  /**
   * How many months to try before concluding that the rule never matches again.
   */
  declare private readonly maxSearchSteps: number;

  // Weekly-specific: ISO days of the week, sorted from Monday.
  private weekDays: number[] = [];

  // Monthly and yearly: byDay (e.g., "2nd Tuesday") or the day of the month (e.g., "the 15th")
  private monthlyByDay: { ord: number; dayOfWeek: number } | null = null;

  private monthlyTargetDay: number = 0;

  constructor(
    public readonly rule: SchedulerProcessedEventRecurrenceRule,
    private readonly seriesStart: PlainDate,
  ) {
    this.interval = (rule.freq === 'YEARLY' ? 12 : 1) * (rule.interval ?? 1);
    this.maxSearchSteps = getMaxSearchSteps(MONTHS_PER_GREGORIAN_CYCLE, this.interval);

    switch (rule.freq) {
      case 'DAILY':
        break;
      case 'WEEKLY': {
        this.weekDays = (
          parsesByDayForWeeklyFrequency(rule.byDay)?.map(getDayOfWeekFromCode) ?? [
            seriesStart.dayOfWeek,
          ]
        ).toSorted((a, b) => a - b);
        break;
      }
      default: {
        if (rule.byDay?.length) {
          const { ord, code } = parsesByDayForMonthlyFrequency(rule.byDay);
          this.monthlyByDay = { ord, dayOfWeek: getDayOfWeekFromCode(code) };
        } else {
          // Without COUNT, only the first value is used.
          this.monthlyTargetDay = rule.byMonthDay?.[0] ?? seriesStart.day;
        }
        break;
      }
    }
  }

  /**
   * Returns the first day on or after `date`, skipping the whole intervals before it.
   */
  public getFirstFrom(date: PlainDate): PlainDate | null {
    const { interval, seriesStart } = this;
    const skip = (periods: number) => (periods > 0 ? Math.floor(periods / interval) * interval : 0);
    const minDate = getLaterDate(seriesStart, date);

    switch (this.rule.freq) {
      case 'DAILY': {
        const first = plainDateFromDayNumber(
          seriesStart.dayNumber + skip(date.dayNumber - seriesStart.dayNumber),
        );
        return PlainDate.compare(first, date) < 0 ? addDays(first, interval) : first;
      }
      case 'WEEKLY': {
        const seriesWeekStart = getStartOfRRuleWeek(seriesStart);
        const weeksDiff = (getStartOfRRuleWeek(date).dayNumber - seriesWeekStart.dayNumber) / 7;
        const startingWeek = plainDateFromDayNumber(
          seriesWeekStart.dayNumber + 7 * skip(weeksDiff),
        );
        const first = this.findFirstInWeek(startingWeek, minDate);
        if (first !== null) {
          return first;
        }
        const nextWeek = addDays(startingWeek, 7 * interval);
        return nextWeek === null ? null : this.findFirstInWeek(nextWeek, seriesStart);
      }
      default: {
        const monthsDiff = (date.year - seriesStart.year) * 12 + date.month - seriesStart.month;
        const startingMonth = addMonths(getStartOfMonth(seriesStart), skip(monthsDiff));
        return startingMonth === null ? null : this.findFirstInMonth(startingMonth, minDate);
      }
    }
  }

  /**
   * Returns the day following `day`, a day of the rule.
   */
  public getNext(day: PlainDate): PlainDate | null {
    switch (this.rule.freq) {
      case 'DAILY': {
        return addDays(day, this.interval);
      }
      case 'WEEKLY': {
        // The next day of the week, or the first one `interval` weeks later.
        const dayOfWeek = this.weekDays.find((weekDay) => weekDay > day.dayOfWeek);
        return addDays(
          day,
          dayOfWeek === undefined
            ? 7 * this.interval + this.weekDays[0] - day.dayOfWeek
            : dayOfWeek - day.dayOfWeek,
        );
      }
      default: {
        const nextMonth = addMonths(getStartOfMonth(day), this.interval);
        return nextMonth === null ? null : this.findFirstInMonth(nextMonth, this.seriesStart);
      }
    }
  }

  private findFirstInWeek(weekStart: PlainDate, minDate: PlainDate): PlainDate | null {
    for (const dayOfWeek of this.weekDays) {
      const candidate = addDays(weekStart, dayOfWeek - 1);
      if (candidate === null || PlainDate.compare(candidate, minDate) >= 0) {
        return candidate;
      }
    }
    return null;
  }

  private findFirstInMonth(monthStart: PlainDate, minDate: PlainDate): PlainDate | null {
    let month: PlainDate | null = monthStart;
    for (let i = 0; i < this.maxSearchSteps && month !== null; i += 1) {
      let candidate: PlainDate | null = null;
      if (this.monthlyByDay !== null) {
        // Monthly by weekday (e.g., "2nd Tuesday of the month")
        candidate = getNthWeekdayOfMonth(month, this.monthlyByDay.dayOfWeek, this.monthlyByDay.ord);
      } else if (this.monthlyTargetDay <= month.daysInMonth) {
        // Monthly by day of month (e.g., "the 15th")
        candidate = plainDateFromDayNumber(month.dayNumber + this.monthlyTargetDay - 1);
      }

      if (candidate !== null && PlainDate.compare(candidate, minDate) >= 0) {
        return candidate;
      }
      month = addMonths(month, this.interval);
    }
    return null;
  }
}

export interface RecurringSeriesParameters {
  /**
   * The rule of the series, as `parseRRule()` returns it.
   */
  rule: SchedulerProcessedEventRecurrenceRule;
  /**
   * The instant of the first occurrence (DTSTART).
   */
  start: number;
  /**
   * The timezone of the series.
   */
  timezone: TemporalTimezone;
  /**
   * The excluded occurrences (EXDATE), labeled in the timezone of the series.
   */
  exDates?: readonly TemporalSupportedObject[];
}

/**
 * A recurring series in its timezone: the days its occurrences fall on, given its rule, UNTIL,
 * COUNT and EXDATE, and the days the timezone skips. Days are plain dates in the timezone of the
 * series.
 *
 * An excluded occurrence counts toward COUNT, as in RFC 5545. A day the timezone skips, like
 * December 30th, 2011 in Pacific/Apia, has no occurrence and doesn't count toward COUNT.
 */
export class RecurringSeries {
  declare public readonly timezone: TemporalTimezone;

  /**
   * The date of the first occurrence (DTSTART).
   */
  declare public readonly startPlainDate: PlainDate;

  /**
   * The wall-clock time of the first occurrence, in milliseconds since midnight.
   */
  declare public readonly startMsInDay: number;

  declare private readonly ruleDays: RuleDays;

  declare private readonly count: number;

  declare private readonly untilDay: PlainDate | null;

  declare private readonly excludedDays: Set<number>;

  private readonly skippedDaysByPeriod = new Map<number, Set<number>>();

  constructor(adapter: Adapter, parameters: RecurringSeriesParameters) {
    const { rule, timezone } = parameters;
    const toDay = (date: TemporalSupportedObject) => toPlainDate(adapter.getTime(date), timezone);

    this.timezone = timezone;
    this.startPlainDate = toPlainDate(parameters.start, timezone);
    this.startMsInDay = toMsInDay(parameters.start, timezone);
    this.ruleDays = new RuleDays(rule, this.startPlainDate);
    // A fractional COUNT is rounded up.
    this.count = Math.ceil(rule.count ?? Infinity);
    this.untilDay = rule.until ? toDay(rule.until) : null;
    this.excludedDays = new Set(parameters.exDates?.map((exDate) => toDay(exDate).dayNumber));
  }

  /**
   * Returns the series of a processed event, in its data timezone.
   * `exDates` replaces the excluded occurrences of the event.
   */
  public static fromEvent(
    adapter: Adapter,
    event: SchedulerProcessedEvent,
    exDates: readonly TemporalSupportedObject[] | undefined = event.dataTimezone.exDates,
  ): RecurringSeries {
    return new RecurringSeries(adapter, {
      rule: event.dataTimezone.rrule!,
      start: event.dataTimezone.start.timestamp,
      timezone: event.dataTimezone.timezone,
      exDates,
    });
  }

  /**
   * Returns the days of the occurrences from `from` to `to`, both included, in order.
   */
  public getOccurrenceDays(from: PlainDate, to: PlainDate): PlainDate[] {
    const days: PlainDate[] = [];
    this.visitOccurrences(from, to, (day, isExcluded) => {
      if (!isExcluded) {
        days.push(day);
      }
      return true;
    });
    return days;
  }

  /**
   * Returns the number of occurrences before `day` that count toward COUNT, up to COUNT.
   */
  public countOccurrencesBefore(day: PlainDate): number {
    const end =
      this.untilDay !== null && PlainDate.compare(this.untilDay, day) < 0
        ? plainDateFromDayNumber(this.untilDay.dayNumber + 1)
        : day;
    return this.countBefore(end);
  }

  /**
   * Returns whether an occurrence that isn't excluded falls before `day`.
   */
  public hasOccurrenceBefore(day: PlainDate): boolean {
    return this.hasOccurrenceUntil(plainDateFromDayNumber(day.dayNumber - 1));
  }

  /**
   * Returns whether the series has an occurrence that isn't excluded.
   */
  public hasOccurrence(): boolean {
    return (this.count === Infinity && this.untilDay === null) || this.hasOccurrenceUntil(null);
  }

  /**
   * Returns whether an occurrence that isn't excluded falls on or before `to`, or at all when `to`
   * is `null`.
   */
  private hasOccurrenceUntil(to: PlainDate | null): boolean {
    let hasOccurrence = false;
    this.visitOccurrences(this.startPlainDate, to, (_day, isExcluded) => {
      hasOccurrence = !isExcluded;
      return !hasOccurrence;
    });
    return hasOccurrence;
  }

  /**
   * Visits the occurrences from the first one on or after `from` to `to` or UNTIL, in order, while
   * `visit` returns `true`. Visits the excluded occurrences too, as they count toward COUNT.
   */
  private visitOccurrences(
    from: PlainDate,
    to: PlainDate | null,
    visit: (day: PlainDate, isExcluded: boolean) => boolean,
  ): void {
    const { ruleDays, untilDay } = this;
    const last =
      to === null || (untilDay !== null && PlainDate.compare(untilDay, to) < 0) ? untilDay : to;
    const isAfterLast = (day: PlainDate) => last !== null && PlainDate.compare(day, last) > 0;
    // Stops before counting or looking up the timezone, as the next day can be millennia away.
    const first = ruleDays.getFirstFrom(from);
    if (first === null || isAfterLast(first)) {
      return;
    }

    // COUNT includes the occurrences before `from`.
    let remainingCount = this.count;
    if (remainingCount !== Infinity) {
      remainingCount -= this.countBefore(first);
    }

    for (
      let day: PlainDate | null = first;
      day !== null && remainingCount > 0;
      day = ruleDays.getNext(day)
    ) {
      if (isAfterLast(day)) {
        return;
      }
      if (!this.isSkippedDay(day)) {
        remainingCount -= 1;
        if (!visit(day, this.excludedDays.has(day.dayNumber))) {
          return;
        }
      }
    }
  }

  /**
   * Returns the number of occurrences before `date` that count toward COUNT, up to COUNT.
   */
  private countBefore(date: PlainDate): number {
    const { ruleDays } = this;
    const startDay = this.startPlainDate;
    let lastDay = startDay;
    const countDays = (isSkippedDay: (day: PlainDate) => boolean) => {
      let count = 0;
      for (
        let day = ruleDays.getFirstFrom(startDay);
        day !== null && PlainDate.compare(day, date) < 0 && count < this.count;
        day = ruleDays.getNext(day)
      ) {
        if (!isSkippedDay(day)) {
          count += 1;
          lastDay = day;
        }
      }
      return count;
    };

    // Counts the days of the rule, then looks for the days the timezone skips among the counted
    // ones only, so that an expired series doesn't look them up until `date`.
    let count: number;
    if (ruleDays.rule.freq === 'DAILY') {
      const days = date.dayNumber - startDay.dayNumber;
      count = days > 0 ? Math.min(this.count, Math.ceil(days / ruleDays.interval)) : 0;
      lastDay = plainDateFromDayNumber(startDay.dayNumber + (count - 1) * ruleDays.interval);
    } else {
      count = countDays(() => false);
    }
    if (
      count === 0 ||
      getSkippedDays(startDay, plainDateFromDayNumber(lastDay.dayNumber + 1), this.timezone)
        .size === 0
    ) {
      return count;
    }
    // The timezone skips a counted day, around a move of the date line.
    return countDays((day) => this.isSkippedDay(day));
  }

  private isSkippedDay(day: PlainDate): boolean {
    const period = Math.floor(day.dayNumber / SKIPPED_DAYS_PERIOD);
    let skippedDays = this.skippedDaysByPeriod.get(period);
    if (skippedDays === undefined) {
      skippedDays = getSkippedDays(
        plainDateFromDayNumber(period * SKIPPED_DAYS_PERIOD),
        plainDateFromDayNumber((period + 1) * SKIPPED_DAYS_PERIOD),
        this.timezone,
      );
      this.skippedDaysByPeriod.set(period, skippedDays);
    }
    return skippedDays.has(day.dayNumber);
  }
}
