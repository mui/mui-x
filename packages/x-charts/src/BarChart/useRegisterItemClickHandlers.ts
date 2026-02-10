'use client';
import * as React from 'react';
import { type BarItemIdentifier } from '../models/seriesType';
import { useSvgRef } from '../hooks/useSvgRef';
import { type UseChartTooltipSignature } from '../internals/plugins/featurePlugins/useChartTooltip';
import { type UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { type UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { type UseChartCartesianAxisSignature } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useChartContext } from '../context/ChartProvider';
import { getSurfacePoint } from '../internals/getSurfacePoint';
import { useStore } from '../internals/store/useStore';
import { selectorBarItemAtPosition } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisPosition.selectors';

/**
 * Hook that registers pointer event handlers for chart item clicking.
 * @param onItemClick Callback for item click events.
 */
export function useRegisterItemClickHandlers(
  onItemClick: ((event: MouseEvent, barItemIdentifier: BarItemIdentifier) => void) | undefined,
) {
  const { instance } =
    useChartContext<
      [UseChartInteractionSignature, UseChartHighlightSignature, UseChartTooltipSignature]
    >();
  const svgRef = useSvgRef();
  const store = useStore<[UseChartCartesianAxisSignature, UseChartHighlightSignature]>();

  React.useEffect(() => {
    const element = svgRef.current;

    if (!element || !onItemClick) {
      return undefined;
    }

    let lastPointerUp: Pick<MouseEvent, 'clientX' | 'clientY'> | null = null;

    const onClick = function onClick(event: MouseEvent) {
      let point: Pick<MouseEvent, 'clientX' | 'clientY'> = event;

      /* The click event doesn't contain decimal values in clientX/Y, but the pointermove does.
       * This caused a problem when rendering many bars that were thinner than a pixel where the tooltip or the highlight
       * would refer to a different bar than the click since those rely on the pointermove event.
       * As a fix, we use the pointerup event to get the decimal values and check if the pointer up event was close enough
       * to the click event (1px difference in each direction); if so, then we can use the pointerup's clientX/Y; if not,
       * we default to the click event's clientX/Y. */
      if (lastPointerUp) {
        if (
          Math.abs(event.clientX - lastPointerUp.clientX) <= 1 &&
          Math.abs(event.clientY - lastPointerUp.clientY) <= 1
        ) {
          point = {
            clientX: lastPointerUp.clientX,
            clientY: lastPointerUp.clientY,
          };
        }
      }

      lastPointerUp = null;

      const svgPoint = getSurfacePoint(element, point);

      if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
        return;
      }

      const item = selectorBarItemAtPosition(store.state, svgPoint);

      if (item) {
        onItemClick(event, {
          type: 'bar',
          seriesId: item.seriesId,
          dataIndex: item.dataIndex,
        });
      }
    };

    const onPointerUp = function onPointerUp(event: PointerEvent) {
      lastPointerUp = event;
    };

    element.addEventListener('click', onClick);
    element.addEventListener('pointerup', onPointerUp);

    return () => {
      element.removeEventListener('click', onClick);
      element.removeEventListener('pointerup', onPointerUp);
    };
  }, [instance, onItemClick, store, svgRef]);
}
