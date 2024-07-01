import { DefaultizedSeriesType } from '@mui/x-charts';
import { AxisDefaultized, ZAxisDefaultized } from '@mui/x-charts/internals';

export default function getColor(
  series: DefaultizedSeriesType<'heatmap'>,
  xAxis?: AxisDefaultized,
  yAxis?: AxisDefaultized,
  zAxis?: ZAxisDefaultized,
) {
  const zColorScale = zAxis?.colorScale;

  if (zColorScale) {
    return (dataIndex: number) => {
      const value = series.data[dataIndex];
      const color = zColorScale(value[2]);
      if (color === null) {
        return '';
      }
      return color;
    };
  }

  return () => '';
}
