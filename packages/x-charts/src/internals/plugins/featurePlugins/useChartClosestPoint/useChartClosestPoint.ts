'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import type { PointerGestureEventData } from '@mui/x-internal-gestures/core';
import type { ChartPlugin } from '../../models';
import type { SeriesId } from '../../../../models/seriesType/common';
import type { UseChartClosestPointSignature } from './useChartClosestPoint.types';
import { getChartPoint } from '../../../getChartPoint';
import {
  selectorChartAxisZoomData,
  selectorChartSeriesEmptyFlatbushMap,
  selectorChartSeriesFlatbushMap,
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartZoomIsInteracting,
} from '../useChartCartesianAxis';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries/useChartSeries.selectors';
import { findClosestPoints } from './findClosestPoints';

type ClosestPoint = { dataIndex: number; seriesId: SeriesId; edgeDistance: number; radius: number };

/**
 * Return `true` if the candidate point is closer to the pointer than the current closest point.
 * By priority we prefer:
 * 1. points that are under the pointer (negative edge distance) sorted by distance to the center.
 * 2. points that are outside the pointer (positive edge distance) by distance to the edge.
 */
function isCloser(candidatePoint: ClosestPoint, currentClosestPoint: ClosestPoint | undefined) {
  if (currentClosestPoint === undefined) {
    return true;
  }

  if (candidatePoint.edgeDistance <= 0) {
    if (currentClosestPoint.edgeDistance > 0) {
      return true;
    }
    const candidateDistance = candidatePoint.edgeDistance + candidatePoint.radius;
    const currentDistance = currentClosestPoint.edgeDistance + currentClosestPoint.radius;
    return candidateDistance < currentDistance;
  }
  if (currentClosestPoint.edgeDistance <= 0) {
    return false;
  }

  return candidatePoint.edgeDistance < currentClosestPoint.edgeDistance;
}

export const useChartClosestPoint: ChartPlugin<UseChartClosestPointSignature> = ({
  params,
  store,
  instance,
}) => {
  const { chartsLayerContainerRef } = instance;
  const { disableHitArea, hitAreaRadius, onItemClick } = params;

  const resolvedDisableHitArea = disableHitArea;
  const resolvedHitAreaRadius = hitAreaRadius;

  const { axis: xAxis, axisIds: xAxisIds } = store.use(selectorChartXAxis);
  const { axis: yAxis, axisIds: yAxisIds } = store.use(selectorChartYAxis);
  const zoomIsInteracting = store.use(selectorChartZoomIsInteracting);

  const { series, seriesOrder } = store.use(selectorChartSeriesProcessed)?.scatter ?? {};
  const flatbushMap = store.use(
    zoomIsInteracting ? selectorChartSeriesEmptyFlatbushMap : selectorChartSeriesFlatbushMap,
  );

  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  useEnhancedEffect(() => {
    store.set('voronoi', { isVoronoiEnabled: !resolvedDisableHitArea });
  }, [store, resolvedDisableHitArea]);

  React.useEffect(() => {
    if (chartsLayerContainerRef.current === null || resolvedDisableHitArea) {
      return undefined;
    }
    const element = chartsLayerContainerRef.current;

    function getClosestPoint(
      event: MouseEvent,
    ):
      | { seriesId: SeriesId; dataIndex: number }
      | 'outside-chart'
      | 'outside-voronoi-max-radius'
      | 'no-point-found' {
      // Get mouse coordinate in global SVG space
      const svgPoint = getChartPoint(element, event);

      if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
        return 'outside-chart';
      }

      let closestPoint: ClosestPoint | undefined = undefined;

      for (const seriesId of seriesOrder ?? []) {
        const aSeries = (series ?? {})[seriesId];
        const entry = flatbushMap.get(seriesId);

        if (!entry || aSeries.hidden) {
          continue;
        }

        const { flatbush, getItemRadius, maxItemRadius } = entry;

        const xAxisId = aSeries.xAxisId ?? defaultXAxisId;
        const yAxisId = aSeries.yAxisId ?? defaultYAxisId;

        const xAxisZoom = selectorChartAxisZoomData(store.state, xAxisId);
        const yAxisZoom = selectorChartAxisZoomData(store.state, yAxisId);
        const maxRadius = resolvedHitAreaRadius === 'item' ? maxItemRadius : resolvedHitAreaRadius;

        const xZoomStart = (xAxisZoom?.start ?? 0) / 100;
        const xZoomEnd = (xAxisZoom?.end ?? 100) / 100;
        const yZoomStart = (yAxisZoom?.start ?? 0) / 100;
        const yZoomEnd = (yAxisZoom?.end ?? 100) / 100;

        const xScale = xAxis[xAxisId].scale;
        const yScale = yAxis[yAxisId].scale;

        const closestPointIndex = findClosestPoints(
          flatbush,
          aSeries.data,
          xScale,
          yScale,
          xZoomStart,
          xZoomEnd,
          yZoomStart,
          yZoomEnd,
          svgPoint.x,
          svgPoint.y,
          maxRadius,
          1,
          getItemRadius,
        )[0];

        if (closestPointIndex === undefined) {
          continue;
        }

        const point = aSeries.data[closestPointIndex];
        const scaledX = xScale(point.x);
        const scaledY = yScale(point.y);

        const centerDist = Math.hypot(scaledX! - svgPoint.x, scaledY! - svgPoint.y);
        const closestPointRadius =
          typeof getItemRadius === 'number' ? getItemRadius : getItemRadius(closestPointIndex);
        const edgeDistance = centerDist - closestPointRadius;

        if (resolvedHitAreaRadius === 'item' && edgeDistance > 0) {
          continue;
        }

        const newPoint = {
          dataIndex: closestPointIndex,
          seriesId,
          edgeDistance,
          radius: closestPointRadius,
        };
        if (isCloser(newPoint, closestPoint)) {
          closestPoint = newPoint;
        }
      }

      if (closestPoint === undefined) {
        return 'no-point-found';
      }

      return { seriesId: closestPoint.seriesId, dataIndex: closestPoint.dataIndex };
    }

    // Clean the interaction when the mouse leaves the chart.
    const moveEndHandler = instance.addInteractionListener('moveEnd', (event) => {
      if (!event.detail.activeGestures.pan) {
        instance.cleanInteraction?.();
        instance.clearHighlight?.();
        instance.removeTooltipItem?.();
      }
    });
    const panEndHandler = instance.addInteractionListener('panEnd', (event) => {
      if (!event.detail.activeGestures.move) {
        instance.cleanInteraction?.();
        instance.clearHighlight?.();
        instance.removeTooltipItem?.();
      }
    });
    const pressEndHandler = instance.addInteractionListener('quickPressEnd', (event) => {
      if (!event.detail.activeGestures.move && !event.detail.activeGestures.pan) {
        instance.cleanInteraction?.();
        instance.clearHighlight?.();
        instance.removeTooltipItem?.();
      }
    });

    const gestureHandler = (event: CustomEvent<PointerGestureEventData>) => {
      const closestPoint = getClosestPoint(event.detail.srcEvent);

      if (closestPoint === 'outside-chart') {
        instance.cleanInteraction?.();
        instance.clearHighlight?.();
        instance.removeTooltipItem?.();
        return;
      }

      if (closestPoint === 'outside-voronoi-max-radius' || closestPoint === 'no-point-found') {
        instance.removeTooltipItem?.();
        instance.clearHighlight?.();
        instance.removeTooltipItem?.();
        return;
      }

      const { seriesId, dataIndex } = closestPoint;
      instance.setTooltipItem?.({ type: 'scatter', seriesId, dataIndex });
      instance.setLastUpdateSource?.('pointer');
      instance.setHighlight?.({
        type: 'scatter',
        seriesId,
        dataIndex,
      });
    };

    const tapHandler = instance.addInteractionListener('tap', (event) => {
      const closestPoint = getClosestPoint(event.detail.srcEvent);

      if (typeof closestPoint !== 'string' && onItemClick) {
        const { seriesId, dataIndex } = closestPoint;
        onItemClick(event.detail.srcEvent, { type: 'scatter', seriesId, dataIndex });
      }
    });

    const moveHandler = instance.addInteractionListener('move', gestureHandler);
    const panHandler = instance.addInteractionListener('pan', gestureHandler);
    const pressHandler = instance.addInteractionListener('quickPress', gestureHandler);

    return () => {
      tapHandler.cleanup();
      moveHandler.cleanup();
      moveEndHandler.cleanup();
      panHandler.cleanup();
      panEndHandler.cleanup();
      pressHandler.cleanup();
      pressEndHandler.cleanup();
    };
  }, [
    chartsLayerContainerRef,
    yAxis,
    xAxis,
    resolvedHitAreaRadius,
    onItemClick,
    resolvedDisableHitArea,
    instance,
    seriesOrder,
    series,
    flatbushMap,
    defaultXAxisId,
    defaultYAxisId,
    store,
  ]);

  // Instance implementation
  const enableVoronoiCallback = useEventCallback(() => {
    store.set('voronoi', { isVoronoiEnabled: true });
  });

  const disableVoronoiCallback = useEventCallback(() => {
    store.set('voronoi', { isVoronoiEnabled: false });
  });

  return {
    instance: {
      enableVoronoi: enableVoronoiCallback,
      disableVoronoi: disableVoronoiCallback,
    },
  };
};

useChartClosestPoint.getDefaultizedParams = ({ params }) => ({
  ...params,
  disableHitArea: params.disableHitArea ?? !params.series.some((item) => item.type === 'scatter'),
});

useChartClosestPoint.getInitialState = (params) => ({
  voronoi: {
    isVoronoiEnabled: !params.disableHitArea,
  },
});

useChartClosestPoint.params = {
  disableHitArea: true,
  hitAreaRadius: true,
  onItemClick: true,
};
