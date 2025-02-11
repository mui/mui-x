import { AxisConfig, ChartsXAxisProps, ChartsYAxisProps, ScaleName } from '../../../../models';
import { AxisId } from '../../../../models/axis';
import { defaultizeZoom } from './defaultizeZoom';
import { DefaultizedZoomOptions } from './useChartCartesianAxis.types';

export const createZoomLookup =
  (axisDirection: 'x' | 'y') =>
  (axes: AxisConfig<ScaleName, any, ChartsXAxisProps | ChartsYAxisProps>[] = []) =>
    axes.reduce<Record<AxisId, DefaultizedZoomOptions>>((acc, v) => {
      // @ts-ignore
      const { zoom, id: axisId } = v;
      const defaultizedZoom = defaultizeZoom(zoom, axisId, axisDirection);
      if (defaultizedZoom) {
        acc[axisId] = defaultizedZoom;
      }
      return acc;
    }, {});
