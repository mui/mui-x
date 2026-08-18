import type * as React from 'react';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { EditingSurface } from './editingModePolicy';

export interface EventEditingContextValue {
  /**
   * Begins editing `occurrence`, anchoring the editing surface to `anchorRef`. The initial editing
   * mode (armed vs edit) is resolved from the provider's surface.
   * Returns `false` when `onEventEditingStart` canceled the editing.
   */
  startEditing: (
    anchorRef: React.RefObject<HTMLElement | null>,
    occurrence: SchedulerRenderableEventOccurrence,
    event?: Event,
  ) => boolean;
  /**
   * Stops editing, closing the editing surface.
   */
  stopEditing: () => void;
  /**
   * The element the editing surface (desktop dialog / toolbar) anchors to. State and not a ref, so
   * surfaces re-position when the anchored element is swapped.
   */
  anchor: HTMLElement | null;
  /**
   * Re-anchors the editing surface to `node`.
   */
  setAnchor: (node: HTMLElement | null) => void;
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
}

export interface CompactEventEditingProviderProps {
  children: React.ReactNode;
}
