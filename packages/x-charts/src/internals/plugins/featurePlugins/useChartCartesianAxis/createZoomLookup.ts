import type { AxisConfig, ScaleName } from '../../../../models';
import type { AxisId, ChartsCartesianAxisProps } from '../../../../models/axis';
import { defaultizeZoom, getEffectiveZoomReverse } from './defaultizeZoom';
import type { DefaultizedZoomOptions } from './useChartCartesianAxis.types';

export const createZoomLookup =
  (axisDirection: 'x' | 'y') =>
  (axes: AxisConfig<ScaleName, any, ChartsCartesianAxisProps>[] = []) =>
    axes.reduce<Record<AxisId, DefaultizedZoomOptions>>((acc, v) => {
      // @ts-ignore
      const { zoom, id: axisId, reverse, scaleType, data } = v;
      const defaultizedZoom = defaultizeZoom(
        zoom,
        axisId,
        axisDirection,
        getEffectiveZoomReverse(axisDirection, scaleType, reverse),
      );
      if (defaultizedZoom) {
        // Resolve the item-count span limits against the data length; they win over the percentages.
        // Only a data-point count is supported (not a value/time-axis value span): a value span
        // needs the computed domain, which isn't known here (raw axes).
        const dataLength = Array.isArray(data) ? data.length : 0;
        if (dataLength > 0 && typeof zoom === 'object') {
          if (zoom.minSpanItems != null) {
            defaultizedZoom.minSpan = Math.min(100, (100 * zoom.minSpanItems) / dataLength);
          }
          if (zoom.maxSpanItems != null) {
            defaultizedZoom.maxSpan = Math.min(100, (100 * zoom.maxSpanItems) / dataLength);
          }
        }
        acc[axisId] = defaultizedZoom;
      }
      return acc;
    }, {});
