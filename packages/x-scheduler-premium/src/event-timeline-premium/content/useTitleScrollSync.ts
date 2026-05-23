'use client';
import * as React from 'react';

interface UseTitleScrollSyncParameters {
  /** Disables the hook (e.g. when no overflow). Resets the CSS variable to 0. */
  enabled: boolean;
  /** The root element on which the `--title-scroll-left` CSS variable is written. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** The main scroller; wheel/touch event listeners are attached here. */
  gridRef: React.RefObject<HTMLElement | null>;
  /** The dedicated title scrollbar element whose `scrollLeft` is the source of truth. */
  scrollbarRef: React.RefObject<HTMLElement | null>;
  /** Class name used to detect that a gesture originated over a title cell. */
  titleCellClassName: string;
}

// Minimum movement (in CSS pixels) before a touch is classified as
// horizontal or vertical. Avoids hijacking a vertical scroll that
// happens to start with a tiny horizontal jitter.
const TOUCH_DIRECTION_THRESHOLD = 8;

/**
 * Wires the dedicated title scrollbar to all title cells:
 *  - Sets `--title-scroll-left` on the container whenever the scrollbar scrolls,
 *    so every title cell's content translates by the same amount.
 *  - Redirects horizontal wheel and touch gestures performed over a title cell
 *    to the scrollbar, so the title column scrolls as a block. Vertical motion
 *    still scrolls the main grid (rows).
 */
export function useTitleScrollSync(params: UseTitleScrollSyncParameters): void {
  const { enabled, containerRef, gridRef, scrollbarRef, titleCellClassName } = params;

  // Mirror the scrollbar's scrollLeft onto a CSS variable read by every
  // title cell. Direct DOM mutation avoids re-rendering each row on scroll.
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }
    if (!enabled) {
      container.style.setProperty('--title-scroll-left', '0');
      return undefined;
    }
    const scrollbar = scrollbarRef.current;
    if (!scrollbar) {
      return undefined;
    }
    const onScroll = () => {
      container.style.setProperty('--title-scroll-left', String(scrollbar.scrollLeft));
    };
    onScroll();
    scrollbar.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollbar.removeEventListener('scroll', onScroll);
  }, [enabled, containerRef, scrollbarRef]);

  // Redirect wheel and touch gestures that originate over a title cell to
  // the dedicated scrollbar, so the title column scrolls as a block.
  React.useEffect(() => {
    const grid = gridRef.current;
    const scrollbar = scrollbarRef.current;
    if (!grid || !scrollbar || !enabled) {
      return undefined;
    }

    const isOverTitleCell = (target: EventTarget | null) =>
      target instanceof Element && target.closest(`.${titleCellClassName}`) != null;

    const onWheel = (event: WheelEvent) => {
      if (event.deltaX === 0 || !isOverTitleCell(event.target)) {
        return;
      }
      event.preventDefault();
      scrollbar.scrollLeft += event.deltaX;
      // Forward any concurrent vertical delta manually since preventDefault
      // cancels the browser's default scroll for the whole event.
      if (event.deltaY !== 0) {
        grid.scrollTop += event.deltaY;
      }
    };

    let touchActive = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchLastX = 0;
    let touchDirection: 'unknown' | 'horizontal' | 'vertical' = 'unknown';

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || !isOverTitleCell(event.target)) {
        touchActive = false;
        return;
      }
      touchActive = true;
      touchDirection = 'unknown';
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      touchLastX = touchStartX;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!touchActive || event.touches.length !== 1) {
        return;
      }
      const x = event.touches[0].clientX;
      const y = event.touches[0].clientY;

      if (touchDirection === 'unknown') {
        const dx = x - touchStartX;
        const dy = y - touchStartY;
        if (Math.abs(dx) < TOUCH_DIRECTION_THRESHOLD && Math.abs(dy) < TOUCH_DIRECTION_THRESHOLD) {
          return;
        }
        touchDirection = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      }

      if (touchDirection !== 'horizontal') {
        // Let the browser handle vertical row scrolling for the rest of this gesture.
        touchActive = false;
        return;
      }

      event.preventDefault();
      scrollbar.scrollLeft -= x - touchLastX;
      touchLastX = x;
    };

    const onTouchEnd = () => {
      touchActive = false;
    };

    const controller = new AbortController();
    const options = { passive: false, signal: controller.signal };

    grid.addEventListener('wheel', onWheel, options);
    grid.addEventListener('touchstart', onTouchStart, options);
    grid.addEventListener('touchmove', onTouchMove, options);
    grid.addEventListener('touchend', onTouchEnd, options);
    grid.addEventListener('touchcancel', onTouchEnd, options);

    return () => {
      controller.abort();
    };
  }, [enabled, gridRef, scrollbarRef, titleCellClassName]);
}
