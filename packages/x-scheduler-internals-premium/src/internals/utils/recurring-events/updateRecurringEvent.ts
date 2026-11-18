import type {
  RecurringEventByDayValue,
  SchedulerProcessedEventRecurrenceRule,
  RecurringEventScope,
  RecurringEventWeekDayCode,
  SchedulerEventCreationProperties,
  SchedulerEventRecurrenceRule,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
  SchedulerEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import type { UpdateEventsParameters } from '@mui/x-scheduler-internals/internals';
import {
  addDaysToDayStart,
  BaseTemporal,
  extractStandaloneEvent,
  getAllDayDayCount,
  getDayTimezone,
  getLastInstant,
  getOccurrenceEnd,
  getOccurrencePlainDate,
  getOccurrenceStart,
  getStartOfDayMs,
  moveTimestampToPlainDate,
  snapAllDayBounds,
  stringifyEventDateChanges,
  toEpochMs,
  toLocalDayNumber,
  toPlainDate,
  untilToEventString,
  getUntilReferenceString,
} from '@mui/x-scheduler-internals/internals';
import { resolveEventTimestamp } from '@mui/x-scheduler-internals/process-event';
import {
  getPlainDateWeekDayCode,
  getWeekDayCode,
  moveEndToPlainDate,
  NOT_LOCALIZED_WEEK_DAYS,
  parsesByDayForWeeklyFrequency,
} from './internal-utils';
import { computeMonthlyOrdinal } from './computeMonthlyOrdinal';
import {
  applyRecurringDeleteFollowing,
  applyRecurringDeleteOnlyThis,
} from './deleteRecurringEvent';
import { RecurringSeries } from './RecurringSeries';

export function updateRecurringEvent(
  originalEvent: SchedulerProcessedEvent,
  occurrence: SchedulerEventOccurrence,
  changes: SchedulerEventUpdatedProperties,
  scope: RecurringEventScope,
  displayTimezone: string,
) {
  switch (scope) {
    case 'this-and-following': {
      return applyRecurringUpdateFollowing(originalEvent, occurrence, changes, displayTimezone);
    }

    case 'all': {
      return applyRecurringUpdateAll(originalEvent, occurrence, changes, displayTimezone);
    }

    case 'only-this': {
      return applyRecurringUpdateOnlyThis(originalEvent, occurrence, changes, displayTimezone);
    }

    default: {
      throw new Error(
        `MUI X Scheduler: The scope "${scope}" is not supported for recurring events. ` +
          'Supported scopes are "all", "only-this", and "this-and-following". ' +
          'Use one of the supported scope values.',
      );
    }
  }
}

/**
 * Applies a "this and following" update to a recurring series by splitting it into:
 * - the original series truncated up to the day before the edited occurrence, and
 * - a new series starting at the edited occurrence with the requested changes.
 * @returns The updated list of events with the split applied.
 */
export function applyRecurringUpdateFollowing(
  originalEvent: SchedulerProcessedEvent,
  occurrence: SchedulerEventOccurrence,
  changes: SchedulerEventUpdatedProperties,
  displayTimezone: string,
): UpdateEventsParameters {
  const occurrenceStart = getOccurrenceStart(occurrence, displayTimezone);

  // 1) New event: apply changes, decide RRULE for the new series
  const newRRule = decideSplitRRule(originalEvent, occurrenceStart, changes, displayTimezone);

  const originalModel = originalEvent.modelInBuiltInFormat;
  // When start/end are not explicitly changed, the new series must start at the occurrence
  // date (not at DTSTART), otherwise the split series and the truncated original would overlap.
  const occurrenceEnd = getOccurrenceEnd({
    event: originalEvent,
    occurrenceStart,
    displayTimezone,
  });
  const shiftedExDates = getShiftedExDates(
    originalEvent,
    changes,
    getDisplayedDaysShift(originalEvent, occurrenceStart, changes, displayTimezone),
    displayTimezone,
  );
  const newChanges = shiftedExDates == null ? changes : { ...changes, exDates: shiftedExDates };
  const stringified: Record<string, any> = {
    ...newChanges,
    ...stringifyEventDateChanges(newChanges, originalModel, displayTimezone, {
      start: occurrenceStart,
      end: occurrenceEnd,
    }),
  };
  const dataTimezone = stringified.timezone ?? originalModel.timezone ?? 'default';

  let newEventRRule: SchedulerEventRecurrenceRule | string | undefined;
  if (typeof newRRule === 'string') {
    newEventRRule = newRRule;
  } else if (newRRule != null) {
    if (newRRule.until != null) {
      newEventRRule = {
        ...newRRule,
        until: untilToEventString(
          newRRule.until,
          getUntilReferenceString(originalModel),
          dataTimezone,
        ),
      };
    } else {
      const { until: unusedUntil, ...rest } = newRRule;
      newEventRRule = rest;
    }
  }

  // The store gives the new series its own id when it creates it.
  const { id: unusedId, ...newEvent } = {
    ...originalModel,
    ...stringified,
    rrule: newEventRRule,
    extractedFromId: originalModel.id,
  };

  // 2) Old series: truncated to end the day before the edited occurrence, like a deletion.
  return {
    created: [newEvent],
    ...applyRecurringDeleteFollowing(originalEvent, occurrence, displayTimezone),
  };
}

/**
 * Applies an "all events" update to a recurring series.
 *
 * Rules:
 * - If the edited occurrence is not the first, keeps the original DTSTART
 *   and adjusts the RRULE pattern (e.g. weekday swap) so all past and future
 *   events follow the new pattern.
 * - If the edited occurrence is the first of the series, updates DTSTART/DTEND directly.
 * - When only the time changes, merges the new time into the original date. An all-day series
 *   keeps its days, and takes the day count of the edited occurrence.
 * - When the edited occurrence turns all-day or timed, the whole series does, from its own first
 *   day.
 * @returns The updated list of events.
 */
export function applyRecurringUpdateAll(
  originalEvent: SchedulerProcessedEvent,
  occurrence: SchedulerEventOccurrence,
  changes: SchedulerEventUpdatedProperties,
  displayTimezone: string,
): UpdateEventsParameters {
  const occurrenceStart = getOccurrenceStart(occurrence, displayTimezone);
  const eventUpdatedProperties: SchedulerEventUpdatedProperties = { ...changes };

  // 1) Detect if caller changed the date part of start or end (vs only time)
  const originalAllDay = originalEvent.allDay ?? false;
  const allDay = changes.allDay ?? originalAllDay;
  const dayTimezone = getDayTimezone(originalEvent, displayTimezone);
  // The timezone the days of the series are read in after the update.
  const nextDayTimezone = getDayTimezone(originalEvent, displayTimezone, changes.allDay);
  const occurrenceEnd = getOccurrenceEnd({
    occurrenceStart,
    event: originalEvent,
    displayTimezone,
  });
  // Changing the representation alone moves no day: the series keeps the days of its rule, and
  // the bounds of the changes are read in the new representation.
  const occurrencePlainDate = getOccurrencePlainDate(occurrence);
  const touchedStartDate =
    changes.start != null &&
    !toPlainDate(changes.start.getTime(), nextDayTimezone).equals(occurrencePlainDate);
  const touchedEndDate =
    changes.end != null &&
    !toPlainDate(getLastInstant(changes.end.getTime(), allDay), nextDayTimezone).equals(
      toPlainDate(getLastInstant(occurrenceEnd, originalAllDay), dayTimezone),
    );

  // 2) Is the edited occurrence the first of the series (DTSTART)?
  const seriesStartMs = originalEvent.start.epochMilliseconds;
  const seriesStartPlainDate = toPlainDate(seriesStartMs, dayTimezone);
  const editedIsDtstart = occurrencePlainDate.equals(seriesStartPlainDate);
  const displayedDaysShift = getDisplayedDaysShift(
    originalEvent,
    occurrenceStart,
    changes,
    displayTimezone,
  );
  const shiftedExDates = getShiftedExDates(
    originalEvent,
    changes,
    displayedDaysShift,
    displayTimezone,
  );
  if (shiftedExDates != null) {
    eventUpdatedProperties.exDates = shiftedExDates;
  }

  // 3) Decide new start/end: editing the first occurrence keeps the instants of the changes, which
  // can move DTSTART to another date. Otherwise, the series keeps its first day and takes the
  // representation of the edited occurrence: its times or its day count. Only the bounds in
  // `changes` are written.
  // The bounds of the edited occurrence in its new representation: the ones given, or its own.
  const changedStart = changes.start?.getTime() ?? occurrenceStart;
  const changedEnd = changes.end?.getTime() ?? occurrenceEnd;
  if (originalAllDay && !allDay && (!editedIsDtstart || changes.start == null)) {
    // The times of the edited occurrence on the first day of the series, in the display timezone
    // the series moves to.
    const startMs = moveTimestampToPlainDate(changedStart, seriesStartPlainDate, nextDayTimezone);
    eventUpdatedProperties.start = new Date(startMs);
    eventUpdatedProperties.end = new Date(startMs + changedEnd - changedStart);
  } else if (!editedIsDtstart) {
    if (allDay !== originalAllDay) {
      // Whole days from the first day of the series, as many as the edited occurrence covers: in
      // the changes, or in its own timezone.
      const dayCount =
        changes.start == null && changes.end == null
          ? getSnappedDayCount(occurrenceStart, occurrenceEnd, dayTimezone)
          : getSnappedDayCount(changedStart, changedEnd, displayTimezone);
      const startMs = toEpochMs(
        shiftToDisplayedDay(seriesStartPlainDate, displayedDaysShift),
        displayTimezone,
      );
      eventUpdatedProperties.start = new Date(startMs);
      eventUpdatedProperties.end = new Date(addDaysToDayStart(startMs, dayCount, displayTimezone));
    } else if (allDay) {
      // The days of the series stay: only its day count follows the edited occurrence.
      delete eventUpdatedProperties.start;
      delete eventUpdatedProperties.end;
      if (changes.start != null || changes.end != null) {
        const dayCount = getSnappedDayCount(changedStart, changedEnd, displayTimezone);
        if (dayCount !== getAllDayDayCount(originalEvent)) {
          eventUpdatedProperties.end = new Date(
            addDaysToDayStart(seriesStartMs, dayCount, displayTimezone),
          );
        }
      }
    } else {
      let startMs = seriesStartMs;
      if (changes.start != null) {
        startMs = moveTimestampToPlainDate(
          changes.start.getTime(),
          seriesStartPlainDate,
          dayTimezone,
        );
        eventUpdatedProperties.start = new Date(startMs);
      }
      if (changes.end != null) {
        eventUpdatedProperties.end = new Date(
          moveEndToPlainDate(
            changes.end.getTime(),
            toPlainDate(originalEvent.end.epochMilliseconds, dayTimezone),
            startMs,
            dayTimezone,
          ),
        );
      }
    }
  }

  // 4) RRULE adjustment: only if day changed, the event is recurring, and the user did not
  // provide an explicit rrule (same hasOwnProperty guard used in decideSplitRRule).
  const hasExplicitRRule = Object.prototype.hasOwnProperty.call(changes, 'rrule');
  if (originalEvent.rrule && !hasExplicitRRule) {
    let rrule = originalEvent.rrule;
    if (touchedStartDate || touchedEndDate) {
      // The days of the edited occurrence and of the destination, in the new representation.
      const nextOccurrenceStart = toEpochMs(occurrencePlainDate, nextDayTimezone);
      const newOccurrenceStart =
        changes.start == null
          ? nextOccurrenceStart
          : getStartOfDayMs(changes.start.getTime(), nextDayTimezone);
      rrule = adjustRRuleForAllMove(
        rrule,
        nextOccurrenceStart,
        newOccurrenceStart,
        nextDayTimezone,
      );
    }
    rrule = shiftUntilToDisplayedDay(rrule, displayedDaysShift);
    if (rrule !== originalEvent.rrule) {
      eventUpdatedProperties.rrule = rrule;
    }
  }

  // 5) Return the updated event
  return {
    updated: [eventUpdatedProperties],
  };
}

/**
 * Applies a "only-this" update to a recurring series by:
 *  - creating a detached one-off event with the requested changes, and
 *  - adding an EXDATE to the original event to exclude the occurrence from the series.
 * @returns The updated list of events.
 */
export function applyRecurringUpdateOnlyThis(
  originalEvent: SchedulerProcessedEvent,
  occurrence: SchedulerEventOccurrence,
  changes: SchedulerEventUpdatedProperties,
  displayTimezone: string,
): UpdateEventsParameters {
  const occurrenceStart = getOccurrenceStart(occurrence, displayTimezone);
  // default start/end to the edited occurrence so the detached event keeps its own day, not DTSTART
  const occurrenceEnd = getOccurrenceEnd({
    event: originalEvent,
    occurrenceStart,
    displayTimezone,
  });
  const stringifiedChanges: Partial<SchedulerEventCreationProperties> = {
    ...changes,
    ...stringifyEventDateChanges(changes, originalEvent.modelInBuiltInFormat, displayTimezone, {
      start: occurrenceStart,
      end: occurrenceEnd,
    }),
  };

  // The original series excludes the occurrence, like a deletion.
  return {
    created: [extractStandaloneEvent(originalEvent, stringifiedChanges)],
    ...applyRecurringDeleteOnlyThis(originalEvent, occurrence, displayTimezone),
  };
}

interface DisplayedDaysShift {
  days: number;
  /**
   * On a weekly rule, the weekday whose dates move, like its BYDAY.
   */
  weekDay: RecurringEventWeekDayCode | null;
}

/**
 * How many days the dates of a timed series move when it's made all-day on a given day: from the
 * days of its timezone to the days it's displayed on, measured on the edited occurrence.
 * Without a day given, the series keeps the days of its timezone.
 */
function getDisplayedDaysShift(
  originalEvent: SchedulerProcessedEvent,
  occurrenceStart: number,
  changes: Partial<SchedulerEventUpdatedProperties>,
  displayTimezone: string,
): DisplayedDaysShift | null {
  if (originalEvent.allDay || !changes.allDay || (changes.start == null && changes.end == null)) {
    return null;
  }
  const timezone = getDayTimezone(originalEvent, displayTimezone);
  const days =
    toLocalDayNumber(occurrenceStart, displayTimezone) -
    toLocalDayNumber(occurrenceStart, timezone);
  if (days === 0) {
    return null;
  }
  return {
    days,
    weekDay:
      originalEvent.rrule?.freq === 'WEEKLY' ? getWeekDayCode(occurrenceStart, timezone) : null,
  };
}

function shiftToDisplayedDay(
  day: BaseTemporal.PlainDate,
  shift: DisplayedDaysShift | null,
): BaseTemporal.PlainDate {
  if (shift == null || (shift.weekDay != null && getPlainDateWeekDayCode(day) !== shift.weekDay)) {
    return day;
  }
  return day.add({ days: shift.days });
}

/**
 * The rule of a timed series made all-day on a given day, with its last day on its displayed day.
 */
function shiftUntilToDisplayedDay(
  rrule: SchedulerProcessedEventRecurrenceRule,
  shift: DisplayedDaysShift | null,
): SchedulerProcessedEventRecurrenceRule {
  if (shift == null || rrule.until == null) {
    return rrule;
  }
  const untilDay =
    rrule.until instanceof BaseTemporal.PlainDateTime ? rrule.until.toPlainDate() : rrule.until;
  const shiftedUntilDay = shiftToDisplayedDay(untilDay, shift);
  return shiftedUntilDay.equals(untilDay) ? rrule : { ...rrule, until: shiftedUntilDay };
}

/**
 * The exception dates of a timed series made all-day on a given day, on their displayed days.
 */
function getShiftedExDates(
  originalEvent: SchedulerProcessedEvent,
  changes: SchedulerEventUpdatedProperties,
  shift: DisplayedDaysShift | null,
  displayTimezone: string,
): Date[] | undefined {
  const { exDates, timezone = 'default' } = originalEvent.modelInBuiltInFormat;
  if (shift == null || exDates == null || changes.exDates != null) {
    return undefined;
  }
  return exDates.map((exDate) => {
    const day = toPlainDate(resolveEventTimestamp(exDate, timezone), timezone);
    return new Date(toEpochMs(shiftToDisplayedDay(day, shift), displayTimezone));
  });
}

/**
 * The number of whole days the bounds cover once snapped to the days of `timezone`.
 */
function getSnappedDayCount(start: number, end: number, timezone: string): number {
  const bounds = snapAllDayBounds(start, end, timezone);
  return toLocalDayNumber(bounds.end, timezone) - toLocalDayNumber(bounds.start, timezone);
}

/**
 * Adjusts a recurring event's RRULE when applying an "all" update that changes the weekday.
 *
 * Rules:
 * - WEEKLY: realign BYDAY by swapping the weekday of the edited occurrence
 *   with the weekday of the destination.
 * - MONTHLY:
 *   - If BYMONTHDAY is used → set it to the new start date's day of month.
 *   - If BYDAY (ordinal) is used → recompute the ordinal (e.g. 2TU → 3WE) based on the new start.
 * @returns The adjusted RRULE object, or the original rrule if no change is needed.
 */
export function adjustRRuleForAllMove(
  rrule: SchedulerProcessedEventRecurrenceRule,
  occurrenceStart: number,
  newStart: number,
  timezone: string,
): SchedulerProcessedEventRecurrenceRule {
  const nextRRule: SchedulerProcessedEventRecurrenceRule = { ...rrule };

  if (rrule.freq === 'WEEKLY') {
    const normalized = parsesByDayForWeeklyFrequency(rrule.byDay) ?? [
      getWeekDayCode(occurrenceStart, timezone),
    ];
    nextRRule.byDay = realignWeeklyByDay(normalized, occurrenceStart, newStart, timezone);
  } else if (rrule.freq === 'MONTHLY') {
    return realignMonthlyRule(rrule, toPlainDate(newStart, timezone));
  }

  return nextRRule;
}

/**
 * Realigns a MONTHLY rule on a new start: BYMONTHDAY moves to its day of the month, and an ordinal
 * BYDAY to its weekday and its ordinal (e.g. 2TU → 3WE).
 */
function realignMonthlyRule(
  rule: SchedulerProcessedEventRecurrenceRule,
  newStartPlainDate: BaseTemporal.PlainDate,
): SchedulerProcessedEventRecurrenceRule {
  const realignedRule: SchedulerProcessedEventRecurrenceRule = { ...rule };
  if (rule.byMonthDay?.length) {
    realignedRule.byMonthDay = [newStartPlainDate.day];
  }
  if (rule.byDay?.length) {
    const ord = computeMonthlyOrdinal(newStartPlainDate);
    const code = getPlainDateWeekDayCode(newStartPlainDate);
    realignedRule.byDay = [`${ord}${code}` as RecurringEventByDayValue];
  }
  return realignedRule;
}

/**
 * Decides the RRULE for the split (new) segment when editing "this and following".
 *
 * Rules:
 * - If user provided changes.rrule → use it as-is (preserve COUNT/UNTIL).
 * - If changes.rrule is explicitly undefined → non-recurring one-off.
 * - If changes.rrule is omitted → inherit pattern and recompute boundaries:
 *   * WEEKLY: if `changes.start` is provided, realign BYDAY by swapping the weekday of the
 *     edited occurrence with the weekday of the new start (dedupe if needed).
 *   * MONTHLY:
 *       - If BYMONTHDAY is present: set it to the day of `changes.start`.
 *       - If BYDAY (ordinal) is present: recompute `{ord}{code}` using `computeMonthlyOrdinal`
 *         and the weekday of `changes.start`.
 *   * Boundaries:
 *       - If original had COUNT: set COUNT = remaining occurrences from the split day.
 *       - If original had UNTIL: keep the same UNTIL.
 */
export function decideSplitRRule(
  originalEvent: SchedulerProcessedEvent,
  splitStart: number,
  changes: Partial<SchedulerEventUpdatedProperties>,
  displayTimezone: string,
): SchedulerProcessedEventRecurrenceRule | string | undefined {
  const originalRule = originalEvent.rrule!;
  const dayTimezone = getDayTimezone(originalEvent, displayTimezone);
  // The timezone the days of the new series are read in.
  const nextDayTimezone = getDayTimezone(originalEvent, displayTimezone, changes.allDay);
  // Detect whether user touched rrule at all
  const hasRRuleProp = Object.prototype.hasOwnProperty.call(changes, 'rrule');
  const changesRRule = changes.rrule;

  // Case A — user provided a new RRULE → respect it (including COUNT/UNTIL)
  if (hasRRuleProp && changesRRule) {
    return changesRRule;
  }

  // Case B — user explicitly removed recurrence → one-off
  if (hasRRuleProp && !changesRRule) {
    return undefined;
  }

  // Case C — user did not touch RRULE → inherit pattern and recompute boundaries
  let realignedRule: SchedulerProcessedEventRecurrenceRule = { ...originalRule };

  // Changing the representation alone moves no day: the new series keeps the days of the rule.
  const splitPlainDate = toPlainDate(splitStart, dayTimezone);

  // Freq WEEKLY: realign BYDAY, swap the old weekday for the new one while preserving the rest of the weekly pattern.
  if (originalRule.freq === 'WEEKLY' && realignedRule.byDay?.length && changes.start) {
    realignedRule.byDay = realignWeeklyByDay(
      realignedRule.byDay as RecurringEventWeekDayCode[],
      toEpochMs(splitPlainDate, nextDayTimezone),
      changes.start.getTime(),
      nextDayTimezone,
    );
  }
  // Freq MONTHLY realignment
  if (originalRule.freq === 'MONTHLY' && changes.start) {
    realignedRule = realignMonthlyRule(
      realignedRule,
      toPlainDate(changes.start.getTime(), nextDayTimezone),
    );
  }

  realignedRule = shiftUntilToDisplayedDay(
    realignedRule,
    getDisplayedDaysShift(originalEvent, splitStart, changes, displayTimezone),
  );

  // Recalculate COUNT: original minus prior occurrences.
  if (originalRule.count) {
    // The excluded occurrences still count toward COUNT.
    const series = RecurringSeries.fromEvent(originalEvent, displayTimezone);
    const remaining = originalRule.count - series.countOccurrencesBefore(splitPlainDate);
    // If no occurrences remain, the split segment is non-recurring.
    if (remaining <= 0) {
      return undefined;
    }

    realignedRule.count = remaining;
  }

  return realignedRule;
}

/**
 * Realigns a WEEKLY BYDAY pattern when splitting “this and following”.
 * Swaps the weekday of the edited occurrence (oldRefDay) with the weekday of the new
 * series start (newStart), preserving the rest of the pattern and avoiding duplicates.
 * @returns {RecurringEventByDayValue[]} - The realigned BYDAY list (deduplicated).
 */
export function realignWeeklyByDay(
  weekDayCodes: RecurringEventWeekDayCode[],
  oldRefDay: number,
  newStart: number,
  timezone: string,
): RecurringEventWeekDayCode[] {
  const oldCode = getWeekDayCode(oldRefDay, timezone);
  const newCode = getWeekDayCode(newStart, timezone);

  if (oldCode === newCode) {
    return weekDayCodes;
  }

  const weekDayCodesSet = new Set(weekDayCodes);

  // Iterate in canonical RFC 5545 order (MO → SU), independent of locale.
  // NOT_LOCALIZED_WEEK_DAYS is already in canonical order, so no offset is needed.
  const newWeekDayCodes: RecurringEventWeekDayCode[] = [];
  for (let i = 0; i < NOT_LOCALIZED_WEEK_DAYS.length; i += 1) {
    const code = NOT_LOCALIZED_WEEK_DAYS[i];

    let shouldAddCode: boolean;
    // Only add the newCode if the oldCode was present
    if (code === newCode && weekDayCodesSet.has(oldCode)) {
      shouldAddCode = true;
    }
    // Only add other codes if they were present originally and are not the oldCode
    else if (weekDayCodesSet.has(code) && code !== oldCode) {
      shouldAddCode = true;
    } else {
      shouldAddCode = false;
    }

    if (shouldAddCode) {
      newWeekDayCodes.push(code);
    }
  }

  return newWeekDayCodes;
}
