'use client';
import * as React from 'react';
import ownerDocument from '@mui/utils/ownerDocument';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';

/*
 * On a fast scroll, browsers can show items the compositor scrolled into view before it has
 * rasterized them, as blank areas at the leading edge. Rasterizing ahead does not help:
 * Chrome, for example, draws only ~300px past the visible area in advance, and a fling's first frames
 * move further than that.
 *
 * The underlay holds a band of `BAND_ITEM_COUNT` items just past each edge of the items'
 * area, behind the scroller, so the browser draws it while the scroll is at rest. While
 * scrolling, nothing about it changes but its position: scroll-driven animations move the
 * band at the leading edge in with the items, and jump it back each time it has moved its
 * own height, so it keeps lining up with them. Missing items show the band beneath;
 * elsewhere the items hide it. The bands are rebuilt once the scroll stops.
 */

const BAND_ITEM_COUNT = 7;
// How long the scroll has to stop before the bands are rebuilt.
const REST_DELAY = 150;

export type UnderlayParams = {
  /** How many items the content should cover. */
  itemCount: number;
  /** The height of each item. */
  itemHeight: number;
};

export type UnderlayContent = {
  /**
   * Elements that scroll sideways with the items, laid out from the top of the first item and
   * the left edge of the scrolled content.
   */
  content: Node[];
  /**
   * Elements that stay in place sideways, such as pinned columns, laid out from the top of
   * the first item and the left edge of the underlay element.
   */
  pinned?: Node[];
};

export type UseScrollUnderlayParameters = {
  /** The element that scrolls. */
  scrollerRef: React.RefObject<HTMLElement | null>;
  /**
   * The underlay element. Render it behind the scroller, over the area the items scroll in,
   * with `position: absolute` and `overflow: hidden`.
   */
  underlayRef: React.RefObject<HTMLElement | null>;
  /** The height every item has. */
  itemHeight: number;
  /** The number of items, so the underlay stops at the last one. */
  itemCount: number;
  /**
   * Whether the content is laid out right to left.
   * @default false
   */
  isRtl?: boolean;
  /**
   * Returns the underlay's content: new elements, not in the page yet, that look like the
   * items, such as copies of rendered items. Called once the scroll stops.
   * @param {UnderlayParams} params How many items the content should cover, and their height.
   * @returns {UnderlayContent | null} The underlay content, or `null` for none, for example while the items don't all have `itemHeight`.
   */
  getUnderlayContent: (params: UnderlayParams) => UnderlayContent | null;
};

export type UseScrollUnderlayReturnValue = {
  /** Rebuilds the underlay once the scroll has stopped, for when the items changed. */
  rebuild: () => void;
};

type Band = {
  band: HTMLDivElement;
  // Moves with the horizontal scroll.
  content: HTMLDivElement;
};

type Bands = {
  top: Band;
  bottom: Band;
  y: ScrollTimeline;
  x: ScrollTimeline;
  animations: Animation[];
};

function createBand(doc: Document): Band {
  const band = doc.createElement('div');
  band.style.position = 'absolute';
  band.style.left = '0';
  band.style.right = '0';
  const content = doc.createElement('div');
  content.style.position = 'absolute';
  content.style.top = '0';
  content.style.left = '0';
  band.append(content);
  return { band, content };
}

function fill(band: Band, content: Node[], pinned: Node[]) {
  band.content.replaceChildren(...content);
  band.band.replaceChildren(band.content, ...pinned);
}

/**
 * Keeps an underlay behind a list or grid: content that looks like the items, which shows
 * through the blank gaps a fast scroll can leave.
 *
 * During a fast scroll, the browser can show items before it has drawn them. This hook keeps
 * a band of look-alike items just past each edge of the items' area, behind the items, and
 * moves it with the scroll, so those gaps show the underlay instead of blank space.
 *
 * To use it, render the element for `underlayRef` behind the scroller, and give the items a
 * background so they hide the underlay. Browsers without scroll-driven animations get no
 * underlay.
 */
export function useScrollUnderlay(
  parameters: UseScrollUnderlayParameters,
): UseScrollUnderlayReturnValue {
  const { scrollerRef, underlayRef, itemHeight, itemCount, isRtl = false } = parameters;
  const timeout = useTimeout();
  const bandsRef = React.useRef<Bands | null>(null);

  const build = useEventCallback(() => {
    const scroller = scrollerRef.current;
    const underlay = underlayRef.current;
    const bands = bandsRef.current;
    if (!scroller || !underlay || !bands) {
      return;
    }
    const { top, bottom } = bands;
    bands.animations.forEach((animation) => animation.cancel());
    bands.animations = [];
    const underlayContent =
      itemHeight > 0
        ? parameters.getUnderlayContent({ itemCount: BAND_ITEM_COUNT, itemHeight })
        : null;
    if (!underlayContent) {
      fill(top, [], []);
      fill(bottom, [], []);
      return;
    }

    // The band past the bottom edge gets the nodes, the band past the top edge copies of them.
    const pinned = underlayContent.pinned ?? [];
    const copy = (nodes: Node[]) => nodes.map((node) => node.cloneNode(true));
    fill(top, copy(underlayContent.content), copy(pinned));
    fill(bottom, underlayContent.content, pinned);

    // Each band starts at the item its edge cuts and reaches BAND_ITEM_COUNT items past it.
    // Scrolling from here towards its edge, it moves with the items, one iteration per band
    // height, so each jump back lands on the same items. The iterations run to the end of
    // the scroll range, the last one partial.
    const { scrollTop } = scroller;
    const period = BAND_ITEM_COUNT * itemHeight;
    const bottomEdgeItem = Math.floor((scrollTop + underlay.clientHeight) / itemHeight);
    const topEdgeItem = Math.ceil(scrollTop / itemHeight);
    top.band.style.height = `${period}px`;
    bottom.band.style.height = `${period}px`;
    top.band.style.top = `${(topEdgeItem - BAND_ITEM_COUNT) * itemHeight - scrollTop}px`;
    bottom.band.style.top = `${bottomEdgeItem * itemHeight - scrollTop}px`;
    // No items past the edge: the band would show where the items end above it.
    bottom.band.hidden = bottomEdgeItem >= itemCount;

    const scrollTopMax = scroller.scrollHeight - scroller.clientHeight;
    const after = (scrollTopMax - scrollTop) / period;
    if (after > 0) {
      bands.animations.push(
        bottom.band.animate([{ transform: 'none' }, { transform: `translateY(${-period}px)` }], {
          timeline: bands.y,
          rangeStart: `${scrollTop}px`,
          rangeEnd: `${scrollTopMax}px`,
          iterations: after,
        }),
      );
    }
    const before = scrollTop / period;
    if (before > 0) {
      bands.animations.push(
        top.band.animate([{ transform: `translateY(${period}px)` }, { transform: 'none' }], {
          timeline: bands.y,
          rangeStart: '0px',
          rangeEnd: `${scrollTop}px`,
          iterations: before,
          // Iterations count from the start of the range: the partial one goes first, so that
          // an iteration ends where the scroll stopped.
          iterationStart: Math.ceil(before) - before,
        }),
      );
    }
    const scrollLeftMax = scroller.scrollWidth - scroller.clientWidth;
    if (scrollLeftMax > 0) {
      // The box follows the left edge of the scrolled content, which starts a whole scroll
      // range left of the viewport in right-to-left content.
      const keyframes = isRtl
        ? [{ transform: `translateX(${-scrollLeftMax}px)` }, { transform: 'none' }]
        : [{ transform: 'none' }, { transform: `translateX(${-scrollLeftMax}px)` }];
      [top, bottom].forEach((band) => {
        bands.animations.push(band.content.animate(keyframes, { timeline: bands.x, fill: 'both' }));
      });
    }
  });

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    const underlay = underlayRef.current;
    if (!scroller || !underlay || typeof ScrollTimeline === 'undefined') {
      return undefined;
    }
    const doc = ownerDocument(underlay);
    const bands: Bands = {
      top: createBand(doc),
      bottom: createBand(doc),
      y: new ScrollTimeline({ source: scroller, axis: 'block' }),
      x: new ScrollTimeline({ source: scroller, axis: 'inline' }),
      animations: [],
    };
    bandsRef.current = bands;
    // Out of reach of the find bar, selection, focus and assistive technology.
    underlay.inert = true;
    underlay.setAttribute('aria-hidden', 'true');
    underlay.replaceChildren(bands.top.band, bands.bottom.band);

    const scheduleBuild = () => timeout.start(REST_DELAY, build);
    scheduleBuild();
    scroller.addEventListener('scroll', scheduleBuild, { passive: true });
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(scheduleBuild);
    resizeObserver?.observe(underlay);
    return () => {
      timeout.clear();
      scroller.removeEventListener('scroll', scheduleBuild);
      resizeObserver?.disconnect();
      bands.animations.forEach((animation) => animation.cancel());
      underlay.replaceChildren();
      bandsRef.current = null;
    };
  }, [scrollerRef, underlayRef, timeout, build]);

  // A new item height, item count or direction makes the bands stale.
  React.useEffect(() => {
    timeout.start(REST_DELAY, build);
  }, [timeout, build, itemHeight, itemCount, isRtl]);

  const rebuild = useEventCallback(() => {
    timeout.start(REST_DELAY, build);
  });

  return { rebuild };
}
