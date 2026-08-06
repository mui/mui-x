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
  // Every mounted trigger of the edited occurrence. A ref, so registering does not re-render.
  const registeredAnchorsRef = React.useRef(new Set<HTMLElement>());

  const registerAnchor = useStableCallback((node: HTMLElement) => {
    registeredAnchorsRef.current.add(node);
    // The trigger the user activated anchored the surface already, so siblings only step in when
    // there is nothing to anchor to.
    setAnchor((current) => (current === null || !current.isConnected ? node : current));
  });

  const unregisterAnchor = useStableCallback((node: HTMLElement) => {
    registeredAnchorsRef.current.delete(node);
    let replacement: HTMLElement | null = null;
    for (const candidate of registeredAnchorsRef.current) {
      if (candidate.isConnected) {
        replacement = candidate;
        break;
      }
    }
    // Handed over in the same update: an intermediate `null` would unmount the surface, and the
    // form would come back seeded from the event, discarding whatever the user had typed.
    setAnchor((current) => (current === node ? replacement : current));
  });

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
    () => ({ startEditing, stopEditing, anchor, registerAnchor, unregisterAnchor }),
    [startEditing, stopEditing, anchor, registerAnchor, unregisterAnchor],
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
  const { startEditing, registerAnchor, unregisterAnchor } = useEventEditingContext();

  const isEdited = useStore(store, schedulerOtherSelectors.isEditedOccurrence, occurrence.key);

  // An occurrence is often rendered by several triggers at once — a multi-day event spans days in
  // the agenda and week rows in the month view, and the "+N more" popover repeats what the cell
  // already shows. They all offer themselves as the anchor, and the provider keeps the one the
  // user activated for as long as it is mounted.
  useIsoLayoutEffect(() => {
    const node = ref.current;
    if (!isEdited || node === null) {
      return undefined;
    }
    registerAnchor(node);
    return () => unregisterAnchor(node);
  }, [isEdited, registerAnchor, unregisterAnchor]);

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
