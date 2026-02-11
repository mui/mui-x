import {
  SchedulerResourceId,
  RecurringEventPresetKey,
  RecurringEventRecurrenceRule,
  TemporalSupportedObject,
} from '@mui/x-scheduler-headless/models';
import {
  SchedulerEvent,
  SchedulerEventCreationProperties,
  SchedulerEventId,
  SchedulerEventOccurrence,
  SchedulerEventSide,
} from '@mui/x-scheduler-headless/models/event';
import { processEvent } from '@mui/x-scheduler-headless/process-event';
import { getWeekDayCode } from '@mui/x-scheduler-headless/internals/utils/recurring-events';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';
import { TemporalTimezone } from '@mui/x-scheduler-headless/base-ui-copy/types';
import { adapter as defaultAdapter } from './adapters';

export const DEFAULT_TESTING_VISIBLE_DATE_STR = '2025-07-03T00:00:00Z';
export const DEFAULT_TESTING_VISIBLE_DATE = defaultAdapter.date(
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  'default',
);

/**
 * Minimal event builder for tests.
 *
 * Scope:
 * - Builds a valid SchedulerEvent.
 * - Uses the provided (or default) adapter for all date ops.
 * - Can optionally derive a SchedulerEventOccurrence via .buildOccurrence().
 */
export class EventBuilder {
  protected event: SchedulerEvent;

  protected displayTimezone: TemporalTimezone = 'default';

  protected constructor(protected adapter: Adapter) {
    const id = crypto.randomUUID();
    const start = DEFAULT_TESTING_VISIBLE_DATE;
    const end = this.adapter.addMinutes(start, 60);

    this.event = {
      id,
      title: `Event ${id}`,
      start,
      end,
      description: `Event ${id} description`,
    };
  }

  /**
   * Create a new builder with a given adapter (defaults to the shared test adapter).
   */
  static new(adapter: Adapter = defaultAdapter) {
    return new EventBuilder(adapter);
  }

  // ─────────────────────────────────────────────
  // Field setters (pure)
  // ─────────────────────────────────────────────

  /** Set a custom id. */
  id(id: SchedulerEventId) {
    this.event.id = id;
    return this;
  }

  /** Set the title. */
  title(title: string) {
    this.event.title = title;
    return this;
  }

  /** Set a description. */
  description(description?: string) {
    this.event.description = description;
    return this;
  }

  /** Associate a resource id. */
  resource(resourceId?: SchedulerResourceId) {
    this.event.resource = resourceId;
    return this;
  }

  /** Mark as all-day (defaults to true when called). */
  allDay(v = true) {
    this.event.allDay = v;
    return this;
  }

  /** Mark as read-only (defaults to true when called). */
  readOnly(v = true) {
    this.event.readOnly = v;
    return this;
  }

  /** Set exception dates for recurrence. */
  exDates(dates?: string[]) {
    dates?.forEach((date) => {
      if (!date.endsWith('Z')) {
        throw new Error('EventBuilder only supports instant-based ISO strings (must include Z)');
      }
    });

    this.event.exDates = dates?.map((date) => this.adapter.date(date, 'default'));
    return this;
  }

  /** Set an RRULE */
  rrule(rule?: RecurringEventRecurrenceRule) {
    this.event.rrule = rule;
    return this;
  }

  /** Reference an original event id (split origin). */
  extractedFromId(id?: SchedulerEventId) {
    this.event.extractedFromId = id;
    return this;
  }

  /** Set the data timezone. */
  withDataTimezone(timezone: TemporalTimezone) {
    this.event.timezone = timezone;
    return this;
  }

  /** Set the display timezone for processed events. */
  withDisplayTimezone(timezone: TemporalTimezone) {
    this.displayTimezone = timezone;
    return this;
  }

  resizable(resizable: boolean | SchedulerEventSide) {
    this.event.resizable = resizable;
    return this;
  }

  draggable(draggable: boolean) {
    this.event.draggable = draggable;
    return this;
  }

  /** Set a custom class name for the event. */
  className(className: string) {
    this.event.className = className;
    return this;
  }

  // ─────────────────────────────────────────────
  // Time setters
  // ─────────────────────────────────────────────

  /**
   * Manually sets the start date/time using an ISO-like string.
   * Useful for fine-grained control (e.g., pairing with `.endAt(...)`).
   */
  startAt(start: string | TemporalSupportedObject) {
    if (typeof start === 'string' && !start.endsWith('Z')) {
      throw new Error('EventBuilder only supports instant-based ISO strings (must include Z)');
    }

    const startDate = typeof start === 'string' ? this.adapter.date(start, 'default') : start;
    this.event.start = startDate;
    return this;
  }

  /**
   * Manually sets the end date/time using an ISO-like string.
   * Useful for fine-grained control (e.g., pairing with `.startAt(...)`).
   */
  endAt(end: string | TemporalSupportedObject) {
    if (typeof end === 'string' && !end.endsWith('Z')) {
      throw new Error('EventBuilder only supports instant-based ISO strings (must include Z)');
    }

    const endDate = typeof end === 'string' ? this.adapter.date(end, 'default') : end;
    this.event.end = endDate;
    return this;
  }

  /**
   * Create a single-day timed event starting at `start` with the given duration (minutes).
   */
  singleDay(start: string | TemporalSupportedObject, durationMinutes = 60) {
    if (typeof start === 'string' && !start.endsWith('Z')) {
      throw new Error('EventBuilder only supports instant-based ISO strings (must include Z)');
    }

    const startDate = typeof start === 'string' ? this.adapter.date(start, 'default') : start;
    const endDate = this.adapter.addMinutes(startDate, durationMinutes);
    this.event.start = startDate;
    this.event.end = endDate;
    return this;
  }

  /**
   * Create an all-day event on the provided calendar day.
   * Sets `allDay=true`.
   */
  fullDay(date: string) {
    if (typeof date === 'string' && !date.endsWith('Z')) {
      throw new Error('EventBuilder only supports instant-based ISO strings (must include Z)');
    }

    const d = this.adapter.date(date, 'default');
    this.event.start = this.adapter.startOfDay(d);
    this.event.end = this.adapter.endOfDay(d);
    this.event.allDay = true;
    return this;
  }

  /**
   * Create an event spanning a start and end.
   * Optionally override `allDay`.
   */
  span(
    start: string | TemporalSupportedObject,
    end: string | TemporalSupportedObject,
    opts?: { allDay?: boolean },
  ) {
    if (
      (typeof start === 'string' && !start.endsWith('Z')) ||
      (typeof end === 'string' && !end.endsWith('Z'))
    ) {
      throw new Error('EventBuilder only supports instant-based ISO strings (must include Z)');
    }

    this.event.start = typeof start === 'string' ? this.adapter.date(start, 'default') : start;
    this.event.end = typeof end === 'string' ? this.adapter.date(end, 'default') : end;
    if (opts?.allDay !== undefined) {
      this.event.allDay = opts.allDay;
    }
    return this;
  }

  // ─────────────────────────────────────────────
  // Recurrence
  // ─────────────────────────────────────────────

  /**
   * Sets a recurrence rule.
   * - If only kind: auto-generates a preset based on start or DEFAULT_VISIBLE_DATE.
   * - If kind + rule: merges your rrule over the preset.
   */
  recurrent(kind: RecurringEventPresetKey, rrule?: Omit<RecurringEventRecurrenceRule, 'freq'>) {
    const anchor =
      this.event.start ?? this.adapter.setTimezone(DEFAULT_TESTING_VISIBLE_DATE, 'default');

    let base: RecurringEventRecurrenceRule = { freq: kind, interval: 1 };

    if (kind === 'WEEKLY') {
      const code = getWeekDayCode(this.adapter, anchor);
      base = { ...base, byDay: [code] };
    } else if (kind === 'MONTHLY') {
      const dayOfMonth = this.adapter.getDate(anchor);
      base = { ...base, byMonthDay: [dayOfMonth] };
    }

    this.event.rrule = { ...base, ...(rrule ?? {}) };
    return this;
  }

  // ─────────────────────────────────────────────
  // Build methods
  // ─────────────────────────────────────────────
  /**
   * Returns the built SchedulerEvent.
   */
  build(): SchedulerEvent {
    return this.event;
  }

  /**
   * Derives a SchedulerEventOccurrence from the built event.
   * @param occurrenceStartDate Start date of the recurrence occurrence.
   * Defaults to the event start date.
   */
  toOccurrence(occurrenceStartDate?: string): SchedulerEventOccurrence {
    const rawStart = occurrenceStartDate
      ? this.adapter.date(occurrenceStartDate, 'default')
      : this.event.start;

    const baseProcessed = processEvent(this.event, this.displayTimezone, this.adapter);
    const originalDurationMs =
      baseProcessed.dataTimezone.end.timestamp - baseProcessed.dataTimezone.start.timestamp;
    const rawEnd = this.adapter.addMilliseconds(rawStart, originalDurationMs);

    const occurrenceModel: SchedulerEvent = {
      ...this.event,
      start: rawStart,
      end: rawEnd,
    };

    const processed = processEvent(occurrenceModel, this.displayTimezone, this.adapter);

    return {
      ...processed,
      key: crypto.randomUUID(),
    };
  }

  /**
   * Derives a processed event from the built event.
   */
  toProcessed() {
    return processEvent(this.event, this.displayTimezone, this.adapter);
  }

  /**
   * Derives a SchedulerEventCreationProperties from the built event.
   */
  toCreationProperties(): SchedulerEventCreationProperties {
    const { id, ...rest } = this.event;
    return rest;
  }
}
