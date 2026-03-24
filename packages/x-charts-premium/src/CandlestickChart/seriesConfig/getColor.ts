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

  // If colorGetter is provided, use it for per-item colors.
  if (series.colorGetter) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }

      const value = series.data[dataIndex];
      return getSeriesColor({ value, dataIndex });
    };
  }

  // Default: use bullish/bearish colors based on OHLC values.
  const { bullishColor, bearishColor } = series;

  return (dataIndex?: number) => {
    if (dataIndex === undefined) {
      return series.color;
    }

    const value = series.data[dataIndex];

    if (value === null) {
      return series.color;
    }

    const [open, , , close] = value;

    if (bullishColor && bearishColor) {
      return close >= open ? bullishColor : bearishColor;
    }

    return series.color;
  };
};

export default getColor;
