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
      event?: Event,
    ) => {
      const isCreating = schedulerOccurrencePlaceholderSelectors.isCreating(store.state);
      const isReadOnly = schedulerEventSelectors.isReadOnly(store.state, occurrence.id);
      const started = store.startEditing(
        occurrence,
        getInitialEditingMode(surface, { isCreating, isReadOnly }),
        event,
      );
      if (started) {
        // Batched with the store write above, so the surface never renders anchored to `null`.
        setAnchor(forwardedAnchorRef.current);
      }
      return started;
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
  const { occurrence, onClick, onEditingCanceled, children } = props;
  const ref = React.useRef<HTMLElement | null>(null);
  const store = useSchedulerStoreContext();
  const { startEditing, setAnchor } = useEventEditingContext();

  const isEdited = useStore(store, schedulerOtherSelectors.isEditedOccurrence, occurrence.key);

  // Re-anchor while edited so the surface follows a scope change that swaps the node.
  // Assumes every occurrence of a rendered day is mounted (no time virtualization).
  useIsoLayoutEffect(() => {
    if (!isEdited) {
      return undefined;
    }
    setAnchor(ref.current);
    // Drop the anchor if this trigger unmounts while still edited, so the surface won't track a detached node.
    return () => setAnchor(null);
  }, [isEdited, setAnchor]);

  return React.cloneElement(children as React.ReactElement<any>, {
    ref,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      const started = startEditing(ref, occurrence, event.nativeEvent);
      if (!started) {
        onEditingCanceled?.();
      }
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
