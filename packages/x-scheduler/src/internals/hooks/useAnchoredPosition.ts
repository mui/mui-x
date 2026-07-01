'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import type { Position } from '../utils/dialog-utils';
import { calculatePosition } from '../utils/dialog-utils';

/** Positions a popup next to an anchor and keeps it in sync on resize/anchor changes. */
export function useAnchoredPosition(parameters: useAnchoredPosition.Parameters) {
  const { anchorRef, popupRef, side = 'left', onReposition } = parameters;

  const updatePosition = React.useCallback(() => {
    const anchor = anchorRef.current;
    const popup = popupRef.current;
    // Skip stale nodes: the anchor may have been detached.
    if (anchor != null && !anchor.isConnected) {
      return;
    }
    const position = calculatePosition(anchor, popup, side);
    if (position && popup) {
      // Safe DOM write, not a mutation of the hook's arguments.
      /* eslint-disable react-compiler/react-compiler */
      popup.style.top = `${position.top}px`;
      popup.style.left = `${position.left}px`;
      /* eslint-enable react-compiler/react-compiler */
      onReposition?.();
    }
  }, [anchorRef, popupRef, side, onReposition]);

  // Position before paint to avoid a flash at the wrong spot.
  useIsoLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  React.useEffect(() => {
    const popup = popupRef.current;
    const anchor = anchorRef.current;
    const reposition = () => updatePosition();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && popup ? new ResizeObserver(reposition) : null;
    if (popup) {
      resizeObserver?.observe(popup);
    }

    const mutationObserver =
      typeof MutationObserver !== 'undefined' && anchor ? new MutationObserver(reposition) : null;
    if (anchor) {
      mutationObserver?.observe(anchor, { attributes: true, attributeFilter: ['style'] });
    }

    window.addEventListener('resize', reposition);

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('resize', reposition);
    };
  }, [anchorRef, popupRef, updatePosition]);
}

export namespace useAnchoredPosition {
  export interface Parameters {
    /** Element to position against. */
    anchorRef: React.RefObject<HTMLElement | null>;
    /** Popup element to position. */
    popupRef: React.RefObject<HTMLElement | null>;
    /**
     * Preferred side.
     * @default 'left'
     */
    side?: Position;
    /** Runs after each reposition (e.g. to reset a drag transform). */
    onReposition?: () => void;
  }
}
