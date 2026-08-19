import type * as React from 'react';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';

export interface EventContextMenuAnchorPosition {
  top: number;
  left: number;
}

export interface EventContextMenuContextValue {
  /**
   * Opens the context menu for `occurrence`, anchored either to a point (right-click) or to
   * `anchorEl` itself (keyboard activation).
   */
  openMenu: (
    occurrence: SchedulerRenderableEventOccurrence,
    anchorEl: HTMLElement,
    anchorPosition?: EventContextMenuAnchorPosition | null,
  ) => void;
}

export interface EventContextMenuProviderProps {
  children: React.ReactNode;
}

export interface EventContextMenuTriggerProps {
  occurrence: SchedulerRenderableEventOccurrence;
  /** A single element. The trigger clones it to attach its editing and context menu handlers. */
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface EventContextMenuProps {
  open: boolean;
  occurrence: SchedulerRenderableEventOccurrence;
  anchorEl: HTMLElement;
  anchorPosition: EventContextMenuAnchorPosition | null;
  onClose: () => void;
}
