import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type {
  RecurringEventByDayValue,
  SchedulerProcessedEventRecurrenceRule,
  RecurringEventScope,
  RecurringEventWeekDayCode,
  SchedulerEventCreationProperties,
  SchedulerEventRecurrenceRule,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import type { BaseTemporal, UpdateEventsParameters } from '@mui/x-scheduler-internals/internals';
import {
  buildTemporalPlainDate,
  extractStandaloneEvent,
  dateToEventString,
  getOccurrenceEnd,
  moveToPlainDate,
  toPlainDate,
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
  adapter: Adapter,
  originalEvent: SchedulerProcessedEvent,
  occurrenceStart: TemporalSupportedObject,
  changes: SchedulerEventUpdatedProperties,
  scope: RecurringEventScope,
) {
  switch (scope) {
    case 'this-and-following': {
      return applyRecurringUpdateFollowing(adapter, originalEvent, occurrenceStart, changes);
    }

    case 'all': {
      return applyRecurringUpdateAll(adapter, originalEvent, occurrenceStart, changes);
    }

    case 'only-this': {
      return applyRecurringUpdateOnlyThis(adapter, originalEvent, occurrenceStart, changes);
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
  adapter: Adapter,
  originalEvent: SchedulerProcessedEvent,
  occurrenceStart: TemporalSupportedObject,
  changes: SchedulerEventUpdatedProperties,
): UpdateEventsParameters {
  const newStart = changes.start ?? occurrenceStart;

  // 1) New event: apply changes, decide RRULE for the new series
  const newRRule = decideSplitRRule(adapter, originalEvent, occurrenceStart, changes);

  const originalModel = originalEvent.modelInBuiltInFormat;
  const dataTimezone = originalModel.timezone ?? 'default';
  const stringified: Record<string, any> = { ...changes };
  // When start/end are not explicitly changed, the new series must start at the occurrence
  // date (not at DTSTART), otherwise the split series and the truncated original would overlap.
  stringified.start = dateToEventString(adapter, newStart, originalModel.start, dataTimezone);
  const occurrenceEnd = getOccurrenceEnd({ adapter, event: originalEvent, occurrenceStart });
  const effectiveEnd = changes.end ?? occurrenceEnd;
  stringified.end = dateToEventString(adapter, effectiveEnd, originalModel.end, dataTimezone);
  if (changes.exDates != null) {
    stringified.exDates = changes.exDates.map((d, i) => {
      const originalExDate = originalModel.exDates?.[i];
      if (originalExDate) {
        return dateToEventString(adapter, d, originalExDate, dataTimezone);
      }
      return dateToEventString(adapter, d, originalModel.start, dataTimezone);
    });
  }

  let newEventRRule: SchedulerEventRecurrenceRule | string | undefined;
  if (typeof newRRule === 'string') {
    newEventRRule = newRRule;
  } else if (newRRule != null) {
    if (newRRule.until != null) {
      newEventRRule = {
        ...newRRule,
        until: dateToEventString(adapter, newRRule.until, originalModel.start, dataTimezone),
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
    ...applyRecurringDeleteFollowing(adapter, originalEvent, occurrenceStart),
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
  adapter: Adapter,
  originalEvent: SchedulerProcessedEvent,
  occurrenceStart: TemporalSupportedObject,
  changes: SchedulerEventUpdatedProperties,
): UpdateEventsParameters {
  const eventUpdatedProperties: SchedulerEventUpdatedProperties = { ...changes };

  // 1) Detect if caller changed the date part of start or end (vs only time)
  const dataTimezone = originalEvent.dataTimezone.timezone;
  const occurrenceEnd = getOccurrenceEnd({ adapter, occurrenceStart, event: originalEvent });
  const occurrencePlainDate = buildTemporalPlainDate(adapter, occurrenceStart, dataTimezone);
  const touchedStartDate =
    changes.start != null &&
    !buildTemporalPlainDate(adapter, changes.start, dataTimezone).equals(occurrencePlainDate);
  const touchedEndDate =
    changes.end != null &&
    !buildTemporalPlainDate(adapter, changes.end, dataTimezone).equals(
      buildTemporalPlainDate(adapter, occurrenceEnd, dataTimezone),
    );

  // 2) Is the edited occurrence the first of the series (DTSTART)?
  const seriesStart = originalEvent.dataTimezone.start;
  const seriesStartPlainDate = toPlainDate(seriesStart.timestamp, dataTimezone);
  const editedIsDtstart = occurrencePlainDate.equals(seriesStartPlainDate);

  // 3) Decide new start/end: editing the first occurrence keeps the instants of the changes, which
  // can move DTSTART to another date. Otherwise, the series keeps its dates and takes the times of
  // the edited occurrence, where a time a DST transition repeats resolves to its first instant, or
  // for the end, to its first instant at or after the start. Only the bounds in `changes` are
  // written, so that the other one keeps its instant.
  if (!editedIsDtstart) {
    if (changes.start != null) {
      eventUpdatedProperties.start = moveToPlainDate(
        adapter,
        changes.start,
        seriesStartPlainDate,
        dataTimezone,
      );
    }
    if (changes.end != null) {
      eventUpdatedProperties.end = moveEndToPlainDate(
        adapter,
        changes.end,
        toPlainDate(originalEvent.dataTimezone.end.timestamp, dataTimezone),
        eventUpdatedProperties.start == null
          ? seriesStart.timestamp
          : adapter.getTime(eventUpdatedProperties.start),
        dataTimezone,
      );
    }
  }

  // 4) RRULE adjustment: only if day changed, the event is recurring, and the user did not
  // provide an explicit rrule (same hasOwnProperty guard used in decideSplitRRule).
  const hasExplicitRRule = Object.prototype.hasOwnProperty.call(changes, 'rrule');
  if (
    (touchedStartDate || touchedEndDate) &&
    originalEvent.dataTimezone.rrule &&
    !hasExplicitRRule
  ) {
    const newOccurrenceStart = changes.start ?? occurrenceStart;
    eventUpdatedProperties.rrule = adjustRRuleForAllMove(
      adapter,
      originalEvent.dataTimezone.rrule,
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
  adapter: Adapter,
  originalEvent: SchedulerProcessedEvent,
  occurrenceStart: TemporalSupportedObject,
  changes: SchedulerEventUpdatedProperties,
): UpdateEventsParameters {
  const originalModel = originalEvent.modelInBuiltInFormat;
  const dataTimezone = originalModel.timezone ?? 'default';
  const stringifiedChanges: Partial<SchedulerEventCreationProperties> = { ...changes };
  // default start/end to the edited occurrence so the detached event keeps its own day, not DTSTART
  const newStart = changes.start ?? occurrenceStart;
  stringifiedChanges.start = dateToEventString(
    adapter,
    newStart,
    originalModel.start,
    dataTimezone,
  );
  const occurrenceEnd = getOccurrenceEnd({ adapter, event: originalEvent, occurrenceStart });
  const newEnd = changes.end ?? occurrenceEnd;
  stringifiedChanges.end = dateToEventString(adapter, newEnd, originalModel.end, dataTimezone);

  // The original series excludes the occurrence, like a deletion.
  return {
    created: [extractStandaloneEvent(originalEvent, stringifiedChanges)],
    ...applyRecurringDeleteOnlyThis(adapter, originalEvent, occurrenceStart),
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
  adapter: Adapter,
  rrule: SchedulerProcessedEventRecurrenceRule,
  occurrenceStart: TemporalSupportedObject,
  newStart: TemporalSupportedObject,
  timezone: TemporalTimezone,
): SchedulerProcessedEventRecurrenceRule {
  const nextRRule: SchedulerProcessedEventRecurrenceRule = { ...rrule };

  if (rrule.freq === 'WEEKLY') {
    const normalized = parsesByDayForWeeklyFrequency(rrule.byDay) ?? [
      getWeekDayCode(adapter, occurrenceStart, timezone),
    ];
    nextRRule.byDay = realignWeeklyByDay(adapter, normalized, occurrenceStart, newStart, timezone);
  } else if (rrule.freq === 'MONTHLY') {
    return realignMonthlyRule(rrule, buildTemporalPlainDate(adapter, newStart, timezone));
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
  adapter: Adapter,
  originalEvent: SchedulerProcessedEvent,
  splitStart: TemporalSupportedObject,
  changes: Partial<SchedulerEventUpdatedProperties>,
): SchedulerProcessedEventRecurrenceRule | string | undefined {
  const originalRule = originalEvent.dataTimezone.rrule!;
  const dataTimezone = originalEvent.dataTimezone.timezone;
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
      adapter,
      originalRule.byDay as RecurringEventWeekDayCode[],
      splitStart,
      changes.start,
      dataTimezone,
    );
  }
  // Freq MONTHLY realignment
  if (originalRule.freq === 'MONTHLY' && changes.start) {
    realignedRule = realignMonthlyRule(
      realignedRule,
      buildTemporalPlainDate(adapter, changes.start, dataTimezone),
    );
  }

  // Recalculate COUNT: original minus prior occurrences.
  if (originalRule.count) {
    // The excluded occurrences still count toward COUNT.
    const series = RecurringSeries.fromEvent(adapter, originalEvent);
    const splitPlainDate = buildTemporalPlainDate(adapter, splitStart, dataTimezone);
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
  adapter: Adapter,
  weekDayCodes: RecurringEventWeekDayCode[],
  oldRefDay: TemporalSupportedObject,
  newStart: TemporalSupportedObject,
  timezone: TemporalTimezone,
): RecurringEventWeekDayCode[] {
  const oldCode = getWeekDayCode(adapter, oldRefDay, timezone);
  const newCode = getWeekDayCode(adapter, newStart, timezone);

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
