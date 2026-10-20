import type {
  RecurringEventScope,
  SchedulerEventId,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import { isEventOccurrence } from '@mui/x-scheduler-internals/internals';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';

const VIEW_SELECTOR = `[role="grid"], .${eventCalendarClasses.agendaView}`;
const AGENDA_EVENT_SELECTOR = `.${eventCalendarClasses.agendaViewEventListItem} [tabindex]`;

interface AgendaFallbackCandidate {
  element: HTMLElement;
  eventId: string;
  occurrenceTimestamp: number;
  isAfter: boolean;
}

/**
 * Snapshot captured by `captureFocusFallback`, resolved by `resolveFocusFallback` once the
 * delete's actual scope is known (`null` for a non-recurring delete, which has none to pick).
 */
export interface FocusFallbackSnapshot {
  owner: HTMLElement | null;
  eventId: string;
  occurrenceTimestamp: number;
  candidates: AgendaFallbackCandidate[];
}

/**
 * Snapshots where focus should go once `element` (an occurrence of `eventId`, started at
 * `occurrenceTimestamp`) is removed by a delete: the cell or row it lives in (`owner`), or in the
 * agenda every other row's identity (`data-event-id`, `data-occurrence-timestamp` — both rendered
 * by `EventItemCard`) and position relative to `element` (`candidates`). `null` when `element`
 * has no scheduler view to fall back within.
 *
 * Captured before the delete is requested: a row can still be connected when the delete resolves
 * (a `dataSource`'s `persistEvents` pending), and a recurring delete's scope isn't picked yet
 * either, so DOM state at that later point can't tell a row that's leaving apart from a surviving
 * one — identity, captured now, can.
 */
export function captureFocusFallback(
  element: HTMLElement,
  eventId: SchedulerEventId,
  occurrenceTimestamp: number,
): FocusFallbackSnapshot | null {
  const view = element.closest<HTMLElement>(VIEW_SELECTOR);
  if (view == null) {
    return null;
  }

  const owner = element.parentElement?.closest<HTMLElement>('[tabindex]');
  const candidates = Array.from(view.querySelectorAll<HTMLElement>(AGENDA_EVENT_SELECTOR))
    .filter((candidate) => candidate !== element)
    .map((candidate) => ({
      element: candidate,
      eventId: candidate.getAttribute('data-event-id') ?? '',
      occurrenceTimestamp: Number(candidate.getAttribute('data-occurrence-timestamp')),
      isAfter: element.compareDocumentPosition(candidate) === Node.DOCUMENT_POSITION_FOLLOWING,
    }));

  return {
    owner: owner != null && view.contains(owner) ? owner : null,
    eventId: String(eventId),
    occurrenceTimestamp,
    candidates,
  };
}

/**
 * Picks the fallback out of a `captureFocusFallback` snapshot once the delete's actual scope is
 * known: the owning cell or row if there is one, else in the agenda the next surviving row, else
 * the previous one — skipping only the rows `scope` says are also gone, not every row of the
 * same event.
 * - `null` (a non-recurring delete, which has no scope dialog) or `"all"`: every row of the
 *   event.
 * - `"only-this"`: only the deleted occurrence's own row(s) (same event, same start).
 * - `"this-and-following"`: the deleted occurrence's row(s) and every later one in the series.
 */
export function resolveFocusFallback(
  snapshot: FocusFallbackSnapshot,
  scope: RecurringEventScope | null,
): HTMLElement | null {
  if (snapshot.owner != null) {
    return snapshot.owner;
  }

  const isAlsoRemoved = (candidate: AgendaFallbackCandidate) => {
    if (candidate.eventId !== snapshot.eventId) {
      return false;
    }
    if (scope === 'only-this') {
      return candidate.occurrenceTimestamp === snapshot.occurrenceTimestamp;
    }
    if (scope === 'this-and-following') {
      return candidate.occurrenceTimestamp >= snapshot.occurrenceTimestamp;
    }
    return true;
  };

  const survivors = snapshot.candidates.filter((candidate) => !isAlsoRemoved(candidate));
  return (
    survivors.find((candidate) => candidate.isAfter)?.element ??
    survivors.filter((candidate) => !candidate.isAfter).pop()?.element ??
    null
  );
}

/**
 * Deletes `occurrence`, then moves focus to the fallback of `anchor` (the element it was opened
 * from) once the delete's scope (if any) is known. `onDelete` runs once the delete applies.
 */
export function deleteOccurrenceAndRestoreFocus(
  store: {
    deleteOccurrence: (
      occurrence: SchedulerRenderableEventOccurrence,
      onDelete?: (scope?: RecurringEventScope) => void,
    ) => void;
  },
  occurrence: SchedulerRenderableEventOccurrence,
  anchor: HTMLElement | null | undefined,
  onDelete?: () => void,
) {
  const occurrenceTimestamp = isEventOccurrence(occurrence)
    ? occurrence.dataTimezone.start.timestamp
    : 0;
  const snapshot = anchor ? captureFocusFallback(anchor, occurrence.id, occurrenceTimestamp) : null;

  store.deleteOccurrence(occurrence, (scope) => {
    onDelete?.();
    const focusFallback = snapshot ? resolveFocusFallback(snapshot, scope ?? null) : null;
    // Deferred: a dialog's focus trap pulls back any focus moved while it is still mounted.
    setTimeout(() => focusFallback?.focus());
  });
}
