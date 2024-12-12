'use client';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { ChartPlugin, AxisId, DefaultizedZoomOption } from '@mui/x-charts/internals';
import { UseChartProZoomSignature } from './useChartProZoom.types';
import { defaultizeZoom } from './defaultizeZoom';
import { createZoomMap } from './useChartProZoom.utils';

// It is helpful to avoid the need to provide the possibly auto-generated id for each axis.
function initializeZoomData(options: Record<AxisId, DefaultizedZoomOption>) {
  return Object.values(options).map(({ axisId, minStart: start, maxEnd: end }) => ({
    axisId,
    start,
    end,
  }));
}

export const useChartProZoom: ChartPlugin<UseChartProZoomSignature> = ({ store, models }) => {
  useEnhancedEffect(() => {
    store.update((prevState) => ({
      ...prevState,
      zoom: {
        ...prevState.zoom,
        zoomMap: createZoomMap(models.zoom.value),
      },
    }));
  }, [store, models.zoom.value]);

  return {};
};

useChartProZoom.params = {
  zoom: true,
  onZoomChange: true,
};

useChartProZoom.getDefaultizedParams = ({ params }) => {
  const options = {
    ...params.defaultizedXAxis.reduce<Record<AxisId, DefaultizedZoomOption>>((acc, v) => {
      const { zoom, id: axisId } = v;
      const defaultizedZoom = defaultizeZoom(zoom, axisId, 'x');
      if (defaultizedZoom) {
        acc[axisId] = defaultizedZoom;
      }
      return acc;
    }, {}),
    ...params.defaultizedYAxis.reduce<Record<AxisId, DefaultizedZoomOption>>((acc, v) => {
      const { zoom, id: axisId } = v;
      const defaultizedZoom = defaultizeZoom(zoom, axisId, 'y');
      if (defaultizedZoom) {
        acc[axisId] = defaultizedZoom;
      }
      return acc;
    }, {}),
  };

  return {
    ...params,
    options,
  };
};

useChartProZoom.models = {
  zoom: {
    getDefaultValue: (params) => initializeZoomData(params.options),
  },
};

useChartProZoom.getInitialState = (params) => {
  return {
    zoom: {
      options: params.options,
      zoomMap: createZoomMap(
        params.zoom === undefined ? initializeZoomData(params.options) : params.zoom,
      ),
      isInteracting: false,
    },
  };
};
