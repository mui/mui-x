'use client';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useEventDialogFormContext } from '../internals/components/event-dialog/form/EventDialogFormContext';

/**
 * Returns the occurrence the event dialog is editing.
 * Constant for the lifetime of the editing session.
 */
export function useEventDialogOccurrence(): SchedulerRenderableEventOccurrence {
  return useEventDialogFormContext().occurrence;
}
