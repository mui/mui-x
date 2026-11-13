import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
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
import type { BaseTemporal, UpdateEventsParameters } from '@mui/x-scheduler-internals/internals';
import {
  extractStandaloneEvent,
  getOccurrenceEnd,
  moveTimestampToPlainDate,
  timestampToEventString,
  toPlainDate,
  untilToEventString,
} from '@mui/x-scheduler-internals/internals';
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
) {
  switch (scope) {
    case 'this-and-following': {
      return applyRecurringUpdateFollowing(originalEvent, occurrence, changes);
    }

    case 'all': {
      return applyRecurringUpdateAll(originalEvent, occurrence, changes);
    }

    case 'only-this': {
      return applyRecurringUpdateOnlyThis(originalEvent, occurrence, changes);
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
 * Reads `occurrenceStart` and the dates in `changes` in the event's data timezone.
 * @returns The updated list of events with the split applied.
 */
export function applyRecurringUpdateFollowing(
  originalEvent: SchedulerProcessedEvent,
  occurrence: SchedulerEventOccurrence,
  changes: SchedulerEventUpdatedProperties,
): UpdateEventsParameters {
  const occurrenceStart = occurrence.unstable_internalInfos.dataStart;
  const newStart = changes.start?.getTime() ?? occurrenceStart;

  // 1) New event: apply changes, decide RRULE for the new series
  const newRRule = decideSplitRRule(originalEvent, occurrenceStart, changes);

  const originalModel = originalEvent.modelInBuiltInFormat;
  const dataTimezone = originalModel.timezone ?? 'default';
  const stringified: Record<string, any> = { ...changes };
  // When start/end are not explicitly changed, the new series must start at the occurrence
  // date (not at DTSTART), otherwise the split series and the truncated original would overlap.
  stringified.start = timestampToEventString(newStart, originalModel.start, dataTimezone);
  const occurrenceEnd = getOccurrenceEnd({ event: originalEvent, occurrenceStart });
  const effectiveEnd = changes.end?.getTime() ?? occurrenceEnd;
  stringified.end = timestampToEventString(effectiveEnd, originalModel.end, dataTimezone);
  if (changes.exDates != null) {
    stringified.exDates = changes.exDates.map((d, i) =>
      timestampToEventString(
        d.getTime(),
        originalModel.exDates?.[i] ?? originalModel.start,
        dataTimezone,
      ),
    );
  }

  let newEventRRule: SchedulerEventRecurrenceRule | string | undefined;
  if (typeof newRRule === 'string') {
    newEventRRule = newRRule;
  } else if (newRRule != null) {
    if (newRRule.until != null) {
      newEventRRule = {
        ...newRRule,
        until: untilToEventString(newRRule.until, originalModel.start, dataTimezone),
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
    ...applyRecurringDeleteFollowing(originalEvent, occurrence),
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
 * - When only the time changes, merges the new time into the original date.
 * Reads `occurrenceStart` and the dates in `changes` in the event's data timezone.
 * @returns The updated list of events.
 */
export function applyRecurringUpdateAll(
  originalEvent: SchedulerProcessedEvent,
  occurrence: SchedulerEventOccurrence,
  changes: SchedulerEventUpdatedProperties,
): UpdateEventsParameters {
  const occurrenceStart = occurrence.unstable_internalInfos.dataStart;
  const eventUpdatedProperties: SchedulerEventUpdatedProperties = { ...changes };

  // 1) Detect if caller changed the date part of start or end (vs only time)
  const dataTimezone = originalEvent.timezone;
  const occurrenceEnd = getOccurrenceEnd({ occurrenceStart, event: originalEvent });
  const occurrencePlainDate = toPlainDate(occurrenceStart, dataTimezone);
  const touchedStartDate =
    changes.start != null &&
    !toPlainDate(changes.start.getTime(), dataTimezone).equals(occurrencePlainDate);
  const touchedEndDate =
    changes.end != null &&
    !toPlainDate(changes.end.getTime(), dataTimezone).equals(
      toPlainDate(occurrenceEnd, dataTimezone),
    );

  // 2) Is the edited occurrence the first of the series (DTSTART)?
  const seriesStartMs = originalEvent.unstable_internalInfos.dataStart;
  const seriesStartPlainDate = toPlainDate(seriesStartMs, dataTimezone);
  const editedIsDtstart = occurrencePlainDate.equals(seriesStartPlainDate);

  // 3) Decide new start/end: editing the first occurrence keeps the instants of the changes, which
  // can move DTSTART to another date. Otherwise, the series keeps its dates and takes the times of
  // the edited occurrence, where a time a DST transition repeats resolves to its first instant, or
  // for the end, to its first instant at or after the start. Only the bounds in `changes` are
  // written, so that the other one keeps its instant.
  if (!editedIsDtstart) {
    let startMs = seriesStartMs;
    if (changes.start != null) {
      startMs = moveTimestampToPlainDate(
        changes.start.getTime(),
        seriesStartPlainDate,
        dataTimezone,
      );
      eventUpdatedProperties.start = new Date(startMs);
    }
    if (changes.end != null) {
      eventUpdatedProperties.end = new Date(
        moveEndToPlainDate(
          changes.end.getTime(),
          toPlainDate(originalEvent.unstable_internalInfos.dataEnd, dataTimezone),
          startMs,
          dataTimezone,
        ),
      );
    }
  }

  // 4) RRULE adjustment: only if day changed, the event is recurring, and the user did not
  // provide an explicit rrule (same hasOwnProperty guard used in decideSplitRRule).
  const hasExplicitRRule = Object.prototype.hasOwnProperty.call(changes, 'rrule');
  if ((touchedStartDate || touchedEndDate) && originalEvent.rrule && !hasExplicitRRule) {
    const newOccurrenceStart = changes.start?.getTime() ?? occurrenceStart;
    eventUpdatedProperties.rrule = adjustRRuleForAllMove(
      originalEvent.rrule,
      occurrenceStart,
      newOccurrenceStart,
      dataTimezone,
    );
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
 * Reads `occurrenceStart` and the dates in `changes` in the event's data timezone.
 * @returns The updated list of events.
 */
export function applyRecurringUpdateOnlyThis(
  originalEvent: SchedulerProcessedEvent,
  occurrence: SchedulerEventOccurrence,
  changes: SchedulerEventUpdatedProperties,
): UpdateEventsParameters {
  const occurrenceStart = occurrence.unstable_internalInfos.dataStart;
  const originalModel = originalEvent.modelInBuiltInFormat;
  const dataTimezone = originalModel.timezone ?? 'default';
  const stringifiedChanges: Partial<SchedulerEventCreationProperties> = { ...changes };
  // default start/end to the edited occurrence so the detached event keeps its own day, not DTSTART
  const newStart = changes.start?.getTime() ?? occurrenceStart;
  stringifiedChanges.start = timestampToEventString(newStart, originalModel.start, dataTimezone);
  const occurrenceEnd = getOccurrenceEnd({ event: originalEvent, occurrenceStart });
  const newEnd = changes.end?.getTime() ?? occurrenceEnd;
  stringifiedChanges.end = timestampToEventString(newEnd, originalModel.end, dataTimezone);

  // The original series excludes the occurrence, like a deletion.
  return {
    created: [extractStandaloneEvent(originalEvent, stringifiedChanges)],
    ...applyRecurringDeleteOnlyThis(originalEvent, occurrence),
  };
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
  timezone: TemporalTimezone,
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
): SchedulerProcessedEventRecurrenceRule | string | undefined {
  const originalRule = originalEvent.rrule!;
  const dataTimezone = originalEvent.timezone;
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

  // Freq WEEKLY: realign BYDAY, swap the old weekday for the new one while preserving the rest of the weekly pattern.
  if (originalRule.freq === 'WEEKLY' && originalRule.byDay?.length && changes.start) {
    realignedRule.byDay = realignWeeklyByDay(
      originalRule.byDay as RecurringEventWeekDayCode[],
      splitStart,
      changes.start.getTime(),
      dataTimezone,
    );
  }
  // Freq MONTHLY realignment
  if (originalRule.freq === 'MONTHLY' && changes.start) {
    realignedRule = realignMonthlyRule(
      realignedRule,
      toPlainDate(changes.start.getTime(), dataTimezone),
    );
  }

  // Recalculate COUNT: original minus prior occurrences.
  if (originalRule.count) {
    // The excluded occurrences still count toward COUNT.
    const series = RecurringSeries.fromEvent(originalEvent);
    const splitPlainDate = toPlainDate(splitStart, dataTimezone);
    const remaining = originalRule.count - series.countOccurrencesBefore(splitPlainDate);
    // If no occurrences remain, the split segment is non-recurring.
    if (remaining <= 0) {
      return undefined;
    }

    realignedRule.count = remaining;
  } else if (originalRule.until) {
    realignedRule.until = originalRule.until;
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
  timezone: TemporalTimezone,
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
