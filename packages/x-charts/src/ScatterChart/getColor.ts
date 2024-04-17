import { AxisDefaultized } from '../models/axis';
import { DefaultizedScatterSeriesType } from '../models/seriesType/scatter';

export default function getColor(
  series: DefaultizedScatterSeriesType,
  xAxis: AxisDefaultized,
  yAxis: AxisDefaultized,
) {
  const yColorScale = yAxis.colorScale;
  const xColorScale = xAxis.colorScale;

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
}
