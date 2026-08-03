import type * as React from 'react';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { DialogProps } from '@mui/material/Dialog';
import type { EventDialogOptionalRenderers } from './EventDialogOptionalRenderersContext';
import type { ControlledValue } from './utils';

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

/**
 * Props shared by the General tab section components.
 * Temporary contract until the form context replaces the prop plumbing (#22868).
 */
export interface EventDialogSectionProps {
  occurrence: SchedulerRenderableEventOccurrence;
  controlled: ControlledValue;
  setControlled: React.Dispatch<React.SetStateAction<ControlledValue>>;
  errors: Record<string, string | string[]>;
  setErrors: (errors: Record<string, string | string[]>) => void;
}
