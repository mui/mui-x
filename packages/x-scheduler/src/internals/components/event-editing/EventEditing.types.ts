import type * as React from 'react';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { EditingSurface } from './editingModePolicy';

export interface EventEditingContextValue {
  /**
   * Begins editing `occurrence`, anchoring the editing surface to `anchorRef`. The initial editing
   * mode (armed vs edit) is resolved from the provider's surface.
   */
  startEditing: (
    anchorRef: React.RefObject<HTMLElement | null>,
    occurrence: SchedulerRenderableEventOccurrence,
  ) => void;
  /**
   * Stops editing, closing the editing surface.
   */
  stopEditing: () => void;
  /**
   * The element the editing surface (desktop dialog / toolbar) anchors to. Synchronous handle, for
   * same-tick reads; prefer {@link anchor} to react to anchor changes.
   */
  anchorRef: React.RefObject<HTMLElement | null>;
  /**
   * Reactive mirror of {@link anchorRef}. Re-rendering on change lets the surface re-position when the
   * anchored element is swapped (e.g. a recurring scope change).
   */
  anchor: HTMLElement | null;
  /**
   * Re-anchors the editing surface to `node`, updating both {@link anchorRef} and {@link anchor}.
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

export interface EventEditingTriggerProps extends React.HTMLAttributes<HTMLElement> {
  occurrence: SchedulerRenderableEventOccurrence;
  children: React.ReactNode;
}

export interface CompactEventEditingProviderProps {
  children: React.ReactNode;
}
