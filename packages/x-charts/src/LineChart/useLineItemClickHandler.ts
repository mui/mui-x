'use client';
import * as React from 'react';
import { useChartsLayerContainerRef } from '../hooks/useChartsLayerContainerRef';
import { useXAxes } from '../hooks/useAxis';
import { useLineSeriesContext } from '../hooks/useLineSeries';
import { getChartPoint } from '../internals/getChartPoint';
import { getAxisIndex } from '../internals/plugins/featurePlugins/useChartCartesianAxis/getAxisValue';
import type { LineItemClickIdentifier } from '../models/seriesType/line';
import type { SeriesId } from '../models/seriesType/common';
import { useActivateChartItem } from '../hooks/useActivateChartItem';

/**
 * Creates a click handler for line and area paths that enriches the item
 * identifier with the `dataIndex` of the closest data point along the x-axis.
 *
 * The index is derived from the click position, using the same logic as the
 * axis interaction (tooltip, highlight, `onAxisClick`). The callback is not
 * fired when the click position cannot be associated with a data point.
 */
export function useLineItemClickHandler(
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    lineItemIdentifier: LineItemClickIdentifier,
  ) => void,
): ((event: React.MouseEvent<SVGElement, MouseEvent>, seriesId: SeriesId) => void) | undefined {
  const chartsLayerContainerRef = useChartsLayerContainerRef();
  const activateItem = useActivateChartItem();
  const { xAxis: xAxes, xAxisIds } = useXAxes();
  const seriesData = useLineSeriesContext();
  const defaultXAxisId = xAxisIds[0];

  return React.useMemo(() => {
    return (event: React.MouseEvent<SVGElement, MouseEvent>, seriesId: SeriesId) => {
      const element = chartsLayerContainerRef.current;
      const xAxisId = seriesData?.series[seriesId]?.xAxisId ?? defaultXAxisId;
      const xAxis = xAxisId === undefined ? undefined : xAxes[xAxisId];

      if (element === null || xAxis === undefined) {
        return;
      }

      const point = getChartPoint(element, event);
      const dataIndex = getAxisIndex(xAxis, point.x);
      if (dataIndex === -1) {
        return;
      }

      const identifier: LineItemClickIdentifier = { type: 'line', seriesId, dataIndex };
      activateItem(identifier);
      onItemClick?.(event, identifier);
    };
  }, [activateItem, onItemClick, chartsLayerContainerRef, seriesData, defaultXAxisId, xAxes]);
}
