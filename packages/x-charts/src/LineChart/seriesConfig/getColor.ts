import { type ColorProcessor } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getSeriesColorFn } from '../../internals/getSeriesColorFn';

const getColor: ColorProcessor<'line'> = (series, xAxis, yAxis) => {
  const yColorScale = yAxis?.colorScale;
  const xColorScale = xAxis?.colorScale;
  const getSeriesColor = getSeriesColorFn(series);

  if (yColorScale) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }
      const value = series.data[dataIndex];
      const color = value === null ? getSeriesColor({ value, dataIndex }) : yColorScale(value);
      if (color === null) {
        return getSeriesColor({ value, dataIndex });
      }

      return color;
    };
  }

  if (xColorScale) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }
      const value = xAxis.data?.[dataIndex];
      const color = value === null ? getSeriesColor({ value, dataIndex }) : xColorScale(value);
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
