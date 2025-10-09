'use client';
import * as React from 'react';
import { useAnimationFrame } from '@base-ui-components/utils/useAnimationFrame';
import { useTimeout } from '@base-ui-components/utils/useTimeout';
import { EMPTY_OBJECT } from '@base-ui-components/utils/empty';
import type { ElementProps, FloatingRootContext } from '../types';
import { isMouseLikePointerType, isTypeableElement } from '../utils';
import { createChangeEventDetails } from '../../utils/createBaseUIEventDetails';
import { getEmptyContext } from './useFloatingRootContext';

export interface UseClickProps {
  /**
   * Whether the Hook is enabled, including all internal Effects and event
   * handlers.
   * @default true
   */
  enabled?: boolean;
  /**
   * The type of event to use to determine a “click” with mouse input.
   * Keyboard clicks work as normal.
   * @default 'click'
   */
  event?: 'click' | 'mousedown' | 'mousedown-only';
  /**
   * Whether to toggle the open state with repeated clicks.
   * @default true
   */
  toggle?: boolean;
  /**
   * Whether to ignore the logic for mouse input (for example, if `useHover()`
   * is also being used).
   * @default false
   */
  ignoreMouse?: boolean;
  /**
   * If already open from another event such as the `useHover()` Hook,
   * determines whether to keep the floating element open when clicking the
   * reference element for the first time.
   * @default true
   */
  stickIfOpen?: boolean;
  /**
   * Touch-only delay (ms) before opening. Useful to allow mobile viewport/keyboard to settle.
   * @default 0
   */
  touchOpenDelay?: number;
}

/**
 * Opens or closes the floating element when clicking the reference element.
 * @see https://floating-ui.com/docs/useClick
 */
export function useClick(
  context: FloatingRootContext | null,
  props: UseClickProps = {},
): ElementProps {
  const { open, onOpenChange, dataRef, elements } = context ?? getEmptyContext();
  const {
    enabled = true,
    event: eventOption = 'click',
    toggle = true,
    ignoreMouse = false,
    stickIfOpen = true,
    touchOpenDelay = 0,
  } = props;

  const pointerTypeRef = React.useRef<'mouse' | 'pen' | 'touch'>(undefined);
  const frame = useAnimationFrame();
  const touchOpenTimeout = useTimeout();

  const reference: ElementProps['reference'] = React.useMemo(
    () => ({
      onPointerDown(event) {
        pointerTypeRef.current = event.pointerType;
      },
      onMouseDown(event) {
        const pointerType = pointerTypeRef.current;
        const nativeEvent = event.nativeEvent;

        // Ignore all buttons except for the "main" button.
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        if (
          event.button !== 0 ||
          eventOption === 'click' ||
          (isMouseLikePointerType(pointerType, true) && ignoreMouse)
        ) {
          return;
        }

        const openEvent = dataRef.current.openEvent;
        const openEventType = openEvent?.type;
        const hasClickedOnInactiveTrigger = elements.domReference !== event.currentTarget;
        const nextOpen =
          (open && hasClickedOnInactiveTrigger) ||
          !(
            open &&
            toggle &&
            (openEvent && stickIfOpen
              ? openEventType === 'click' || openEventType === 'mousedown'
              : true)
          );

        // Animations sometimes won't run on a typeable element if using a rAF.
        // Focus is always set on these elements. For touch, we may delay opening.
        if (isTypeableElement(nativeEvent.target)) {
          const details = createChangeEventDetails(
            'trigger-press',
            nativeEvent,
            nativeEvent.target as HTMLElement,
          );
          if (nextOpen && pointerType === 'touch' && touchOpenDelay > 0) {
            touchOpenTimeout.start(touchOpenDelay, () => {
              onOpenChange(true, details);
            });
          } else {
            onOpenChange(nextOpen, details);
          }
          return;
        }

        // Wait until focus is set on the element. This is an alternative to
        // `event.preventDefault()` to avoid :focus-visible from appearing when using a pointer.
        frame.request(() => {
          const details = createChangeEventDetails(
            'trigger-press',
            nativeEvent,
            event.currentTarget as HTMLElement,
          );
          if (nextOpen && pointerType === 'touch' && touchOpenDelay > 0) {
            touchOpenTimeout.start(touchOpenDelay, () => {
              onOpenChange(true, details);
            });
          } else {
            onOpenChange(nextOpen, details);
          }
        });
      },
      onClick(event) {
        if (eventOption === 'mousedown-only') {
          return;
        }

        const pointerType = pointerTypeRef.current;

        if (eventOption === 'mousedown' && pointerType) {
          pointerTypeRef.current = undefined;
          return;
        }

        if (isMouseLikePointerType(pointerType, true) && ignoreMouse) {
          return;
        }

        const openEvent = dataRef.current.openEvent;
        const openEventType = openEvent?.type;
        const hasClickedOnInactiveTrigger = elements.domReference !== event.currentTarget;
        const nextOpen =
          (open && hasClickedOnInactiveTrigger) ||
          !(
            open &&
            toggle &&
            (openEvent && stickIfOpen
              ? openEventType === 'click' ||
                openEventType === 'mousedown' ||
                openEventType === 'keydown' ||
                openEventType === 'keyup'
              : true)
          );
        const details = createChangeEventDetails(
          'trigger-press',
          event.nativeEvent,
          event.currentTarget as HTMLElement,
        );

        if (nextOpen && pointerType === 'touch' && touchOpenDelay > 0) {
          touchOpenTimeout.start(touchOpenDelay, () => {
            onOpenChange(true, details);
          });
        } else {
          onOpenChange(nextOpen, details);
        }
      },
      onKeyDown() {
        pointerTypeRef.current = undefined;
      },
    }),
    [
      dataRef,
      eventOption,
      ignoreMouse,
      onOpenChange,
      open,
      stickIfOpen,
      toggle,
      frame,
      touchOpenTimeout,
      touchOpenDelay,
      elements.domReference,
    ],
  );

  return React.useMemo(() => (enabled ? { reference } : EMPTY_OBJECT), [enabled, reference]);
}
