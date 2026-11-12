'use client';
import * as React from 'react';

/**
 * Disarms on Escape while mounted (restoring the Escape-to-close the dialog/popover replaced).
 * Bubble phase, so a dialog opened on top (e.g. the recurring scope confirmation) closes first.
 */
export function useDisarmOnEscape(parameters: { onDisarm: () => void }) {
  const { onDisarm } = parameters;

  React.useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      // Skip if an inner handler already consumed it.
      if (event.key === 'Escape' && !event.defaultPrevented) {
        onDisarm();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onDisarm]);
}
