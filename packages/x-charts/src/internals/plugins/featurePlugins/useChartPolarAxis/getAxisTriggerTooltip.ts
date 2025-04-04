import { PolarChartSeriesType } from '../../../../models/seriesType/config';
import { ChartSeriesConfig, AxisTooltipGetter } from '../../models/seriesConfig';
import { ProcessedSeries } from '../../corePlugins/useChartSeries/useChartSeries.types';
import { isPolarSeriesType } from '../../../isPolar';
import { AxisId } from '../../../../models/axis';

export const getAxisTriggerTooltip = <TSeriesType extends PolarChartSeriesType>(
  axisDirection: 'radius' | 'rotation',
  seriesConfig: ChartSeriesConfig<TSeriesType>,
  formattedSeries: ProcessedSeries<TSeriesType>,
  defaultAxisId: AxisId,
) => {
  const tooltipAxesIds = new Set<AxisId>();

  const chartTypes = Object.keys(seriesConfig).filter(isPolarSeriesType) as TSeriesType[];

  chartTypes.forEach((chartType) => {
    const series = formattedSeries[chartType]?.series ?? {};
    const tooltipAxes = (
      seriesConfig[chartType].axisTooltipGetter as
        | AxisTooltipGetter<TSeriesType, 'radius' | 'rotation'>
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
