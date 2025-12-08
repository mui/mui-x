import type * as React from 'react';
import { useChartContext } from '../context/ChartProvider';
import { type IndividualBarPlotProps } from './IndividualBarPlot';
import { getBarItemAtPosition } from './getBarItemAtPosition';
import { useStore } from '../internals/store/useStore';
import { getSVGPoint } from '../internals/getSVGPoint';
import { type UseChartCartesianAxisSignature } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { type UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { useSvgRef } from '../hooks/useSvgRef';

export function useOnItemClick(onItemClick: IndividualBarPlotProps['onItemClick'] | undefined) {
  const { instance } = useChartContext();
  const svgRef = useSvgRef();
  const store = useStore<[UseChartCartesianAxisSignature, UseChartHighlightSignature]>();

  return function onClick(event: React.MouseEvent<SVGElement, MouseEvent>) {
    const element = svgRef.current;

    if (element == null) {
      return;
    }

    const svgPoint = getSVGPoint(element, event);

    if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
      return;
    }

    const item = getBarItemAtPosition(store, svgPoint);

    if (item) {
      onItemClick?.(event, {
        type: 'bar',
        seriesId: item.seriesId,
        dataIndex: item.dataIndex,
      });
    }
  };
}
