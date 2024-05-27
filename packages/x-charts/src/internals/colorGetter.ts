import getBarColor from '../BarChart/getColor';
import getLineColor from '../LineChart/getColor';
import getScatterColor from '../ScatterChart/getColor';
import getPieColor from '../PieChart/getColor';
import { DefaultizedSeriesType } from '../models';
import { AxisDefaultized } from '../models/axis';
import { ZAxisDefaultized } from '../models/z-axis';

export type ColorGetterType = (
  series: DefaultizedSeriesType,
  xAxis?: AxisDefaultized,
  yAxis?: AxisDefaultized,
  zAxis?: ZAxisDefaultized,
) => string;

function getColor(series: DefaultizedSeriesType<'pie'>): (dataIndex: number) => string;
function getColor(
  series: DefaultizedSeriesType<'line' | 'bar'>,
  xAxis: AxisDefaultized,
  yAxis: AxisDefaultized,
): (dataIndex: number) => string;
function getColor(
  series: DefaultizedSeriesType<'scatter'>,
  xAxis: AxisDefaultized,
  yAxis: AxisDefaultized,
  zAxis?: ZAxisDefaultized,
): (dataIndex: number) => string;
function getColor(
  series: DefaultizedSeriesType,
  xAxis?: AxisDefaultized,
  yAxis?: AxisDefaultized,
  zAxis?: ZAxisDefaultized,
): (dataIndex: number) => string {
  if (xAxis !== undefined && yAxis !== undefined) {
    if (series.type === 'bar') {
      return getBarColor(series, xAxis, yAxis);
    }

    if (series.type === 'line') {
      return getLineColor(series, xAxis, yAxis);
    }

    if (series.type === 'scatter') {
      return getScatterColor(series, xAxis, yAxis, zAxis);
    }
  }
  if (series.type === 'pie') {
    return getPieColor(series);
  }

  if (series.type === 'heatmap') {
    const colorScale = zAxis?.colorScale;

    if (colorScale) {
      return (dataIndex: number) => {
        const value = series.data[dataIndex][2];
        if (value !== undefined) {
          return colorScale(value) ?? '';
        }
        return '';
      };
    }
  }

  throw Error(
    `MUI X Charts: getColor called with unexpected arguments for series with id "${series.id}"`,
  );
}

export default getColor;
