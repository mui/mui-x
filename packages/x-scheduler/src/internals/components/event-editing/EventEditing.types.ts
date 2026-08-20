import type * as React from 'react';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { EditingSurface } from './editingModePolicy';

export interface EventEditingContextValue {
  /**
   * Begins editing `occurrence`, anchoring the editing surface to `anchorRef`. The initial editing
   * mode (armed vs edit) is resolved from the provider's surface.
   * `stableAnchor` becomes `eventDetails.anchor` in `onEventEditingStart` — pass it when a
   * cancellation would unmount the `anchorRef` element (it defaults to that element otherwise).
   * Returns `false` when `onEventEditingStart` canceled the editing.
   */
  startEditing: (
    anchorRef: React.RefObject<HTMLElement | null>,
    occurrence: SchedulerRenderableEventOccurrence,
    event?: Event,
    stableAnchor?: HTMLElement | null,
  ) => boolean;
  /**
   * Stops editing, closing the editing surface.
   */
  stopEditing: () => void;
  /**
   * The element the editing surface (desktop dialog / toolbar) anchors to. State and not a ref, so
   * surfaces re-position when the anchored element is swapped. `null` means no surface is rendered.
   */
  anchor: HTMLElement | null;
  /**
   * Offers `node` as an anchor and returns a cleanup that withdraws it. If the withdrawn node was
   * the anchor, the surface moves to another registered element, or to `null` when none is left.
   */
  registerAnchor: (node: HTMLElement) => () => void;
}

export interface EventEditingProviderProps {
  children: React.ReactNode;
  /**
   * The surface this provider drives; selects the initial editing mode of an occurrence.
   */
  surface: EditingSurface;
}

export interface EventEditingTriggerProps {
  occurrence: SchedulerRenderableEventOccurrence;
  /** A single element. The trigger clones it and replaces its `ref`. */
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Called when an activation is canceled by `onEventEditingStart`. */
  onEditingCanceled?: () => void;
  /**
   * Element exposed as `eventDetails.anchor` in `onEventEditingStart`. Pass it when a cancellation
   * unmounts this trigger (e.g. it lives in the "+N more" popover, which the cancellation closes);
   * it defaults to the trigger element itself.
   */
  stableAnchor?: HTMLElement | null;
}

export interface CompactEventEditingProviderProps {
  children: React.ReactNode;
}
