import type { ColorProcessor } from '@mui/x-charts/internals';

const getColor: ColorProcessor<'mapShape'> = (series, _mainAxis, _secondaryAxis, zAxis) => {
  const colorScale = zAxis?.colorScale;

  if (colorScale) {
    return (name?: string) => {
      if (name == null) {
        return series.color;
      }
      const item = series.data.find((d) => d.name === name);

      if (item?.color !== undefined) {
        return item.color;
      }
      const scaleInput = item?.colorValue ?? item?.value;

      const color = colorScale(scaleInput);

      return color;
    };
  }

  return (name?: string) => {
    if (name == null) {
      return series.color;
    }
    const item = series.data.find((d) => d.name === name);
    return item?.color ?? series.color;
  };
};

export default getColor;
