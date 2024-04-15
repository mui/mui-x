import { AxisDefaultized } from '../models/axis';
import { DefaultizedLineSeriesType } from '../models/seriesType/line';

export default function getColor(
  series: DefaultizedLineSeriesType,
  xAxis: AxisDefaultized,
  yAxis: AxisDefaultized,
) {
  const yColorScale = yAxis.colorScale;
  const xColorScale = xAxis.colorScale;

  if (yColorScale) {
    return (dataIndex: number) => {
      const value = series.data[dataIndex];
      const color = value === null ? series.color : yColorScale(value);
      if (color === null) {
        return series.color;
      }
      return color;
    };
  }
  if (xColorScale) {
    return (dataIndex: number) => {
      const value = xAxis.data?.[dataIndex];
      const color = value === null ? series.color : xColorScale(value);
      if (color === null) {
        return series.color;
      }
      return color;
    };
  }

  return () => series.color;
}
