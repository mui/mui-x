import { AxisDefaultized } from '../models/axis';
import { DefaultizedBarSeriesType } from '../models/seriesType/bar';

export default function getColor(
  series: DefaultizedBarSeriesType,
  xAxis: AxisDefaultized,
  yAxis: AxisDefaultized,
) {
  const verticalLayout = series.layout === 'vertical';

  const bandColorScale = verticalLayout ? xAxis.colorScale : yAxis.colorScale;
  const valueColorScale = verticalLayout ? yAxis.colorScale : xAxis.colorScale;
  const bandValues = verticalLayout ? xAxis.data! : yAxis.data!;

  if (valueColorScale) {
    return (dataIndex: number) => {
      const value = series.data[dataIndex];
      const color = value === null ? series.color : valueColorScale(value);
      if (color === null) {
        return series.color;
      }
      return color;
    };
  }
  if (bandColorScale) {
    return (dataIndex: number) => {
      const value = bandValues[dataIndex];
      const color = value === null ? series.color : bandColorScale(value);
      if (color === null) {
        return series.color;
      }
      return color;
    };
  }
  return () => series.color;
}
