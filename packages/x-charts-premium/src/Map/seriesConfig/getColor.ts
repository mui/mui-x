import type { ColorProcessor } from '@mui/x-charts/internals';

const getColor: ColorProcessor<'mapShape'> = (series, _mainAxis, _secondaryAxis, zAxis) => {
  const colorScale = zAxis?.colorScale;

  if (colorScale) {
    return (name?: string) => {
      if (name == null) {
        return series.color;
      }
      const itemIndex = series.lookupByName.get(name);
      if (itemIndex === undefined) {
        return series.color;
      }
      const item = series.data[itemIndex];

      if (item === undefined) {
        return series.color;
      }

      if (item.color !== undefined) {
        return item.color;
      }
      const scaleInput = item.colorValue ?? item.value;

      const color = colorScale(scaleInput);

      return color;
    };
  }

  return (name?: string) => {
    if (name == null) {
      return series.color;
    }
    const itemIndex = series.lookupByName.get(name);
    if (itemIndex === undefined) {
      return series.color;
    }
    const item = series.data[itemIndex];
    return item?.color ?? series.color;
  };
};

export default getColor;
