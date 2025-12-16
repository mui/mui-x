'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { type BarItemIdentifier } from '../models/seriesType';
import { useSvgRef } from '../hooks/useSvgRef';
import type { UseChartTooltipSignature } from '../internals/plugins/featurePlugins/useChartTooltip';
import { type UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { type UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { type UseChartCartesianAxisSignature } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useChartContext } from '../context/ChartProvider';
import { getSVGPoint } from '../internals/getSVGPoint';
import { useStore } from '../internals/store/useStore';
import { selectorBarItemAtPosition } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisPosition.selectors';

/**
 * Hook to get pointer interaction props for chart items.
 * @param setCursorPointer If true, sets the cursor to pointer when hovering a bar.
 */
export function useInteractionItemProps(setCursorPointer: boolean) {
  const { instance } =
    useChartContext<
      [UseChartInteractionSignature, UseChartHighlightSignature, UseChartTooltipSignature]
    >();
  const svgRef = useSvgRef();
  const store = useStore<[UseChartCartesianAxisSignature, UseChartHighlightSignature]>();
  const interactionActive = React.useRef(false);
  const lastItemRef = React.useRef<BarItemIdentifier | undefined>(undefined);
  const prevCursorRef = React.useRef<string | null>(null);

  const onPointerEnter = useEventCallback(() => {
    interactionActive.current = true;
  });

  const reset = useEventCallback(() => {
    const lastItem = lastItemRef.current;

    if (lastItem) {
      lastItemRef.current = undefined;
      instance.removeTooltipItem(lastItem);
      instance.clearHighlight();
    }

    if (setCursorPointer && prevCursorRef.current !== null) {
      document.body.style.cursor = prevCursorRef.current;
      prevCursorRef.current = null;
    }
  });

  const onPointerLeave = useEventCallback(() => {
    interactionActive.current = false;
    reset();
  });

  const onPointerMove = useEventCallback((event: React.PointerEvent<SVGElement>) => {
    const element = svgRef.current;

    if (element == null) {
      return;
    }

    const svgPoint = getSVGPoint(element, event);

    if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
      return;
    }

    const item = selectorBarItemAtPosition(store.state, svgPoint);

    if (item) {
      if (setCursorPointer && prevCursorRef.current === null) {
        prevCursorRef.current = document.body.style.cursor;
        document.body.style.cursor = 'pointer';
      }

      instance.setLastUpdateSource('pointer');
      instance.setTooltipItem(item);
      instance.setHighlight(item);
      lastItemRef.current = item;
    } else {
      reset();
    }
  });

  React.useEffect(() => {
    return () => {
      /* Clean up state if this item is unmounted while active. */
      if (interactionActive.current) {
        onPointerLeave();
      }
    };
  }, [onPointerLeave]);

  return {
    onPointerEnter,
    onPointerLeave,
    onPointerMove,
  };
}
