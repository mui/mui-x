'use client';
import * as React from 'react';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { ControlledValue } from '../event-dialog/utils';

export interface RecurrenceTabRendererProps {
  occurrence: SchedulerRenderableEventOccurrence;
  controlled: ControlledValue;
  setControlled: React.Dispatch<React.SetStateAction<ControlledValue>>;
  tabValue: string;
}

/**
 * Components optionally rendered inside the editing surface (the desktop dialog and the compact
 * drawer alike). The premium scheduler fills these via the `optionalRenderers` prop on
 * `EventDialogProvider`; community leaves them empty.
 */
export interface EventEditingOptionalRenderers {
  /**
   * Component rendered as the "Recurrence" tab inside the editing form.
   */
  recurrenceTab?: React.ComponentType<RecurrenceTabRendererProps>;
  /**
   * Component rendered when the user is asked to choose the scope of a recurring update.
   *
   * Stacked on top of the active editing surface (the desktop dialog or the compact drawer); it
   * renders its own shell (a centered dialog). The concrete shell is the renderer's own concern.
   */
  recurringScope?: React.ComponentType<Record<string, never>>;
}

export const EventEditingOptionalRenderersContext =
  React.createContext<EventEditingOptionalRenderers>({});

export function useEventEditingOptionalRenderers(): EventEditingOptionalRenderers {
  return React.useContext(EventEditingOptionalRenderersContext);
}
