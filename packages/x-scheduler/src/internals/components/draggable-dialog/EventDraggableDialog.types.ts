import * as React from 'react';
import { SchedulerEventOccurrence } from '@mui/x-scheduler-headless/models';
import { DialogProps } from '@mui/material/Dialog';

export interface EventDraggableDialogProps extends DialogProps {
  /**
   * The event occurrence to display in the popover.
   */
  occurrence: SchedulerEventOccurrence;
  /**
   * The anchor element for the popover positioning.
   */
  anchor: HTMLElement;
  /**
   * Handles the close action of the popover.
   */
  onClose: () => void;
  /**
   * Ref to the Paper element of the dialog.
   */
  paperRef?: React.RefObject<HTMLDivElement>;
}

export interface EventDraggableDialogProviderProps {
  containerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}

export interface EventDraggableDialogTriggerProps extends React.HTMLAttributes<HTMLElement> {
  occurrence: SchedulerEventOccurrence;
  children: React.ReactNode;
}
