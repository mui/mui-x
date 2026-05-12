import type { ChartSeriesType } from '../models/seriesType/config';
import type { ColorProcessor } from './plugins/corePlugins/useChartSeriesConfig';
import { getSeriesColorFn } from './getSeriesColorFn';

/**
 * Shared color processor for line-style polar/cartesian charts.
 *
 * Used by `line`, `radialLine`, and `radialBar` — series types whose getColor body
 * checks the secondary-axis colorScale, then the main-axis colorScale, then falls
 * back to the series color.
 */
export function createLineStyleColorProcessor<T extends ChartSeriesType>(): ColorProcessor<T> {
  return ((series: any, mainAxis: any, secondaryAxis: any) => {
    const secondaryColorScale = secondaryAxis?.colorScale;
    const mainColorScale = mainAxis?.colorScale;
    const getSeriesColor = getSeriesColorFn(series);

    if (secondaryColorScale) {
      return (dataIndex?: number) => {
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
      };
    }

    if (mainColorScale) {
      return (dataIndex?: number) => {
        if (dataIndex === undefined) {
          return series.color;
        }
        const value = mainAxis.data?.[dataIndex];
        const color = value === null ? getSeriesColor({ value, dataIndex }) : mainColorScale(value);
        if (color === null) {
          return getSeriesColor({ value, dataIndex });
        }
        return color;
      };
    }

    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }
      const value = series.data[dataIndex];
      return getSeriesColor({ value, dataIndex });
    };
  }) as ColorProcessor<T>;
}
