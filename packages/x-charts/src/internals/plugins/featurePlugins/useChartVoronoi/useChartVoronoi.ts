'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { Delaunay } from '@mui/x-charts-vendor/d3-delaunay';
import { PointerGestureEventData } from '@mui/x-internal-gestures/core';
import Flatbush from 'flatbush';
import RBush from 'rbush';
import knn from 'rbush-knn';
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
};

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
  const zoomIsInteracting = useSelector(store, selectorChartZoomIsInteracting);

  const { series, seriesOrder } = useSelector(store, selectorChartSeriesProcessed)?.scatter ?? {};
  const voronoiRef = React.useRef<Record<string, VoronoiSeries>>({});
  const flatbushRef = React.useRef<Flatbush | undefined>(undefined);
  const rbushRef = React.useRef<any | undefined>(undefined);
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
    const dataPoints = Object.values(series).reduce((acc, aSeries) => acc + aSeries.data.length, 0);

    performance.mark('Delaunay-prepare-points-start');
    const points = new Float64Array(dataPoints * 2);
    let seriesStartIndex = 0;
    let currentIndex = 0;

    seriesOrder.forEach((seriesId) => {
      const { data, xAxisId, yAxisId } = series[seriesId];

      const xScale = xAxis[xAxisId ?? defaultXAxisId].scale;
      const yScale = yAxis[yAxisId ?? defaultYAxisId].scale;

      const getXPosition = getValueToPositionMapper(xScale);
      const getYPosition = getValueToPositionMapper(yScale);

      seriesStartIndex = currentIndex;

      for (const datum of data) {
        const pointX = getXPosition(datum.x);
        const pointY = getYPosition(datum.y);

        if (!instance.isPointInside(pointX, pointY)) {
          // If the point is not displayed we move them to a trash coordinate.
          // This avoids managing index mapping before/after filtering.
          // The trash point is far enough such that any point in the drawing area will be closer to the mouse than the trash coordinate.
          points[currentIndex * 2] = -drawingArea.width;
          points[currentIndex * 2 + 1] = -drawingArea.height;
        } else {
          points[currentIndex * 2] = pointX;
          points[currentIndex * 2 + 1] = pointY;
        }

        currentIndex += 1;
      }

      voronoiRef.current[seriesId] = {
        seriesId,
        startIndex: seriesStartIndex,
        endIndex: seriesStartIndex + currentIndex,
      };
    });
    performance.mark('Delaunay-prepare-points-end');
    performance.measure(
      'Delaunay-prepare-points',
      'Delaunay-prepare-points-start',
      'Delaunay-prepare-points-end',
    );

    performance.mark('new Delaunay-start');
    delauneyRef.current = new Delaunay(points);
    performance.mark('new Delaunay-end');
    performance.measure('new Delaunay()', 'new Delaunay-start', 'new Delaunay-end');

    performance.mark('Flatbush-start');
    const flatbush = new Flatbush(dataPoints);
    flatbushRef.current = flatbush;
    seriesStartIndex = 0;
    currentIndex = 0;

    seriesOrder.forEach((seriesId) => {
      const { data, xAxisId, yAxisId } = series[seriesId];

      const xScale = xAxis[xAxisId ?? defaultXAxisId].scale;
      const yScale = yAxis[yAxisId ?? defaultYAxisId].scale;

      const getXPosition = getValueToPositionMapper(xScale);
      const getYPosition = getValueToPositionMapper(yScale);

      seriesStartIndex = currentIndex;

      for (const datum of data) {
        const pointX = getXPosition(datum.x);
        const pointY = getYPosition(datum.y);

        if (!instance.isPointInside(pointX, pointY)) {
          // If the point is not displayed we move them to a trash coordinate.
          // This avoids managing index mapping before/after filtering.
          // The trash point is far enough such that any point in the drawing area will be closer to the mouse than the trash coordinate.
          flatbush.add(-drawingArea.width, -drawingArea.height);
        } else {
          flatbush.add(pointX, pointY);
        }

        currentIndex += 1;
      }

      voronoiRef.current[seriesId] = {
        seriesId,
        startIndex: seriesStartIndex,
        endIndex: seriesStartIndex + currentIndex,
      };
    });

    flatbush.finish();

    performance.mark('Flatbush-end');
    performance.measure('Flatbush', 'Flatbush-start', 'Flatbush-end');

    performance.mark('RBush-start');
    const tree = new RBush();
    const rbushPoints = new Array<{ minX: number; minY: number; maxX: number; maxY: number }>(
      dataPoints,
    );
    let rbushSeriesStartIndex = 0;
    let rbushCurrentIndex = 0;

    seriesOrder.forEach((seriesId) => {
      const { data, xAxisId, yAxisId } = series[seriesId];

      const xScale = xAxis[xAxisId ?? defaultXAxisId].scale;
      const yScale = yAxis[yAxisId ?? defaultYAxisId].scale;

      const getXPosition = getValueToPositionMapper(xScale);
      const getYPosition = getValueToPositionMapper(yScale);

      rbushSeriesStartIndex = rbushCurrentIndex;

      for (const datum of data) {
        const pointX = getXPosition(datum.x);
        const pointY = getYPosition(datum.y);

        if (!instance.isPointInside(pointX, pointY)) {
          // If the point is not displayed we move them to a trash coordinate.
          // This avoids managing index mapping before/after filtering.
          // The trash point is far enough such that any point in the drawing area will be closer to the mouse than the trash coordinate.
          rbushPoints[rbushCurrentIndex] = {
            minX: -drawingArea.width,
            maxX: -drawingArea.width,
            minY: -drawingArea.height,
            maxY: -drawingArea.height,
          };
        } else {
          rbushPoints[rbushCurrentIndex] = {
            minX: pointX,
            maxX: pointX,
            minY: pointY,
            maxY: pointY,
          };
        }

        rbushCurrentIndex += 1;
      }

      voronoiRef.current[seriesId] = {
        seriesId,
        startIndex: rbushSeriesStartIndex,
        endIndex: rbushSeriesStartIndex + rbushCurrentIndex,
      };
    });
    tree.load(rbushPoints);
    rbushRef.current = tree;
    performance.mark('RBush-end');
    performance.measure('RBush', 'RBush-start', 'RBush-end');

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

      const start = performance.now();
      const closestPointIndex = delauneyRef.current.find(svgPoint.x, svgPoint.y, lastFind.current);
      const end = performance.now();
      performance.measure('Delaunay-find', { start, end });

      if (!flatbushRef.current) {
        return 'no-point-found';
      }

      const start1 = performance.now();
      const closestFlatbushPointIndex = flatbushRef.current.neighbors(svgPoint.x, svgPoint.y, 1)[0];
      const end1 = performance.now();
      performance.measure('Flatbush-find', { start: start1, end: end1 });

      const start2 = performance.now();
      const closestRbushPointIndex = knn(rbushRef.current, svgPoint.x, svgPoint.y, 1)[0];
      const end2 = performance.now();
      performance.measure('RBush-find', { start: start2, end: end2 });

      console.log({
        delaunay: closestPointIndex,
        flatbush: closestFlatbushPointIndex,
        rbush: closestRbushPointIndex,
      });

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

      const dataIndex =
        (2 * closestPointIndex - voronoiRef.current[closestSeries.seriesId].startIndex) / 2;

      if (voronoiMaxRadius !== undefined) {
        const pointX = delauneyRef.current.points[2 * closestPointIndex];
        const pointY = delauneyRef.current.points[2 * closestPointIndex + 1];
        const dist2 = (pointX - svgPoint.x) ** 2 + (pointY - svgPoint.y) ** 2;
        if (dist2 > voronoiMaxRadius ** 2) {
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
  }, [svgRef, yAxis, xAxis, voronoiMaxRadius, onItemClick, disableVoronoi, drawingArea, instance]);

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
