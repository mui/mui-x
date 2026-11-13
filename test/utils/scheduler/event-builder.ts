import type {
  RecurringEventPresetKey,
  SchedulerEventRecurrenceRule,
  SchedulerResource,
} from '@mui/x-scheduler-internals/models';
import type {
  SchedulerEvent,
  SchedulerEventColor,
  SchedulerEventCreationProperties,
  SchedulerEventId,
  SchedulerEventOccurrence,
  SchedulerEventSide,
  SchedulerProcessedEvent,
} from '@mui/x-scheduler-internals/models/event';
import { processEvent, resolveEventTimestamp } from '@mui/x-scheduler-internals/process-event';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import type { SchedulerState } from '@mui/x-scheduler-internals/internals';
import {
  normalizeAllDayBounds,
  createProcessedDate,
  getRecurringOccurrenceKey,
  toPlainDate,
} from '@mui/x-scheduler-internals/internals';
import {
  schedulerRecurringEventsPlugin,
  getWeekDayCode,
} from '@mui/x-scheduler-internals-premium/internals';
import type { TemporalAdapter, TemporalTimezone } from '@base-ui/react/internals/temporal';
import { adapter as defaultAdapter } from './adapters';
import { addMinutes, createDate, endOfDay, startOfDay } from './dates';

export const DEFAULT_TESTING_VISIBLE_DATE_STR = '2025-07-03T00:00:00Z';
export const DEFAULT_TESTING_VISIBLE_DATE = createDate(DEFAULT_TESTING_VISIBLE_DATE_STR);

/**
 * Minimal event builder for tests.
 *
 * Scope:
 * - Builds a valid SchedulerEvent with string dates (instant or wall-time).
 * - Can optionally derive a SchedulerEventOccurrence via .toOccurrence().
 */
export class EventBuilder {
  declare protected event: SchedulerEvent;

  protected displayTimezone: TemporalTimezone = 'default';

  protected constructor(protected adapter: TemporalAdapter) {
    const id = crypto.randomUUID();
    const start = DEFAULT_TESTING_VISIBLE_DATE;
    const end = addMinutes(start, 60);

    this.event = {
      id,
      title: `Event ${id}`,
      start: start.toISOString(),
      end: end.toISOString(),
      description: `Event ${id} description`,
    };
  }

  /**
   * Create a new builder. The `adapter` is unused: no Scheduler function takes one anymore.
   */
  static new(adapter: TemporalAdapter = defaultAdapter) {
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

  /** Associate a single resource. */
  resource(resource: SchedulerResource) {
    this.event.resource = resource.id;
    return this;
  }

  /** Associate multiple resources. */
  resources(resourceList: SchedulerResource[]) {
    this.event.resource = resourceList.map((r) => r.id);
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

  color(color: SchedulerEventColor) {
    this.event.color = color;
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
   * Computes the end from the start.
   */
  singleDay(start: string, durationMinutes = 60) {
    const dataTimezone = this.event.timezone ?? 'default';
    const startDate = new Date(resolveEventTimestamp(start, dataTimezone));
    const endDate = addMinutes(startDate, durationMinutes);
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
    const d = new Date(resolveEventTimestamp(date, dataTimezone));
    this.event.start = startOfDay(d).toISOString();
    this.event.end = endOfDay(d).toISOString();
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
      ? resolveEventTimestamp(this.event.start, dataTimezone)
      : DEFAULT_TESTING_VISIBLE_DATE.getTime();

    let base: SchedulerEventRecurrenceRule = { freq: kind, interval: 1 };

    if (kind === 'WEEKLY') {
      const code = getWeekDayCode(anchor, dataTimezone);
      base = { ...base, byDay: [code] };
    } else if (kind === 'MONTHLY') {
      const dayOfMonth = toPlainDate(anchor, dataTimezone).day;
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
    const rawStart = resolveEventTimestamp(occurrenceStartDate ?? this.event.start, dataTimezone);

    const baseProcessed = processEvent(
      this.event,
      this.displayTimezone,
      schedulerRecurringEventsPlugin,
    );
    const originalDurationMs =
      baseProcessed.unstable_internalInfos.dataEnd - baseProcessed.unstable_internalInfos.dataStart;
    const occurrenceModel: SchedulerEvent = {
      ...this.event,
      start: new Date(rawStart).toISOString(),
      end: new Date(rawStart + originalDurationMs).toISOString(),
    };

    const processed = processEvent(
      occurrenceModel,
      this.displayTimezone,
      schedulerRecurringEventsPlugin,
    );

    const { exDates: unusedExDates, ...occurrenceProperties } = processed;
    return {
      ...occurrenceProperties,
      key: crypto.randomUUID(),
    };
  }

  /**
   * Derives a processed event from the built event.
   */
  toProcessed() {
    return processEvent(this.event, this.displayTimezone, schedulerRecurringEventsPlugin);
  }

  /**
   * Derives a SchedulerEventCreationProperties from the built event.
   */
  toCreationProperties(): SchedulerEventCreationProperties {
    const { id, ...rest } = this.event;
    return rest;
  }
}

/**
 * The occurrence of a processed event that starts at `occurrenceStart`, read in the timezone of
 * the event, with the duration of the event.
 */
export function createOccurrence(
  event: SchedulerProcessedEvent,
  occurrenceStart: Date,
): SchedulerEventOccurrence {
  const { dataStart, dataEnd, displayTimezone } = event.unstable_internalInfos;
  const startMs = occurrenceStart.getTime();
  const endMs = startMs + dataEnd - dataStart;
  const { exDates: unusedExDates, ...occurrenceProperties } = event;
  const displayBounds = normalizeAllDayBounds(startMs, endMs, event.allDay, displayTimezone);
  return {
    ...occurrenceProperties,
    key: getRecurringOccurrenceKey(event.id, startMs, event.timezone),
    start: createProcessedDate(displayBounds.start, displayTimezone),
    end: createProcessedDate(displayBounds.end, displayTimezone),
    unstable_internalInfos: { displayTimezone, dataStart: startMs, dataEnd: endMs },
  };
}

/**
 * The occurrence of an event of a store that starts at `occurrenceStart`.
 */
export function createStoreOccurrence(
  store: { state: SchedulerState },
  eventId: SchedulerEventId,
  occurrenceStart: Date,
): SchedulerEventOccurrence {
  return createOccurrence(
    schedulerEventSelectors.processedEvent(store.state, eventId)!,
    occurrenceStart,
  );
}
