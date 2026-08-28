'use client';
import * as React from 'react';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { ResourceSelectionMode } from '@mui/x-scheduler-internals/internals';
import type { EventDialogFormValues } from '../utils';
import { EventDialogFormStore } from './EventDialogFormStore';

export const EventDialogFormContext = React.createContext<EventDialogFormStore | null>(null);

export function useEventDialogFormContext(): EventDialogFormStore {
  const context = React.useContext(EventDialogFormContext);
  if (context == null) {
    throw new Error(
      'MUI X Scheduler: The component must be rendered inside the event dialog form. ' +
        'The draft form values only exist while the dialog is open. ' +
        'Render the component through the `eventDialogGeneralTab` slot.',
    );
  }
  return context;
}

export interface EventDialogFormProviderProps {
  /**
   * Values the form is seeded with. Captured when the provider mounts.
   * The dialog always seeds every built-in key; test probes may seed partial bags.
   */
  initialValues: Record<string, unknown>;
  /**
   * The occurrence the editing session targets. Captured when the provider mounts.
   */
  occurrence: SchedulerRenderableEventOccurrence;
  /**
   * Whether the resource picker of the editing session is single- or multi-select.
   * Captured when the provider mounts.
   */
  resourceSelectionMode: ResourceSelectionMode;
  /**
   * Called synchronously after each write with the new values and the written keys.
   */
  onValuesChange?: (values: EventDialogFormValues, changedKeys: string[]) => void;
  children: React.ReactNode;
}

export function EventDialogFormProvider(props: EventDialogFormProviderProps) {
  const onValuesChange = useStableCallback((values: EventDialogFormValues, changedKeys: string[]) =>
    props.onValuesChange?.(values, changedKeys),
  );

  // The seed is captured on mount only. This relies on the dialog content
  // unmounting when the dialog closes and remounting when it is retargeted
  // (enforced by the `key` on `FormContent`), so the store lives exactly as
  // long as one editing session.
  const store = useRefWithInit(
    () =>
      new EventDialogFormStore(props.initialValues as EventDialogFormValues, {
        occurrence: props.occurrence,
        resourceSelectionMode: props.resourceSelectionMode,
        onValuesChange,
      }),
  ).current;

  return (
    <EventDialogFormContext.Provider value={store}>
      {props.children}
    </EventDialogFormContext.Provider>
  );
}
