'use client';
import * as React from 'react';
import type { ResourceSelectionMode } from '@mui/x-scheduler-internals/internals';

export const EventEditingResourceSelectionModeContext =
  React.createContext<ResourceSelectionMode | null>(null);

/**
 * Returns whether the resource picker of the current editing session is single- or multi-select.
 */
export function useEventEditingResourceSelectionMode(): ResourceSelectionMode {
  const context = React.useContext(EventEditingResourceSelectionModeContext);
  if (context == null) {
    throw new Error(
      'MUI X Scheduler: useEventEditingResourceSelectionMode must be used within the event editing form. ' +
        'The component requires the resource selection mode captured when the form mounted. ' +
        'Ensure the component is rendered inside the event dialog or the compact editing drawer.',
    );
  }
  return context;
}
