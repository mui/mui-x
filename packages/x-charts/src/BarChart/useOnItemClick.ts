import type * as React from 'react';
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

  return function onClick(event: React.MouseEvent<SVGElement, MouseEvent>) {
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

    const item = selectorBarItemAtPosition(store.state, svgPoint);

    if (item) {
      onItemClick?.(event, {
        type: 'bar',
        seriesId: item.seriesId,
        dataIndex: item.dataIndex,
      });
    }
  };
}
