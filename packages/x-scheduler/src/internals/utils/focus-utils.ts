import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';

const VIEW_SELECTOR = `[role="grid"], .${eventCalendarClasses.agendaView}`;
const AGENDA_EVENT_SELECTOR = `.${eventCalendarClasses.agendaViewEventListItem} [tabindex]`;

/**
 * Where focus should go once `element` (an event) is removed by a delete, without leaving the
 * scheduler view: the cell or row it lives in, or in the agenda the next (else previous) event.
 * Returns a thunk rather than resolving right away: a multi-day or recurring event can render
 * several rows in the agenda (one per day/occurrence), and all of them unmount together once the
 * delete actually applies — picking a fallback before then can land on one of those other rows,
 * which then unmounts too. Call the thunk after the delete has applied, not before.
 */
export function getFocusFallback(element: HTMLElement): () => HTMLElement | null {
  const view = element.closest<HTMLElement>(VIEW_SELECTOR);
  if (view == null) {
    return () => null;
  }

  const owner = element.parentElement?.closest<HTMLElement>('[tabindex]');
  if (owner != null && view.contains(owner)) {
    return () => (owner.isConnected ? owner : null);
  }

  const agendaEvents = Array.from(view.querySelectorAll<HTMLElement>(AGENDA_EVENT_SELECTOR));
  const isAfter = (candidate: HTMLElement) =>
    element.compareDocumentPosition(candidate) === Node.DOCUMENT_POSITION_FOLLOWING;
  const ordered = [
    ...agendaEvents.filter(isAfter),
    ...agendaEvents.filter((candidate) => !isAfter(candidate)).reverse(),
  ];

  // Resolved lazily: any other row of the deleted event is gone from the document by the time
  // this runs, which `isConnected` catches along with `element` itself.
  return () => ordered.find((candidate) => candidate.isConnected) ?? null;
}

/**
 * Deletes `occurrence`, then moves focus to the fallback of `anchor` (the element it was opened
 * from), which is gone by then. `onDelete` runs once the delete applies.
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
  const resolveFocusFallback = anchor ? getFocusFallback(anchor) : () => null;
  store.deleteOccurrence(occurrence, () => {
    onDelete?.();
    // Deferred: a dialog's focus trap pulls back any focus moved while it is still mounted.
    setTimeout(() => resolveFocusFallback()?.focus());
  });
}
