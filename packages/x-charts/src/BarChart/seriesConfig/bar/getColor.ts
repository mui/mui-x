import type { ColorProcessor } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getSeriesColorFn } from '../../../internals/getSeriesColorFn';

const getColor: ColorProcessor<'bar'> = (series, xAxis, yAxis) => {
  const verticalLayout = series.layout === 'vertical';

  const bandColorScale = verticalLayout ? xAxis?.colorScale : yAxis?.colorScale;
  const valueColorScale = verticalLayout ? yAxis?.colorScale : xAxis?.colorScale;
  const bandValues = verticalLayout ? xAxis?.data : yAxis?.data;
  const getSeriesColor = getSeriesColorFn(series);

  if (valueColorScale) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }

      const value = series.data[dataIndex];
      const color = value === null ? getSeriesColor({ value, dataIndex }) : valueColorScale(value);

      if (color === null) {
        return getSeriesColor({ value, dataIndex });
      }

      return color;
    };
  }
  if (bandColorScale && bandValues) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }

      const value = bandValues[dataIndex];
      const color = value === null ? getSeriesColor({ value, dataIndex }) : bandColorScale(value);

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
};

export default getColor;
