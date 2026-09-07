'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import type { Position } from '../utils/dialog-utils';
import { calculatePosition } from '../utils/dialog-utils';

/** Positions a popup next to an anchor and keeps it in sync on resize/anchor changes. */
export function useAnchoredPosition(parameters: useAnchoredPosition.Parameters) {
  const { anchor, popupRef, side = 'left', onReposition } = parameters;

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
    // Deferred to the next frame so the observers never read and write layout inside their own
    // delivery pass, which the browser reports as "ResizeObserver loop completed with undelivered
    // notifications". Coalesced: repositioning once per frame is enough to track the anchor.
    let followFrame = 0;
    const followKeepingDrag = () => {
      cancelAnimationFrame(followFrame);
      followFrame = requestAnimationFrame(() => updatePosition(false));
    };
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
      cancelAnimationFrame(followFrame);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('resize', repositionResettingDrag);
    };
  }, [anchor, popupRef, updatePosition]);
}

export namespace useAnchoredPosition {
  export interface Parameters {
    /**
     * Element to position against. An element and not a ref, so swapping the anchor re-runs the
     * positioning effects.
     */
    anchor: HTMLElement | null;
    /** Popup element to position. */
    popupRef: React.RefObject<HTMLElement | null>;
    /**
     * Preferred side.
     * @default 'left'
     */
    side?: Position;
    /**
     * Runs when the base position is recomputed from scratch (mount, anchor change, viewport resize),
     * to reset a drag transform. Not called when the popup only follows its anchor.
     */
    onReposition?: () => void;
  }
}
