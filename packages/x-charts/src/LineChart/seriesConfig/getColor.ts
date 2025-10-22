import { ColorProcessor } from '../../internals/plugins/models';
import { getSeriesColorFn } from '../../internals/getSeriesColorFn';

const getColor: ColorProcessor<'line'> = (series, xAxis, yAxis) => {
  const yColorScale = yAxis?.colorScale;
  const xColorScale = xAxis?.colorScale;
  const getSeriesColor = getSeriesColorFn(series.color);

  if (yColorScale) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return getSeriesColor(dataIndex);
      }
      const value = series.data[dataIndex];
      const color = value === null ? getSeriesColor(dataIndex) : yColorScale(value);
      if (color === null) {
        return getSeriesColor(dataIndex);
      }

      return color;
    };
  }

  if (xColorScale) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return getSeriesColor(dataIndex);
      }
      const value = xAxis.data?.[dataIndex];
      const color = value === null ? getSeriesColor(dataIndex) : xColorScale(value);
      if (color === null) {
        return getSeriesColor(dataIndex);
      }

      return color;
    };
  }

  return getSeriesColor;
};

export default getColor;
