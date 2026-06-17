'use client';
import * as React from 'react';

/**
 * While `active`, swallows the next click inside `ref` (unless it matches `ignoreSelector`) and
 * calls `onDisarm`, so a tap that would otherwise create or arm an event just exits editing instead.
 */
export function useDisarmOnOutsidePointer(parameters: {
  ref: React.RefObject<HTMLElement | null>;
  active: boolean;
  onDisarm: () => void;
  /**
   * Clicks landing on an element matching this selector are ignored (not treated as "outside").
   * Used so finishing a resize gesture on its handle doesn't disarm the event.
   */
  ignoreSelector?: string;
}) {
  const { ref, active, onDisarm, ignoreSelector } = parameters;

  React.useEffect(() => {
    const node = ref.current;
    if (!active || !node) {
      return undefined;
    }
    const onClickCapture = (event: MouseEvent) => {
      if (
        ignoreSelector &&
        event.target instanceof Element &&
        event.target.closest(ignoreSelector)
      ) {
        return;
      }
      // Swallow the click so it reaches neither a create handler nor an event's open trigger.
      event.stopPropagation();
      event.preventDefault();
      onDisarm();
    };
    node.addEventListener('click', onClickCapture, true);
    return () => {
      node.removeEventListener('click', onClickCapture, true);
    };
  }, [ref, active, onDisarm, ignoreSelector]);
}
