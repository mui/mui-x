'use client';
import * as React from 'react';
import { isElement } from '@floating-ui/utils/dom';
import { useTimeout } from '@base-ui-components/utils/useTimeout';
import { useLatestRef } from '@base-ui-components/utils/useLatestRef';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { contains, getDocument, isMouseLikePointerType } from '../utils';

import { useFloatingParentNodeId, useFloatingTree } from '../components/FloatingTree';
import type {
  Delay,
  ElementProps,
  FloatingContext,
  FloatingRootContext,
  FloatingTreeType,
  SafePolygonOptions,
} from '../types';
import { createChangeEventDetails } from '../../utils/createBaseUIEventDetails';
import { createAttribute } from '../utils/createAttribute';
import { FloatingUIOpenChangeDetails } from '../../utils/types';
import { getEmptyContext } from './useFloatingRootContext';

const safePolygonIdentifier = createAttribute('safe-polygon');

export interface HandleCloseContext extends FloatingContext {
  onClose: () => void;
  tree?: FloatingTreeType | null;
  leave?: boolean;
}

export interface HandleClose {
  (context: HandleCloseContext): (event: MouseEvent) => void;
  __options?: SafePolygonOptions;
}

export function getDelay(
  value: UseHoverProps['delay'],
  prop: 'open' | 'close',
  pointerType?: PointerEvent['pointerType'],
) {
  if (pointerType && !isMouseLikePointerType(pointerType)) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'function') {
    const result = value();
    if (typeof result === 'number') {
      return result;
    }
    return result?.[prop];
  }

  return value?.[prop];
}

function getRestMs(value: number | (() => number)) {
  if (typeof value === 'function') {
    return value();
  }
  return value;
}

export interface UseHoverProps {
  /**
   * Whether the Hook is enabled, including all internal Effects and event
   * handlers.
   * @default true
   */
  enabled?: boolean;
  /**
   * Accepts an event handler that runs on `mousemove` to control when the
   * floating element closes once the cursor leaves the reference element.
   * @default null
   */
  handleClose?: HandleClose | null;
  /**
   * Waits until the user’s cursor is at “rest” over the reference element
   * before changing the `open` state.
   * @default 0
   */
  restMs?: number | (() => number);
  /**
   * Waits for the specified time when the event listener runs before changing
   * the `open` state.
   * @default 0
   */
  delay?: Delay | (() => Delay);
  /**
   * Whether the logic only runs for mouse input, ignoring touch input.
   * Note: due to a bug with Linux Chrome, "pen" inputs are considered "mouse".
   * @default false
   */
  mouseOnly?: boolean;
  /**
   * Whether moving the cursor over the floating element will open it, without a
   * regular hover event required.
   * @default true
   */
  move?: boolean;
  /**
   * Allows to override the element that will trigger the popup.
   * Wheh it's set, useHover won't read the reference element from the root context.
   * This allows to have multiple triggers per floating element (assuming `useHover` is called per trigger).
   */
  triggerElement?: HTMLElement | null;
}

/**
 * Opens the floating element while hovering over the reference element, like
 * CSS `:hover`.
 * @see https://floating-ui.com/docs/useHover
 */
export function useHover(
  context: FloatingRootContext | null,
  props: UseHoverProps = {},
): ElementProps {
  const { open, onOpenChange, dataRef, events, elements } = context ?? getEmptyContext();
  const {
    enabled = true,
    delay = 0,
    handleClose = null,
    mouseOnly = false,
    restMs = 0,
    move = true,
    triggerElement = null,
  } = props;

  const tree = useFloatingTree();
  const parentId = useFloatingParentNodeId();
  const handleCloseRef = useLatestRef(handleClose);
  const delayRef = useLatestRef(delay);
  const openRef = useLatestRef(open);
  const restMsRef = useLatestRef(restMs);

  const pointerTypeRef = React.useRef<string>(undefined);
  const timeout = useTimeout();
  const handlerRef = React.useRef<(event: MouseEvent) => void>(undefined);
  const restTimeout = useTimeout();
  const blockMouseMoveRef = React.useRef(true);
  const performedPointerEventsMutationRef = React.useRef(false);
  const unbindMouseMoveRef = React.useRef(() => {});
  const restTimeoutPendingRef = React.useRef(false);

  const isHoverOpen = useEventCallback(() => {
    const type = dataRef.current.openEvent?.type;
    return type?.includes('mouse') && type !== 'mousedown';
  });

  // When closing before opening, clear the delay timeouts to cancel it
  // from showing.
  React.useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    function onOpenChangeLocal(details: FloatingUIOpenChangeDetails) {
      if (!details.open) {
        timeout.clear();
        restTimeout.clear();
        blockMouseMoveRef.current = true;
        restTimeoutPendingRef.current = false;
      }
    }

    events.on('openchange', onOpenChangeLocal);
    return () => {
      events.off('openchange', onOpenChangeLocal);
    };
  }, [enabled, events, timeout, restTimeout]);

  React.useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    if (!handleCloseRef.current) {
      return undefined;
    }
    if (!open) {
      return undefined;
    }

    function onLeave(event: MouseEvent) {
      if (isHoverOpen()) {
        onOpenChange(
          false,
          createChangeEventDetails(
            'trigger-hover',
            event,
            (event.currentTarget as HTMLElement) ?? undefined,
          ),
        );
      }
    }

    const html = getDocument(elements.floating).documentElement;
    html.addEventListener('mouseleave', onLeave);
    return () => {
      html.removeEventListener('mouseleave', onLeave);
    };
  }, [elements.floating, open, onOpenChange, enabled, handleCloseRef, isHoverOpen]);

  const closeWithDelay = React.useCallback(
    (event: MouseEvent, runElseBranch = true) => {
      const closeDelay = getDelay(delayRef.current, 'close', pointerTypeRef.current);
      if (closeDelay && !handlerRef.current) {
        timeout.start(closeDelay, () =>
          onOpenChange(false, createChangeEventDetails('trigger-hover', event)),
        );
      } else if (runElseBranch) {
        timeout.clear();
        onOpenChange(false, createChangeEventDetails('trigger-hover', event));
      }
    },
    [delayRef, onOpenChange, timeout],
  );

  const cleanupMouseMoveHandler = useEventCallback(() => {
    unbindMouseMoveRef.current();
    handlerRef.current = undefined;
  });

  const clearPointerEvents = useEventCallback(() => {
    if (performedPointerEventsMutationRef.current) {
      const body = getDocument(elements.floating).body;
      body.style.pointerEvents = '';
      body.removeAttribute(safePolygonIdentifier);
      performedPointerEventsMutationRef.current = false;
    }
  });

  const isClickLikeOpenEvent = useEventCallback(() => {
    return dataRef.current.openEvent
      ? ['click', 'mousedown'].includes(dataRef.current.openEvent.type)
      : false;
  });

  // Registering the mouse events on the reference directly to bypass React's
  // delegation system. If the cursor was on a disabled element and then entered
  // the reference (no gap), `mouseenter` doesn't fire in the delegation system.
  React.useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    function onReferenceMouseEnter(event: MouseEvent) {
      timeout.clear();
      blockMouseMoveRef.current = false;

      if (
        (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current)) ||
        (getRestMs(restMsRef.current) > 0 && !getDelay(delayRef.current, 'open'))
      ) {
        return;
      }

      const openDelay = getDelay(delayRef.current, 'open', pointerTypeRef.current);
      const trigger = (event.currentTarget as HTMLElement) ?? undefined;

      const isOverInactiveTrigger =
        elements.domReference && trigger && !contains(elements.domReference, trigger);

      if (openDelay) {
        timeout.start(openDelay, () => {
          if (!openRef.current) {
            onOpenChange(true, createChangeEventDetails('trigger-hover', event, trigger));
          }
        });
      } else if (!open || isOverInactiveTrigger) {
        onOpenChange(true, createChangeEventDetails('trigger-hover', event, trigger));
      }
    }

    function onReferenceMouseLeave(event: MouseEvent) {
      if (isClickLikeOpenEvent()) {
        clearPointerEvents();
        return;
      }

      unbindMouseMoveRef.current();

      const doc = getDocument(elements.floating);
      restTimeout.clear();
      restTimeoutPendingRef.current = false;

      if (
        event.relatedTarget &&
        elements.triggers &&
        elements.triggers.includes(event.relatedTarget as Element)
      ) {
        // If the mouse is leaving the reference element to another trigger, don't explicitly close the popup
        // as it will be moved.
        return;
      }

      if (handleCloseRef.current && dataRef.current.floatingContext) {
        // Prevent clearing `onScrollMouseLeave` timeout.
        if (!open) {
          timeout.clear();
        }

        handlerRef.current = handleCloseRef.current({
          ...dataRef.current.floatingContext,
          tree,
          x: event.clientX,
          y: event.clientY,
          onClose() {
            clearPointerEvents();
            cleanupMouseMoveHandler();
            if (!isClickLikeOpenEvent()) {
              closeWithDelay(event, true);
            }
          },
        });

        const handler = handlerRef.current;

        doc.addEventListener('mousemove', handler);
        unbindMouseMoveRef.current = () => {
          doc.removeEventListener('mousemove', handler);
        };

        return;
      }

      // Allow interactivity without `safePolygon` on touch devices. With a
      // pointer, a short close delay is an alternative, so it should work
      // consistently.
      const shouldClose =
        pointerTypeRef.current === 'touch'
          ? !contains(elements.floating, event.relatedTarget as Element | null)
          : true;
      if (shouldClose) {
        closeWithDelay(event);
      }
    }

    // Ensure the floating element closes after scrolling even if the pointer
    // did not move.
    // https://github.com/floating-ui/floating-ui/discussions/1692
    function onScrollMouseLeave(event: MouseEvent) {
      if (isClickLikeOpenEvent()) {
        return;
      }
      if (!dataRef.current.floatingContext) {
        return;
      }
      if (
        event.relatedTarget &&
        elements.triggers &&
        elements.triggers.includes(event.relatedTarget as Element)
      ) {
        // If the mouse is leaving the reference element to another trigger, don't explicitly close the popup
        // as it will be moved.
        return;
      }

      handleCloseRef.current?.({
        ...dataRef.current.floatingContext,
        tree,
        x: event.clientX,
        y: event.clientY,
        onClose() {
          clearPointerEvents();
          cleanupMouseMoveHandler();
          if (!isClickLikeOpenEvent()) {
            closeWithDelay(event);
          }
        },
      })(event);
    }

    function onFloatingMouseEnter() {
      timeout.clear();
    }

    function onFloatingMouseLeave(event: MouseEvent) {
      if (!isClickLikeOpenEvent()) {
        closeWithDelay(event, false);
      }
    }

    const trigger = (triggerElement ?? elements.domReference) as HTMLElement | null;

    if (isElement(trigger)) {
      const floating = elements.floating;

      if (open) {
        trigger.addEventListener('mouseleave', onScrollMouseLeave);
      }

      if (move) {
        trigger.addEventListener('mousemove', onReferenceMouseEnter, {
          once: true,
        });
      }

      trigger.addEventListener('mouseenter', onReferenceMouseEnter);
      trigger.addEventListener('mouseleave', onReferenceMouseLeave);

      if (floating) {
        floating.addEventListener('mouseleave', onScrollMouseLeave);
        floating.addEventListener('mouseenter', onFloatingMouseEnter);
        floating.addEventListener('mouseleave', onFloatingMouseLeave);
      }

      return () => {
        if (open) {
          trigger.removeEventListener('mouseleave', onScrollMouseLeave);
        }

        if (move) {
          trigger.removeEventListener('mousemove', onReferenceMouseEnter);
        }

        trigger.removeEventListener('mouseenter', onReferenceMouseEnter);
        trigger.removeEventListener('mouseleave', onReferenceMouseLeave);

        if (floating) {
          floating.removeEventListener('mouseleave', onScrollMouseLeave);
          floating.removeEventListener('mouseenter', onFloatingMouseEnter);
          floating.removeEventListener('mouseleave', onFloatingMouseLeave);
        }
      };
    }

    return undefined;
  }, [
    elements,
    enabled,
    context,
    mouseOnly,
    move,
    closeWithDelay,
    cleanupMouseMoveHandler,
    clearPointerEvents,
    onOpenChange,
    open,
    openRef,
    tree,
    delayRef,
    handleCloseRef,
    dataRef,
    isClickLikeOpenEvent,
    restMsRef,
    timeout,
    restTimeout,
    triggerElement,
  ]);

  // Block pointer-events of every element other than the reference and floating
  // while the floating element is open and has a `handleClose` handler. Also
  // handles nested floating elements.
  // https://github.com/floating-ui/floating-ui/issues/1722
  useIsoLayoutEffect(() => {
    if (!enabled) {
      return undefined;
    }

    // eslint-disable-next-line no-underscore-dangle
    if (open && handleCloseRef.current?.__options?.blockPointerEvents && isHoverOpen()) {
      performedPointerEventsMutationRef.current = true;
      const floatingEl = elements.floating;

      if (isElement(elements.domReference) && floatingEl) {
        const body = getDocument(elements.floating).body;
        body.setAttribute(safePolygonIdentifier, '');

        const ref = elements.domReference as HTMLElement | SVGSVGElement;

        const parentFloating = tree?.nodesRef.current.find((node) => node.id === parentId)?.context
          ?.elements.floating;

        if (parentFloating) {
          parentFloating.style.pointerEvents = '';
        }

        body.style.pointerEvents = 'none';
        ref.style.pointerEvents = 'auto';
        floatingEl.style.pointerEvents = 'auto';

        return () => {
          body.style.pointerEvents = '';
          ref.style.pointerEvents = '';
          floatingEl.style.pointerEvents = '';
        };
      }
    }

    return undefined;
  }, [enabled, open, parentId, elements, tree, handleCloseRef, isHoverOpen]);

  useIsoLayoutEffect(() => {
    if (!open) {
      pointerTypeRef.current = undefined;
      restTimeoutPendingRef.current = false;
      cleanupMouseMoveHandler();
      clearPointerEvents();
    }
  }, [open, cleanupMouseMoveHandler, clearPointerEvents]);

  React.useEffect(() => {
    return () => {
      cleanupMouseMoveHandler();
      timeout.clear();
      restTimeout.clear();
    };
  }, [enabled, elements.domReference, cleanupMouseMoveHandler, timeout, restTimeout]);

  React.useEffect(() => {
    return clearPointerEvents;
  }, [clearPointerEvents]);

  const reference: ElementProps['reference'] = React.useMemo(() => {
    function setPointerRef(event: React.PointerEvent) {
      pointerTypeRef.current = event.pointerType;
    }

    return {
      onPointerDown: setPointerRef,
      onPointerEnter: setPointerRef,
      onMouseMove(event) {
        const { nativeEvent } = event;
        const trigger = event.currentTarget as HTMLElement;

        // `true` when there are multiple triggers per floating element and user hovers over the one that
        // wasn't used to open the floating element.
        const isOverInactiveTrigger =
          elements.domReference && !contains(elements.domReference, event.target as Element);

        function handleMouseMove() {
          if (!blockMouseMoveRef.current && (!openRef.current || isOverInactiveTrigger)) {
            onOpenChange(true, createChangeEventDetails('trigger-hover', nativeEvent, trigger));
          }
        }

        if (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current)) {
          return;
        }

        if ((open && !isOverInactiveTrigger) || getRestMs(restMsRef.current) === 0) {
          return;
        }

        // Ignore insignificant movements to account for tremors.
        if (
          !isOverInactiveTrigger &&
          restTimeoutPendingRef.current &&
          event.movementX ** 2 + event.movementY ** 2 < 2
        ) {
          return;
        }

        restTimeout.clear();

        if (pointerTypeRef.current === 'touch') {
          handleMouseMove();
        } else if (isOverInactiveTrigger) {
          handleMouseMove();
        } else {
          restTimeoutPendingRef.current = true;
          restTimeout.start(getRestMs(restMsRef.current), handleMouseMove);
        }
      },
    };
  }, [mouseOnly, onOpenChange, open, openRef, restMsRef, restTimeout, elements.domReference]);

  return React.useMemo(() => (enabled ? { reference } : {}), [enabled, reference]);
}
