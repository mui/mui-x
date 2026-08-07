'use client';
import * as React from 'react';
import { useChartsLayerContainerRef } from '../hooks/useChartsLayerContainerRef';
import { useXAxes } from '../hooks/useAxis';
import { useLineSeriesContext } from '../hooks/useLineSeries';
import { getChartPoint } from '../internals/getChartPoint';
import { getAxisIndex } from '../internals/plugins/featurePlugins/useChartCartesianAxis/getAxisValue';
import type { LineItemClickIdentifier } from '../models/seriesType/line';
import type { SeriesId } from '../models/seriesType/common';
import type { ChartsActivationEvent } from '../models/events';
import { useRegisterItemActivation } from '../internals/useRegisterItemActivation';

/**
 * Priorities matching the pointer hit-testing order: marks sit above lines, lines above areas.
 * The topmost callback a pointer would reach is the one keyboard activation fires.
 */
export const LINE_ACTIVATION_PRIORITY = { mark: 2, line: 1, area: 0 };

/**
 * Registers <kbd>Enter</kbd>/<kbd>Space</kbd> activation of the focused line item.
 */
export function useRegisterLineItemActivation(
  onItemClick:
    | ((
        event: ChartsActivationEvent<SVGElement>,
        lineItemIdentifier: LineItemClickIdentifier,
      ) => void)
    | undefined,
  priority: number,
  /**
   * Declines items the caller does not render, so activation falls through to the next handler.
   * Used by the mark plot: a mark that is not shown should defer to the line, then the area.
   */
  canActivate?: (item: LineItemClickIdentifier) => boolean,
) {
  useRegisterItemActivation<'line'>(
    {
      type: 'line',
      priority,
      canActivate:
        canActivate &&
        ((item) => {
          // The dispatcher matches the `line` type before calling this, so the item is a line item.
          const lineItem = item as LineItemClickIdentifier;
          return canActivate({
            type: 'line',
            seriesId: lineItem.seriesId,
            dataIndex: lineItem.dataIndex,
          });
        }),
    },
    onItemClick &&
      ((event, item) =>
        onItemClick(event, {
          type: 'line',
          seriesId: item.seriesId,
          dataIndex: item.dataIndex,
        })),
  );
}

/**
 * Creates a click handler for line and area paths that enriches the item
 * identifier with the `dataIndex` of the closest data point along the x-axis.
 *
 * The index is derived from the click position, using the same logic as the
 * axis interaction (tooltip, highlight, `onAxisClick`). The callback is not
 * fired when the click position cannot be associated with a data point.
 */
export function useLineItemClickHandler(
  onItemClick:
    | ((
        event: ChartsActivationEvent<SVGElement>,
        lineItemIdentifier: LineItemClickIdentifier,
      ) => void)
    | undefined,
  priority: number,
  /**
   * Declines items the caller does not render, so activation falls through to the next handler.
   * The area plot uses it to defer when the series has no area drawn.
   */
  canActivate?: (item: LineItemClickIdentifier) => boolean,
): ((event: React.MouseEvent<SVGElement, MouseEvent>, seriesId: SeriesId) => void) | undefined {
  useRegisterLineItemActivation(onItemClick, priority, canActivate);

  const chartsLayerContainerRef = useChartsLayerContainerRef();
  const { xAxis: xAxes, xAxisIds } = useXAxes();
  const seriesData = useLineSeriesContext();
  const defaultXAxisId = xAxisIds[0];

  return React.useMemo(() => {
    if (!onItemClick) {
      return undefined;
    }

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

      onItemClick(event, { type: 'line', seriesId, dataIndex });
    };
  }, [onItemClick, chartsLayerContainerRef, seriesData, defaultXAxisId, xAxes]);
}
