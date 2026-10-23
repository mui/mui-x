'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { Store } from '@base-ui/utils/store';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import type { BaseState, ParamsWithDefaults } from '../useVirtualizer';
import type { ScrollPosition, Size } from '../models';

/* eslint-disable import/export, @typescript-eslint/no-redeclare */

export type ScrollContainer = 'self' | 'window' | HTMLElement | (() => HTMLElement | null);
export type ScrollViewportInsets = { top?: number; right?: number; bottom?: number; left?: number };

type Rect = { top: number; left: number; right: number; bottom: number };
type Owner = HTMLElement | Window;

export interface ScrollGeometry {
  external: boolean;
  bothAxes: boolean;
  ready: boolean;
  /** External owner measurement; self scrolling uses virtualization.scrollPosition. */
  position: ScrollPosition;
  renderPosition: ScrollPosition;
  rowViewportHeight: number;
  columnViewportWidth: number;
  /** Start of the visible grid intersection, before excluding pinned bands. */
  viewportTop: number;
  viewportSize: Size;
  insets: Required<ScrollViewportInsets>;
}

function initializeState(params: ParamsWithDefaults): Scrolling.State {
  return {
    scrolling: {
      external: params.scrollContainer !== undefined && params.scrollContainer !== 'self',
      bothAxes: params.scrollContainerAxes === 'both',
      ready: false,
      position: { top: 0, left: 0 },
      renderPosition: { top: 0, left: 0 },
      rowViewportHeight: 0,
      columnViewportWidth: 0,
      viewportTop: 0,
      viewportSize: { width: 0, height: 0 },
      insets: { top: 0, right: 0, bottom: 0, left: 0, ...params.scrollViewportInsets },
    },
  };
}

/** Intersect before clamping indices: an offscreen grid has an empty viewport. */
export function intersectScrollViewport(viewport: Rect, content: Rect): Size {
  const top = Math.max(viewport.top, content.top);
  const left = Math.max(viewport.left, content.left);
  return {
    width: Math.max(0, Math.min(viewport.right, content.right) - left),
    height: Math.max(0, Math.min(viewport.bottom, content.bottom) - top),
  };
}

/** Visible data interval after clipping the pinned bands to their containing block. */
export function getVisibleScrollRange(
  ownerStart: number,
  ownerEnd: number,
  clipStart: number,
  clipEnd: number,
  size: number,
  pinnedStart: number,
  pinnedEnd: number,
) {
  const leadingEnd =
    Math.min(Math.max(ownerStart, 0), Math.max(0, size - pinnedStart)) + pinnedStart;
  const trailingStart = Math.max(0, Math.min(ownerEnd - pinnedEnd, size - pinnedEnd));
  const start = Math.max(clipStart, leadingEnd, pinnedStart);
  const end = Math.min(clipEnd, trailingStart, size - pinnedEnd);
  return { start, size: Math.max(0, end - start) };
}

function isWindow(owner: Owner): owner is Window {
  return 'window' in owner && owner.window === owner;
}

function ownerPosition(owner: Owner): ScrollPosition {
  return isWindow(owner)
    ? { top: owner.scrollY, left: owner.scrollX }
    : { top: owner.scrollTop, left: owner.scrollLeft };
}

function clientRect(element: HTMLElement): Rect {
  const rect = element.getBoundingClientRect();
  const top = rect.top + element.clientTop;
  const left = rect.left + element.clientLeft;
  return { top, left, bottom: top + element.clientHeight, right: left + element.clientWidth };
}

function ownerRect(owner: Owner, document: Document): Rect {
  return isWindow(owner)
    ? {
        top: 0,
        left: 0,
        right: document.documentElement.clientWidth,
        bottom: document.documentElement.clientHeight,
      }
    : clientRect(owner);
}

type RequiredAPI = {
  updateDimensions: (firstUpdate?: boolean) => void;
  handleScroll: () => void;
  forceUpdateRenderContext: () => void;
};

function useScrolling(store: Store<BaseState>, params: ParamsWithDefaults, api: RequiredAPI) {
  const binding = React.useRef<{
    root: HTMLElement;
    owner: Owner;
    scroller: HTMLElement | null;
    external: boolean;
    bothAxes: boolean;
    cleanup: () => void;
  } | null>(null);
  const horizontalScrollers = React.useRef(new Set<HTMLElement>());
  const pendingHorizontalWrites = React.useRef(new WeakMap<HTMLElement, number>());
  const notifying = React.useRef(false);
  const frame = React.useRef<number | null>(null);
  const measurementInputs = React.useRef<unknown[]>([]);

  const resolveOwner = () => {
    const root = params.layout.refs.container.current;
    const target = params.scrollContainer;
    if (!root) {
      return null;
    }
    if (target === 'window') {
      return root.ownerDocument.defaultView;
    }
    if (target === undefined || target === 'self') {
      return params.layout.refs.scroller.current;
    }
    return typeof target === 'function' ? target() : target;
  };

  const measure = useEventCallback(() => {
    const root = params.layout.refs.container.current;
    const scroller = params.layout.refs.scroller.current;
    const owner = resolveOwner();
    const external = params.scrollContainer !== undefined && params.scrollContainer !== 'self';
    const bothAxes = params.scrollContainerAxes === 'both';
    const insets = { top: 0, right: 0, bottom: 0, left: 0, ...params.scrollViewportInsets };
    let next = {
      ...store.state.scrolling,
      external,
      bothAxes,
      insets,
      ready: Boolean(root && owner),
    };
    if (root && owner) {
      if (external) {
        const view = root.ownerDocument.defaultView!;
        const documentElement = root.ownerDocument.documentElement;
        const viewport = ownerRect(owner, root.ownerDocument);
        viewport.top += insets.top;
        viewport.bottom -= insets.bottom;
        viewport.left += insets.left;
        viewport.right -= insets.right;
        const ownerViewport = { ...viewport };
        // The owner can itself be clipped by another scrollport or by the window.
        viewport.top = Math.max(0, viewport.top);
        viewport.left = Math.max(0, viewport.left);
        viewport.bottom = Math.min(documentElement.clientHeight, viewport.bottom);
        viewport.right = Math.min(documentElement.clientWidth, viewport.right);
        for (
          let ancestor = root.parentElement;
          ancestor && ancestor !== documentElement;
          ancestor = ancestor.parentElement
        ) {
          if (ancestor === owner || ancestor === root.ownerDocument.body) {
            continue;
          }
          const style = view.getComputedStyle(ancestor);
          const clipsY = /(auto|scroll|hidden|clip)/.test(style.overflowY);
          const clipsX = /(auto|scroll|hidden|clip)/.test(style.overflowX);
          if (!clipsX && !clipsY) {
            continue;
          }
          const bounds = clientRect(ancestor);
          if (clipsY) {
            viewport.top = Math.max(viewport.top, bounds.top);
            viewport.bottom = Math.min(viewport.bottom, bounds.bottom);
          }
          if (clipsX) {
            viewport.left = Math.max(viewport.left, bounds.left);
            viewport.right = Math.min(viewport.right, bounds.right);
          }
        }
        const bounds = clientRect(root);
        const intersection = intersectScrollViewport(viewport, bounds);
        const { isRtl } = params.virtualization;
        const externalLeft = isRtl
          ? ownerViewport.right - bounds.right
          : ownerViewport.left - bounds.left;
        const dimensions = store.state.dimensions;
        const lane =
          !bothAxes &&
          dimensions.columnsTotalWidth > root.clientWidth &&
          !params.disableHorizontalScroll
            ? dimensions.scrollbarSize
            : 0;
        const rowRange = getVisibleScrollRange(
          ownerViewport.top - bounds.top,
          ownerViewport.bottom - bounds.top,
          viewport.top - bounds.top,
          viewport.bottom - bounds.top,
          root.clientHeight,
          dimensions.topContainerHeight,
          dimensions.bottomContainerHeight + lane,
        );
        const left = bothAxes ? externalLeft : (scroller?.scrollLeft ?? 0);
        const inlineStart = isRtl ? -left : left;
        const clippedStart = isRtl ? bounds.right - viewport.right : viewport.left - bounds.left;
        const clippedEnd = isRtl ? bounds.right - viewport.left : viewport.right - bounds.left;
        const columnRange = getVisibleScrollRange(
          inlineStart,
          inlineStart + (bothAxes ? ownerViewport.right - ownerViewport.left : root.clientWidth),
          clippedStart + (bothAxes ? 0 : inlineStart),
          clippedEnd + (bothAxes ? 0 : inlineStart),
          Math.max(dimensions.columnsTotalWidth, root.clientWidth),
          dimensions.leftPinnedWidth,
          dimensions.rightPinnedWidth,
        );
        next = {
          ...next,
          position: {
            top: ownerViewport.top - bounds.top,
            left,
          },
          renderPosition: {
            top: Math.max(0, rowRange.start - dimensions.topContainerHeight),
            left: (isRtl ? -1 : 1) * Math.max(0, columnRange.start - dimensions.leftPinnedWidth),
          },
          rowViewportHeight: intersection.width > 0 ? rowRange.size : 0,
          columnViewportWidth: columnRange.size,
          viewportTop: Math.max(0, viewport.top - bounds.top),
          viewportSize: intersection,
        };
      }
    }
    return isDeepEqual(store.state.scrolling, next) ? store.state.scrolling : next;
  });

  const synchronizeHorizontal = useEventCallback(() => {
    if (!store.state.scrolling.external || store.state.scrolling.bothAxes) {
      return;
    }
    const left = params.layout.refs.scroller.current?.scrollLeft ?? 0;
    horizontalScrollers.current.forEach((node) => {
      if (node.scrollLeft !== left) {
        pendingHorizontalWrites.current.set(node, left);
        node.scrollLeft = left;
      }
    });
  });

  const notify = useEventCallback((fromScroll = false) => {
    if (notifying.current) {
      return;
    }
    notifying.current = true;
    try {
      const previous = store.state.scrolling;
      const geometry = measure();
      if (previous === geometry && !fromScroll) {
        return;
      }
      // Dimension and range updates consume the same measurement, before notifying
      // subscribers. A read through getScrollPosition must not consume this update.
      const previousState = store.state;
      store.state.scrolling = geometry;
      if (
        geometry.external &&
        (!previous.ready ||
          previous.viewportSize.width !== geometry.viewportSize.width ||
          previous.viewportSize.height !== geometry.viewportSize.height ||
          previous.rowViewportHeight !== geometry.rowViewportHeight)
      ) {
        api.updateDimensions();
      }
      // A native echo from an earlier write can arrive after another band has
      // received input. Do not overwrite that input when the body hasn't moved.
      if (previous.position.left !== geometry.position.left) {
        synchronizeHorizontal();
      }
      if (fromScroll) {
        api.handleScroll();
      } else {
        api.forceUpdateRenderContext();
      }
      // Other store updates already publish this measurement. Only notify separately
      // when geometry moved without a dimension or render-context update.
      if (previous !== geometry && previousState === store.state) {
        store.notifyAll();
      }
    } finally {
      notifying.current = false;
    }
  });
  const onScroll = useEventCallback(() => {
    if (store.state.scrolling.external) {
      notify(true);
    } else {
      // Preserve the existing self-scrolling hot path: no geometry or second publication.
      api.handleScroll();
    }
  });
  const onWheel = useEventCallback((event: Event) =>
    params.onWheel?.(event as unknown as React.WheelEvent),
  );
  const onTouchMove = useEventCallback((event: Event) =>
    params.onTouchMove?.(event as unknown as React.TouchEvent),
  );

  const refresh = useEventCallback((force: boolean) => {
    const root = params.layout.refs.container.current;
    const scroller = params.layout.refs.scroller.current;
    const owner = resolveOwner();
    const external = params.scrollContainer !== undefined && params.scrollContainer !== 'self';
    const bothAxes = params.scrollContainerAxes === 'both';
    if (
      binding.current?.root !== root ||
      binding.current?.owner !== owner ||
      binding.current?.scroller !== scroller ||
      binding.current?.external !== external ||
      binding.current?.bothAxes !== bothAxes
    ) {
      binding.current?.cleanup();
      binding.current = null;
      if (root && owner) {
        const view = root.ownerDocument.defaultView!;
        const cleanup: Array<() => void> = [];
        const listen = (target: EventTarget, event: string, listener: EventListener) => {
          target.addEventListener(event, listener, { passive: true });
          cleanup.push(() => target.removeEventListener(event, listener));
        };
        const schedule = () => {
          if (frame.current === null) {
            frame.current = view.requestAnimationFrame(() => {
              frame.current = null;
              notify();
            });
          }
        };
        const targets = new Set<EventTarget>([owner]);
        if (scroller && (!external || !bothAxes)) {
          targets.add(scroller);
        }
        targets.forEach((target) => listen(target, 'scroll', onScroll));
        listen(owner, 'wheel', onWheel);
        listen(owner, 'touchmove', onTouchMove);
        if (external) {
          listen(view, 'resize', schedule);
          const resizeObserver =
            typeof view.ResizeObserver === 'function'
              ? new view.ResizeObserver(schedule)
              : undefined;
          const mutationObserver = new view.MutationObserver(() => {
            observeSurroundings();
            schedule();
          });
          // Observe the ancestor path and its siblings, never virtualized row children.
          function observeSurroundings() {
            if (!root) {
              return;
            }
            resizeObserver?.disconnect();
            mutationObserver.disconnect();
            resizeObserver?.observe(root);
            for (
              let node: HTMLElement | null = root;
              node?.parentElement;
              node = node.parentElement
            ) {
              const parent = node.parentElement;
              resizeObserver?.observe(parent);
              Array.from(parent.children).forEach((child) => resizeObserver?.observe(child));
              mutationObserver.observe(parent, { childList: true });
              if (parent === root.ownerDocument.body) {
                break;
              }
            }
          }
          observeSurroundings();
          for (let ancestor = root.parentElement; ancestor; ancestor = ancestor.parentElement) {
            if (
              !targets.has(ancestor) &&
              /(auto|scroll|hidden)/.test(view.getComputedStyle(ancestor).overflow)
            ) {
              listen(ancestor, 'scroll', onScroll);
            }
          }
          if (!targets.has(view)) {
            listen(view, 'scroll', onScroll);
          }
          cleanup.push(
            () => resizeObserver?.disconnect(),
            () => mutationObserver.disconnect(),
          );
        }
        binding.current = {
          root,
          owner,
          scroller,
          external,
          bothAxes,
          cleanup: () => {
            cleanup.forEach((fn) => fn());
            if (frame.current !== null) {
              view.cancelAnimationFrame(frame.current);
              frame.current = null;
            }
          },
        };
      }
    }
    // Compare resolved values: callers commonly pass inline getters and inset objects.
    const inputs = [
      root,
      owner,
      scroller,
      external,
      bothAxes,
      store.state.dimensions,
      params.virtualization.isRtl,
      params.disableHorizontalScroll,
      params.scrollViewportInsets?.top,
      params.scrollViewportInsets?.right,
      params.scrollViewportInsets?.bottom,
      params.scrollViewportInsets?.left,
    ];
    if (force || inputs.some((value, index) => value !== measurementInputs.current[index])) {
      measurementInputs.current = inputs;
      notify();
    }
  });

  const refreshScrollContainer = useEventCallback(() => refresh(true));
  const getScrollPosition = useEventCallback(() => {
    const root = params.layout.refs.container.current;
    const owner = resolveOwner();
    if (!root || !owner) {
      return { ...store.state.scrolling.position };
    }
    if (params.scrollContainer === undefined || params.scrollContainer === 'self') {
      return ownerPosition(owner);
    }
    const viewport = ownerRect(owner, root.ownerDocument);
    const bounds = clientRect(root);
    const insets = params.scrollViewportInsets;
    let left = params.layout.refs.scroller.current?.scrollLeft ?? 0;
    if (params.scrollContainerAxes === 'both') {
      left = params.virtualization.isRtl
        ? viewport.right - (insets?.right ?? 0) - bounds.right
        : viewport.left + (insets?.left ?? 0) - bounds.left;
    }
    return { top: viewport.top + (insets?.top ?? 0) - bounds.top, left };
  });

  const scrollToPosition = useEventCallback((position: Partial<ScrollPosition>) => {
    const owner = resolveOwner();
    if (!params.layout.refs.container.current || !owner) {
      return false;
    }
    const external = params.scrollContainer !== undefined && params.scrollContainer !== 'self';
    const bothAxes = params.scrollContainerAxes === 'both';
    const currentPosition =
      external && (position.top !== undefined || (bothAxes && position.left !== undefined))
        ? getScrollPosition()
        : { top: 0, left: 0 };
    const horizontalOwner = external && !bothAxes ? params.layout.refs.scroller.current : owner;
    let changed = false;
    const write = (target: Owner, axis: 'top' | 'left', value: number) => {
      const current = ownerPosition(target);
      if (current[axis] !== value) {
        if (isWindow(target)) {
          target.scrollTo({ ...current, [axis]: value, behavior: 'instant' });
        } else if (axis === 'top') {
          target.scrollTop = value;
        } else {
          target.scrollLeft = value;
        }
        changed = ownerPosition(target)[axis] !== current[axis] || changed;
      }
    };
    if (position.top !== undefined) {
      write(
        owner,
        'top',
        external ? ownerPosition(owner).top + position.top - currentPosition.top : position.top,
      );
    }
    if (position.left !== undefined && horizontalOwner) {
      write(
        horizontalOwner,
        'left',
        external && bothAxes
          ? ownerPosition(horizontalOwner).left + position.left - currentPosition.left
          : position.left,
      );
    }
    notify();
    return changed;
  });

  const registerHorizontalScroller = useEventCallback((node: HTMLElement) => {
    horizontalScrollers.current.add(node);
    const handleScroll = () => {
      if (pendingHorizontalWrites.current.get(node) === node.scrollLeft) {
        return;
      }
      pendingHorizontalWrites.current.delete(node);
      scrollToPosition({ left: node.scrollLeft });
    };
    node.addEventListener('scroll', handleScroll, { passive: true });
    synchronizeHorizontal();
    return () => {
      horizontalScrollers.current.delete(node);
      node.removeEventListener('scroll', handleScroll);
    };
  });

  useEnhancedEffect(() => refresh(false));
  // Parent refs can attach after the child's layout effects.
  React.useEffect(() => refresh(false), [refresh]);
  useEnhancedEffect(
    () => () => {
      binding.current?.cleanup();
      binding.current = null;
      measurementInputs.current = [];
    },
    [],
  );

  return {
    getScrollPosition,
    scrollToPosition,
    refreshScrollContainer,
    registerHorizontalScroller,
  };
}

export const Scrolling = { initialize: initializeState, use: useScrolling };
export namespace Scrolling {
  export type State = { scrolling: ScrollGeometry };
  export type API = ReturnType<typeof useScrolling>;
}
