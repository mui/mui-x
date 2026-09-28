import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';

const VIEW_SELECTOR = `[role="grid"], .${eventCalendarClasses.agendaView}`;
const AGENDA_EVENT_SELECTOR = `.${eventCalendarClasses.agendaViewEventListItem} [tabindex]`;

/**
 * Where focus should go once `element` (an event) is removed by a delete, without leaving the
 * scheduler view: the cell or row it lives in, or in the agenda the next (else previous) event.
 */
export function getFocusFallback(element: HTMLElement): HTMLElement | null {
  const view = element.closest<HTMLElement>(VIEW_SELECTOR);
  if (view == null) {
    return null;
  }

  const owner = element.parentElement?.closest<HTMLElement>('[tabindex]');
  if (owner != null && view.contains(owner)) {
    return owner;
  }

  const agendaEvents = Array.from(view.querySelectorAll<HTMLElement>(AGENDA_EVENT_SELECTOR)).filter(
    (candidate) => !element.contains(candidate),
  );
  const isAfter = (candidate: HTMLElement) =>
    element.compareDocumentPosition(candidate) === Node.DOCUMENT_POSITION_FOLLOWING;
  return agendaEvents.find(isAfter) ?? agendaEvents.filter((c) => !isAfter(c)).pop() ?? null;
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
  const focusFallback = anchor ? getFocusFallback(anchor) : null;
  store.deleteOccurrence(occurrence, () => {
    onDelete?.();
    // Deferred: a dialog's focus trap pulls back any focus moved while it is still mounted.
    setTimeout(() => focusFallback?.focus());
  });
}
