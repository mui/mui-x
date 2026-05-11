import { type ColorProcessor, getSeriesColorFn } from '@mui/x-charts/internals';

const getColor: ColorProcessor<'radialLine'> = (series, rotationAxis, radiusAxis) => {
  const yColorScale = radiusAxis?.colorScale;
  const xColorScale = rotationAxis?.colorScale;
  const getSeriesColor = getSeriesColorFn(series);

  if (yColorScale) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }
      const value = series.data[dataIndex];
      const color = value === null ? getSeriesColor({ value, dataIndex }) : yColorScale(value);
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
      const value = rotationAxis.data?.[dataIndex];
      const color = value === null ? getSeriesColor({ value, dataIndex }) : xColorScale(value);
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
