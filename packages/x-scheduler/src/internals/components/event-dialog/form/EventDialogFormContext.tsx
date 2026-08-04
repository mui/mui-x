'use client';
import * as React from 'react';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import type { EventDialogFormValues } from '../utils';
import { EventDialogFormStore } from './EventDialogFormStore';

export const EventDialogFormContext = React.createContext<EventDialogFormStore | null>(null);

export function useEventDialogFormContext(): EventDialogFormStore {
  const context = React.useContext(EventDialogFormContext);
  if (context == null) {
    throw new Error(
      'MUI X Scheduler: useEventDialogFormContext must be used within an <EventDialogFormProvider />. ' +
        'The component requires access to the draft form values. ' +
        'Ensure the component is rendered inside the event dialog form.',
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
      new EventDialogFormStore(props.initialValues as EventDialogFormValues, { onValuesChange }),
  ).current;

  return (
    <EventDialogFormContext.Provider value={store}>
      {props.children}
    </EventDialogFormContext.Provider>
  );
}
