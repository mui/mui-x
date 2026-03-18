import { type NumberValue } from '@mui/x-charts-vendor/d3-scale';
import { type AxisConfig } from '../../../../models/axis';
import { type CartesianChartSeriesType } from '../../../../models/seriesType/config';
import { type ProcessedSeries } from '../../corePlugins/useChartSeries';

export const getAxisDomainLimit = <T extends CartesianChartSeriesType>(
  axis: Pick<AxisConfig, 'id' | 'domainLimit'>,
  axisDirection: 'x' | 'y',
  axisIndex: number,
  formattedSeries: ProcessedSeries<T | 'line'>,
):
  | 'nice'
  | 'strict'
  | ((min: NumberValue, max: NumberValue) => { min: NumberValue; max: NumberValue }) => {
  if (axis.domainLimit !== undefined) {
    return axis.domainLimit;
  }

  if (axisDirection === 'x') {
    for (const seriesId of formattedSeries.line?.seriesOrder ?? []) {
      const series = formattedSeries.line!.series[seriesId];

      if (series.xAxisId === axis.id || (series.xAxisId === undefined && axisIndex === 0)) {
        return 'strict';
      }
    }
  }
  return 'nice';
};
