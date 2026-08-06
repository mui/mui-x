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
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  const startEditing = useStableCallback(
    (
      forwardedAnchorRef: React.RefObject<HTMLElement | null>,
      occurrence: SchedulerRenderableEventOccurrence,
    ) => {
      // Batched with the store write below, so the surface never renders anchored to `null`.
      setAnchor(forwardedAnchorRef.current);
      const isCreating = schedulerOccurrencePlaceholderSelectors.isCreating(store.state);
      const isReadOnly = schedulerEventSelectors.isReadOnly(store.state, occurrence.id);
      store.startEditing(occurrence, getInitialEditingMode(surface, { isCreating, isReadOnly }));
    },
  );

  const stopEditing = useStableCallback(() => {
    store.stopEditing();
  });

  const contextValue = React.useMemo<EventEditingContextValue>(
    () => ({ startEditing, stopEditing, anchor, setAnchor }),
    [startEditing, stopEditing, anchor],
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
  const { anchor, startEditing, setAnchor } = useEventEditingContext();

  const isEdited = useStore(store, schedulerOtherSelectors.isEditedOccurrence, occurrence.key);

  // Re-anchor while edited so the surface follows a scope change that swaps the node.
  // Assumes every occurrence of a rendered day is mounted (no time virtualization).
  useIsoLayoutEffect(() => {
    if (!isEdited) {
      return undefined;
    }
    setAnchor(ref.current);
    // Drop the anchor if this trigger unmounts while still edited, so the surface won't track a detached node.
    // Only when it still owns it: another trigger for the same occurrence may have re-anchored in between,
    // and clearing that would close the surface even though editing is still active.
    const node = ref.current;
    return () => setAnchor((current) => (current === node ? null : current));
  }, [isEdited, setAnchor]);

  // Take over a vacant anchor: the trigger that owned it may have unmounted (the "+N more" popover
  // closing, say) while this one stayed mounted, and without an owner the surface stops rendering.
  // Settles in one pass, since claiming it makes the condition false for every other trigger.
  useIsoLayoutEffect(() => {
    if (isEdited && anchor === null && ref.current !== null) {
      setAnchor(ref.current);
    }
  }, [isEdited, anchor, setAnchor]);

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
