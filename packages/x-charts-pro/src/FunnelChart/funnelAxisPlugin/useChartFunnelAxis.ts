'use client';
import * as React from 'react';
import { warnOnce } from '@mui/x-internals/warning';
import {
  ChartPlugin,
  getSVGPoint,
  getCartesianAxisIndex,
  selectorChartDrawingArea,
  selectorChartSeriesProcessed,
  selectorChartsInteractionIsInitialized,
  useSelector,
  defaultizeXAxis,
  defaultizeYAxis,
} from '@mui/x-charts/internals';
import { UseChartFunnelAxisSignature } from './useChartFunnelAxis.types';
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

  const drawingArea = useSelector(store, selectorChartDrawingArea);

  const isInteractionEnabled = useSelector(store, selectorChartsInteractionIsInitialized);

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    store.update((prev) => ({
      ...prev,
      funnel: {
        gap: gap ?? 0,
      },
      cartesianAxis: {
        ...prev.cartesianAxis,
        x: defaultizeXAxis(xAxis, dataset),
        y: defaultizeYAxis(yAxis, dataset),
      },
    }));
  }, [seriesConfig, drawingArea, xAxis, yAxis, dataset, store, gap]);

  React.useEffect(() => {
    const element = svgRef.current;
    if (!isInteractionEnabled || element === null || params.disableAxisListener) {
      return () => {};
    }

    const handleOut = () => {
      instance.cleanInteraction?.();
    };

    const handleMove = (event: MouseEvent | TouchEvent) => {
      const target = 'targetTouches' in event ? event.targetTouches[0] : event;
      const svgPoint = getSVGPoint(element, target);

      if (!instance.isPointInside(svgPoint.x, svgPoint.y, event.target as SVGElement)) {
        instance.cleanInteraction?.();
        return;
      }

      instance.setPointerCoordinate?.(svgPoint);
    };

    const handleDown = (event: PointerEvent) => {
      const target = event.currentTarget;
      if (!target) {
        return;
      }

      if (
        'hasPointerCapture' in target &&
        (target as HTMLElement).hasPointerCapture(event.pointerId)
      ) {
        (target as HTMLElement).releasePointerCapture(event.pointerId);
      }
    };

    element.addEventListener('pointerdown', handleDown);
    element.addEventListener('pointermove', handleMove);
    element.addEventListener('pointercancel', handleOut);
    element.addEventListener('pointerleave', handleOut);
    return () => {
      element.removeEventListener('pointerdown', handleDown);
      element.removeEventListener('pointermove', handleMove);
      element.removeEventListener('pointercancel', handleOut);
      element.removeEventListener('pointerleave', handleOut);
    };
  }, [svgRef, instance, params.disableAxisListener, isInteractionEnabled]);

  React.useEffect(() => {
    const element = svgRef.current;
    const onAxisClick = params.onAxisClick;
    if (element === null || !onAxisClick) {
      return () => {};
    }

    const handleMouseClick = (event: MouseEvent) => {
      event.preventDefault();

      const { axis: xAxisWithScale, axisIds: xAxisIds } = selectorChartXAxis(store.value);
      const { axis: yAxisWithScale, axisIds: yAxisIds } = selectorChartYAxis(store.value);
      const processedSeries = selectorChartSeriesProcessed(store.value);

      const usedXAxis = xAxisIds[0];
      const usedYAxis = yAxisIds[0];

      let dataIndex: number | null = null;
      let isXAxis: boolean = false;

      const svgPoint = getSVGPoint(element, event);

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

      onAxisClick(event, { dataIndex, axisValue, seriesValues });
    };

    element.addEventListener('click', handleMouseClick);
    return () => {
      element.removeEventListener('click', handleMouseClick);
    };
  }, [params.onAxisClick, svgRef, store]);

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
