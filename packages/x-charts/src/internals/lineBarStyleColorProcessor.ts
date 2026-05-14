import type { ColorGetter } from './plugins/corePlugins/useChartSeriesConfig';
import { getSeriesColorFn } from './getSeriesColorFn';
import type { DefaultizedSeriesType } from '../models/seriesType';
import type {
  ChartsRadiusAxisProps,
  ChartsRotationAxisProps,
  ComputedAxis,
  ComputedXAxis,
  ComputedYAxis,
  ScaleName,
} from '../models/axis';

/**
 * Shared color processor for line/bar-style polar/cartesian charts.
 *
 * Used by `line`, `radialLine`, `bar`, and `radialBar` — series types whose getColor body
 * checks the secondary-axis colorScale, then the main-axis colorScale, then falls
 * back to the series color.
 */
export function lineBarStyleColorProcessor<
  SeriesType extends 'line' | 'radialLine' | 'bar' | 'radialBar',
>(
  series: DefaultizedSeriesType<SeriesType>,
  xAxisAxis?: ComputedXAxis | ComputedAxis<ScaleName, any, ChartsRotationAxisProps>,
  yAxisAxis?: ComputedYAxis | ComputedAxis<ScaleName, any, ChartsRadiusAxisProps>,
): ColorGetter<SeriesType> {
  // The layout is only relevant for bar charts
  const horizontalLayout = 'layout' in series && series.layout === 'vertical';
  const mainAxis = horizontalLayout ? yAxisAxis : xAxisAxis;
  const secondaryAxis = horizontalLayout ? xAxisAxis : yAxisAxis;

  const secondaryColorScale = secondaryAxis?.colorScale;
  const mainColorScale = mainAxis?.colorScale;
  const getSeriesColor = getSeriesColorFn(series);

  if (secondaryColorScale) {
    return ((dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }
      const value = series.data[dataIndex];
      const color =
        value === null ? getSeriesColor({ value, dataIndex }) : secondaryColorScale(value);
      if (color === null) {
        return getSeriesColor({ value, dataIndex });
      }
      return color;
    }) as ColorGetter<SeriesType>; // Cast needed due to TS limitation in narrowing generic.
  }

  if (mainColorScale) {
    return ((dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }
      const value = mainAxis.data?.[dataIndex];
      const color = value === null ? getSeriesColor({ value, dataIndex }) : mainColorScale(value);
      if (color === null) {
        return getSeriesColor({ value, dataIndex });
      }
      return color;
    }) as ColorGetter<SeriesType>; // Cast needed due to TS limitation in narrowing generic.
  }

  return ((dataIndex?: number) => {
    if (dataIndex === undefined) {
      return series.color;
    }
    const value = series.data[dataIndex];
    return getSeriesColor({ value, dataIndex });
  }) as ColorGetter<SeriesType>; // Cast needed due to TS limitation in narrowing generic.
}
