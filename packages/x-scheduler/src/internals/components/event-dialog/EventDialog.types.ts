import * as React from 'react';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { DialogProps } from '@mui/material/Dialog';
import type { EventDialogOptionalRenderers } from './EventDialogOptionalRenderersContext';

export interface EventDialogProps extends DialogProps {
  /**
   * The event occurrence to display in the popover.
   */
  occurrence: SchedulerRenderableEventOccurrence;
  /**
   * The anchor element for the popover positioning.
   */
  anchorRef: React.RefObject<HTMLElement | null>;
  /**
   * Handles the close action of the popover.
   */
  onClose: () => void;
}

export interface EventDialogProviderProps {
  children: React.ReactNode;
  /**
   * Optional components rendered inside the dialog (recurrence tab, recurring scope dialog).
   */
  optionalRenderers?: EventDialogOptionalRenderers;
}

export interface EventDialogTriggerProps extends React.HTMLAttributes<HTMLElement> {
  occurrence: SchedulerRenderableEventOccurrence;
  children: React.ReactNode;
}
