'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useSvgRef } from '../hooks/useSvgRef';
import type { UseChartTooltipSignature } from '../internals/plugins/featurePlugins/useChartTooltip';
import { type UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { type UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { type UseChartCartesianAxisSignature } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useChartContext } from '../context/ChartProvider';
import { getSVGPoint } from '../internals/getSVGPoint';
import { getBarItemAtPosition } from './getBarItemAtPosition';
import { useStore } from '../internals/store/useStore';

export function useInteractionItemProps() {
  const { instance } =
    useChartContext<
      [UseChartInteractionSignature, UseChartHighlightSignature, UseChartTooltipSignature]
    >();
  const svgRef = useSvgRef();
  const store = useStore<[UseChartCartesianAxisSignature, UseChartHighlightSignature]>();
  const interactionActive = React.useRef(false);
  const lastItemRef = React.useRef<ReturnType<typeof getBarItemAtPosition>>(undefined);

  const onPointerEnter = useEventCallback(() => {
    interactionActive.current = true;
  });

  const onPointerLeave = useEventCallback(() => {
    interactionActive.current = false;
    const lastItem = lastItemRef.current;

    if (lastItem) {
      lastItemRef.current = undefined;
      instance.removeTooltipItem(lastItem);
      instance.clearHighlight();
    }
  });

  const onPointerMove = useEventCallback((event: React.PointerEvent<SVGElement>) => {
    const element = svgRef.current;

    if (element == null) {
      return;
    }

    // Round the coordinates to avoid sub-pixel issues.
    const svgPoint = getSVGPoint(element, {
      clientX: Math.round(event.clientX),
      clientY: Math.round(event.clientY),
    });

    if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
      return;
    }

    const item = getBarItemAtPosition(store, svgPoint);

    if (item) {
      instance.setLastUpdateSource('pointer');
      instance.setTooltipItem(item);
      instance.setHighlight(item);
      lastItemRef.current = item;
    } else {
      const lastItem = lastItemRef.current;

      if (lastItem) {
        lastItemRef.current = undefined;
        instance.removeTooltipItem(lastItem);
        instance.clearHighlight();
      }
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
