import type { ColorProcessor } from '@mui/x-charts/internals';

const getColor: ColorProcessor<'mapPoint'> = (series, _mainAxis, _secondaryAxis, zAxis) => {
  const colorScale = zAxis?.colorScale;

  return (dataIndex?: number) => {
    if (dataIndex === undefined) {
      return series.color;
    }
    const item = series.data[dataIndex];
    if (item === undefined) {
      return series.color;
    }
    if (item.color !== undefined) {
      return item.color;
    }
    if (colorScale) {
      const color = colorScale(item.colorValue ?? item.value);
      if (typeof color === 'string') {
        return color;
      }
    }
    return series.color;
  };
};

export default getColor;
