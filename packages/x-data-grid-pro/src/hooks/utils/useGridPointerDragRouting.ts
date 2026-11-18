'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import useEventCallback from '@mui/utils/useEventCallback';
import { gridClasses, useGridEventPriority } from '@mui/x-data-grid';
import type { GridPrivateApiPro } from '../../models/gridApiPro';

/**
 * Returns whether `element` belongs to the grid of `root`, and not to a grid nested in it, for example in a detail panel.
 * @param {Element | null | undefined} root The grid root element.
 * @param {Element} element The element to check.
 * @returns {boolean} `true` when the closest grid root of `element` is `root`.
 */
export function isElementInGrid(root: Element | null | undefined, element: Element): boolean {
  return !!root && element.closest(`.${gridClasses.root}`) === root;
}

// A slow tap on a control of a handle, like a menu button or a chip, must stay a tap
const INTERACTIVE_CONTROL_SELECTOR = 'button, a, input, select, textarea, [role="button"]';

/**
 * Returns whether a press on a drag handle is on one of its controls, and must not start a drag.
 * @param {PointerEvent} event The `pointerdown` event.
 * @param {Element} handle The pressed handle.
 * @returns {boolean} `true` when the press is on a control inside of `handle`.
 */
export function isPointerDownOnHandleControl(event: PointerEvent, handle: Element): boolean {
  const control = (event.target as Element | null)?.closest?.(INTERACTIVE_CONTROL_SELECTOR);
  return !!control && handle.contains(control);
}

type GridRootNativeEventHandler<K extends keyof HTMLElementEventMap> = (
  event: HTMLElementEventMap[K],
) => void;

/**
 * Binds a native listener to the grid root.
 * A side panel mounts after the root and binds in its effect.
 * Feature hooks can run before the root mounts, when hydrating, and bind on `rootMount`.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {K} eventName The event to listen to.
 * @param {Function} handler The listener. It must keep its identity, with `useEventCallback`.
 * @param {boolean} capture Whether to listen in the capture phase.
 */
function useGridRootNativeEventListener<K extends keyof HTMLElementEventMap>(
  apiRef: RefObject<GridPrivateApiPro>,
  eventName: K,
  handler: GridRootNativeEventHandler<K>,
  capture = false,
) {
  const boundRootRef = React.useRef<HTMLElement | null>(null);
  const isMountedRef = React.useRef(false);

  const bind = useEventCallback((root: HTMLElement | null | undefined) => {
    if (!root || boundRootRef.current === root) {
      return;
    }
    boundRootRef.current?.removeEventListener(eventName, handler, capture);
    root.addEventListener(eventName, handler, capture);
    boundRootRef.current = root;
  });

  // The `rootMount` subscription is made during render, so a render that is thrown away, by React 18 StrictMode for example, keeps it until it is garbage collected. Only a mounted hook binds from it, or the listener would be bound twice.
  useGridEventPriority(apiRef, 'rootMount', (root) => {
    if (isMountedRef.current) {
      bind(root);
    }
  });

  React.useEffect(() => {
    isMountedRef.current = true;
    bind(apiRef.current.rootElementRef?.current);
    return () => {
      isMountedRef.current = false;
      boundRootRef.current?.removeEventListener(eventName, handler, capture);
      boundRootRef.current = null;
    };
  }, [apiRef, bind, eventName, handler, capture]);
}

// Allowlist, not `!== 'mouse'`: an empty or missing `pointerType` must keep HTML drag and drop
const isPointerDragType = (pointerType: string | null | undefined) =>
  pointerType === 'touch' || pointerType === 'pen';

interface UseGridPointerDragRoutingOptions {
  /**
   * Selector of the drag handles. A handle that can't be dragged must not match it.
   */
  handleSelector: string;
  /**
   * Called when a handle is pressed with touch or pen. Mouse presses keep using HTML drag and drop.
   * @param {PointerEvent} event The `pointerdown` event.
   * @param {HTMLElement} handle The pressed handle.
   */
  onPointerDown: (event: PointerEvent, handle: HTMLElement) => void;
}

/**
 * Sends each press on a drag handle to one drag implementation, from its pointer type.
 * - Mouse, or an unknown pointer type: HTML drag and drop, unchanged.
 * - Touch and pen: `onPointerDown`, which starts a `usePointerDrag` session.
 *   The native drag that some browsers start on a long press is blocked, so it can't cancel the pointer events.
 */
export function useGridPointerDragRouting(
  apiRef: RefObject<GridPrivateApiPro>,
  options: UseGridPointerDragRoutingOptions,
) {
  const { handleSelector, onPointerDown } = options;
  // The pointer type of the last press on a handle
  const handlePointerTypeRef = React.useRef<string | null>(null);

  const getHandle = (target: EventTarget | null): HTMLElement | null => {
    const handle = (target as Element | null)?.closest?.<HTMLElement>(handleSelector);
    // Ignore the handles of nested grids
    if (!handle || !isElementInGrid(apiRef.current.rootElementRef?.current, handle)) {
      return null;
    }
    return handle;
  };

  const handlePointerDown = useEventCallback((event: PointerEvent) => {
    const handle = getHandle(event.target);
    if (!handle) {
      return;
    }
    handlePointerTypeRef.current = event.pointerType;
    if (isPointerDragType(event.pointerType)) {
      onPointerDown(event, handle);
    }
  });

  // A long press on a draggable element starts a native drag on some browsers (Chrome on Android).
  // It would cancel the pointer events, so it's blocked when the handle was pressed with touch or pen.
  // `pointerdown` always comes before `dragstart`, so the pointer type is the one of this press.
  // Stopping the propagation in the capture phase also keeps the HTML drag and drop handlers from seeing it.
  const handleNativeDragStart = useEventCallback((event: DragEvent) => {
    if (isPointerDragType(handlePointerTypeRef.current) && getHandle(event.target)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  useGridRootNativeEventListener(apiRef, 'pointerdown', handlePointerDown);
  useGridRootNativeEventListener(apiRef, 'dragstart', handleNativeDragStart, true);
}
