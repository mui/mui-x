'use client';
import * as React from 'react';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { createModal } from '../create-modal';
import { CompactEventEditingProviderProps, EventEditingTriggerProps } from './EventEditing.types';
import { getInitialEditingMode } from './editingModePolicy';

/**
 * Shared, surface-agnostic editing backbone. Both the desktop dialog and the compact drawer open
 * through this one `createModal`, so anything stacked after them shares the open/close flow.
 * Tracks only *which* surface is open; *what* is edited lives on the store. The concrete surface
 * comes from consumers (`EventEditingProvider` / `CompactEventEditingProvider`).
 */
const EventEditingModal = createModal<SchedulerRenderableEventOccurrence>({
  contextName: 'EventEditingContext',
});

export const EventEditingContext = EventEditingModal.Context;
export const useEventEditingContext = EventEditingModal.useContext;
/**
 * Low-level editing-surface provider, wrapped by the desktop dialog and `CompactEventEditingProvider`.
 */
export const EventEditingProvider = EventEditingModal.Provider;

/**
 * Wraps an element so activating it edits its occurrence and opens the editing surface. Works for
 * both the desktop dialog and the compact drawer.
 */
export function EventEditingTrigger(props: EventEditingTriggerProps) {
  const { occurrence, ...other } = props;
  const ref = React.useRef<HTMLElement | null>(null);

  return <EventEditingModal.Trigger ref={ref} data={occurrence} {...other} />;
}

/**
 * Compact (mobile) editing surface: reuses the backbone but renders no surface of its own. The
 * drawer is rendered in-flow by `CompactDayTimeGrid`, reading open state from this non-anchored context.
 */
export function CompactEventEditingProvider(props: CompactEventEditingProviderProps) {
  const { children } = props;
  const store = useSchedulerStoreContext();

  return (
    <EventEditingModal.Provider
      render={() => null}
      anchored={false}
      onOpen={(occurrence) => {
        store.startEditing(occurrence, getInitialEditingMode('drawer'));
      }}
      onClose={() => {
        store.stopEditing();
      }}
    >
      {children}
    </EventEditingModal.Provider>
  );
}
