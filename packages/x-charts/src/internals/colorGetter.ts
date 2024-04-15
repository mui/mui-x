import getBarColor from '../BarChart/getColor';
import getLineColor from '../LineChart/getColor';
import getScatterColor from '../ScatterChart/getColor';
import getPieColor from '../PieChart/getColor';
import {
  DefaultizedBarSeriesType,
  DefaultizedLineSeriesType,
  DefaultizedPieSeriesType,
  DefaultizedScatterSeriesType,
} from '../models';
import { AxisDefaultized } from '../models/axis';

function getColor(series: DefaultizedPieSeriesType): (dataIndex: number) => string;
function getColor(
  series:
    | DefaultizedBarSeriesType
    | DefaultizedLineSeriesType
    | DefaultizedScatterSeriesType
    | DefaultizedPieSeriesType,
  xAxis: AxisDefaultized,
  yAxis: AxisDefaultized,
): (dataIndex: number) => string;
function getColor(
  series:
    | DefaultizedBarSeriesType
    | DefaultizedLineSeriesType
    | DefaultizedScatterSeriesType
    | DefaultizedPieSeriesType,
  xAxis?: AxisDefaultized,
  yAxis?: AxisDefaultized,
): (dataIndex: number) => string {
  if (xAxis !== undefined && yAxis !== undefined) {
    if (series.type === 'bar') {
      return getBarColor(series, xAxis, yAxis);
    }

    if (series.type === 'line') {
      return getLineColor(series, xAxis, yAxis);
    }

    if (series.type === 'scatter') {
      return getScatterColor(series, xAxis, yAxis);
    }
  }
  if (series.type === 'pie') {
    return getPieColor(series);
  }

  throw Error(
    `MUI X Charts: getColor called with unexpected arguments for series with id "${series.id}"`,
  );
}

export default getColor;
