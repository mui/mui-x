import type { AxisConfig, ScaleName } from '../../../../models';
import type { AxisId, ChartsCartesianAxisProps } from '../../../../models/axis';
import { defaultizeZoom, getEffectiveZoomReverse } from './defaultizeZoom';
import { type DefaultizedZoomOptions } from './useChartCartesianAxis.types';

export const createZoomLookup =
  (axisDirection: 'x' | 'y') =>
  (axes: AxisConfig<ScaleName, any, ChartsCartesianAxisProps>[] = []) =>
    axes.reduce<Record<AxisId, DefaultizedZoomOptions>>((acc, v) => {
      // @ts-ignore
      const { zoom, id: axisId, reverse, scaleType } = v;
      const defaultizedZoom = defaultizeZoom(
        zoom,
        axisId,
        axisDirection,
        getEffectiveZoomReverse(axisDirection, scaleType, reverse),
      );
      if (defaultizedZoom) {
        acc[axisId] = defaultizedZoom;
      }
      return acc;
    }, {});
