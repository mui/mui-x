'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { schedulerOccurrencePlaceholderSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useLongPress } from './useLongPress';

export interface UseMobileEventLiftParameters {
  /**
   * Whether touch+hold should arm the lifted state. Typically `false` for placeholder
   * or otherwise non-interactive renders.
   */
  enabled: boolean;
  /**
   * The unique key of the occurrence — used to drop the lifted state when an in-flight
   * drag or resize for this occurrence finishes.
   */
  occurrenceKey: string;
}

export interface UseMobileEventLiftReturn {
  /**
   * `true` while the event is "lifted" — i.e. the user touch+held it and the variant
   * should reveal its drag affordances (handles, outline) and accept body drag.
   */
  isLifted: boolean;
  /**
   * Pass to `<CalendarGrid.TimeEvent canDrag={canDrag}>` (or any other CalendarGrid event
   * part that accepts `canDrag`). Returns `true` for non-touch pointers (preserves the
   * desktop ergonomics) and for touch only once `isLifted` is set.
   */
  canDrag: () => boolean;
  /**
   * Ref to merge with the event's root ref. Wires up long-press detection and
   * swallows the click that fires after a long-press release so the editing dialog
   * doesn't open at the same time the event becomes lifted.
   */
  ref: React.Ref<HTMLElement>;
}

/**
 * Touch-only "lifted" mode for mobile event variants. The lifted state is independent
 * from the editing-dialog state — both can coexist.
 *
 * Intended to be the single source of mobile event drag-activation across variants
 * (time grid, day grid, agenda, ...): each mobile event component calls this hook
 * and forwards `ref`, `canDrag`, and `isLifted` to its root.
 */
export function useMobileEventLift(
  parameters: UseMobileEventLiftParameters,
): UseMobileEventLiftReturn {
  const { enabled, occurrenceKey } = parameters;

  const store = useSchedulerStoreContext();
  const placeholderAction = useStore(
    store,
    schedulerOccurrencePlaceholderSelectors.actionForOccurrence,
    occurrenceKey,
  );

  const [isLifted, setIsLifted] = React.useState(false);
  const rootRef = React.useRef<HTMLElement | null>(null);
  const suppressNextClickRef = React.useRef(false);

  const { ref: longPressRef, lastPointerTypeRef } = useLongPress({
    enabled,
    onLongPress: () => {
      suppressNextClickRef.current = true;
      setIsLifted(true);
    },
  });

  const canDrag = useStableCallback(
    () => isLifted || lastPointerTypeRef.current !== 'touch',
  );

  // Drop the lifted state once an in-flight drag/resize for this occurrence ends.
  const previousActionRef = React.useRef(placeholderAction);
  React.useEffect(() => {
    if (previousActionRef.current && !placeholderAction) {
      setIsLifted(false);
    }
    previousActionRef.current = placeholderAction;
  }, [placeholderAction]);

  // Callback ref that tracks the root node and attaches click-suppression listeners.
  // Owning the attach/detach here (instead of an empty-deps effect) means listeners
  // follow node identity rather than relying on a mount-time snapshot of `rootRef`.
  const clickSuppressRef = React.useMemo(() => {
    const onClickCapture = (event: MouseEvent) => {
      if (suppressNextClickRef.current) {
        event.stopPropagation();
        event.preventDefault();
        suppressNextClickRef.current = false;
      }
    };
    const onPointerDownClear = () => {
      // Clear at the start of a new touch sequence so a stale flag (e.g. long-press
      // followed by no click) doesn't swallow a later legitimate tap.
      suppressNextClickRef.current = false;
    };
    return (node: HTMLElement | null) => {
      if (rootRef.current === node) {
        return;
      }
      if (rootRef.current) {
        rootRef.current.removeEventListener('click', onClickCapture, true);
        rootRef.current.removeEventListener('pointerdown', onPointerDownClear);
      }
      rootRef.current = node;
      if (node) {
        node.addEventListener('click', onClickCapture, true);
        node.addEventListener('pointerdown', onPointerDownClear);
      }
    };
  }, []);

  // Exit lifted state when the user taps outside the event.
  React.useEffect(() => {
    if (!isLifted) {
      return undefined;
    }
    const onOutsidePointerDown = (event: PointerEvent) => {
      const node = rootRef.current;
      if (node && event.target instanceof Node && !node.contains(event.target)) {
        setIsLifted(false);
      }
    };
    document.addEventListener('pointerdown', onOutsidePointerDown, true);
    return () => {
      document.removeEventListener('pointerdown', onOutsidePointerDown, true);
    };
  }, [isLifted]);

  const ref = useMergedRefs(longPressRef, clickSuppressRef);

  return { isLifted, canDrag, ref };
}
