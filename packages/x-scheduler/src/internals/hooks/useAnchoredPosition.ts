'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import type { Position } from '../utils/dialog-utils';
import { calculatePosition } from '../utils/dialog-utils';

/** Positions a popup next to an anchor and keeps it in sync on resize/anchor changes. */
export function useAnchoredPosition(parameters: useAnchoredPosition.Parameters) {
  const { anchorRef, popupRef, side = 'left', onReposition } = parameters;

  // Re-run the effects below when the anchored node changes identity (e.g. a recurring scope swap).
  const anchor = anchorRef.current;

  const updatePosition = React.useCallback(
    // `resetDrag` gates `onReposition`: skip it for content-size repositions so a dragged dialog stays put.
    (resetDrag = true) => {
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
        if (resetDrag) {
          onReposition?.();
        }
      }
    },
    [anchor, popupRef, side, onReposition],
  );

  // Position before paint to avoid a flash at the wrong spot.
  useIsoLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  React.useEffect(() => {
    const popup = popupRef.current;
    // Follow the anchor / popup as it moves or resizes, keeping any user drag offset intact.
    const followKeepingDrag = () => updatePosition(false);
    // A viewport resize recomputes the base position from scratch, so the drag offset is reset.
    const repositionResettingDrag = () => updatePosition(true);

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && popup ? new ResizeObserver(followKeepingDrag) : null;
    if (popup) {
      resizeObserver?.observe(popup);
    }

    const mutationObserver =
      typeof MutationObserver !== 'undefined' && anchor
        ? new MutationObserver(followKeepingDrag)
        : null;
    if (anchor) {
      mutationObserver?.observe(anchor, { attributes: true, attributeFilter: ['style'] });
    }

    window.addEventListener('resize', repositionResettingDrag);

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('resize', repositionResettingDrag);
    };
  }, [anchor, popupRef, updatePosition]);
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
