'use client';
import * as React from 'react';

/**
 * While `active`, disarms on Escape (restoring the Escape-to-close the dialog/popover replaced).
 * Bubble phase, so a dialog opened on top (e.g. the recurring scope confirmation) closes first.
 */
export function useDisarmOnEscape(parameters: { active: boolean; onDisarm: () => void }) {
  const { active, onDisarm } = parameters;

  React.useEffect(() => {
    if (!active || typeof document === 'undefined') {
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
  }, [active, onDisarm]);
}
