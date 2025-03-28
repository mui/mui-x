import { CartesianChartSeriesType } from '../../../../models/seriesType/config';
import { ChartSeriesConfig, AxisTriggeringTooltipGetter } from '../../models/seriesConfig';
import { ProcessedSeries } from '../../corePlugins/useChartSeries/useChartSeries.types';
import { isCartesianSeriesType } from '../../../isCartesian';
import { AxisId } from '../../../../models/axis';

export const getAxisTriggerTooltip = <TSeriesType extends CartesianChartSeriesType>(
  axisDirection: 'x' | 'y',
  seriesConfig: ChartSeriesConfig<TSeriesType>,
  formattedSeries: ProcessedSeries<TSeriesType>,
  defaultAxisId: AxisId,
) => {
  const tooltipAxesIds = new Set<AxisId>();

  const chartTypes = Object.keys(seriesConfig).filter(isCartesianSeriesType) as TSeriesType[];

  chartTypes.forEach((chartType) => {
    const series = formattedSeries[chartType]?.series ?? {};
    const tooltipAxes = (
      seriesConfig[chartType].axisTriggeringTooltipGetter as
        | AxisTriggeringTooltipGetter<TSeriesType, 'x' | 'y'>
        | undefined
    )?.(series);

    if (tooltipAxes === undefined) {
      return;
    }

    tooltipAxes.forEach(({ axisId, direction }) => {
      if (direction === axisDirection) {
        tooltipAxesIds.add(axisId ?? defaultAxisId);
      }
    });
  });
  return tooltipAxesIds;
};
