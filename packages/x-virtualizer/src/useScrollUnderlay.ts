'use client';
import * as React from 'react';
import ownerDocument from '@mui/utils/ownerDocument';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';

/*
 * On a fast scroll, browsers can show items the compositor scrolled into view before it has
 * rasterized them, as blank areas. Rasterizing ahead does not help: Chrome, for example, draws
 * only ~300px past the visible area in advance, and a fling's first frames can move a whole
 * viewport per frame.
 *
 * The underlay holds look-alike items across the whole area the items scroll in, behind them, so
 * the browser draws it with the rest of what is in view. While scrolling, nothing about it changes
 * but its position: a scroll-driven animation moves it with the items, and jumps it back every
 * `PERIOD_ITEM_COUNT` items, so it keeps lining up with them without ever leaving the area.
 * Missing items show the underlay; elsewhere the items hide it.
 *
 * Its position depends on the scroll position alone, so it holds up in both directions and through
 * flings too close together for the scroll to stop. The content is rebuilt once the scroll stops.
 */

// How far the underlay moves before it jumps back. It rests halfway through, so what a scroll
// brings into view is at most half of this past the area, which the browser draws in advance.
const PERIOD_ITEM_COUNT = 4;
// How long the scroll has to stop before the content is rebuilt.
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
  /** The number of items. The underlay is rebuilt when it changes. */
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

type Layer = {
  // Moves with the vertical scroll.
  element: HTMLDivElement;
  // Moves with the horizontal scroll.
  content: HTMLDivElement;
  y: ScrollTimeline;
  x: ScrollTimeline;
  animations: Animation[];
};

function createLayer(scroller: HTMLElement, doc: Document): Layer {
  const element = doc.createElement('div');
  element.style.position = 'absolute';
  element.style.left = '0';
  element.style.right = '0';
  const content = doc.createElement('div');
  content.style.position = 'absolute';
  content.style.top = '0';
  content.style.left = '0';
  element.append(content);
  return {
    element,
    content,
    y: new ScrollTimeline({ source: scroller, axis: 'block' }),
    x: new ScrollTimeline({ source: scroller, axis: 'inline' }),
    animations: [],
  };
}

function fill(layer: Layer, content: Node[], pinned: Node[]) {
  layer.content.replaceChildren(...content);
  layer.element.replaceChildren(layer.content, ...pinned);
}

/**
 * Keeps an underlay behind a list or grid: content that looks like the items, which shows
 * through the blank gaps a fast scroll can leave.
 *
 * During a fast scroll, the browser can show items before it has drawn them. This hook keeps
 * look-alike items behind the items, across the area they scroll in, and moves them with the
 * scroll, so those gaps show the underlay instead of blank space.
 *
 * To use it, render the element for `underlayRef` behind the scroller, and give the items an
 * opaque background: the underlay is behind them at all times. Browsers without scroll-driven
 * animations get no underlay.
 */
export function useScrollUnderlay(
  parameters: UseScrollUnderlayParameters,
): UseScrollUnderlayReturnValue {
  const { scrollerRef, underlayRef, itemHeight, itemCount, isRtl = false } = parameters;
  const timeout = useTimeout();
  const layerRef = React.useRef<Layer | null>(null);

  const build = useEventCallback(() => {
    const scroller = scrollerRef.current;
    const underlay = underlayRef.current;
    const layer = layerRef.current;
    if (!scroller || !underlay || !layer) {
      return;
    }
    layer.animations.forEach((animation) => animation.cancel());
    layer.animations = [];
    // Nothing can move past what is drawn without a vertical scroll.
    const scrollTopMax = scroller.scrollHeight - scroller.clientHeight;
    // The items fill the area wherever a period puts them, from up to a period and an item above.
    const underlayItemCount = Math.ceil(underlay.clientHeight / itemHeight) + PERIOD_ITEM_COUNT + 1;
    const underlayContent =
      itemHeight > 0 && scrollTopMax > 0
        ? parameters.getUnderlayContent({ itemCount: underlayItemCount, itemHeight })
        : null;
    if (!underlayContent) {
      fill(layer, [], []);
      return;
    }
    fill(layer, underlayContent.content, underlayContent.pinned ?? []);

    // Starts at the item the top edge cuts, so the items line up with the real ones.
    const { scrollTop } = scroller;
    const period = PERIOD_ITEM_COUNT * itemHeight;
    const firstItem = Math.floor(scrollTop / itemHeight);
    layer.element.style.top = `${firstItem * itemHeight - scrollTop}px`;
    layer.element.style.height = `${underlayItemCount * itemHeight}px`;

    // One iteration per period across the whole scroll, which puts the rest position halfway
    // through one. The range ends past the scroll: a finished animation leaves the compositor,
    // so one that finished where the scroll stopped would miss the first frames of the next fling.
    const restProgress = Math.floor(PERIOD_ITEM_COUNT / 2) / PERIOD_ITEM_COUNT;
    const scrollRange = scrollTopMax + period;
    layer.animations.push(
      layer.element.animate([{ transform: 'none' }, { transform: `translateY(${-period}px)` }], {
        timeline: layer.y,
        rangeStart: '0px',
        rangeEnd: `${scrollRange}px`,
        iterations: scrollRange / period,
        // Iterations count from the start of the range.
        iterationStart: restProgress - scrollTop / period + Math.ceil(scrollTop / period),
      }),
    );

    const scrollLeftMax = scroller.scrollWidth - scroller.clientWidth;
    if (scrollLeftMax > 0) {
      // The box follows the left edge of the scrolled content, which starts a whole scroll
      // range left of the viewport in right-to-left content.
      const keyframes = isRtl
        ? [{ transform: `translateX(${-scrollLeftMax}px)` }, { transform: 'none' }]
        : [{ transform: 'none' }, { transform: `translateX(${-scrollLeftMax}px)` }];
      layer.animations.push(layer.content.animate(keyframes, { timeline: layer.x, fill: 'both' }));
    }
  });

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    const underlay = underlayRef.current;
    if (!scroller || !underlay || typeof ScrollTimeline === 'undefined') {
      return undefined;
    }
    const layer = createLayer(scroller, ownerDocument(underlay));
    layerRef.current = layer;
    // Out of reach of the find bar, selection, focus and assistive technology.
    underlay.inert = true;
    underlay.setAttribute('aria-hidden', 'true');
    underlay.replaceChildren(layer.element);

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
      layer.animations.forEach((animation) => animation.cancel());
      underlay.replaceChildren();
      layerRef.current = null;
    };
  }, [scrollerRef, underlayRef, timeout, build]);

  // A new item height, item count or direction makes the underlay stale.
  React.useEffect(() => {
    timeout.start(REST_DELAY, build);
  }, [timeout, build, itemHeight, itemCount, isRtl]);

  const rebuild = useEventCallback(() => {
    timeout.start(REST_DELAY, build);
  });

  return { rebuild };
}
