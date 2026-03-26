import { type ColorProcessor, getSeriesColorFn } from '@mui/x-charts/internals';
import { candlestickPaletteLight } from '../../colorPalettes/complementary/candlestick';

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

  if (series.colorGetter) {
    return (dataIndex?: number) => {
      if (dataIndex === undefined) {
        return series.color;
      }

      const value = series.data[dataIndex];
      return getSeriesColor({ value, dataIndex });
    };
  }

  const upColor = series.upColor ?? candlestickPaletteLight[0];
  const downColor = series.downColor ?? candlestickPaletteLight[1];

  return (dataIndex?: number) => {
    if (dataIndex === undefined) {
      return series.color;
    }

    const value = series.data[dataIndex];

    if (value === null) {
      return series.color;
    }

    const [open, , , close] = value;
    return close >= open ? upColor : downColor;
  };
};

export default getColor;
