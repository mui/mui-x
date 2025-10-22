import { ColorProcessor } from '../../internals/plugins/models';
import { getSeriesColorFn } from '../../internals/getSeriesColorFn';

const getColor: ColorProcessor<'scatter'> = (series, xAxis, yAxis, zAxis) => {
  const zColorScale = zAxis?.colorScale;
  const yColorScale = yAxis?.colorScale;
  const xColorScale = xAxis?.colorScale;
  const getSeriesColor = getSeriesColorFn(series.color);

  if (zColorScale) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return getSeriesColor(dataIndex);
      }
      if (zAxis?.data?.[dataIndex] !== undefined) {
        const color = zColorScale(zAxis?.data?.[dataIndex]);
        if (color !== null) {
          return color;
        }
      }
      const value = series.data[dataIndex];
      const color = value === null ? getSeriesColor(dataIndex) : zColorScale(value.z);
      if (color === null) {
        return getSeriesColor(dataIndex);
      }
      return color;
    };
  }

  if (yColorScale) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return getSeriesColor(dataIndex);
      }
      const value = series.data[dataIndex];
      const color = value === null ? getSeriesColor(dataIndex) : yColorScale(value.y);
      if (color === null) {
        return getSeriesColor(dataIndex);
      }
      return color;
    };
  }

  if (xColorScale) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return getSeriesColor(dataIndex);
      }
      const value = series.data[dataIndex];
      const color = value === null ? getSeriesColor(dataIndex) : xColorScale(value.x);
      if (color === null) {
        return getSeriesColor(dataIndex);
      }
      return color;
    };
  }

  return getSeriesColor;
};

export default getColor;
