import type { ColorProcessor } from '@mui/x-charts/internals';

const getColor: ColorProcessor<'mapShape'> = (series, _mainAxis, _secondaryAxis, zAxis) => {
  const colorScale = zAxis?.colorScale;

  if (colorScale) {
    return (dataIndex?: number) => {
      if (dataIndex == null) {
        return series.color;
      }
      const item = series.data[dataIndex];
      if (item === undefined) {
        return series.color;
      }
      const scaleInput = item.colorValue ?? item.value;
      if (scaleInput != null) {
        const color = colorScale(scaleInput);
        if (color !== null) {
          return color;
        }
      }
      return item.color ?? series.color;
    };
  }

  return (dataIndex?: number) => {
    if (dataIndex == null) {
      return series.color;
    }
    return series.data[dataIndex].color ?? series.color;
  };
};

export default getColor;
