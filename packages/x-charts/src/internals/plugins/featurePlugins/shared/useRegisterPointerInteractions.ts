'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useSvgRef } from '../../../../hooks';
import { type UseChartTooltipSignature } from '../../featurePlugins/useChartTooltip';
import { type SeriesItemIdentifierWithType } from '../../../../models/seriesType';
import { type ChartSeriesType } from '../../../../models/seriesType/config';
import { type UseChartInteractionSignature } from '../useChartInteraction';
import { type UseChartHighlightSignature } from '../useChartHighlight';
import { type UseChartCartesianAxisSignature } from '../useChartCartesianAxis';
import { useStore } from '../../../store/useStore';
import { useChartContext } from '../../../../context/ChartProvider';
import { getChartPoint } from '../../../getChartPoint';
import { type ChartState } from '../../models';

/**
 * Hook to get pointer interaction props for chart items.
 */
export function useRegisterPointerInteractions<SeriesType extends ChartSeriesType>(
  getItemAtPosition: (
    state: ChartState<[UseChartCartesianAxisSignature, UseChartHighlightSignature<SeriesType>]>,
    point: { x: number; y: number },
  ) => SeriesItemIdentifierWithType<SeriesType> | undefined,
  onItemEnter?: () => void,
  onItemLeave?: () => void,
) {
  const { instance } =
    useChartContext<
      [
        UseChartInteractionSignature,
        UseChartHighlightSignature<SeriesType>,
        UseChartTooltipSignature,
      ]
    >();
  const svgRef = useSvgRef();
  const store =
    useStore<[UseChartCartesianAxisSignature, UseChartHighlightSignature<SeriesType>]>();
  const interactionActive = React.useRef(false);
  const lastItemRef = React.useRef<SeriesItemIdentifierWithType<SeriesType> | undefined>(undefined);

  const onItemEnterRef = useEventCallback(() => onItemEnter?.());
  const onItemLeaveRef = useEventCallback(() => onItemLeave?.());

  React.useEffect(() => {
    const svg = svgRef.current;

    if (!svg) {
      return undefined;
    }

    function onPointerEnter() {
      interactionActive.current = true;
    }

    function reset() {
      const lastItem = lastItemRef.current;

      if (lastItem) {
        lastItemRef.current = undefined;
        instance.removeTooltipItem(lastItem);
        instance.clearHighlight();
        onItemLeaveRef();
      }
    }

    function onPointerLeave() {
      interactionActive.current = false;
      reset();
    }

    const onPointerMove = function onPointerMove(event: PointerEvent) {
      const svgPoint = getChartPoint(svg, event);

      if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
        reset();
        return;
      }

      const item = getItemAtPosition(store.state, svgPoint);

      if (item) {
        instance.setLastUpdateSource('pointer');
        instance.setTooltipItem(item);
        instance.setHighlight(item);
        onItemEnterRef();
        lastItemRef.current = item;
      } else {
        reset();
      }
    };

    svg.addEventListener('pointerleave', onPointerLeave);
    svg.addEventListener('pointermove', onPointerMove);
    svg.addEventListener('pointerenter', onPointerEnter);

    return () => {
      svg.removeEventListener('pointerenter', onPointerEnter);
      svg.removeEventListener('pointermove', onPointerMove);
      svg.removeEventListener('pointerleave', onPointerLeave);

      /* Clean up state if this item is unmounted while active. */
      if (interactionActive.current) {
        onPointerLeave();
      }
    };
  }, [getItemAtPosition, instance, onItemEnterRef, onItemLeaveRef, store, svgRef]);
}
