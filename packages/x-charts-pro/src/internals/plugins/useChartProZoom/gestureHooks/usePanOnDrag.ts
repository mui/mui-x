'use client';
import * as React from 'react';
import {
  ChartPlugin,
  useSelector,
  selectorChartDrawingArea,
  ZoomData,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { PanEvent } from '@web-gestures/core';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { UseChartProZoomSignature } from '../useChartProZoom.types';
import { translateZoom } from './useZoom.utils';

function getScrollParent(element: Element | null, includeHidden: boolean = false): Element {
  if (!element) {
    return document.body;
  }

  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === 'absolute';
  const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

  if (style.position === 'fixed') {
    return document.body;
  }
  // eslint-disable-next-line no-cond-assign
  for (let parent: Element | null = element; (parent = parent.parentElement); ) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === 'static') {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent;
    }
  }

  return document.body;
}

export const usePanOnDrag = (
  {
    store,
    instance,
    svgRef,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance' | 'svgRef'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const optionsLookup = useSelector(store, selectorChartZoomOptionsLookup);
  const isChangingRef = React.useRef(false);
  const isChangingTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Add event for chart panning
  const isPanEnabled = React.useMemo(
    () => Object.values(optionsLookup).some((v) => v.panning) || false,
    [optionsLookup],
  );

  React.useEffect(() => {
    const element = svgRef.current;

    if (element === null || !isPanEnabled) {
      return () => {};
    }

    // Store the initial zoom data in the event detail
    // This way we can simplify the logic by using the deltas for full calculation
    // instead of always calculating the new zoom data based on the current zoom data
    const panStartHandler = instance.addInteractionListener('panStart', (event) => {
      event.detail.customData.zoomData = store.getSnapshot().zoom.zoomData;
      const scrollParent = getScrollParent(event.target as Element);
      event.detail.customData.scrollParent = scrollParent;
      event.detail.customData.scrollParentOriginalPosition = {
        top: scrollParent.scrollTop,
        left: scrollParent.scrollLeft,
      };
    });

    const rafThrottledCallback = rafThrottle(
      (
        event: PanEvent<{
          zoomData: readonly ZoomData[];
          scrollParent: Element;
          scrollParentOriginalPosition: { top: number; left: number };
        }>,
      ) => {
        const zoomData = event.detail.customData.zoomData;

        const newZoomData = translateZoom(
          zoomData,
          { x: event.detail.deltaX, y: -event.detail.deltaY },
          {
            width: drawingArea.width,
            height: drawingArea.height,
          },
          optionsLookup,
        );

        // This handles preventing the default behavior of the wheel event
        // when the zoom data is changing.
        const isEqual = isDeepEqual(zoomData, newZoomData);
        if (!isEqual || isChangingTimeoutRef.current) {
          isChangingRef.current = true;
          if (isChangingTimeoutRef.current) {
            clearTimeout(isChangingTimeoutRef.current);
          }
          isChangingTimeoutRef.current = setTimeout(() => {
            isChangingRef.current = false;
            isChangingTimeoutRef.current = null;
          }, 100);
        }

        if (!isChangingRef.current && event.detail.srcEvent.pointerType !== 'mouse') {
          const canScrollVertical =
            event.detail.customData.scrollParent.scrollHeight >
            event.detail.customData.scrollParent.clientHeight;
          const canScrollHorizontal =
            event.detail.customData.scrollParent.scrollWidth >
            event.detail.customData.scrollParent.clientWidth;
          event.detail.customData.scrollParent.scrollTo({
            ...(canScrollHorizontal
              ? {
                  left:
                    event.detail.customData.scrollParentOriginalPosition.left + event.detail.deltaX,
                }
              : {}),
            ...(canScrollVertical
              ? {
                  top:
                    event.detail.customData.scrollParentOriginalPosition.top - event.detail.deltaY,
                }
              : {}),
            behavior: 'instant',
          });
        }

        setZoomDataCallback(newZoomData);
      },
    );

    const panHandler = instance.addInteractionListener<{
      zoomData: readonly ZoomData[];
      scrollParent: Element;
      scrollParentOriginalPosition: { top: number; left: number };
    }>('pan', rafThrottledCallback);

    return () => {
      panStartHandler.cleanup();
      panHandler.cleanup();
      rafThrottledCallback.clear();
      if (isChangingTimeoutRef.current) {
        clearTimeout(isChangingTimeoutRef.current);
        isChangingTimeoutRef.current = null;
      }
      isChangingRef.current = false;
    };
  }, [
    instance,
    svgRef,
    isPanEnabled,
    optionsLookup,
    drawingArea.width,
    drawingArea.height,
    setZoomDataCallback,
    store,
  ]);
};
