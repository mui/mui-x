import { Adapter } from '../../../use-adapter';
import {
  RecurringEventByDayValue,
  SchedulerProcessedEventRecurrenceRule,
  RecurringEventUpdateScope,
  RecurringEventWeekDayCode,
  SchedulerEvent,
  SchedulerEventCreationProperties,
  SchedulerEventRecurrenceRule,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
  TemporalSupportedObject,
} from '../../../models';
import type { UpdateEventsParameters } from '../SchedulerStore';
import { dateToEventString, getDateKey, getOccurrenceEnd, mergeDateAndTime } from '../date-utils';
import {
  getRemainingOccurrences,
  getWeekDayCode,
  NOT_LOCALIZED_WEEK_DAYS,
  parsesByDayForWeeklyFrequency,
} from './internal-utils';
import { createEventFromRecurringEvent } from './createEventFromRecurringEvent';
import { computeMonthlyOrdinal } from './computeMonthlyOrdinal';

/**
 * Generates the update to apply in order to update a recurring event according to the given `scope`.
 */
export function updateRecurringEvent(
  adapter: Adapter,
  originalEvent: SchedulerProcessedEvent,
  occurrenceStart: TemporalSupportedObject,
  changes: SchedulerEventUpdatedProperties,
  scope: RecurringEventUpdateScope,
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
      throw new Error(`MUI: scope="${scope}" is not supported.`);
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
  adapter: Adapter,
  originalEvent: SchedulerProcessedEvent,
  occurrenceStart: TemporalSupportedObject,
  changes: SchedulerEventUpdatedProperties,
): UpdateEventsParameters {
  const newStart = changes.start ?? occurrenceStart;

  // 1) Old series: truncate rule to end the day before the edited occurrence
  const occurrenceDayStart = adapter.startOfDay(occurrenceStart);
  const untilDate = adapter.addDays(occurrenceDayStart, -1);

  const originalRule = originalEvent.dataTimezone.rrule!;
  const { count, until, ...baseRule } = originalRule;

  // 2) New event: apply changes, decide RRULE for the new series
  const newRRule = decideSplitRRule(
    adapter,
    originalRule,
    originalEvent.dataTimezone.start.value,
    occurrenceStart,
    changes,
  );
  const newEventId = `${originalEvent.id}::${getDateKey(newStart, adapter)}`;

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

  let newEventRRule: SchedulerEventRecurrenceRule | undefined;
  if (newRRule != null) {
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

  const newEvent: SchedulerEvent = {
    ...originalEvent.modelInBuiltInFormat,
    ...stringified,
    id: newEventId,
    rrule: newEventRRule,
    extractedFromId: originalEvent.modelInBuiltInFormat.id,
  };

  // 3) If UNTIL falls before DTSTART, the original series has no remaining occurrences -> drop it, otherwise truncate it.
  const shouldDropOldSeries = adapter.isBefore(
    adapter.endOfDay(untilDate),
    adapter.startOfDay(originalEvent.dataTimezone.start.value),
  );

  if (shouldDropOldSeries) {
    return { created: [newEvent], deleted: [originalEvent.id] };
  }

  return {
    created: [newEvent],
    updated: [{ id: originalEvent.id, rrule: { ...baseRule, until: untilDate } }],
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
  const occurrenceEnd = getOccurrenceEnd({ adapter, occurrenceStart, event: originalEvent });
  const touchedStartDate =
    changes.start != null && !adapter.isSameDay(occurrenceStart, changes.start);
  const touchedEndDate = changes.end != null && !adapter.isSameDay(occurrenceEnd, changes.end);

  // 2) Is the edited occurrence the first of the series (DTSTART)?
  const editedIsDtstart = adapter.isSameDay(
    occurrenceStart,
    originalEvent.dataTimezone.start.value,
  );

  // 3) Decide new start/end
  if (changes.start != null) {
    if (touchedStartDate) {
      // Date changed
      if (editedIsDtstart) {
        // First occurrence: allow moving DTSTART date
        eventUpdatedProperties.start = changes.start;
      } else {
        // Not first: keep original DTSTART date, merge only time
        eventUpdatedProperties.start = mergeDateAndTime(
          adapter,
          originalEvent.dataTimezone.start.value,
          changes.start,
        );
      }
    } else {
      // Same day -> merge time into original date
      eventUpdatedProperties.start = mergeDateAndTime(
        adapter,
        originalEvent.dataTimezone.start.value,
        changes.start,
      );
    }
  }

  if (changes.end != null) {
    if (touchedEndDate) {
      if (editedIsDtstart) {
        eventUpdatedProperties.end = changes.end;
      } else {
        eventUpdatedProperties.end = mergeDateAndTime(
          adapter,
          originalEvent.dataTimezone.end.value,
          changes.end,
        );
      }
    } else {
      eventUpdatedProperties.end = mergeDateAndTime(
        adapter,
        originalEvent.dataTimezone.end.value,
        changes.end,
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
  if (changes.start != null) {
    stringifiedChanges.start = dateToEventString(
      adapter,
      changes.start,
      originalModel.start,
      dataTimezone,
    );
  }
  if (changes.end != null) {
    stringifiedChanges.end = dateToEventString(
      adapter,
      changes.end,
      originalModel.end,
      dataTimezone,
    );
  }

  return {
    created: [createEventFromRecurringEvent(originalEvent, stringifiedChanges)],
    updated: [
      {
        id: originalEvent.id,
        exDates: [
          ...(originalEvent.dataTimezone.exDates ?? []),
          adapter.startOfDay(occurrenceStart),
        ],
      },
    ],
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
): SchedulerProcessedEventRecurrenceRule {
  const nextRRule: SchedulerProcessedEventRecurrenceRule = { ...rrule };

  if (rrule.freq === 'WEEKLY') {
    const normalized = parsesByDayForWeeklyFrequency(rrule.byDay) ?? [
      getWeekDayCode(adapter, occurrenceStart),
    ];
    nextRRule.byDay = realignWeeklyByDay(adapter, normalized, occurrenceStart, newStart);
  } else if (rrule.freq === 'MONTHLY') {
    // BYMONTHDAY → match the new calendar day
    if (rrule.byMonthDay?.length) {
      nextRRule.byMonthDay = [adapter.getDate(newStart)];
    }
    // Ordinal BYDAY → recompute ordinal + weekday for newStart
    if (rrule.byDay?.length) {
      const code = getWeekDayCode(adapter, newStart);
      const ord = computeMonthlyOrdinal(adapter, newStart);
      nextRRule.byDay = [`${ord}${code}` as RecurringEventByDayValue];
    }
  }

  return nextRRule;
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
  originalRule: SchedulerProcessedEventRecurrenceRule,
  originalSeriesStart: TemporalSupportedObject,
  splitStart: TemporalSupportedObject,
  changes: Partial<SchedulerEventUpdatedProperties>,
): SchedulerProcessedEventRecurrenceRule | undefined {
  // Detect whether user touched rrule at all
  const hasRRuleProp = Object.prototype.hasOwnProperty.call(changes, 'rrule');
  const changesRRule = changes.rrule;

  // Case A — user provided a new RRULE → respect it (including COUNT/UNTIL)
  if (hasRRuleProp && changesRRule) {
    return changesRRule as SchedulerProcessedEventRecurrenceRule;
  }

  // Case B — user explicitly removed recurrence → one-off
  if (hasRRuleProp && !changesRRule) {
    return undefined;
  }

  // Case C — user did not touch RRULE → inherit pattern and recompute boundaries
  const realignedRule: SchedulerProcessedEventRecurrenceRule = { ...originalRule };

  // Freq WEEKLY: realign BYDAY, swap the old weekday for the new one while preserving the rest of the weekly pattern.
  if (originalRule.freq === 'WEEKLY' && originalRule.byDay?.length && changes.start) {
    realignedRule.byDay = realignWeeklyByDay(
      adapter,
      originalRule.byDay as RecurringEventWeekDayCode[],
      adapter.startOfDay(splitStart),
      changes.start,
    );
  }
  // Freq MONTHLY realignment
  if (originalRule.freq === 'MONTHLY' && changes.start) {
    // A) BYMONTHDAY → set to the new calendar day
    if (originalRule.byMonthDay?.length) {
      realignedRule.byMonthDay = [adapter.getDate(changes.start)];
    }

    // B) Ordinal BYDAY → recompute ordinal + weekday for the new date
    if (originalRule.byDay?.length) {
      const code = getWeekDayCode(adapter, changes.start);
      const ord = computeMonthlyOrdinal(adapter, changes.start);
      realignedRule.byDay = [`${ord}${code}` as RecurringEventByDayValue];
    }
  }

  // Recalculate COUNT: original minus prior occurrences.
  if (originalRule.count) {
    const dayBefore = adapter.addDays(adapter.startOfDay(splitStart), -1);
    const remaining = getRemainingOccurrences(
      adapter,
      originalRule,
      originalSeriesStart,
      dayBefore,
      originalRule.count,
    );
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
): RecurringEventWeekDayCode[] {
  const oldCode = getWeekDayCode(adapter, oldRefDay);
  const newCode = getWeekDayCode(adapter, newStart);

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
