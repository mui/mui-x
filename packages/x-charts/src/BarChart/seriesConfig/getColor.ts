import { ColorProcessor } from '../../internals/plugins/models';

const getColor: ColorProcessor<'bar'> = (series, xAxis, yAxis) => {
  const verticalLayout = series.layout === 'vertical';

  const bandColorScale = verticalLayout ? xAxis?.colorScale : yAxis?.colorScale;
  const valueColorScale = verticalLayout ? yAxis?.colorScale : xAxis?.colorScale;
  const bandValues = verticalLayout ? xAxis?.data : yAxis?.data;

  if (valueColorScale) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }
      const value = series.data[dataIndex];
      const color = value === null ? series.color : valueColorScale(value);
      if (color === null) {
        return series.color;
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
      const color = value === null ? series.color : bandColorScale(value);
      if (color === null) {
        return series.color;
      }
      return color;
    };
  }
  return () => series.color;
};

export default getColor;
