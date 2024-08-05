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
import { CartesianChartSeriesType, DatasetType } from '../../models/seriesType/config';
import { DefaultizedAxisConfig } from './CartesianContext';
import { getColorScale, getOrdinalColorScale } from '../../internals/colorScale';
import { getTickNumber } from '../../hooks/useTicks';
import { getScale } from '../../internals/getScale';
import { DrawingArea } from '../DrawingProvider';
import { FormattedSeries } from '../SeriesProvider';
import { normalizeAxis } from './normalizeAxis';
import { applyZoomFilter, zoomScaleRange } from './zoom';
import { ExtremumGetter } from '../PluginProvider';

const getRange = (drawingArea: DrawingArea, axisDirection: 'x' | 'y', isReverse?: boolean) => {
  const range =
    axisDirection === 'x'
      ? [drawingArea.left, drawingArea.left + drawingArea.width]
      : [drawingArea.top + drawingArea.height, drawingArea.top];

  return isReverse ? range.reverse() : range;
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

type ComputeResult<T extends ChartsAxisProps> = {
  axis: DefaultizedAxisConfig<T>;
  axisIds: string[];
};

type ComputeCommonParams = {
  drawingArea: DrawingArea;
  formattedSeries: FormattedSeries;
  extremumGetters: { [K in CartesianChartSeriesType]?: ExtremumGetter<K> };
  dataset: DatasetType | undefined;
  zoomData?: { axisId: AxisId; start: number; end: number }[];
  zoomOptions?: Record<AxisId, { filterMode: 'discard' | 'keep' | 'empty' }>;
};

export function computeValue(
  options: ComputeCommonParams & {
    axis: AxisConfig<ScaleName, any, ChartsYAxisProps>[] | undefined;
    axisDirection: 'y';
  },
): ComputeResult<ChartsYAxisProps>;
export function computeValue(
  options: ComputeCommonParams & {
    axis: AxisConfig<ScaleName, any, ChartsXAxisProps>[] | undefined;
    axisDirection: 'x';
  },
): ComputeResult<ChartsAxisProps>;
export function computeValue({
  drawingArea,
  formattedSeries,
  axis: inAxis,
  extremumGetters,
  dataset,
  axisDirection,
  zoomData,
  zoomOptions,
}: ComputeCommonParams & {
  axis: AxisConfig<ScaleName, any, ChartsAxisProps>[] | undefined;
  axisDirection: 'x' | 'y';
}) {
  const allAxis = normalizeAxis(inAxis, dataset, axisDirection);

  const completeAxis: DefaultizedAxisConfig<ChartsAxisProps> = {};
  allAxis.forEach((axis, axisIndex) => {
    const isDefaultAxis = axisIndex === 0;
    const zoomOption = zoomOptions?.[axis.id];
    const zoom = zoomData?.find(({ axisId }) => axisId === axis.id);
    const zoomRange: [number, number] = zoom ? [zoom.start, zoom.end] : [0, 100];
    const range = getRange(drawingArea, axisDirection, axis.reverse);

    const { minData, maxData, data, minFiltered, maxFiltered } = applyZoomFilter({
      axis,
      getters: extremumGetters,
      isDefaultAxis,
      formattedSeries,
      zoomRange,
      zoomOption,
    });

    if (isBandScaleConfig(axis)) {
      const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
      const barGapRatio = axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO;
      // Reverse range because ordinal scales are presented from top to bottom on y-axis
      const scaleRange = axisDirection === 'x' ? range : [range[1], range[0]];
      const zoomedRange = zoomScaleRange(scaleRange, zoomRange);

      completeAxis[axis.id] = {
        categoryGapRatio,
        barGapRatio,
        ...axis,
        data,
        scale: scaleBand(data, zoomedRange)
          .paddingInner(categoryGapRatio)
          .paddingOuter(categoryGapRatio / 2),
        filteredExtremums: { min: minFiltered, max: maxFiltered },
        tickNumber: data.length,
        colorScale:
          axis.colorMap &&
          (axis.colorMap.type === 'ordinal'
            ? getOrdinalColorScale({ values: data, ...axis.colorMap })
            : getColorScale(axis.colorMap)),
      };

      if (isDateData(data)) {
        const dateFormatter = createDateFormatter({ ...axis, data }, scaleRange);
        completeAxis[axis.id].valueFormatter = axis.valueFormatter ?? dateFormatter;
      }
    }
    if (isPointScaleConfig(axis)) {
      const scaleRange = axisDirection === 'x' ? range : [...range].reverse();
      const zoomedRange = zoomScaleRange(scaleRange, zoomRange);

      completeAxis[axis.id] = {
        ...axis,
        data,
        scale: scalePoint(data, zoomedRange),
        filteredExtremums: { min: minFiltered, max: maxFiltered },
        tickNumber: data.length,
        colorScale:
          axis.colorMap &&
          (axis.colorMap.type === 'ordinal'
            ? getOrdinalColorScale({ values: data, ...axis.colorMap })
            : getColorScale(axis.colorMap)),
      };

      if (isDateData(data)) {
        const dateFormatter = createDateFormatter({ ...axis, data }, scaleRange);
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

    const zoomedRange = zoomScaleRange(range, zoomRange);

    // TODO: move nice to prop? Disable when there is zoom?
    const scale = getScale(scaleType, extremums, zoomedRange).nice(rawTickNumber);
    const [minDomain, maxDomain] = scale.domain();
    const domain = [axis.min ?? minDomain, axis.max ?? maxDomain];
    scale.domain(domain);

    completeAxis[axis.id] = {
      ...axis,
      data,
      scaleType: scaleType as any,
      scale: scale as any,
      filteredExtremums: { min: minFiltered, max: maxFiltered },
      tickNumber,
      colorScale: axis.colorMap && getColorScale(axis.colorMap),
    };
  });

  return {
    axis: completeAxis,
    axisIds: allAxis.map(({ id }) => id),
  };
}
