'use client';
import useEventCallback from '@mui/utils/useEventCallback';
import type { PanEvent } from '@mui/x-internal-gestures/core';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { getSVGPoint } from '../../../getSVGPoint';
import { ChartPlugin } from '../../models';
import { UseChartBrushSignature, type Point } from './useChartBrush.types';

export const useChartBrush: ChartPlugin<UseChartBrushSignature> = ({
  store,
  svgRef,
  instance,
  params,
}) => {
  useEnhancedEffect(() => {
    store.update((prev) => {
      return {
        ...prev,
        brush: {
          ...prev.brush,
          enabled: params.enabled ?? false,
        },
      };
    });
  }, [store, params.enabled]);

  const setBrushCoordinates = useEventCallback(function setBrushCoordinates(point: Point | null) {
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
  });

  const clearBrush = useEventCallback(function clearBrush() {
    store.update((prev) => {
      return {
        ...prev,
        brush: {
          ...prev.brush,
          start: null,
          current: null,
        },
      };
    });
  });

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !store.getSnapshot().brush.enabled) {
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
  enabled: true,
};

useChartBrush.getInitialState = (params) => {
  return {
    brush: {
      enabled: params.enabled ?? false,
      start: null,
      current: null,
    },
  };
};
