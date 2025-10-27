'use client';
import useEventCallback from '@mui/utils/useEventCallback';
import type { PanEvent } from '@mui/x-internal-gestures/core';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { getSVGPoint } from '../../../getSVGPoint';
import { ChartPlugin } from '../../models';
import { UseChartBrushSignature, type Point } from './useChartBrush.types';
import { useSelector } from '../../../store/useSelector';
import { selectorIsBrushEnabled } from './useChartBrush.selectors';

export const useChartBrush: ChartPlugin<UseChartBrushSignature> = ({
  store,
  svgRef,
  instance,
  params,
}) => {
  const isEnabled = useSelector(store, selectorIsBrushEnabled);

  useEnhancedEffect(() => {
    store.update((prev) => {
      return {
        ...prev,
        brush: {
          ...prev.brush,
          enabled: params.brushConfig.enabled,
          preventTooltip: params.brushConfig.preventTooltip,
          preventHighlight: params.brushConfig.preventHighlight,
        },
      };
    });
  }, [
    store,
    params.brushConfig.enabled,
    params.brushConfig.preventTooltip,
    params.brushConfig.preventHighlight,
  ]);

  const setBrushCoordinates = useEventCallback(function setBrushCoordinates(point: Point | null) {
    store.update((prev) => {
      return {
        ...prev,
        brush: {
          ...prev.brush,
          start: prev.brush.start ?? point,
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

  const setZoomBrushEnabled = useEventCallback(function setZoomBrushEnabled(enabled: boolean) {
    store.update((prev) => {
      if (prev.brush.isZoomBrushEnabled === enabled) {
        return prev;
      }

      return {
        ...prev,
        brush: {
          ...prev.brush,
          isZoomBrushEnabled: enabled,
        },
      };
    });
  });

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !isEnabled) {
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
  }, [svgRef, instance, store, clearBrush, setBrushCoordinates, isEnabled]);

  return {
    instance: {
      setBrushCoordinates,
      clearBrush,
      setZoomBrushEnabled,
    },
  };
};

useChartBrush.params = {
  brushConfig: true,
};

useChartBrush.getDefaultizedParams = ({ params }) => {
  return {
    ...params,
    brushConfig: {
      enabled: params?.brushConfig?.enabled ?? false,
      preventTooltip: params?.brushConfig?.preventTooltip ?? true,
      preventHighlight: params?.brushConfig?.preventHighlight ?? true,
    },
  };
};

useChartBrush.getInitialState = (params) => {
  return {
    brush: {
      enabled: params.brushConfig.enabled,
      isZoomBrushEnabled: false,
      preventTooltip: params.brushConfig.preventTooltip,
      preventHighlight: params.brushConfig.preventHighlight,
      start: null,
      current: null,
    },
  };
};
