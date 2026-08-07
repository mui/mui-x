'use client';
import * as React from 'react';

/**
 * While `active`, swallows a click that would create/arm an event and calls `onDisarm` instead;
 * `ignoreSelector` clicks pass through. `global` listens document-wide so any view's outside tap disarms.
 */
export function useDisarmOnOutsidePointer(parameters: {
  ref: React.RefObject<HTMLElement | null>;
  active: boolean;
  onDisarm: () => void;
  /**
   * Clicks matching this selector are ignored, so finishing a resize gesture on its handle doesn't disarm.
   */
  ignoreSelector?: string;
  /**
   * Listen on the whole document (modal-like) instead of only `ref`'s subtree, and never disarm on a
   * click inside `ref` itself.
   */
  global?: boolean;
}) {
  const { ref, active, onDisarm, ignoreSelector, global = false } = parameters;

  React.useEffect(() => {
    const node = ref.current;
    if (!active || !node) {
      return undefined;
    }
    // In global mode the listener spans the whole document, so an outside tap in any view disarms.
    const listenerTarget = global ? node.ownerDocument : node;
    const onClickCapture = (event: MouseEvent) => {
      // Real target from the composed path, so detection works inside a shadow root too.
      const composedPath = event.composedPath();
      const target = composedPath[0];
      // A non-Element target (e.g. `Document` on a scrollbar click) isn't "outside": leave it armed.
      if (!(target instanceof Element)) {
        return;
      }
      // The surface itself must keep working while modal; `composedPath` is shadow-safe.
      if (global && composedPath.includes(node)) {
        return;
      }
      if (ignoreSelector && target.closest(ignoreSelector)) {
        return;
      }
      // Swallow the click so it reaches neither a create handler nor an event's open trigger.
      event.stopPropagation();
      event.preventDefault();
      onDisarm();
    };
    // Cast: `listenerTarget` is `Document | HTMLElement`, which widens the handler type.
    listenerTarget.addEventListener('click', onClickCapture as EventListener, true);
    return () => {
      listenerTarget.removeEventListener('click', onClickCapture as EventListener, true);
    };
  }, [ref, active, onDisarm, ignoreSelector, global]);
}
