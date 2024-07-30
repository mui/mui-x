import { scaleBand, scalePoint, scaleTime } from '@mui/x-charts-vendor/d3-scale';
import { AxisConfig, ScaleName } from '../../models';
import {
  ChartsXAxisProps,
  ChartsAxisProps,
  ChartsYAxisProps,
  isBandScaleConfig,
  isPointScaleConfig,
  AxisId,
} from '../../models/axis';
import {
  CartesianChartSeriesType,
  DatasetType,
  ExtremumGetter,
} from '../../models/seriesType/config';
import { DefaultizedAxisConfig } from './CartesianContext';
import { getColorScale, getOrdinalColorScale } from '../../internals/colorScale';
import { getTickNumber } from '../../hooks/useTicks';
import { getScale } from '../../internals/getScale';
import { DrawingArea } from '../DrawingProvider';
import { FormattedSeries } from '../SeriesProvider';
import { getAxisExtremum } from './getAxisExtremum';
import { normalizeAxis } from './normalizeAxis';

const getRange = (drawingArea: DrawingArea, axisDirection: 'x' | 'y', isReverse?: boolean) => {
  const range =
    axisDirection === 'x'
      ? [drawingArea.left, drawingArea.left + drawingArea.width]
      : [drawingArea.top + drawingArea.height, drawingArea.top];

  return isReverse ? range.reverse() : range;
};

const zoomedScaleRange = (scaleRange: [number, number] | number[], zoomRange: [number, number]) => {
  const rangeGap = scaleRange[1] - scaleRange[0];
  const zoomGap = zoomRange[1] - zoomRange[0];

  // If current zoom show the scale between p1 and p2 percents
  // The range should be extended by adding [0, p1] and [p2, 100] segments
  const min = scaleRange[0] - (zoomRange[0] * rangeGap) / zoomGap;
  const max = scaleRange[1] + ((100 - zoomRange[1]) * rangeGap) / zoomGap;

  return [min, max];
};
const isDateData = (data?: any[]): data is Date[] => data?.[0] instanceof Date;

function createDateFormatter(
  axis: AxisConfig<'band' | 'point', any, ChartsAxisProps>,
  range: number[],
): AxisConfig<'band' | 'point', any, ChartsAxisProps>['valueFormatter'] {
  const timeScale = scaleTime(axis.data!, range);

  return (v, { location }) =>
    location === 'tick' ? timeScale.tickFormat(axis.tickNumber)(v) : `${v.toLocaleString()}`;
}

const DEFAULT_CATEGORY_GAP_RATIO = 0.2;
const DEFAULT_BAR_GAP_RATIO = 0.1;

export function computeValue(options: {
  drawingArea: DrawingArea;
  formattedSeries: FormattedSeries;
  axis: AxisConfig<ScaleName, any, ChartsYAxisProps>[] | undefined;
  extremumGetters: { [K in CartesianChartSeriesType]?: ExtremumGetter<K> };
  axisDirection: 'y';
  dataset: DatasetType | undefined;
  zoomData?: { axisId: AxisId; start: number; end: number }[];
}): {
  axis: DefaultizedAxisConfig<ChartsYAxisProps>;
  axisIds: string[];
};
export function computeValue(options: {
  drawingArea: DrawingArea;
  formattedSeries: FormattedSeries;
  axis: AxisConfig<ScaleName, any, ChartsXAxisProps>[] | undefined;
  extremumGetters: { [K in CartesianChartSeriesType]?: ExtremumGetter<K> };
  axisDirection: 'x';
  dataset: DatasetType | undefined;
  zoomData?: { axisId: AxisId; start: number; end: number }[];
}): {
  axis: DefaultizedAxisConfig<ChartsAxisProps>;
  axisIds: string[];
};
export function computeValue({
  drawingArea,
  formattedSeries,
  axis: inAxis,
  extremumGetters,
  dataset,
  axisDirection,
  zoomData,
}: {
  drawingArea: DrawingArea;
  formattedSeries: FormattedSeries;
  axis: AxisConfig<ScaleName, any, ChartsAxisProps>[] | undefined;
  extremumGetters: { [K in CartesianChartSeriesType]?: ExtremumGetter<K> };
  axisDirection: 'x' | 'y';
  dataset: DatasetType | undefined;
  zoomData?: { axisId: AxisId; start: number; end: number }[];
}) {
  const allAxis = normalizeAxis(inAxis, dataset, axisDirection);

  const completeAxis: DefaultizedAxisConfig<ChartsAxisProps> = {};
  allAxis.forEach((axis, axisIndex) => {
    const isDefaultAxis = axisIndex === 0;
    const [minData, maxData] = getAxisExtremum(
      axis,
      extremumGetters,
      isDefaultAxis,
      formattedSeries,
    );

    const zoom = zoomData?.find(({ axisId }) => axisId === axis.id);
    const zoomRange: [number, number] = zoom ? [zoom.start, zoom.end] : [0, 100];
    const range = getRange(drawingArea, axisDirection, axis.reverse);

    if (isBandScaleConfig(axis)) {
      const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
      const barGapRatio = axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO;
      // Reverse range because ordinal scales are presented from top to bottom on y-axis
      const scaleRange = axisDirection === 'x' ? range : [range[1], range[0]];
      const zoomedRange = zoomedScaleRange(scaleRange, zoomRange);

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

      if (isDateData(axis.data)) {
        const dateFormatter = createDateFormatter(axis, scaleRange);
        completeAxis[axis.id].valueFormatter = axis.valueFormatter ?? dateFormatter;
      }
    }
    if (isPointScaleConfig(axis)) {
      const scaleRange = axisDirection === 'x' ? range : [...range].reverse();
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

      if (isDateData(axis.data)) {
        const dateFormatter = createDateFormatter(axis, scaleRange);
        completeAxis[axis.id].valueFormatter = axis.valueFormatter ?? dateFormatter;
      }
    }
    if (axis.scaleType === 'band' || axis.scaleType === 'point') {
      // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
      return;
    }

    const scaleType = axis.scaleType ?? ('linear' as const);

    const extremums = [axis.min ?? minData, axis.max ?? maxData];
    const rawTickNumber = getTickNumber({ ...axis, range, domain: extremums });
    const tickNumber = rawTickNumber / ((zoomRange[1] - zoomRange[0]) / 100);

    const zoomedRange = zoomedScaleRange(range, zoomRange);

    // TODO: move nice to prop? Disable when there is zoom?
    const scale = getScale(scaleType, extremums, zoomedRange).nice(rawTickNumber);
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
