import {
  SchedulerResourceId,
  RecurringEventPresetKey,
  SchedulerEventRecurrenceRule,
} from '@mui/x-scheduler-headless/models';
import {
  SchedulerEvent,
  SchedulerEventCreationProperties,
  SchedulerEventId,
  SchedulerEventOccurrence,
  SchedulerEventSide,
} from '@mui/x-scheduler-headless/models/event';
import { processEvent, resolveEventDate } from '@mui/x-scheduler-headless/process-event';
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
 * - Builds a valid SchedulerEvent with string dates (instant or wall-time).
 * - Uses the provided (or default) adapter for date computations.
 * - Can optionally derive a SchedulerEventOccurrence via .toOccurrence().
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
      start: start.toISOString(),
      end: end.toISOString(),
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
    this.event.exDates = dates;
    return this;
  }

  /** Set an RRULE */
  rrule(rule?: SchedulerEventRecurrenceRule) {
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

  /** Sets the start date/time as a string (instant or wall-time). */
  startAt(start: string) {
    this.event.start = start;
    return this;
  }

  /** Sets the end date/time as a string (instant or wall-time). */
  endAt(end: string) {
    this.event.end = end;
    return this;
  }

  /**
   * Create a single-day timed event starting at `start` with the given duration (minutes).
   * Computes the end from the start using the adapter.
   */
  singleDay(start: string, durationMinutes = 60) {
    const dataTimezone = this.event.timezone ?? 'default';
    const startDate = resolveEventDate(start, dataTimezone, this.adapter);
    const endDate = this.adapter.addMinutes(startDate, durationMinutes);
    this.event.start = start;
    this.event.end = endDate.toISOString();
    return this;
  }

  /**
   * Create an all-day event on the provided calendar day.
   * Sets `allDay=true`.
   */
  fullDay(date: string) {
    const dataTimezone = this.event.timezone ?? 'default';
    const d = resolveEventDate(date, dataTimezone, this.adapter);
    this.event.start = this.adapter.startOfDay(d).toISOString();
    this.event.end = this.adapter.endOfDay(d).toISOString();
    this.event.allDay = true;
    return this;
  }

  /**
   * Sets start and end as strings (instant or wall-time).
   * Optionally override `allDay`.
   */
  span(start: string, end: string, opts?: { allDay?: boolean }) {
    this.event.start = start;
    this.event.end = end;
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
  recurrent(kind: RecurringEventPresetKey, rrule?: Omit<SchedulerEventRecurrenceRule, 'freq'>) {
    const dataTimezone = this.event.timezone ?? 'default';
    const anchor = this.event.start
      ? resolveEventDate(this.event.start, dataTimezone, this.adapter)
      : this.adapter.setTimezone(DEFAULT_TESTING_VISIBLE_DATE, 'default');

    let base: SchedulerEventRecurrenceRule = { freq: kind, interval: 1 };

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
    const dataTimezone = this.event.timezone ?? 'default';
    const rawStart = occurrenceStartDate
      ? this.adapter.date(occurrenceStartDate, 'default')
      : resolveEventDate(this.event.start, dataTimezone, this.adapter);

    const baseProcessed = processEvent(this.event, this.displayTimezone, this.adapter);
    const originalDurationMs =
      baseProcessed.dataTimezone.end.timestamp - baseProcessed.dataTimezone.start.timestamp;
    const rawEnd = this.adapter.addMilliseconds(rawStart, originalDurationMs);

    const occurrenceModel: SchedulerEvent = {
      ...this.event,
      start: rawStart.toISOString(),
      end: rawEnd.toISOString(),
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
