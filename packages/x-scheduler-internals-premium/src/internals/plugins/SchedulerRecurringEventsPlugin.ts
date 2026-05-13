import type { TemporalSupportedObject, TemporalTimezone } from '@mui/x-scheduler-internals/base-ui-copy';
import type {
  RecurringEventPresetKey,
  RecurringEventWeekDayCode,
  SchedulerEventOccurrence,
  SchedulerEventRecurrenceRule,
  SchedulerProcessedDate,
  SchedulerProcessedEvent,
  SchedulerProcessedEventRecurrenceRule,
  SchedulerEventCreationProperties,
  SchedulerEventUpdatedProperties,
  RecurringEventUpdateScope,
} from '@mui/x-scheduler-internals/models';
import type {
  UpdateEventsParameters,
  SchedulerRecurringEventsPluginInterface,
} from '@mui/x-scheduler-internals/internals';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import {
  parseRRule,
  serializeRRule,
} from '../utils/recurring-events/rRuleString';
import { projectRRuleToTimezone } from '../utils/recurring-events/projectRRuleToTimezone';
import { getRecurringEventOccurrencesForVisibleDays } from '../utils/recurring-events/getRecurringEventOccurrencesForVisibleDays';
import { updateRecurringEvent } from '../utils/recurring-events/updateRecurringEvent';
import { createEventFromRecurringEvent } from '../utils/recurring-events/createEventFromRecurringEvent';
import { applyDataTimezoneToEventUpdate } from '../utils/recurring-events/applyDataTimezoneToEventUpdate';
import { computeMonthlyOrdinal } from '../utils/recurring-events/computeMonthlyOrdinal';
import { getWeekDayCode } from '../utils/recurring-events/internal-utils';

/**
 * Premium plugin that provides RRULE parsing, occurrence expansion,
 * and scope-aware updates for recurring events.
 *
 * Conceptually mirrors {@link SchedulerLazyLoadingPlugin}: a premium class
 * that the premium store instantiates. The plugin is stateless and gets
 * attached to `state.recurringEvents` by the base scheduler store, so
 * community code can delegate through that slot without holding a hard
 * dependency on this class. Methods are thin wrappers around the private
 * implementations co-located in this package.
 */
export class SchedulerRecurringEventsPlugin implements SchedulerRecurringEventsPluginInterface {
  public parseRRule = (
    adapter: Adapter,
    input: string | SchedulerEventRecurrenceRule,
    timezone: TemporalTimezone,
  ): SchedulerProcessedEventRecurrenceRule => parseRRule(adapter, input, timezone);

  public serializeRRule = (
    adapter: Adapter,
    rule: SchedulerProcessedEventRecurrenceRule,
  ): string => serializeRRule(adapter, rule);

  public projectRRuleToTimezone = (
    adapter: Adapter,
    rrule: SchedulerProcessedEventRecurrenceRule,
    targetTimezone: TemporalTimezone,
    seriesStartDataTimezone: TemporalSupportedObject,
  ): SchedulerProcessedEventRecurrenceRule =>
    projectRRuleToTimezone(adapter, rrule, targetTimezone, seriesStartDataTimezone);

  public getOccurrencesForVisibleDays = (
    event: SchedulerProcessedEvent,
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
    adapter: Adapter,
    displayTimezone: TemporalTimezone,
  ): SchedulerEventOccurrence[] =>
    getRecurringEventOccurrencesForVisibleDays(event, start, end, adapter, displayTimezone);

  public updateRecurringEvent = (
    adapter: Adapter,
    originalEvent: SchedulerProcessedEvent,
    occurrenceStart: TemporalSupportedObject,
    changes: SchedulerEventUpdatedProperties,
    scope: RecurringEventUpdateScope,
  ): UpdateEventsParameters =>
    updateRecurringEvent(adapter, originalEvent, occurrenceStart, changes, scope);

  public createEventFromRecurringEvent = (
    originalEvent: SchedulerProcessedEvent,
    changes: Partial<SchedulerEventCreationProperties>,
  ): SchedulerEventCreationProperties => createEventFromRecurringEvent(originalEvent, changes);

  public applyDataTimezoneToEventUpdate = (params: {
    adapter: Adapter;
    originalEvent: SchedulerProcessedEvent;
    changes: SchedulerEventUpdatedProperties;
  }): SchedulerEventUpdatedProperties => applyDataTimezoneToEventUpdate(params);

  public computePresets = (
    adapter: Adapter,
    date: SchedulerProcessedDate,
  ): Record<RecurringEventPresetKey, SchedulerProcessedEventRecurrenceRule> => ({
    DAILY: { freq: 'DAILY', interval: 1 },
    WEEKLY: { freq: 'WEEKLY', interval: 1, byDay: [getWeekDayCode(adapter, date.value)] },
    MONTHLY: { freq: 'MONTHLY', interval: 1, byMonthDay: [adapter.getDate(date.value)] },
    YEARLY: { freq: 'YEARLY', interval: 1 },
  });

  public getDefaultPresetKey = (
    adapter: Adapter,
    rule: SchedulerProcessedEventRecurrenceRule | undefined,
    occurrenceStart: SchedulerProcessedDate,
  ): RecurringEventPresetKey | 'custom' | null => {
    if (!rule) {
      return null;
    }

    const interval = rule.interval ?? 1;
    const neverEnds = !rule.count && !rule.until;
    const hasSelectors = !!(
      rule.byDay?.length ||
      rule.byMonthDay?.length ||
      rule.byMonth?.length
    );

    switch (rule.freq) {
      case 'DAILY': {
        return interval === 1 && neverEnds && !hasSelectors ? 'DAILY' : 'custom';
      }
      case 'WEEKLY': {
        const occurrenceStartWeekDayCode = getWeekDayCode(adapter, occurrenceStart.value);
        const byDay = rule.byDay ?? [];
        const matchesDefaultByDay =
          byDay.length === 0 || (byDay.length === 1 && byDay[0] === occurrenceStartWeekDayCode);
        const isPresetWeekly =
          interval === 1 &&
          neverEnds &&
          matchesDefaultByDay &&
          !(rule.byMonthDay?.length || rule.byMonth?.length);
        return isPresetWeekly ? 'WEEKLY' : 'custom';
      }
      case 'MONTHLY': {
        const day = adapter.getDate(occurrenceStart.value);
        const byMonthDay = rule.byMonthDay ?? [];
        const matchesDefaultByMonthDay =
          byMonthDay.length === 0 || (byMonthDay.length === 1 && byMonthDay[0] === day);
        const isPresetMonthly =
          interval === 1 &&
          neverEnds &&
          matchesDefaultByMonthDay &&
          !(rule.byDay?.length || rule.byMonth?.length);
        return isPresetMonthly ? 'MONTHLY' : 'custom';
      }
      case 'YEARLY': {
        return interval === 1 && neverEnds && !hasSelectors ? 'YEARLY' : 'custom';
      }
      default:
        return 'custom';
    }
  };

  public isSameRRule = (
    adapter: Adapter,
    rruleA: SchedulerProcessedEventRecurrenceRule | undefined,
    rruleB: SchedulerProcessedEventRecurrenceRule | undefined,
  ): boolean => {
    if (!rruleA && !rruleB) {
      return true;
    }
    if (!rruleA || !rruleB) {
      return false;
    }
    return serializeRRule(adapter, rruleA) === serializeRRule(adapter, rruleB);
  };

  public getWeeklyDays = (
    adapter: Adapter,
    visibleDate: TemporalSupportedObject,
  ): { code: RecurringEventWeekDayCode; date: TemporalSupportedObject }[] => {
    const start = adapter.startOfWeek(visibleDate);
    return Array.from({ length: 7 }, (_, i) => {
      const date = adapter.addDays(start, i);
      return { code: getWeekDayCode(adapter, date), date };
    });
  };

  public getMonthlyReference = (
    adapter: Adapter,
    date: SchedulerProcessedDate,
  ): {
    dayOfMonth: number;
    code: RecurringEventWeekDayCode;
    ord: number;
    date: TemporalSupportedObject;
  } => ({
    dayOfMonth: adapter.getDate(date.value),
    code: getWeekDayCode(adapter, date.value),
    ord: computeMonthlyOrdinal(adapter, date.value),
    date: date.value,
  });
}
