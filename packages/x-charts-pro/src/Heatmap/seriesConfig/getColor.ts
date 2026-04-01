import { type ColorProcessor } from '@mui/x-charts/internals';

const getColor: ColorProcessor<'heatmap'> = (series, xAxis, yAxis, zAxis) => {
  const zColorScale = zAxis?.colorScale;

  if (zColorScale) {
    return (value: number | null) => {
      if (value === null) {
        return '';
      }

      const color = zColorScale(value);
      if (color === null) {
        return '';
      }
      return color;
    };
  }

  return () => '';
};

export default getColor;
