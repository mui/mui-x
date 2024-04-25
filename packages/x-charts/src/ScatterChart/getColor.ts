import { AxisDefaultized } from '../models/axis';
import { ZAxisDefaultized } from '../models/z-axis';
import { DefaultizedScatterSeriesType } from '../models/seriesType/scatter';

export default function getColor(
  series: DefaultizedScatterSeriesType,
  xAxis: AxisDefaultized,
  yAxis: AxisDefaultized,
  zAxis?: ZAxisDefaultized,
) {
  const zColorScale = zAxis?.colorScale;
  const yColorScale = yAxis.colorScale;
  const xColorScale = xAxis.colorScale;

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
}
