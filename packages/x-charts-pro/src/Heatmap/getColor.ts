import { ColorProcessor } from '@mui/x-charts/internals';

const getColor: ColorProcessor<'heatmap'> = (series, xAxis, yAxis, zAxis) => {
  const zColorScale = zAxis?.colorScale;

  if (zColorScale) {
    return (dataIndex: number) => {
      const value = series.data[dataIndex];
      const color = zColorScale(value[2]);
      if (color === null) {
        return '';
      }
      return color;
    };
  }

  return () => '';
};

export default getColor;
