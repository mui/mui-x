'use client';
import * as React from 'react';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { EventDialogFormContext } from '../internals/components/event-dialog/form/EventDialogFormContext';

/**
 * Returns the occurrence the event dialog is editing.
 * Constant for the lifetime of the editing session.
 */
export function useEventDialogOccurrence(): SchedulerRenderableEventOccurrence {
  const store = React.useContext(EventDialogFormContext);
  if (store == null) {
    throw new Error(
      'MUI X Scheduler: useEventDialogOccurrence must be used within the event dialog form. ' +
        'The hook reads the occurrence being edited, which only exists while the dialog is open. ' +
        'Call it from a component rendered through the `eventDialogGeneralTab` slot.',
    );
  }
  return store.occurrence;
}
