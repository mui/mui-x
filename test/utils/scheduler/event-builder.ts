import {
  CalendarResourceId,
  RecurringEventPresetKey,
  RecurringEventRecurrenceRule,
} from '@mui/x-scheduler-headless/models';
import {
  SchedulerEvent,
  SchedulerEventId,
  SchedulerEventOccurrence,
} from '@mui/x-scheduler-headless/models/event';
import { processEvent } from '@mui/x-scheduler-headless/process-event';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { getWeekDayCode } from '@mui/x-scheduler-headless/utils/recurring-event-utils';
import { Adapter, diffIn } from '@mui/x-scheduler-headless/use-adapter';
import { adapter as defaultAdapter } from './adapters';

export const DEFAULT_TESTING_VISIBLE_DATE_STR = '2025-07-03T00:00:00Z';
export const DEFAULT_TESTING_VISIBLE_DATE = defaultAdapter.date(DEFAULT_TESTING_VISIBLE_DATE_STR);

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
  resource(resourceId?: CalendarResourceId) {
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
    this.event.exDates = dates?.map((date) => this.adapter.date(date));
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

  // ─────────────────────────────────────────────
  // Time setters
  // ─────────────────────────────────────────────

  /**
   * Manually sets the start date/time using an ISO-like string.
   * Useful for fine-grained control (e.g., pairing with `.endAt(...)`).
   */
  startAt(startISO: string) {
    this.event.start = this.adapter.date(startISO);
    return this;
  }

  /**
   * Manually sets the end date/time using an ISO-like string.
   * Useful for fine-grained control (e.g., pairing with `.startAt(...)`).
   */
  endAt(endISO: string) {
    this.event.end = this.adapter.date(endISO);
    return this;
  }

  /**
   * Create a single-day timed event starting at `start` with the given duration (minutes).
   */
  singleDay(start: string, durationMinutes = 60) {
    const startDate = this.adapter.date(start);
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
    const d = this.adapter.date(date);
    this.event.start = this.adapter.startOfDay(d);
    this.event.end = this.adapter.endOfDay(d);
    this.event.allDay = true;
    return this;
  }

  /**
   * Create an event spanning a start and end.
   * Optionally override `allDay`.
   */
  span(start: string, end: string, opts?: { allDay?: boolean }) {
    this.event.start = this.adapter.date(start);
    this.event.end = this.adapter.date(end);
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
    const anchor = this.event.start ?? DEFAULT_TESTING_VISIBLE_DATE;

    const freqMap: Record<RecurringEventPresetKey, RecurringEventRecurrenceRule['freq']> = {
      daily: 'DAILY',
      weekly: 'WEEKLY',
      monthly: 'MONTHLY',
      yearly: 'YEARLY',
    };

    let base: RecurringEventRecurrenceRule = { freq: freqMap[kind], interval: 1 };

    if (kind === 'weekly') {
      const code = getWeekDayCode(this.adapter, anchor);
      base = { ...base, byDay: [code] };
    } else if (kind === 'monthly') {
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
  buildOccurrence(occurrenceStartDate?: string): SchedulerEventOccurrence {
    const event = this.event;
    const effectiveDate = occurrenceStartDate
      ? this.adapter.date(occurrenceStartDate)
      : event.start;
    const duration = diffIn(this.adapter, event.end, event.start, 'minutes');
    const end = this.adapter.addMinutes(effectiveDate, duration);
    const key = `${event.id}::${this.adapter.format(effectiveDate, 'keyboardDate')}`;
    const processedEvent = processEvent(event, this.adapter);

    return {
      ...processedEvent,
      start: processDate(effectiveDate, this.adapter),
      end: processDate(end, this.adapter),
      key,
    };
  }
}
