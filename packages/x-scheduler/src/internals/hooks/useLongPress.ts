'use client';
import * as React from 'react';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { TimeoutManager } from '@mui/x-scheduler-internals/internals';

const DEFAULT_DURATION_MS = 400;
const DEFAULT_MOVEMENT_THRESHOLD_PX = 8;
// Hoisted so the default doesn't allocate a new array per render and destabilize
// the `ref` memo's dep array (which would detach/reattach listeners every render).
const DEFAULT_POINTER_TYPES: ReadonlyArray<'touch' | 'pen' | 'mouse'> = ['touch'];
const LONG_PRESS_TIMER_KEY = 'long-press';

export interface UseLongPressParameters {
  /**
   * Whether long-press detection is active.
   * @default true
   */
  enabled?: boolean;
  /**
   * Hold duration before the long-press fires.
   * @default 400
   */
  durationMs?: number;
  /**
   * Pointer movement beyond this distance (px) cancels the pending long-press.
   * @default 8
   */
  movementThresholdPx?: number;
  /**
   * Pointer types that should trigger long-press. Other types are ignored.
   * @default ['touch']
   */
  pointerTypes?: ReadonlyArray<'touch' | 'pen' | 'mouse'>;
  /**
   * Fired when the user holds the pointer for `durationMs` without moving past the threshold.
   */
  onLongPress: (event: PointerEvent) => void;
}

export interface UseLongPressReturn {
  /**
   * Callback ref to attach to the element that should receive the long-press detection.
   */
  ref: (node: HTMLElement | null) => void;
  /**
   * Pointer type of the last `pointerdown` seen on the element. Useful for gating
   * behavior on the touch-vs-mouse distinction outside the long-press callback.
   */
  lastPointerTypeRef: React.RefObject<string>;
}

interface LongPressState {
  node: HTMLElement | null;
  pending: boolean;
  pointerId: number | null;
  startX: number;
  startY: number;
}

export function useLongPress(parameters: UseLongPressParameters): UseLongPressReturn {
  const {
    enabled = true,
    durationMs = DEFAULT_DURATION_MS,
    movementThresholdPx = DEFAULT_MOVEMENT_THRESHOLD_PX,
    pointerTypes = DEFAULT_POINTER_TYPES,
    onLongPress,
  } = parameters;

  const onLongPressStable = useStableCallback(onLongPress);
  const lastPointerTypeRef = React.useRef<string>('mouse');
  const timeoutManager = useRefWithInit(() => new TimeoutManager()).current;

  const stateRef = React.useRef<LongPressState>({
    node: null,
    pending: false,
    pointerId: null,
    startX: 0,
    startY: 0,
  });

  const ref = React.useMemo(() => {
    const state = stateRef.current;

    const clearTimer = () => {
      if (state.pending) {
        timeoutManager.clearTimeout(LONG_PRESS_TIMER_KEY);
        state.pending = false;
      }
      state.pointerId = null;
    };

    const onPointerDown = (event: PointerEvent) => {
      lastPointerTypeRef.current = event.pointerType || 'mouse';
      if (!enabled) {
        return;
      }
      if (!pointerTypes.includes(event.pointerType as 'touch' | 'pen' | 'mouse')) {
        return;
      }
      clearTimer();
      state.pending = true;
      state.pointerId = event.pointerId;
      state.startX = event.clientX;
      state.startY = event.clientY;
      timeoutManager.startTimeout(LONG_PRESS_TIMER_KEY, durationMs, () => {
        state.pending = false;
        onLongPressStable(event);
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!state.pending || event.pointerId !== state.pointerId) {
        return;
      }
      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;
      if (Math.hypot(dx, dy) > movementThresholdPx) {
        clearTimer();
      }
    };

    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerId !== state.pointerId) {
        return;
      }
      clearTimer();
    };

    const attach = (node: HTMLElement) => {
      node.addEventListener('pointerdown', onPointerDown, { passive: true });
      node.addEventListener('pointermove', onPointerMove, { passive: true });
      node.addEventListener('pointerup', onPointerEnd, { passive: true });
      node.addEventListener('pointercancel', onPointerEnd, { passive: true });
      node.addEventListener('pointerleave', onPointerEnd, { passive: true });
    };

    const detach = (node: HTMLElement) => {
      node.removeEventListener('pointerdown', onPointerDown);
      node.removeEventListener('pointermove', onPointerMove);
      node.removeEventListener('pointerup', onPointerEnd);
      node.removeEventListener('pointercancel', onPointerEnd);
      node.removeEventListener('pointerleave', onPointerEnd);
    };

    return (node: HTMLElement | null) => {
      if (state.node === node) {
        return;
      }
      if (state.node) {
        detach(state.node);
        clearTimer();
      }
      state.node = node;
      if (node) {
        attach(node);
      }
    };
  }, [enabled, durationMs, movementThresholdPx, pointerTypes, onLongPressStable, timeoutManager]);

  // Belt-and-suspenders unmount cleanup, matching the SchedulerStore.disposeEffect
  // pattern. The callback ref's null-call already detaches and clears, but this
  // guarantees no timer can fire after teardown even in edge cases.
  React.useEffect(() => timeoutManager.clearAll, [timeoutManager]);

  return { ref, lastPointerTypeRef };
}
