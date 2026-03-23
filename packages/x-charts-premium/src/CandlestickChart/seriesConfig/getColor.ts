import { type ColorProcessor, getSeriesColorFn } from '@mui/x-charts/internals';

const getColor: ColorProcessor<'ohlc'> = (series, xAxis) => {
  const bandColorScale = xAxis?.colorScale;
  const bandValues = xAxis?.data;
  const getSeriesColor = getSeriesColorFn(series);

  if (bandColorScale && bandValues) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }

      const value = bandValues[dataIndex];
      const color = value === null ? getSeriesColor({ value, dataIndex }) : bandColorScale(value);

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
