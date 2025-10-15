'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { PointerGestureEventData } from '@mui/x-internal-gestures/core';
import { ChartPlugin } from '../../models';
import { SeriesId } from '../../../../models/seriesType/common';
import { UseChartClosestPointSignature } from './useChartClosestPoint.types';
import { getSVGPoint } from '../../../getSVGPoint';
import { useSelector } from '../../../store/useSelector';
import {
  selectorChartAxisZoomData,
  selectorChartSeriesEmptyFlatbushMap,
  selectorChartSeriesFlatbushMap,
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartZoomIsInteracting,
} from '../useChartCartesianAxis';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries/useChartSeries.selectors';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';
import { findClosestPoints } from './findClosestPoints';

export const useChartClosestPoint: ChartPlugin<UseChartClosestPointSignature> = ({
  svgRef,
  params,
  store,
  instance,
}) => {
  const { disableVoronoi, voronoiMaxRadius, onItemClick } = params;
  const drawingArea = useSelector(store, selectorChartDrawingArea);

  const { axis: xAxis, axisIds: xAxisIds } = useSelector(store, selectorChartXAxis);
  const { axis: yAxis, axisIds: yAxisIds } = useSelector(store, selectorChartYAxis);
  const zoomIsInteracting = useSelector(store, selectorChartZoomIsInteracting);

  const { series, seriesOrder } = useSelector(store, selectorChartSeriesProcessed)?.scatter ?? {};
  const flatbushMap = useSelector(
    store,
    zoomIsInteracting ? selectorChartSeriesEmptyFlatbushMap : selectorChartSeriesFlatbushMap,
  );

  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  useEnhancedEffect(() => {
    store.update((prev) =>
      prev.voronoi.isVoronoiEnabled === !disableVoronoi
        ? prev
        : {
            ...prev,
            voronoi: {
              isVoronoiEnabled: !disableVoronoi,
            },
          },
    );
  }, [store, disableVoronoi]);

  React.useEffect(() => {
    if (svgRef.current === null || disableVoronoi) {
      return undefined;
    }
    const element = svgRef.current;

    function getClosestPoint(
      event: MouseEvent,
    ):
      | { seriesId: SeriesId; dataIndex: number }
      | 'outside-chart'
      | 'outside-voronoi-max-radius'
      | 'no-point-found' {
      // Get mouse coordinate in global SVG space
      const svgPoint = getSVGPoint(element, event);

      if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
        return 'outside-chart';
      }

      let closestPoint: { dataIndex: number; seriesId: SeriesId; distanceSq: number } | undefined =
        undefined;

      for (const seriesId of seriesOrder ?? []) {
        const aSeries = (series ?? {})[seriesId];
        const flatbush = flatbushMap.get(seriesId);

        if (!flatbush) {
          continue;
        }

        const xAxisId = aSeries.xAxisId ?? defaultXAxisId;
        const yAxisId = aSeries.yAxisId ?? defaultYAxisId;

        const xAxisZoom = selectorChartAxisZoomData(store.getSnapshot(), xAxisId);
        const yAxisZoom = selectorChartAxisZoomData(store.getSnapshot(), yAxisId);
        const maxRadius = voronoiMaxRadius === 'item' ? aSeries.markerSize : voronoiMaxRadius;

        const xZoomStart = (xAxisZoom?.start ?? 0) / 100;
        const xZoomEnd = (xAxisZoom?.end ?? 100) / 100;
        const yZoomStart = (yAxisZoom?.start ?? 0) / 100;
        const yZoomEnd = (yAxisZoom?.end ?? 100) / 100;

        const xScale = xAxis[xAxisId].scale;
        const yScale = yAxis[yAxisId].scale;

        const closestPointIndex = findClosestPoints(
          flatbush,
          drawingArea,
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
        )[0];

        if (closestPointIndex === undefined) {
          continue;
        }

        const point = aSeries.data[closestPointIndex];
        const scaledX = xScale(point.x);
        const scaledY = yScale(point.y);

        const distSq = (scaledX! - svgPoint.x) ** 2 + (scaledY! - svgPoint.y) ** 2;

        if (closestPoint === undefined || distSq < closestPoint.distanceSq) {
          closestPoint = {
            dataIndex: closestPointIndex,
            seriesId,
            distanceSq: distSq,
          };
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
      }
    });
    const panEndHandler = instance.addInteractionListener('panEnd', (event) => {
      if (!event.detail.activeGestures.move) {
        instance.cleanInteraction?.();
        instance.clearHighlight?.();
      }
    });
    const pressEndHandler = instance.addInteractionListener('quickPressEnd', (event) => {
      if (!event.detail.activeGestures.move && !event.detail.activeGestures.pan) {
        instance.cleanInteraction?.();
        instance.clearHighlight?.();
      }
    });

    const gestureHandler = (event: CustomEvent<PointerGestureEventData>) => {
      const closestPoint = getClosestPoint(event.detail.srcEvent);

      if (closestPoint === 'outside-chart') {
        instance.cleanInteraction?.();
        instance.clearHighlight?.();
        return;
      }

      if (closestPoint === 'outside-voronoi-max-radius' || closestPoint === 'no-point-found') {
        instance.removeItemInteraction?.();
        instance.clearHighlight?.();
        return;
      }

      const { seriesId, dataIndex } = closestPoint;
      instance.setItemInteraction?.(
        { type: 'scatter', seriesId, dataIndex },
        { interaction: 'pointer' },
      );
      instance.setHighlight?.({
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
    svgRef,
    yAxis,
    xAxis,
    voronoiMaxRadius,
    onItemClick,
    disableVoronoi,
    drawingArea,
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
    store.update((prev) => ({
      ...prev,
      voronoi: {
        ...prev.voronoi,
        isVoronoiEnabled: true,
      },
    }));
  });

  const disableVoronoiCallback = useEventCallback(() => {
    store.update((prev) => ({
      ...prev,
      voronoi: {
        ...prev.voronoi,
        isVoronoiEnabled: false,
      },
    }));
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
  disableVoronoi: params.disableVoronoi ?? !params.series.some((item) => item.type === 'scatter'),
});

useChartClosestPoint.getInitialState = (params) => ({
  voronoi: {
    isVoronoiEnabled: !params.disableVoronoi,
  },
});

useChartClosestPoint.params = {
  disableVoronoi: true,
  voronoiMaxRadius: true,
  onItemClick: true,
};
