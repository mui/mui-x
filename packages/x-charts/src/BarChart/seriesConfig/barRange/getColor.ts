import { ColorProcessor } from '../../../internals/plugins/models';

const getColor: ColorProcessor<'barRange'> = (series, xAxis, yAxis) => {
  const verticalLayout = series.layout === 'vertical';

  const bandColorScale = verticalLayout ? xAxis?.colorScale : yAxis?.colorScale;
  const bandValues = verticalLayout ? xAxis?.data : yAxis?.data;

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
