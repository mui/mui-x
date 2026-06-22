'use client';
import * as React from 'react';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { createModal } from '../create-modal';
import { CompactEventEditingProviderProps, EventEditingTriggerProps } from './EventEditing.types';

/**
 * The shared, surface-agnostic editing backbone.
 *
 * Both the desktop event dialog and the compact (mobile) editing drawer open through this single
 * `createModal` instance, so any surface stacked after them (e.g. the recurring scope confirmation)
 * shares the same open/close flow regardless of platform.
 *
 * This context only tracks *which* surface is open; *what* is being edited (the occurrence) lives on
 * the store, so the two concerns stay decoupled. The concrete surface is provided by the consumers:
 * the desktop dialog via `EventEditingProvider`, the compact drawer via `CompactEventEditingProvider`.
 */
const EventEditingModal = createModal<SchedulerRenderableEventOccurrence>({
  contextName: 'EventEditingContext',
});

export const EventEditingContext = EventEditingModal.Context;
export const useEventEditingContext = EventEditingModal.useContext;
/**
 * The low-level editing-surface provider. The desktop dialog wraps it for the anchored dialog;
 * `CompactEventEditingProvider` wraps it for the in-flow drawer.
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
 * Compact (mobile) editing surface: reuses the shared backbone but renders no surface of its own.
 * The drawer is rendered in-flow by `CompactDayTimeGrid`, reading the open state from this context;
 * being non-anchored, it opens without an anchor element.
 */
export function CompactEventEditingProvider(props: CompactEventEditingProviderProps) {
  const { children } = props;
  const store = useSchedulerStoreContext();

  return (
    <EventEditingModal.Provider
      render={() => null}
      anchored={false}
      onOpen={(occurrence) => {
        store.startEditing(occurrence);
      }}
      onClose={() => {
        store.stopEditing();
      }}
    >
      {children}
    </EventEditingModal.Provider>
  );
}
