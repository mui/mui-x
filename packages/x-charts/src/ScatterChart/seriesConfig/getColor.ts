import { type ColorProcessor } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getSeriesColorFn } from '../../internals/getSeriesColorFn';

const getColor: ColorProcessor<'scatter'> = (series, xAxis, yAxis, zAxis) => {
  const zColorScale = zAxis?.colorScale;
  const yColorScale = yAxis?.colorScale;
  const xColorScale = xAxis?.colorScale;
  const getSeriesColor = getSeriesColorFn(series);

  if (zColorScale) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }

      if (zAxis?.data?.[dataIndex] !== undefined) {
        const color = zColorScale(zAxis?.data?.[dataIndex]);
        if (color !== null) {
          return color;
        }
      }
      const value = series.data[dataIndex];
      const color = value === null ? getSeriesColor({ value, dataIndex }) : zColorScale(value.z);
      if (color === null) {
        return getSeriesColor({ value, dataIndex });
      }
      return color;
    };
  }

  if (yColorScale) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }
      const value = series.data[dataIndex];
      const color = value === null ? getSeriesColor({ value, dataIndex }) : yColorScale(value.y);
      if (color === null) {
        return getSeriesColor({ value, dataIndex });
      }
      return color;
    };
  }

  if (xColorScale) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }
      const value = series.data[dataIndex];
      const color = value === null ? getSeriesColor({ value, dataIndex }) : xColorScale(value.x);
      if (color === null) {
        return getSeriesColor({ value, dataIndex });
      }
      return color;
    };
  }

  return (dataIndex?: number) => {
    if (dataIndex === undefined) {
      return series.color;
    }

    const value = series.data[dataIndex];

    return getSeriesColor({ value, dataIndex });
  };
};

export default getColor;
