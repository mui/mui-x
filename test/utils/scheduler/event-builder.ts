import {
  CalendarResourceId,
  RecurringEventPresetKey,
  RecurringEventRecurrenceRule,
} from '@mui/x-scheduler-headless/models';
import {
  CalendarEvent,
  CalendarEventId,
  CalendarEventOccurrence,
} from '@mui/x-scheduler-headless/models/event';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';
import { adapter as defaultAdapter } from 'test/utils/scheduler';

export const DEFAULT_TESTING_VISIBLE_DATE = '2025-07-03T00:00:00Z';

/**
 * Minimal event builder for tests.
 *
 * Scope:
 * - Only sets fields and time ranges.
 * - Uses the provided (or default) adapter for all date ops.
 * - Returns a CalendarEventOccurrence to reduce test boilerplate.
 */
export class EventBuilder {
  /** Internal draft; only partial until `build()` time. */
  protected event: Partial<CalendarEvent> = { id: crypto.randomUUID(), allDay: false };

  protected constructor(protected adapter: Adapter) {}

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
  id(id: CalendarEventId) {
    this.event.id = id;
    return this;
  }

  /** Set the title. */
  title(title: string) {
    this.event.title = title;
    return this;
  }

  /** Set an optional description. */
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
  extractedFromId(id?: CalendarEventId) {
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
    const anchor = this.event.start ?? this.adapter.date(DEFAULT_TESTING_VISIBLE_DATE);

    const freqMap: Record<RecurringEventPresetKey, RecurringEventRecurrenceRule['freq']> = {
      daily: 'DAILY',
      weekly: 'WEEKLY',
      monthly: 'MONTHLY',
      yearly: 'YEARLY',
    };

    let base: RecurringEventRecurrenceRule = { freq: freqMap[kind], interval: 1 };

    if (kind === 'weekly') {
      const dayOfWeek = this.adapter.getDayOfWeek(anchor);
      base = { ...base, byDay: [weekNumToCode(dayOfWeek)] };
    } else if (kind === 'monthly') {
      const dayOfMonth = this.adapter.getDate(anchor);
      base = { ...base, byMonthDay: [dayOfMonth] };
    }

    this.event.rrule = { ...base, ...(rrule ?? {}) };
    return this;
  }

  /**
   * Build a CalendarEventOccurrence from the current draft.
   */
  build(): CalendarEventOccurrence {
    const defaultStartDate = this.adapter.date(DEFAULT_TESTING_VISIBLE_DATE);
    const defaultEndDate = this.adapter.addMinutes(defaultStartDate, 60);

    return {
      id: this.event.id!,
      key: `${this.event.id}::${this.adapter.format(this.event.start ?? defaultStartDate, 'keyboardDate')}`,
      title: this.event.title ?? `Event ${this.event.id}`,
      start: this.event.start ?? defaultStartDate,
      end: this.event.end ?? defaultEndDate,
      description: this.event.description ?? `Event ${this.event.id} description`,
      resource: this.event.resource ?? undefined,
      rrule: this.event.rrule ?? undefined,
      exDates: this.event.exDates ?? undefined,
      allDay: this.event.allDay ?? false,
      readOnly: this.event.readOnly ?? false,
      extractedFromId: this.event.extractedFromId ?? undefined,
    };
  }
}
