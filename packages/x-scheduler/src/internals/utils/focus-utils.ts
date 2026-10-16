import type {
  SchedulerEventId,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';

const VIEW_SELECTOR = `[role="grid"], .${eventCalendarClasses.agendaView}`;
const AGENDA_EVENT_SELECTOR = `.${eventCalendarClasses.agendaViewEventListItem} [tabindex]`;

/**
 * Where focus should go once `element` (an occurrence of `eventId`) is removed by a delete,
 * without leaving the scheduler view: the cell or row it lives in, or in the agenda the next
 * (else previous) event — skipping any other row of `eventId` itself, since a multi-day or
 * recurring event renders one per day/occurrence.
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

/**
 * Deletes `occurrence`, then moves focus to the fallback of `anchor` (the element it was opened
 * from). `onDelete` runs once the delete applies.
 */
export function deleteOccurrenceAndRestoreFocus(
  store: {
    deleteOccurrence: (
      occurrence: SchedulerRenderableEventOccurrence,
      onDelete?: () => void,
    ) => void;
  },
  occurrence: SchedulerRenderableEventOccurrence,
  anchor: HTMLElement | null | undefined,
  onDelete?: () => void,
) {
  const focusFallback = anchor ? getFocusFallback(anchor, occurrence.id) : null;
  store.deleteOccurrence(occurrence, () => {
    onDelete?.();
    // Deferred: a dialog's focus trap pulls back any focus moved while it is still mounted.
    setTimeout(() => focusFallback?.focus());
  });
}
