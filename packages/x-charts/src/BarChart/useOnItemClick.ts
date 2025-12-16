import * as React from 'react';
import { useChartContext } from '../context/ChartProvider';
import { type IndividualBarPlotProps } from './IndividualBarPlot';
import { useStore } from '../internals/store/useStore';
import { getSVGPoint } from '../internals/getSVGPoint';
import { type UseChartCartesianAxisSignature } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { type UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { useSvgRef } from '../hooks/useSvgRef';
import { selectorBarItemAtPosition } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisPosition.selectors';

export function useOnItemClick(onItemClick: IndividualBarPlotProps['onItemClick'] | undefined) {
  const { instance } = useChartContext();
  const svgRef = useSvgRef();
  const store = useStore<[UseChartCartesianAxisSignature, UseChartHighlightSignature]>();
  const lastPointerUpRef = React.useRef<Pick<MouseEvent, 'clientX' | 'clientY'> | null>(null);

  const onClick = function onClick(event: React.MouseEvent<SVGElement, MouseEvent>) {
    const element = svgRef.current;

    if (element == null) {
      return;
    }

    const lastPointerUp = lastPointerUpRef.current;

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

    lastPointerUpRef.current = null;

    const svgPoint = getSVGPoint(element, point);

    if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
      return;
    }

    const item = selectorBarItemAtPosition(store.state, svgPoint);

    if (item) {
      onItemClick?.(event, {
        type: 'bar',
        seriesId: item.seriesId,
        dataIndex: item.dataIndex,
      });
    }
  };

  const onPointerUp = function onPointerUp(event: React.PointerEvent<SVGElement>) {
    lastPointerUpRef.current = event;
  };

  return {
    onClick: onItemClick ? onClick : undefined,
    onPointerUp: onItemClick ? onPointerUp : undefined,
  };
}
