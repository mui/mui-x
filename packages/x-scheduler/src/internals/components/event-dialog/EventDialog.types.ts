import type * as React from 'react';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { DialogProps } from '@mui/material/Dialog';
import type { EventEditingOptionalRenderers } from '../event-editing';

export interface EventDialogProps extends DialogProps {
  /**
   * The event occurrence to display in the popover.
   */
  occurrence: SchedulerRenderableEventOccurrence;
  /**
   * The element the dialog is positioned against.
   */
  anchor: HTMLElement | null;
  /**
   * Handles the close action of the popover.
   */
  onClose: () => void;
}

export interface EventDialogProviderProps {
  children: React.ReactNode;
  /**
   * Optional components rendered during editing (recurrence tab, recurring scope confirmation).
   */
  optionalRenderers?: EventEditingOptionalRenderers;
}
