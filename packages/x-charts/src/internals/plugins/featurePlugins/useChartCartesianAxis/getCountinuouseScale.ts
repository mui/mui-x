import { ScaleSymLog } from '@mui/x-charts-vendor/d3-scale';
import { ChartSeriesType } from '../../../../models/seriesType/config';
import { getScale } from '../../../getScale';
import { isSymlogScaleConfig, ContinuousScaleName, AxisConfig } from '../../../../models/axis';
import { getAxisDomainLimit } from './getAxisDomainLimit';
import { getTickNumber, scaleTickNumberByRange } from '../../../ticks';
import { zoomScaleRange } from './zoom';
import { ProcessedSeries } from '../../corePlugins/useChartSeries';

export function getCountinuouseScale<T extends ChartSeriesType>(
  axis: Readonly<AxisConfig<ContinuousScaleName>>,
  axisDirection: 'x' | 'y',
  axisIndex: number,
  axisExtremums: [number, number],
  axisRange: [number, number],
  zoomRange: [number, number],
  formattedSeries: ProcessedSeries<T>,
  preferStrictDomainInLineCharts?: boolean,
) {
  const scaleType = axis.scaleType ?? ('linear' as const);

  const domainLimit = getAxisDomainLimit(
    axis,
    axisDirection,
    axisIndex,
    formattedSeries,
    preferStrictDomainInLineCharts,
  );

  let adjustedExtrema = axisExtremums;
  if (typeof domainLimit === 'function') {
    const { min, max } = domainLimit(axisExtremums[0], axisExtremums[1]);
    adjustedExtrema = [min, max];
  }

  const rawTickNumber = getTickNumber({ ...axis, range: axisRange, domain: adjustedExtrema });
  const tickNumber = scaleTickNumberByRange(rawTickNumber, zoomRange);

  const zoomedRange = zoomScaleRange(axisRange, zoomRange);

  const scale = getScale(scaleType, adjustedExtrema, zoomedRange);

  if (domainLimit === 'nice') {
    scale.nice(tickNumber);
  }
  if (isSymlogScaleConfig(axis) && axis.constant != null) {
    (scale as ScaleSymLog<number, number>).constant(axis.constant);
  }

  return { scale, scaleType, tickNumber };
}
