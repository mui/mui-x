'use client';
import useEventCallback from '@mui/utils/useEventCallback';
import type { PanEvent } from '@mui/x-internal-gestures/core';
import * as React from 'react';
import { getSVGPoint } from '../../../getSVGPoint';
import { ChartPlugin } from '../../models';
import {
  UseChartBrushSignature,
  type BrushCoordinate,
  type UseChartBrushState,
} from './useChartBrush.types';

const emptyBrush: UseChartBrushState['brush'] = { start: null, current: null };

export const useChartBrush: ChartPlugin<UseChartBrushSignature> = ({
  store,
  params,
  svgRef,
  instance,
}) => {
  const setBrushCoordinates = useEventCallback(function setBrushCoordinates(
    point: BrushCoordinate,
  ) {
    store.update((prev) => {
      return {
        ...prev,
        brush: {
          ...prev.brush,
          start: prev.brush.start === null ? point : prev.brush.start,
          current: point,
        },
      };
    });
    params.onBrushChange?.(store.getSnapshot().brush);
  });

  const clearBrush = useEventCallback(function clearBrush() {
    store.update((prev) => {
      return {
        ...prev,
        brush: emptyBrush,
      };
    });
  });

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handleBrushStart = (event: PanEvent) => {
      if ((event.detail.target as SVGElement)?.closest('[data-charts-zoom-slider]')) {
        return;
      }

      const point = getSVGPoint(element, {
        clientX: event.detail.initialCentroid.x,
        clientY: event.detail.initialCentroid.y,
      });

      setBrushCoordinates(point);
    };

    const handleBrush = (event: PanEvent) => {
      const currentPoint = getSVGPoint(element, {
        clientX: event.detail.centroid.x,
        clientY: event.detail.centroid.y,
      });

      setBrushCoordinates(currentPoint);
    };

    const brushStartHandler = instance.addInteractionListener('brushStart', handleBrushStart);
    const brushHandler = instance.addInteractionListener('brush', handleBrush);
    const brushCancelHandler = instance.addInteractionListener('brushCancel', clearBrush);
    const brushEndHandler = instance.addInteractionListener('brushEnd', clearBrush);

    return () => {
      brushStartHandler.cleanup();
      brushHandler.cleanup();
      brushEndHandler.cleanup();
      brushCancelHandler.cleanup();
    };
  }, [svgRef, instance, store, clearBrush, setBrushCoordinates]);

  return {
    instance: {
      setBrushCoordinates,
      clearBrush,
    },
  };
};

useChartBrush.params = {
  onBrushChange: true,
};

useChartBrush.getInitialState = () => {
  return {
    brush: {
      start: null,
      current: null,
    },
  };
};
