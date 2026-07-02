'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import type {
  CompactEventEditingProviderProps,
  EventEditingContextValue,
  EventEditingProviderProps,
  EventEditingTriggerProps,
} from './EventEditing.types';
import { getInitialEditingMode } from './editingModePolicy';

export const EventEditingContext = React.createContext<EventEditingContextValue | undefined>(
  undefined,
);

export function useEventEditingContext(): EventEditingContextValue {
  const context = React.useContext(EventEditingContext);
  if (!context) {
    throw new Error(
      'MUI X Scheduler: `EventEditingContext` is missing. Hook must be placed within its Provider.',
    );
  }
  return context;
}

/**
 * Surface-agnostic editing backbone. Editing state (which occurrence, which stage) lives on the store;
 * this context only adds the anchor element and the start/stop helpers. Consumers provide the surface.
 */
export function EventEditingProvider(props: EventEditingProviderProps) {
  const { children, surface } = props;
  const store = useSchedulerStoreContext();
  // `anchorRef` for same-tick reads; `anchor` is the reactive mirror that re-positions the surfaces.
  const anchorRef = React.useRef<HTMLElement | null>(null);
  const [anchor, setAnchorState] = React.useState<HTMLElement | null>(null);

  const setAnchor = useStableCallback((node: HTMLElement | null) => {
    anchorRef.current = node;
    setAnchorState(node);
  });

  const startEditing = useStableCallback(
    (
      forwardedAnchorRef: React.RefObject<HTMLElement | null>,
      occurrence: SchedulerRenderableEventOccurrence,
    ) => {
      // Set the anchor synchronously before the store write so the surface, which re-renders from the
      // store update, reads a populated anchor on the same tick.
      setAnchor(forwardedAnchorRef?.current ?? null);
      const isCreating = schedulerOccurrencePlaceholderSelectors.isCreating(store.state);
      const isReadOnly = schedulerEventSelectors.isReadOnly(store.state, occurrence.id);
      store.startEditing(occurrence, getInitialEditingMode(surface, { isCreating, isReadOnly }));
    },
  );

  const stopEditing = useStableCallback(() => {
    store.stopEditing();
  });

  const contextValue = React.useMemo<EventEditingContextValue>(
    () => ({ startEditing, stopEditing, anchorRef, anchor, setAnchor }),
    [startEditing, stopEditing, anchor, setAnchor],
  );

  return (
    <EventEditingContext.Provider value={contextValue}>{children}</EventEditingContext.Provider>
  );
}

/**
 * Wraps an element so activating it edits its occurrence and opens the editing surface. Works for
 * both the desktop dialog and the compact drawer.
 */
export function EventEditingTrigger(props: EventEditingTriggerProps) {
  const { occurrence, onClick, children } = props;
  const ref = React.useRef<HTMLElement | null>(null);
  const store = useSchedulerStoreContext();
  const { startEditing, setAnchor } = useEventEditingContext();

  const isEdited = useStore(store, schedulerOtherSelectors.isEditedOccurrence, occurrence.key);

  // Re-anchor while edited, so the surface follows a recurring scope change that swaps the node: the
  // repointed occurrence's trigger mounts and re-anchors as the old node unmounts. Relies on the grid
  // mounting every occurrence of a rendered day (no time virtualization); revisit if that changes.
  useIsoLayoutEffect(() => {
    if (isEdited) {
      setAnchor(ref.current);
    }
  }, [isEdited, setAnchor]);

  return React.cloneElement(children as React.ReactElement<any>, {
    ref,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      startEditing(ref, occurrence);
    },
  });
}

/**
 * Compact (mobile) editing surface: reuses the backbone but renders no surface of its own. The
 * drawer is rendered in-flow by `CompactDayTimeGrid`, reading editing state from the store.
 */
export function CompactEventEditingProvider(props: CompactEventEditingProviderProps) {
  return <EventEditingProvider surface="drawer">{props.children}</EventEditingProvider>;
}
