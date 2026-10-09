import type * as React from 'react';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';

export interface EventContextMenuAnchorPosition {
  top: number;
  left: number;
}

export interface OpenEventContextMenuOptions {
  /** Anchors the menu to a point (right-click). Anchors to `anchorEl` itself when omitted. */
  anchorPosition?: EventContextMenuAnchorPosition | null;
  /** Forwarded to `startEditing` when Edit is chosen — see `EventEditingTriggerProps`. */
  onEditingCanceled?: () => void;
  /** Forwarded to `startEditing` when Edit is chosen — see `EventEditingTriggerProps`. */
  stableAnchor?: HTMLElement | null;
  /** See `EventContextMenuTriggerProps`. */
  getFocusFallback?: () => HTMLElement | null;
}

export interface EventContextMenuContextValue {
  /**
   * Opens the context menu for `occurrence`, anchored either to a point (right-click) or to
   * `anchorEl` itself (keyboard activation).
   */
  openMenu: (
    occurrence: SchedulerRenderableEventOccurrence,
    anchorEl: HTMLElement,
    options?: OpenEventContextMenuOptions,
  ) => void;
  /** Closes the menu if it was opened from `anchorEl`, which is about to unmount. */
  closeMenuForAnchor: (anchorEl: HTMLElement) => void;
}

export interface EventContextMenuProviderProps {
  children: React.ReactNode;
}

export interface EventContextMenuTriggerProps {
  occurrence: SchedulerRenderableEventOccurrence;
  /** A single element. The trigger clones it to attach its editing and context menu handlers. */
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  /**
   * Called when an activation (click, or Edit from the context menu) is canceled by
   * `onEventEditingStart`. See `EventEditingTriggerProps`.
   */
  onEditingCanceled?: () => void;
  /**
   * Element exposed as `eventDetails.anchor` in `onEventEditingStart`. Pass it when a cancellation
   * unmounts this trigger (e.g. it lives in the "+N more" popover, which the cancellation closes);
   * it defaults to the trigger element itself. See `EventEditingTriggerProps`.
   */
  stableAnchor?: HTMLElement | null;
  /**
   * Returns the element to focus when its menu closes after the trigger has unmounted and focus
   * would be lost. Defaults to the trigger's nearest focusable ancestor.
   */
  getFocusFallback?: () => HTMLElement | null;
}

export interface EventContextMenuProps {
  open: boolean;
  occurrence: SchedulerRenderableEventOccurrence;
  anchorEl: HTMLElement;
  anchorPosition: EventContextMenuAnchorPosition | null;
  onEditingCanceled?: () => void;
  stableAnchor?: HTMLElement | null;
  getFocusFallback?: () => HTMLElement | null;
  onClose: () => void;
}
