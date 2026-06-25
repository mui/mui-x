import type { ColorProcessor } from '@mui/x-charts/internals';

const getColor: ColorProcessor<'mapShape'> = (series, _mainAxis, _secondaryAxis, zAxis) => {
  const lookupByName = new Map(series.data.map((d) => [d.name, d]));
  const colorScale = zAxis?.colorScale;

  if (colorScale) {
    return (name?: string) => {
      if (name == null) {
        return series.color;
      }
      const item = lookupByName.get(name);
      if (!item) {
        return series.color;
      }

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
    const item = lookupByName.get(name);
    return item?.color ?? series.color;
  };
};

export default getColor;
