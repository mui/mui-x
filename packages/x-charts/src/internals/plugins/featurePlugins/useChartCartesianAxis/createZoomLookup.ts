import type { AxisConfig, ScaleName } from '../../../../models';
import type { AxisId, ChartsCartesianAxisProps } from '../../../../models/axis';
import { defaultizeZoom } from './defaultizeZoom';
import { type DefaultizedZoomOptions } from './useChartCartesianAxis.types';

export const createZoomLookup =
  (axisDirection: 'x' | 'y') =>
  (axes: AxisConfig<ScaleName, any, ChartsCartesianAxisProps>[] = []) =>
    axes.reduce<Record<AxisId, DefaultizedZoomOptions>>((acc, v) => {
      // @ts-ignore
      const { zoom, id: axisId, reverse } = v;
      const defaultizedZoom = defaultizeZoom(zoom, axisId, axisDirection, reverse);
      if (defaultizedZoom) {
        acc[axisId] = defaultizedZoom;
      }
      return acc;
    }, {});
