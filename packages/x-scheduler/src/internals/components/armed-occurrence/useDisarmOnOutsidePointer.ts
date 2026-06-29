'use client';
import * as React from 'react';

/**
 * While `active`, swallows the next click inside `ref` (unless it matches `ignoreSelector`) and
 * calls `onDisarm`, so a tap that would create or arm an event just exits editing instead.
 */
export function useDisarmOnOutsidePointer(parameters: {
  ref: React.RefObject<HTMLElement | null>;
  active: boolean;
  onDisarm: () => void;
  /**
   * Clicks matching this selector are ignored, so finishing a resize gesture on its handle doesn't disarm.
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
      // Real target from the composed path, so detection works inside a shadow root too.
      const target = event.composedPath()[0];
      if (ignoreSelector && target instanceof Element && target.closest(ignoreSelector)) {
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
