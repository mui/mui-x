'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import type {
  UseChartTooltipSignature,
  UseChartHighlightSignature,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature,
} from '@mui/x-charts/internals';
import { useSvgRef } from '@mui/x-charts/hooks';
import { useChartContext, getSVGPoint, useStore } from '@mui/x-charts/internals';
import { type HeatmapItemIdentifier } from '../models/seriesType';
import { selectorHeatmapItemAtPosition } from '../plugins/selectors/useChartHeatmapPosition.selectors';

/**
 * Hook to get pointer interaction props for chart items.
 */
export function useInteractionItemProps() {
  const { instance } =
    useChartContext<
      [UseChartInteractionSignature, UseChartHighlightSignature, UseChartTooltipSignature]
    >();
  const svgRef = useSvgRef();
  const store = useStore<[UseChartCartesianAxisSignature, UseChartHighlightSignature]>();
  const interactionActive = React.useRef(false);
  const lastItemRef = React.useRef<HeatmapItemIdentifier | undefined>(undefined);

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

    const item = selectorHeatmapItemAtPosition(store.state, svgPoint);

    if (item) {
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
