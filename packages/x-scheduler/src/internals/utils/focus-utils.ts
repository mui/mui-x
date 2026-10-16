import type {
  RecurringEventScope,
  SchedulerEventId,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';

const VIEW_SELECTOR = `[role="grid"], .${eventCalendarClasses.agendaView}`;
const AGENDA_EVENT_SELECTOR = `.${eventCalendarClasses.agendaViewEventListItem} [tabindex]`;

/**
 * Where focus should go once `element` (an occurrence of `eventId`) is removed by a delete,
 * without leaving the scheduler view: the cell or row it lives in, or in the agenda the next
 * (else previous) event — skipping any other row of `eventId` itself, since a multi-day event
 * renders one per day. Assumes every row of `eventId` is going away: for a recurring occurrence,
 * whose scope can instead leave some of its series' other rows in place, use
 * `captureAgendaFallbackCandidates` / `resolveAgendaFallback` instead (`deleteOccurrenceAndRestoreFocus`
 * already picks between the two).
 *
 * Resolved before the delete is requested, not after: with a `dataSource`, the event only leaves
 * the DOM once its `persistEvents` call resolves, which can be well after the delete applies
 * elsewhere — by then, telling the deleted event's other rows apart from any other row by DOM
 * presence alone no longer works, since none of them have unmounted yet either.
 */
export function getFocusFallback(
  element: HTMLElement,
  eventId: SchedulerEventId,
): HTMLElement | null {
  const view = element.closest<HTMLElement>(VIEW_SELECTOR);
  if (view == null) {
    return null;
  }

  const owner = element.parentElement?.closest<HTMLElement>('[tabindex]');
  if (owner != null && view.contains(owner)) {
    return owner;
  }

  const agendaEvents = Array.from(view.querySelectorAll<HTMLElement>(AGENDA_EVENT_SELECTOR)).filter(
    (candidate) => candidate.getAttribute('data-event-id') !== String(eventId),
  );
  const isAfter = (candidate: HTMLElement) =>
    element.compareDocumentPosition(candidate) === Node.DOCUMENT_POSITION_FOLLOWING;
  return agendaEvents.find(isAfter) ?? agendaEvents.filter((c) => !isAfter(c)).pop() ?? null;
}

interface AgendaFallbackCandidate {
  element: HTMLElement;
  eventId: string;
  occurrenceTimestamp: number;
  isAfter: boolean;
}

/**
 * Snapshot captured by `captureAgendaFallbackCandidates`, filtered by `resolveAgendaFallback`
 * once the delete's actual scope is known.
 */
export interface AgendaFallbackSnapshot {
  eventId: string;
  occurrenceTimestamp: number;
  candidates: AgendaFallbackCandidate[];
}

/**
 * Snapshots every other agenda row's identity (`data-event-id`, and the occurrence's own start —
 * `data-occurrence-timestamp`, both rendered by `EventItemCard`) and position relative to
 * `element`, for a recurring occurrence whose delete scope isn't known yet. `null` when `element`
 * isn't in the agenda (the grid's "owner cell" fallback in `getFocusFallback` already covers that
 * case, and is scope-independent) or has no scheduler view to fall back within.
 *
 * Captured before the scope is chosen, not after: like `getFocusFallback`, a row can still be
 * connected well after it was told to go away (a `dataSource`'s `persistEvents` still pending) —
 * telling it apart from a surviving row by DOM presence alone wouldn't work. `resolveAgendaFallback`
 * instead filters this snapshot by identity, which holds regardless of what has or hasn't unmounted.
 */
export function captureAgendaFallbackCandidates(
  element: HTMLElement,
  eventId: SchedulerEventId,
  occurrenceTimestamp: number,
): AgendaFallbackSnapshot | null {
  const view = element.closest<HTMLElement>(VIEW_SELECTOR);
  if (view == null) {
    return null;
  }

  const owner = element.parentElement?.closest<HTMLElement>('[tabindex]');
  if (owner != null && view.contains(owner)) {
    return null;
  }

  const candidates = Array.from(view.querySelectorAll<HTMLElement>(AGENDA_EVENT_SELECTOR))
    .filter((candidate) => candidate !== element)
    .map((candidate) => ({
      element: candidate,
      eventId: candidate.getAttribute('data-event-id') ?? '',
      occurrenceTimestamp: Number(candidate.getAttribute('data-occurrence-timestamp')),
      isAfter: element.compareDocumentPosition(candidate) === Node.DOCUMENT_POSITION_FOLLOWING,
    }));

  return { eventId: String(eventId), occurrenceTimestamp, candidates };
}

/**
 * Picks the fallback out of a `captureAgendaFallbackCandidates` snapshot once the scope that was
 * actually applied is known: the next surviving row, else the previous one — skipping only the
 * rows `scope` says are also gone, not every row of the same event.
 * - `null` (a non-recurring delete, "all", or the series dropping entirely because excluding the
 *   occurrence would leave none — see `deleteRecurringEvent`): every row of the event, same as
 *   `getFocusFallback`.
 * - `"only-this"`: only the deleted occurrence's own row(s) (same event, same start).
 * - `"this-and-following"`: the deleted occurrence's row(s) and every later one in the series.
 */
export function resolveAgendaFallback(
  snapshot: AgendaFallbackSnapshot,
  scope: RecurringEventScope | null,
): HTMLElement | null {
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
 * from). `onDelete` runs once the delete applies.
 *
 * A recurring occurrence in the agenda defers picking the fallback until its scope dialog
 * resolves (`captureAgendaFallbackCandidates` / `resolveAgendaFallback`): "only this" and "this
 * and following" leave some of the series' other rows in place, which isn't known yet when the
 * delete is first requested. Anything else resolves immediately, same as before.
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
  const isRecurringOccurrence =
    anchor != null && 'dataTimezone' in occurrence && occurrence.dataTimezone.rrule != null;
  const agendaSnapshot = isRecurringOccurrence
    ? captureAgendaFallbackCandidates(
        anchor,
        occurrence.id,
        occurrence.dataTimezone.start.timestamp,
      )
    : null;

  if (agendaSnapshot) {
    store.deleteOccurrence(occurrence, (scope) => {
      onDelete?.();
      const focusFallback = resolveAgendaFallback(agendaSnapshot, scope ?? null);
      // Deferred: a dialog's focus trap pulls back any focus moved while it is still mounted.
      setTimeout(() => focusFallback?.focus());
    });
    return;
  }

  const focusFallback = anchor ? getFocusFallback(anchor, occurrence.id) : null;
  store.deleteOccurrence(occurrence, () => {
    onDelete?.();
    // Deferred: a dialog's focus trap pulls back any focus moved while it is still mounted.
    setTimeout(() => focusFallback?.focus());
  });
}
