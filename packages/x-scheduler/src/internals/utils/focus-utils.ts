'use client';
import * as React from 'react';
import { activeElement, contains } from '@base-ui/utils/shadowDom';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import type {
  RecurringEventScope,
  SchedulerEventId,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import { isEventOccurrence } from '@mui/x-scheduler-internals/internals';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';

// Both helpers pierce shadow roots, where `document.activeElement` stops at the host.

/** Whether focus is on the document, which is where it lands when the focused element unmounts. */
export function isFocusOnDocument(ownerDocument: Document): boolean {
  const focused = activeElement(ownerDocument);
  return focused === null || focused === ownerDocument.body;
}

/**
 * Whether focus goes away with `container` when it unmounts: it is on the document, or inside
 * `container`.
 */
export function isFocusLostWith(container: HTMLElement): boolean {
  const ownerDocument = container.ownerDocument;
  return isFocusOnDocument(ownerDocument) || contains(container, activeElement(ownerDocument));
}

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

  return pickNearestCandidate(snapshot.candidates.filter((candidate) => !isAlsoRemoved(candidate)));
}

/** The next of `survivors` after the removed element, else the previous one. */
function pickNearestCandidate(survivors: AgendaFallbackCandidate[]): HTMLElement | null {
  return (
    survivors.find((candidate) => candidate.isAfter)?.element ??
    survivors.filter((candidate) => !candidate.isAfter).pop()?.element ??
    null
  );
}

/**
 * `resolveFocusFallback` once the removal has already landed: the rows still in the document are
 * exactly the ones that survived it, so every one of them is a candidate — including the other
 * occurrences of the same event, unlike a scope-less `resolveFocusFallback`.
 */
export function resolveConnectedFocusFallback(snapshot: FocusFallbackSnapshot): HTMLElement | null {
  if (snapshot.owner != null) {
    return snapshot.owner;
  }
  return pickNearestCandidate(
    snapshot.candidates.filter((candidate) => candidate.element.isConnected),
  );
}

/** The start `captureFocusFallback` identifies an occurrence's rows by. */
export function getOccurrenceTimestamp(occurrence: SchedulerRenderableEventOccurrence): number {
  return isEventOccurrence(occurrence) ? occurrence.dataTimezone.start.timestamp : 0;
}

/**
 * Moves focus to the fallback of the element in `ref` (rendering `occurrence`) when it unmounts
 * while focused, e.g. once its event is removed through a controlled `events` prop. Without it,
 * focus is lost to the document.
 *
 * Runs in a layout cleanup, which React calls before detaching the element, so the fallback is
 * captured while the element is still in place; focus moves once the commit is done.
 */
export function useMoveFocusOutOnUnmount(
  ref: React.RefObject<HTMLElement | null>,
  occurrence: SchedulerRenderableEventOccurrence,
  enabled: boolean,
) {
  const occurrenceRef = React.useRef(occurrence);
  occurrenceRef.current = occurrence;

  useIsoLayoutEffect(() => {
    const node = ref.current;
    if (!enabled || node === null) {
      return undefined;
    }
    return () => {
      const ownerDocument = node.ownerDocument;
      if (!contains(node, activeElement(ownerDocument))) {
        return;
      }
      const snapshot = captureFocusFallback(
        node,
        occurrenceRef.current.id,
        getOccurrenceTimestamp(occurrenceRef.current),
      );
      if (snapshot === null) {
        return;
      }
      queueMicrotask(() => {
        // Still focused, or focus moved elsewhere in the meantime.
        if (!isFocusOnDocument(ownerDocument)) {
          return;
        }
        const focusFallback = resolveConnectedFocusFallback(snapshot);
        if (focusFallback?.isConnected) {
          focusFallback.focus({ preventScroll: true });
        }
      });
    };
  }, [ref, enabled]);
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
  const snapshot = anchor
    ? captureFocusFallback(anchor, occurrence.id, getOccurrenceTimestamp(occurrence))
    : null;

  store.deleteOccurrence(occurrence, (scope) => {
    onDelete?.();
    const focusFallback = snapshot ? resolveFocusFallback(snapshot, scope ?? null) : null;
    // Deferred: a dialog's focus trap pulls back any focus moved while it is still mounted.
    setTimeout(() => focusFallback?.focus());
  });
}
