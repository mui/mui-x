import { ColorProcessor } from '../../../internals/plugins/models';
import { getSeriesColorFn } from '../../../internals/getSeriesColorFn';

const getColor: ColorProcessor<'bar'> = (series, xAxis, yAxis) => {
  const verticalLayout = series.layout === 'vertical';

  const bandColorScale = verticalLayout ? xAxis?.colorScale : yAxis?.colorScale;
  const valueColorScale = verticalLayout ? yAxis?.colorScale : xAxis?.colorScale;
  const bandValues = verticalLayout ? xAxis?.data : yAxis?.data;
  const getSeriesColor = getSeriesColorFn(series.color);

  if (valueColorScale) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return getSeriesColor(dataIndex);
      }

      const value = series.data[dataIndex];
      const color = value === null ? getSeriesColor(dataIndex) : valueColorScale(value);

      if (color === null) {
        return getSeriesColor(dataIndex);
      }

      return color;
    };
  }
  if (bandColorScale && bandValues) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return getSeriesColor(dataIndex);
      }

      const value = bandValues[dataIndex];
      const color = value === null ? getSeriesColor(dataIndex) : bandColorScale(value);

      if (color === null) {
        return getSeriesColor(dataIndex);
      }

      return color;
    };
  }

  return getSeriesColor;
};

export default getColor;
