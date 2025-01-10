import { ColorProcessor } from '@mui/x-charts/internals';

const getColor: ColorProcessor<'funnel'> = (series, xAxis, yAxis) => {
  const verticalLayout = series.layout === 'vertical';

  const bandColorScale = verticalLayout ? xAxis?.colorScale : yAxis?.colorScale;
  const valueColorScale = verticalLayout ? yAxis?.colorScale : xAxis?.colorScale;
  const bandValues = verticalLayout ? xAxis?.data : yAxis?.data;

  if (valueColorScale) {
    return (dataIndex: number) => {
      const item = series.data[dataIndex];
      const color = valueColorScale(item.value);
      if (color === null) {
        return item.color;
      }
      return color;
    };
  }
  if (bandColorScale && bandValues) {
    return (dataIndex: number) => {
      const item = bandValues[dataIndex];
      const color = bandColorScale(item.value);
      if (color === null) {
        return item.color;
      }
      return color;
    };
  }
  return (dataIndex: number) => series.data[dataIndex].color;
};

export default getColor;
