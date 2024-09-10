import { AxisConfig } from '../../models';
import { CartesianChartSeriesType } from '../../models/seriesType/config';
import { FormattedSeries } from '../SeriesProvider';
import { ExtremumGettersConfig, ExtremumGetterResult } from '../PluginProvider';

const axisExtremumCallback = <T extends CartesianChartSeriesType>(
  acc: ExtremumGetterResult,
  chartType: T,
  axis: AxisConfig,
  getters: ExtremumGettersConfig<T>,
  isDefaultAxis: boolean,
  formattedSeries: FormattedSeries,
): ExtremumGetterResult => {
  const getter = getters[chartType];
  const series = formattedSeries[chartType]?.series ?? {};

  const [minChartTypeData, maxChartTypeData] = getter?.({
    series,
    axis,
    isDefaultAxis,
  }) ?? [Infinity, -Infinity];

  const [minData, maxData] = acc;

  return [Math.min(minChartTypeData, minData), Math.max(maxChartTypeData, maxData)];
};

export const getAxisExtremum = (
  axis: AxisConfig,
  getters: ExtremumGettersConfig,
  isDefaultAxis: boolean,
  formattedSeries: FormattedSeries,
) => {
  const charTypes = Object.keys(getters) as CartesianChartSeriesType[];

  const extremums = charTypes.reduce<ExtremumGetterResult>(
    (acc, charType) =>
      axisExtremumCallback(acc, charType, axis, getters, isDefaultAxis, formattedSeries),
    [Infinity, -Infinity],
  );

  if (Number.isNaN(extremums[0]) || Number.isNaN(extremums[1])) {
    return [Infinity, -Infinity];
  }

  return extremums;
};
