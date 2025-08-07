'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { Delaunay } from '@mui/x-charts-vendor/d3-delaunay';
import { PointerGestureEventData } from '@mui/x-internal-gestures/core';
import { ChartPlugin } from '../../models';
import { getValueToPositionMapper } from '../../../../hooks/useScale';
import { SeriesId } from '../../../../models/seriesType/common';
import { UseChartVoronoiSignature } from './useChartVoronoi.types';
import { getSVGPoint } from '../../../getSVGPoint';
import { useSelector } from '../../../store/useSelector';
import {
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartZoomIsInteracting,
} from '../useChartCartesianAxis';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries/useChartSeries.selectors';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';

type VoronoiSeries = {
  /**
   * The series id
   */
  seriesId: SeriesId;
  /**
   * The first index in the voronoi data that is about this series.
   */
  startIndex: number;
  /**
   * The first index in the voronoi data that is outside this series.
   */
  endIndex: number;
  /**
   * The mapping from voronoi point index to the series dataIndex.
   * This takes into account removed points.
   */
  seriesIndexes: number[];
  /**
   * Size of the marker in pixels.
   */
  markerSize: number;
};

export const useChartVoronoi: ChartPlugin<UseChartVoronoiSignature> = ({
  svgRef,
  params,
  store,
  instance,
}) => {
  const { disableClosestPoint, voronoiMaxRadius, onItemClick } = params;
  const disableOnItemClick = onItemClick == null;
  const disableVoronoi = disableClosestPoint && disableOnItemClick;
  const drawingArea = useSelector(store, selectorChartDrawingArea);

  const { axis: xAxis, axisIds: xAxisIds } = useSelector(store, selectorChartXAxis);
  const { axis: yAxis, axisIds: yAxisIds } = useSelector(store, selectorChartYAxis);
  const zoomIsInteracting = useSelector(store, selectorChartZoomIsInteracting);

  const { series, seriesOrder } = useSelector(store, selectorChartSeriesProcessed)?.scatter ?? {};
  const voronoiRef = React.useRef<Record<string, VoronoiSeries>>({});
  const delauneyRef = React.useRef<Delaunay<any> | undefined>(undefined);
  const lastFind = React.useRef<number | undefined>(undefined);

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
    // This effect generate and store the Delaunay object that's used to map coordinate to closest point.

    if (zoomIsInteracting || seriesOrder === undefined || series === undefined || disableVoronoi) {
      // If there is no scatter chart series
      return;
    }

    voronoiRef.current = {};
    let points: number[] = [];
    seriesOrder.forEach((seriesId) => {
      const { data, xAxisId, yAxisId } = series[seriesId];

      const xScale = xAxis[xAxisId ?? defaultXAxisId].scale;
      const yScale = yAxis[yAxisId ?? defaultYAxisId].scale;

      const getXPosition = getValueToPositionMapper(xScale);
      const getYPosition = getValueToPositionMapper(yScale);

      const seriesPoints: number[] = [];
      const seriesIndexes: number[] = [];
      for (let dataIndex = 0; dataIndex < data.length; dataIndex += 1) {
        const { x, y } = data[dataIndex];
        const pointX = getXPosition(x);
        const pointY = getYPosition(y);

        if (instance.isPointInside(pointX, pointY)) {
          seriesPoints.push(pointX);
          seriesPoints.push(pointY);
          seriesIndexes.push(dataIndex);
        }
      }

      voronoiRef.current[seriesId] = {
        seriesId,
        seriesIndexes,
        startIndex: points.length,
        endIndex: points.length + seriesPoints.length,
        markerSize: series[seriesId].markerSize,
      };
      points = points.concat(seriesPoints);
    });

    delauneyRef.current = new Delaunay(points);
    lastFind.current = undefined;
  }, [
    zoomIsInteracting,
    defaultXAxisId,
    defaultYAxisId,
    series,
    seriesOrder,
    xAxis,
    yAxis,
    drawingArea,
    instance,
    disableVoronoi,
  ]);

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
        lastFind.current = undefined;
        return 'outside-chart';
      }

      if (!delauneyRef.current) {
        return 'no-point-found';
      }

      const closestPointIndex = delauneyRef.current.find(svgPoint.x, svgPoint.y, lastFind.current);
      if (closestPointIndex === undefined) {
        return 'no-point-found';
      }

      lastFind.current = closestPointIndex;
      const closestSeries = Object.values(voronoiRef.current).find((value) => {
        return 2 * closestPointIndex >= value.startIndex && 2 * closestPointIndex < value.endIndex;
      });

      if (closestSeries === undefined) {
        return 'no-point-found';
      }

      // The point index in the series with id=closestSeries.seriesId.
      const seriesPointIndex =
        (2 * closestPointIndex - voronoiRef.current[closestSeries.seriesId].startIndex) / 2;
      const dataIndex = voronoiRef.current[closestSeries.seriesId].seriesIndexes[seriesPointIndex];

      const maxRadius = disableClosestPoint ? closestSeries.markerSize : voronoiMaxRadius;

      if (maxRadius !== undefined) {
        const pointX = delauneyRef.current.points[2 * closestPointIndex];
        const pointY = delauneyRef.current.points[2 * closestPointIndex + 1];
        const dist2 = (pointX - svgPoint.x) ** 2 + (pointY - svgPoint.y) ** 2;
        if (dist2 > maxRadius ** 2) {
          // The closest point is too far to be considered.
          return 'outside-voronoi-max-radius';
        }
      }
      return { seriesId: closestSeries.seriesId, dataIndex };
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
    disableClosestPoint,
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
  disableClosestPoint:
    params.disableVoronoi ?? !params.series.some((item) => item.type === 'scatter'),
});

useChartVoronoi.getInitialState = (params) => ({
  voronoi: {
    isVoronoiEnabled: !params.disableClosestPoint,
  },
});

useChartVoronoi.params = {
  disableVoronoi: true,
  voronoiMaxRadius: true,
  onItemClick: true,
};
