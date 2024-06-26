import { scaleBand, scalePoint } from 'd3-scale';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../../constants';
import { AxisConfig, ScaleName } from '../../models';
import {
  ChartsXAxisProps,
  ChartsAxisProps,
  ChartsYAxisProps,
  isBandScaleConfig,
  isPointScaleConfig,
} from '../../models/axis';
import { CartesianChartSeriesType, ExtremumGetter } from '../../models/seriesType/config';
import { DefaultizedAxisConfig } from './CartesianContext';
import { getColorScale, getOrdinalColorScale } from '../../internals/colorScale';
import { getTickNumber } from '../../hooks/useTicks';
import { getScale } from '../../internals/getScale';
import { DrawingArea } from '../DrawingProvider';
import { FormattedSeries } from '../SeriesContextProvider';
import { MakeOptional } from '../../models/helpers';
import { getAxisExtremum } from './getAxisExtremum';

const getRange = (drawingArea: DrawingArea, axisName: 'x' | 'y', isReverse?: boolean) => {
  const range =
    axisName === 'x'
      ? [drawingArea.left, drawingArea.left + drawingArea.width]
      : [drawingArea.top + drawingArea.height, drawingArea.top];

  return isReverse ? range.reverse() : range;
};

const zoomedScaleRange = (scaleRange: [number, number] | number[], zoomRange: [number, number]) => {
  const rangeGap = scaleRange[1] - scaleRange[0];
  const rangeMinMultiplier = zoomRange[0] / 100;
  const rangeMaxMultiplier = (zoomRange[1] - zoomRange[0]) / 100 - rangeMinMultiplier;
  const min = (scaleRange[0] - rangeGap * rangeMinMultiplier) / (1 - rangeMinMultiplier);
  const max = (scaleRange[1] + rangeGap * (1 - rangeMaxMultiplier)) / rangeMaxMultiplier;
  console.table([
    {
      mul: rangeMinMultiplier,
      gap: rangeGap * rangeMinMultiplier,
      pct: (rangeGap * rangeMinMultiplier) / rangeGap,
    },
    {
      mul: rangeMaxMultiplier,
      gap: rangeGap * rangeMaxMultiplier,
      pct: (rangeGap * rangeMaxMultiplier) / rangeGap,
    },
  ]);
  console.table({
    vals: zoomRange,
    pct: rangeMaxMultiplier + rangeMinMultiplier,
  });
  return [min, max];
};

const DEFAULT_CATEGORY_GAP_RATIO = 0.2;
const DEFAULT_BAR_GAP_RATIO = 0.1;

export function computeValue(
  drawingArea: DrawingArea,
  formattedSeries: FormattedSeries,
  axis: MakeOptional<AxisConfig<ScaleName, any, ChartsYAxisProps>, 'id'>[] | undefined,
  extremumGetters: { [K in CartesianChartSeriesType]?: ExtremumGetter<K> },
  axisName: 'y',
  zoomRange?: [number, number],
): {
  axis: DefaultizedAxisConfig<ChartsYAxisProps>;
  axisIds: string[];
};
export function computeValue(
  drawingArea: DrawingArea,
  formattedSeries: FormattedSeries,
  inAxis: MakeOptional<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id'>[] | undefined,
  extremumGetters: { [K in CartesianChartSeriesType]?: ExtremumGetter<K> },
  axisName: 'x',
  zoomRange?: [number, number],
): {
  axis: DefaultizedAxisConfig<ChartsAxisProps>;
  axisIds: string[];
};
export function computeValue(
  drawingArea: DrawingArea,
  formattedSeries: FormattedSeries,
  inAxis: MakeOptional<AxisConfig<ScaleName, any, ChartsAxisProps>, 'id'>[] | undefined,
  extremumGetters: { [K in CartesianChartSeriesType]?: ExtremumGetter<K> },
  axisName: 'x' | 'y',
  zoomRange: [number, number] = [0, 100],
) {
  const DEFAULT_AXIS_KEY = axisName === 'x' ? DEFAULT_X_AXIS_KEY : DEFAULT_Y_AXIS_KEY;

  const allAxis: AxisConfig<ScaleName, any, ChartsAxisProps>[] = [
    ...(inAxis?.map((axis, index) => ({ id: `defaultized-${axisName}-axis-${index}`, ...axis })) ??
      []),
    ...(inAxis === undefined || inAxis.findIndex(({ id }) => id === DEFAULT_AXIS_KEY) === -1
      ? [{ id: DEFAULT_AXIS_KEY, scaleType: 'linear' as const }]
      : []),
  ];

  const completeAxis: DefaultizedAxisConfig<ChartsAxisProps> = {};
  allAxis.forEach((axis, axisIndex) => {
    const isDefaultAxis = axisIndex === 0;
    const [minData, maxData] = getAxisExtremum(
      axis,
      extremumGetters,
      isDefaultAxis,
      formattedSeries,
    );

    const range = getRange(drawingArea, axisName, axis.reverse);

    if (isBandScaleConfig(axis)) {
      const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
      const barGapRatio = axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO;
      // Reverse range because ordinal scales are presented from top to bottom on y-axis
      const scaleRange = axisName === 'x' ? range : [range[1], range[0]];
      const zoomedRange = zoomedScaleRange(scaleRange, zoomRange);

      // This is a band scale
      completeAxis[axis.id] = {
        categoryGapRatio,
        barGapRatio,
        ...axis,
        scale: scaleBand(axis.data!, zoomedRange)
          .paddingInner(categoryGapRatio)
          .paddingOuter(categoryGapRatio / 2),
        tickNumber: axis.data!.length,
        colorScale:
          axis.colorMap &&
          (axis.colorMap.type === 'ordinal'
            ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
            : getColorScale(axis.colorMap)),
      };
    }
    if (isPointScaleConfig(axis)) {
      const scaleRange = axisName === 'x' ? range : [...range].reverse();
      const zoomedRange = zoomedScaleRange(scaleRange, zoomRange);

      completeAxis[axis.id] = {
        ...axis,
        scale: scalePoint(axis.data!, zoomedRange),
        tickNumber: axis.data!.length,
        colorScale:
          axis.colorMap &&
          (axis.colorMap.type === 'ordinal'
            ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
            : getColorScale(axis.colorMap)),
      };
    }
    if (axis.scaleType === 'band' || axis.scaleType === 'point') {
      // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
      return;
    }

    const scaleType = axis.scaleType ?? ('linear' as const);

    const extremums = [axis.min ?? minData, axis.max ?? maxData];
    const tickNumber = getTickNumber({ ...axis, range, domain: extremums });

    const scale = getScale(scaleType, extremums, range);
    // TODO: move nice to prop? Disable when there is zoom? .nice(tickNumber);
    const [minDomain, maxDomain] = scale.domain();
    const domain = [axis.min ?? minDomain, axis.max ?? maxDomain];

    completeAxis[axis.id] = {
      ...axis,
      scaleType: scaleType as any,
      scale: scale.domain(domain) as any,
      tickNumber,
      colorScale: axis.colorMap && getColorScale(axis.colorMap),
    };
  });

  return {
    axis: completeAxis,
    axisIds: allAxis.map(({ id }) => id),
  };
}
