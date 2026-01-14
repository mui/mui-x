'use client';
import * as React from 'react';
import { warnOnce } from '@mui/x-internals/warning';
import {
  type ChartPlugin,
  getSVGPoint,
  getCartesianAxisIndex,
  selectorChartDrawingArea,
  selectorChartSeriesProcessed,
  selectorChartsInteractionIsInitialized,
  defaultizeXAxis,
  defaultizeYAxis,
} from '@mui/x-charts/internals';
import { type PointerGestureEventData } from '@mui/x-internal-gestures/core';
import { type UseChartFunnelAxisSignature } from './useChartFunnelAxis.types';
import { selectorChartXAxis, selectorChartYAxis } from './useChartFunnelAxisRendering.selectors';

export const useChartFunnelAxis: ChartPlugin<UseChartFunnelAxisSignature> = ({
  params,
  store,
  seriesConfig,
  svgRef,
  instance,
}) => {
  const { xAxis, yAxis, dataset, gap } = params;

  if (process.env.NODE_ENV !== 'production') {
    const ids = [...(xAxis ?? []), ...(yAxis ?? [])]
      .filter((axis) => axis.id)
      .map((axis) => axis.id);
    const duplicates = new Set(ids.filter((id, index) => ids.indexOf(id) !== index));
    if (duplicates.size > 0) {
      warnOnce(
        [
          `MUI X Charts: The following axis ids are duplicated: ${Array.from(duplicates).join(', ')}.`,
          `Please make sure that each axis has a unique id.`,
        ].join('\n'),
        'error',
      );
    }
  }

  const drawingArea = store.use(selectorChartDrawingArea);

  const isInteractionEnabled = store.use(selectorChartsInteractionIsInitialized);

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    store.update({
      funnel: {
        gap: gap ?? 0,
      },
      cartesianAxis: {
        x: defaultizeXAxis(xAxis, dataset),
        y: defaultizeYAxis(yAxis, dataset),
      },
    });
  }, [seriesConfig, drawingArea, xAxis, yAxis, dataset, store, gap]);

  React.useEffect(() => {
    const element = svgRef.current;
    if (!isInteractionEnabled || !element || params.disableAxisListener) {
      return () => {};
    }

    // Clean the interaction when the mouse leaves the chart.
    const moveEndHandler = instance.addInteractionListener('moveEnd', (event) => {
      if (!event.detail.activeGestures.pan) {
        instance.cleanInteraction?.();
      }
    });
    const panEndHandler = instance.addInteractionListener('panEnd', (event) => {
      if (!event.detail.activeGestures.move) {
        instance.cleanInteraction?.();
      }
    });
    const pressEndHandler = instance.addInteractionListener('quickPressEnd', (event) => {
      if (!event.detail.activeGestures.move && !event.detail.activeGestures.pan) {
        instance.cleanInteraction?.();
      }
    });

    const gestureHandler = (event: CustomEvent<PointerGestureEventData>) => {
      const srvEvent = event.detail.srcEvent;
      const target = event.detail.target as SVGElement | undefined;
      const svgPoint = getSVGPoint(element, srvEvent);
      // Release the pointer capture if we are panning, as this would cause the tooltip to
      // be locked to the first "section" it touches.
      if (
        event.detail.srcEvent.buttons >= 1 &&
        target?.hasPointerCapture(event.detail.srcEvent.pointerId)
      ) {
        target?.releasePointerCapture(event.detail.srcEvent.pointerId);
      }
      if (!instance.isPointInside(svgPoint.x, svgPoint.y, target)) {
        instance.cleanInteraction?.();
        return;
      }
      instance.setPointerCoordinate?.(svgPoint);
    };

    const moveHandler = instance.addInteractionListener('move', gestureHandler);
    const panHandler = instance.addInteractionListener('pan', gestureHandler);
    const pressHandler = instance.addInteractionListener('quickPress', gestureHandler);

    return () => {
      moveHandler.cleanup();
      moveEndHandler.cleanup();
      panHandler.cleanup();
      panEndHandler.cleanup();
      pressHandler.cleanup();
      pressEndHandler.cleanup();
    };
  }, [svgRef, instance, params.disableAxisListener, isInteractionEnabled]);

  React.useEffect(() => {
    const element = svgRef.current;
    const onAxisClick = params.onAxisClick;
    if (element === null || !onAxisClick) {
      return () => {};
    }

    const axisClickHandler = instance.addInteractionListener('tap', (event) => {
      const { axis: xAxisWithScale, axisIds: xAxisIds } = selectorChartXAxis(store.state);
      const { axis: yAxisWithScale, axisIds: yAxisIds } = selectorChartYAxis(store.state);
      const processedSeries = selectorChartSeriesProcessed(store.state);

      const usedXAxis = xAxisIds[0];
      const usedYAxis = yAxisIds[0];

      let dataIndex: number | null = null;
      let isXAxis: boolean = false;

      const svgPoint = getSVGPoint(element, event.detail.srcEvent);

      const xIndex = getCartesianAxisIndex(xAxisWithScale[usedXAxis], svgPoint.x);
      isXAxis = xIndex !== -1;

      dataIndex = isXAxis ? xIndex : getCartesianAxisIndex(yAxisWithScale[usedYAxis], svgPoint.y);

      const USED_AXIS_ID = isXAxis ? xAxisIds[0] : yAxisIds[0];
      if (dataIndex == null || dataIndex === -1) {
        return;
      }

      // The .data exist because otherwise the dataIndex would be null or -1.
      const axisValue = (isXAxis ? xAxisWithScale : yAxisWithScale)[USED_AXIS_ID].data![dataIndex];

      const seriesValues: Record<string, number | null | undefined> = {};

      processedSeries.funnel?.seriesOrder.forEach((seriesId) => {
        const seriesItem = processedSeries.funnel!.series[seriesId];

        const providedXAxisId = seriesItem.xAxisId;
        const providedYAxisId = seriesItem.yAxisId;

        const axisKey = isXAxis ? providedXAxisId : providedYAxisId;
        if (axisKey === undefined || axisKey === USED_AXIS_ID) {
          seriesValues[seriesId] = seriesItem.data[dataIndex].value;
        }
      });

      onAxisClick(event.detail.srcEvent, { dataIndex, axisValue, seriesValues });
    });

    return () => {
      axisClickHandler.cleanup();
    };
  }, [params.onAxisClick, svgRef, store, instance]);

  return {};
};

useChartFunnelAxis.params = {
  xAxis: true,
  yAxis: true,
  gap: true,
  dataset: true,
  onAxisClick: true,
  disableAxisListener: true,
};

useChartFunnelAxis.getDefaultizedParams = ({ params }) => {
  return {
    ...params,
    gap: params.gap ?? 0,
    defaultizedXAxis: defaultizeXAxis(params.xAxis, params.dataset),
    defaultizedYAxis: defaultizeYAxis(params.yAxis, params.dataset),
  };
};

useChartFunnelAxis.getInitialState = (params) => {
  return {
    funnel: {
      gap: params.gap ?? 0,
    },
    cartesianAxis: {
      x: params.defaultizedXAxis,
      y: params.defaultizedYAxis,
    },
  };
};
