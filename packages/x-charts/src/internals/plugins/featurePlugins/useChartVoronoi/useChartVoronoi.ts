'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { PointerGestureEventData } from '@mui/x-internal-gestures/core';
import Flatbush from 'flatbush';
import { ChartPlugin } from '../../models';
import { SeriesId } from '../../../../models/seriesType/common';
import { UseChartVoronoiSignature } from './useChartVoronoi.types';
import { getSVGPoint } from '../../../getSVGPoint';
import { useSelector } from '../../../store/useSelector';
import {
  selectorChartAxisZoomData,
  selectorChartXAxis,
  selectorChartYAxis,
} from '../useChartCartesianAxis';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries/useChartSeries.selectors';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';

export const useChartVoronoi: ChartPlugin<UseChartVoronoiSignature> = ({
  svgRef,
  params,
  store,
  instance,
}) => {
  const { disableVoronoi, voronoiMaxRadius, onItemClick } = params;
  const drawingArea = useSelector(store, selectorChartDrawingArea);

  const { axis: xAxis, axisIds: xAxisIds } = useSelector(store, selectorChartXAxis);
  const { axis: yAxis, axisIds: yAxisIds } = useSelector(store, selectorChartYAxis);

  const { series, seriesOrder } = useSelector(store, selectorChartSeriesProcessed)?.scatter ?? {};
  const flatbushMapRef = React.useRef<Record<SeriesId, Flatbush>>({});

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

  useEnhancedEffect(() => {
    // This effect generate and store the data structure that's used to obtain the closest point to a given coordinate.

    if (seriesOrder === undefined || series === undefined || disableVoronoi) {
      // If there is no scatter chart series
      return;
    }

    seriesOrder.forEach((seriesId) => {
      const { data, xAxisId, yAxisId } = series[seriesId];
      const flatbush = new Flatbush(data.length);

      const xScale = xAxis[xAxisId ?? defaultXAxisId].scale;
      const yScale = yAxis[yAxisId ?? defaultYAxisId].scale;
      const originalXScale = xScale.copy();
      const originalYScale = yScale.copy();
      originalXScale.range([0, 1]);
      originalYScale.range([0, 1]);

      for (const datum of data) {
        // Add the points using a [0, 1]. This makes it so that we don't need to recreate the Flatbush structure when zooming.
        flatbush.add(originalXScale(datum.x)!, originalYScale(datum.y)!);
      }

      flatbush.finish();
      // FIXME: This is slightly inefficient as we can have one flatbush per xAxisId and yAxisId combination.
      flatbushMapRef.current[seriesId] = flatbush;
    });
  }, [defaultXAxisId, defaultYAxisId, disableVoronoi, series, seriesOrder, xAxis, yAxis]);

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

      const flatbushMap = flatbushMapRef.current;

      if (!flatbushMap) {
        return 'no-point-found';
      }

      let closestPoint: { dataIndex: number; seriesId: SeriesId; distanceSq: number } | undefined;

      for (const seriesId of seriesOrder ?? []) {
        const aSeries = (series ?? {})[seriesId];
        const flatbush = flatbushMap[seriesId];

        const xAxisId = aSeries.xAxisId ?? defaultXAxisId;
        const yAxisId = aSeries.yAxisId ?? defaultYAxisId;

        const xAxisZoom = selectorChartAxisZoomData(store.getSnapshot(), xAxisId);
        const yAxisZoom = selectorChartAxisZoomData(store.getSnapshot(), yAxisId);

        const xZoomStart = (xAxisZoom?.start ?? 0) / 100;
        const xZoomEnd = (xAxisZoom?.end ?? 100) / 100;
        const yZoomStart = (yAxisZoom?.start ?? 0) / 100;
        const yZoomEnd = (yAxisZoom?.end ?? 100) / 100;

        const xScale = xAxis[xAxisId].scale;
        const yScale = yAxis[yAxisId].scale;
        const originalXScale = xScale.copy();
        const originalYScale = yScale.copy();
        originalXScale.range([0, 1]);
        originalYScale.range([0, 1]);

        const excludeIfOutsideDrawingArea = function excludeIfOutsideDrawingArea(index: number) {
          const x = originalXScale(aSeries.data[index].x)!;
          const y = originalYScale(aSeries.data[index].y)!;

          return x >= xZoomStart && x <= xZoomEnd && y >= yZoomStart && y <= yZoomEnd;
        };

        // We need to convert the distance from the original range [0, 1] to the current drawing area
        // so the comparison is done on pixels instead of normalized values.
        // fx and fy are the factors to convert the distance from [0, 1] to the current drawing area.
        const fx = xScale.range()[1] - xScale.range()[0];
        const fy = yScale.range()[1] - yScale.range()[0];
        function sqDistFn(dx: number, dy: number) {
          return fx * fx * dx * dx + fy * fy * dy * dy;
        }

        const pointX =
          xZoomStart +
          ((svgPoint.x - drawingArea.left) / drawingArea.width) * (xZoomEnd - xZoomStart);
        const pointY =
          yZoomStart +
          (1 - (svgPoint.y - drawingArea.top) / drawingArea.height) * (yZoomEnd - yZoomStart);
        const closestPointIndex = flatbush.neighbors(
          pointX,
          pointY,
          1,
          // FIXME: Re-introduce the `voronoiMaxRadius` parameter.
          Infinity,
          excludeIfOutsideDrawingArea,
          sqDistFn,
        )[0];

        if (closestPointIndex === undefined) {
          continue;
        }

        const point = aSeries.data[closestPointIndex];
        const scaledX = xAxis[xAxisId].scale(point.x);
        const scaledY = yAxis[yAxisId].scale(point.y);

        const distSq = (scaledX! - svgPoint.x) ** 2 + (scaledY! - svgPoint.y) ** 2;

        if (closestPoint === undefined || distSq < closestPoint?.distanceSq) {
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
      instance.setItemInteraction?.({ type: 'scatter', seriesId, dataIndex });
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

useChartVoronoi.getDefaultizedParams = ({ params }) => ({
  ...params,
  disableVoronoi: params.disableVoronoi ?? !params.series.some((item) => item.type === 'scatter'),
});

useChartVoronoi.getInitialState = (params) => ({
  voronoi: {
    isVoronoiEnabled: !params.disableVoronoi,
  },
});

useChartVoronoi.params = {
  disableVoronoi: true,
  voronoiMaxRadius: true,
  onItemClick: true,
};
