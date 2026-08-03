'use client';
import * as React from 'react';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { EventDialogFormStore } from './EventDialogFormStore';

export const EventDialogFormContext = React.createContext<EventDialogFormStore | null>(null);

export function useEventDialogFormContext(): EventDialogFormStore {
  const context = React.useContext(EventDialogFormContext);
  if (context == null) {
    throw new Error(
      'MUI X Scheduler: useEventDialogFormContext must be used within an <EventDialogFormProvider />',
    );
  }
  return context;
}

export interface EventDialogFormProviderProps {
  /**
   * Values the form is seeded with. Captured when the provider mounts.
   */
  initialValues: Record<string, unknown>;
  /**
   * Called synchronously after each write with the new values and the written keys.
   */
  onValuesChange?: (values: Record<string, unknown>, changedKeys: string[]) => void;
  children: React.ReactNode;
}

export function EventDialogFormProvider(props: EventDialogFormProviderProps) {
  const onValuesChange = useStableCallback(
    (values: Record<string, unknown>, changedKeys: string[]) =>
      props.onValuesChange?.(values, changedKeys),
  );

  // The seed is captured on mount only — the dialog content unmounts when the
  // dialog closes, so the store lives exactly as long as one editing session.
  const store = useRefWithInit(
    () => new EventDialogFormStore(props.initialValues, { onValuesChange }),
  ).current;

  return (
    <EventDialogFormContext.Provider value={store}>
      {props.children}
    </EventDialogFormContext.Provider>
  );
}
