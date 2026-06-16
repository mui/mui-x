'use client';
import * as React from 'react';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { schedulerOccurrencePlaceholderSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { createModal } from '../create-modal';
import { EditingSurfaceContext } from './EditingSurfaceContext';
import { CompactEventEditingProviderProps, EventEditingTriggerProps } from './EventEditing.types';

/**
 * The shared, surface-agnostic editing backbone.
 *
 * Both the desktop event dialog and the compact (mobile) editing drawer open through this single
 * `createModal` instance — the one stacking backbone — so any surface stacked after the editing
 * surface (e.g. the recurring scope confirmation) participates in the same open/close/
 * `subscribeCloseHandler` flow regardless of platform.
 *
 * This context only tracks *which* surface is open (concept 2). *What* is being edited (the
 * occurrence) lives on the store (`editingOccurrence`, concept 1), so the two concerns stay
 * decoupled. The concrete surface (dialog vs. drawer) is provided by the consumers: the desktop
 * dialog renders through `EventEditingProvider`, the compact drawer through
 * `CompactEventEditingProvider`.
 */
const EventEditingModal = createModal<SchedulerRenderableEventOccurrence>({
  contextName: 'EventEditingContext',
});

export const EventEditingContext = EventEditingModal.Context;
export const useEventEditingContext = EventEditingModal.useContext;
/**
 * The low-level editing-surface provider. Desktop wraps this to render the anchored dialog; the
 * compact provider below wraps it for the in-flow drawer.
 */
export const EventEditingProvider = EventEditingModal.Provider;

/**
 * Wraps an element so that activating it puts its occurrence into editing state and opens the
 * editing surface. Surface-agnostic: the same trigger works for the desktop dialog and the
 * compact drawer.
 */
export function EventEditingTrigger(props: EventEditingTriggerProps) {
  const { occurrence, ...other } = props;
  const ref = React.useRef<HTMLElement | null>(null);

  return <EventEditingModal.Trigger ref={ref} data={occurrence} {...other} />;
}

/**
 * The compact (mobile) editing-surface provider.
 *
 * It reuses the shared editing backbone but renders no surface of its own (`render={() => null}`):
 * the drawer is rendered in-flow by `CompactDayTimeGrid`, reading the open state from this context.
 * Being a non-anchored surface, it opens without an anchor element (`anchored={false}`).
 *
 * Opening/closing records the editing state on the store, keeping "what is being edited" (the
 * store) decoupled from "which surface is open" (this modal).
 */
export function CompactEventEditingProvider(props: CompactEventEditingProviderProps) {
  const { children } = props;
  const store = useSchedulerStoreContext();

  return (
    <EditingSurfaceContext.Provider value="drawer">
      <EventEditingModal.Provider
        render={() => null}
        anchored={false}
        onOpen={(occurrence) => {
          store.startEditing(
            occurrence,
            schedulerOccurrencePlaceholderSelectors.isCreating(store.state) ? 'creation' : 'event',
          );
        }}
        onClose={() => {
          store.stopEditing();
        }}
      >
        {children}
      </EventEditingModal.Provider>
    </EditingSurfaceContext.Provider>
  );
}
