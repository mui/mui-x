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
  // Every mounted trigger of the edited occurrence.
  const registeredAnchorsRef = React.useRef(new Set<HTMLElement>());

  const registerAnchor = useStableCallback((node: HTMLElement) => {
    registeredAnchorsRef.current.add(node);
    // Siblings only step in when there is nothing to anchor to.
    setAnchor((current) => (current === null || !current.isConnected ? node : current));

    return () => {
      registeredAnchorsRef.current.delete(node);
      let replacement: HTMLElement | null = null;
      for (const candidate of registeredAnchorsRef.current) {
        if (candidate.isConnected) {
          replacement = candidate;
          break;
        }
      }
      // Hand over in the same update: an intermediate `null` unmounts the surface and drops the draft.
      setAnchor((current) => (current === node ? replacement : current));
    };
  });

  const startEditing = useStableCallback(
    (
      forwardedAnchorRef: React.RefObject<HTMLElement | null>,
      occurrence: SchedulerRenderableEventOccurrence,
      event?: Event,
      stableAnchor?: HTMLElement | null,
    ) => {
      const isCreating = schedulerOccurrencePlaceholderSelectors.isCreating(store.state);
      const isReadOnly = schedulerEventSelectors.isReadOnly(store.state, occurrence.id);
      const started = store.startEditing(
        occurrence,
        getInitialEditingMode(surface, { isCreating, isReadOnly }),
        event,
        forwardedAnchorRef.current ?? undefined,
        stableAnchor ?? undefined,
      );
      if (started) {
        // Batched with the store write above, so the surface never renders anchored to `null`.
        setAnchor(forwardedAnchorRef.current);
      }
      return started;
    },
  );

  const contextValue = React.useMemo<EventEditingContextValue>(
    () => ({ startEditing, stopEditing: store.stopEditing, anchor, registerAnchor }),
    [startEditing, store, anchor, registerAnchor],
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
  const { occurrence, onClick, onEditingCanceled, stableAnchor, children } = props;
  const ref = React.useRef<HTMLElement | null>(null);
  const store = useSchedulerStoreContext();
  const { startEditing, registerAnchor } = useEventEditingContext();

  const isEdited = useStore(store, schedulerOtherSelectors.isEditedOccurrence, occurrence.key);

  // Several triggers can render the same occurrence at once (month cell + "+N more" popover,
  // multi-day rows). Each offers itself as the anchor while it is mounted.
  useIsoLayoutEffect(() => {
    const node = ref.current;
    if (!isEdited || node === null) {
      return undefined;
    }
    return registerAnchor(node);
  }, [isEdited, registerAnchor]);

  return React.cloneElement(children as React.ReactElement<any>, {
    ref,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      const started = startEditing(ref, occurrence, event.nativeEvent, stableAnchor);
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
