import { ColorProcessor } from '../context/PluginProvider/ColorProcessor.types';

const getColor: ColorProcessor<'scatter'> = (series, xAxis, yAxis, zAxis) => {
  const zColorScale = zAxis?.colorScale;
  const yColorScale = yAxis?.colorScale;
  const xColorScale = xAxis?.colorScale;

  if (zColorScale) {
    return (dataIndex: number) => {
      if (zAxis?.data?.[dataIndex] !== undefined) {
        const color = zColorScale(zAxis?.data?.[dataIndex]);
        if (color !== null) {
          return color;
        }
      }
      const value = series.data[dataIndex];
      const color = value === null ? series.color : zColorScale(value.z);
      if (color === null) {
        return series.color;
      }
      return color;
    };
  }
  if (yColorScale) {
    return (dataIndex: number) => {
      const value = series.data[dataIndex];
      const color = value === null ? series.color : yColorScale(value.y);
      if (color === null) {
        return series.color;
      }
      return color;
    };
  }
  if (xColorScale) {
    return (dataIndex: number) => {
      const value = series.data[dataIndex];
      const color = value === null ? series.color : xColorScale(value.x);
      if (color === null) {
        return series.color;
      }
      return color;
    };
  }

  return () => series.color;
};

export default getColor;
