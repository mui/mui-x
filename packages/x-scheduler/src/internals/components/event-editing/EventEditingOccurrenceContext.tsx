'use client';
import * as React from 'react';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';

export const EventEditingOccurrenceContext =
  React.createContext<SchedulerRenderableEventOccurrence | null>(null);

/**
 * Returns the occurrence the editing surface is currently editing.
 */
export function useEventEditingOccurrence(): SchedulerRenderableEventOccurrence {
  const context = React.useContext(EventEditingOccurrenceContext);
  if (context == null) {
    throw new Error(
      'MUI X Scheduler: useEventEditingOccurrence must be used within the event editing form. ' +
        'The component requires access to the occurrence being edited. ' +
        'Ensure the component is rendered inside the event dialog or the compact editing drawer.',
    );
  }
  return context;
}
