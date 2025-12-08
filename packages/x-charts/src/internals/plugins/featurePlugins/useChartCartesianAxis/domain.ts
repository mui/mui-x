import { type NumberValue } from '@mui/x-charts-vendor/d3-scale';
import { type ContinuousScaleName, type DefaultedAxis } from '../../../../models/axis';
import { getScale } from '../../../getScale';
import { type ProcessedSeries } from '../../corePlugins/useChartSeries';
import { getAxisDomainLimit } from './getAxisDomainLimit';
import { getTickNumber } from '../../../ticks';
import { type TickParams } from '../../../../hooks/useTicks';

function niceDomain(
  scaleType: ContinuousScaleName | undefined,
  domain: [NumberValue, NumberValue],
  tickNumber?: number,
) {
  return getScale(scaleType ?? 'linear', domain, [0, 1])
    .nice(tickNumber)
    .domain() as [number | Date, number | Date];
}

/**
 * Calculates the initial domain and tick number for a given axis.
 * The domain should still run through the zoom filterMode after this step.
 */
export function calculateInitialDomainAndTickNumber(
  axis: DefaultedAxis<ContinuousScaleName>,
  axisDirection: 'x' | 'y',
  axisIndex: number,
  formattedSeries: ProcessedSeries,
  [minData, maxData]: [number | Date, number | Date],
  defaultTickNumber: number,
  preferStrictDomainInLineCharts: boolean | undefined,
) {
  const domainLimit = getDomainLimit(
    axis,
    axisDirection,
    axisIndex,
    formattedSeries,
    preferStrictDomainInLineCharts,
  );

  let axisExtrema = getActualAxisExtrema(axis, minData, maxData);

  if (typeof domainLimit === 'function') {
    const { min, max } = domainLimit(minData.valueOf(), maxData.valueOf());
    axisExtrema[0] = min;
    axisExtrema[1] = max;
  }

  const tickNumber = getTickNumber(axis, axisExtrema, defaultTickNumber);

  if (domainLimit === 'nice') {
    axisExtrema = niceDomain(axis.scaleType, axisExtrema, tickNumber);
  }

  axisExtrema = [
    'min' in axis ? (axis.min ?? axisExtrema[0]) : axisExtrema[0],
    'max' in axis ? (axis.max ?? axisExtrema[1]) : axisExtrema[1],
  ];

  return { domain: axisExtrema, tickNumber };
}

/**
 * Calculates the final domain for an axis.
 * After this step, the domain can be used to create the axis scale.
 */
export function calculateFinalDomain(
  axis: Pick<DefaultedAxis<ContinuousScaleName>, 'id' | 'domainLimit' | 'scaleType'> &
    TickParams & { min?: NumberValue; max?: NumberValue },
  axisDirection: 'x' | 'y',
  axisIndex: number,
  formattedSeries: ProcessedSeries,
  [minData, maxData]: [number | Date, number | Date],
  tickNumber: number,
  preferStrictDomainInLineCharts: boolean | undefined,
) {
  const domainLimit = getDomainLimit(
    axis,
    axisDirection,
    axisIndex,
    formattedSeries,
    preferStrictDomainInLineCharts,
  );

  let axisExtrema = getActualAxisExtrema(axis, minData, maxData);

  if (typeof domainLimit === 'function') {
    const { min, max } = domainLimit(minData.valueOf(), maxData.valueOf());
    axisExtrema[0] = min;
    axisExtrema[1] = max;
  }

  if (domainLimit === 'nice') {
    axisExtrema = niceDomain(axis.scaleType, axisExtrema, tickNumber);
  }

  return [axis.min ?? axisExtrema[0], axis.max ?? axisExtrema[1]];
}

function getDomainLimit(
  axis: Pick<DefaultedAxis, 'id' | 'domainLimit'>,
  axisDirection: 'x' | 'y',
  axisIndex: number,
  formattedSeries: ProcessedSeries,
  preferStrictDomainInLineCharts: boolean | undefined,
) {
  return preferStrictDomainInLineCharts
    ? getAxisDomainLimit(axis, axisDirection, axisIndex, formattedSeries)
    : (axis.domainLimit ?? 'nice');
}

/**
 * Get the actual axis extrema considering the user defined min and max values.
 * @param axisExtrema User defined axis extrema.
 * @param minData Minimum value from the data.
 * @param maxData Maximum value from the data.
 */
function getActualAxisExtrema(
  axisExtrema: { min?: NumberValue; max?: NumberValue } | {},
  minData: NumberValue,
  maxData: NumberValue,
): [NumberValue, NumberValue] {
  let min = minData;
  let max = maxData;

  if ('max' in axisExtrema && axisExtrema.max != null && axisExtrema.max < minData) {
    min = axisExtrema.max;
  }

  if ('min' in axisExtrema && axisExtrema.min != null && axisExtrema.min > minData) {
    max = axisExtrema.min;
  }

  if (!('min' in axisExtrema) && !('max' in axisExtrema)) {
    return [min, max];
  }
  return [axisExtrema.min ?? min, axisExtrema.max ?? max];
}
