import { NumberValue } from '@mui/x-charts-vendor/d3-scale';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';
import {
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
} from '../../corePlugins/useChartSeries';
import { createSelector } from '../../utils/selectors';
import { computeAxisValue } from './computeAxisValue';
import { ExtremumFilter, UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { ChartState } from '../../models/chart';
import {
  createContinuousScaleGetAxisFilter,
  createDiscreteScaleGetAxisFilter,
  createGetAxisFilters,
} from './createAxisFilterMapper';
import { ZoomData } from './zoom.types';
import { createZoomLookup } from './createZoomLookup';
import {
  AxisId,
  ChartsAxisProps,
  ContinuousScaleName,
  D3Scale,
  DefaultedAxis,
  isBandScaleConfig,
  isPointScaleConfig,
  ScaleName,
} from '../../../../models/axis';
import {
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';
import { selectorPreferStrictDomainInLineCharts } from '../../corePlugins/useChartExperimentalFeature';
import { getDefaultTickNumber } from '../../../ticks';
import { getNormalizedAxisScale, getRange } from './getAxisScale';
import { isOrdinalScale } from '../../../scaleGuards';
import { zoomScaleRange } from './zoom';
import { getAxisExtrema } from './getAxisExtrema';
import { ChartSeriesConfig } from '../../models';
import { CartesianChartSeriesType } from '../../../../models/seriesType/config';
import { calculateFinalDomain, calculateInitialDomainAndTickNumber } from './domain';
import { SeriesId } from '../../../../models/seriesType/common';
import { Flatbush } from '../../../Flatbush';

export const createZoomMap = (zoom: readonly ZoomData[]) => {
  const zoomItemMap = new Map<AxisId, ZoomData>();
  zoom.forEach((zoomItem) => {
    zoomItemMap.set(zoomItem.axisId, zoomItem);
  });
  return zoomItemMap;
};

const selectorChartZoomState = (state: ChartState<[], [UseChartCartesianAxisSignature]>) =>
  state.zoom;

/**
 * Following selectors are not exported because they exist in the MIT chart only to ba able to reuse the Zoom state from the pro.
 */

export const selectorChartZoomIsInteracting = createSelector(
  [selectorChartZoomState],
  (zoom) => zoom?.isInteracting,
);

export const selectorChartZoomMap = createSelector(
  [selectorChartZoomState],
  (zoom) => zoom?.zoomData && createZoomMap(zoom?.zoomData),
);

export const selectorChartAxisZoomData = createSelector(
  [selectorChartZoomMap, (_, axisId: AxisId) => axisId],
  (zoomMap, axisId) => zoomMap?.get(axisId),
);

export const selectorChartZoomOptionsLookup = createSelector(
  [selectorChartRawXAxis, selectorChartRawYAxis],
  (xAxis, yAxis) => ({
    ...createZoomLookup('x')(xAxis),
    ...createZoomLookup('y')(yAxis),
  }),
);

export const selectorChartAxisZoomOptionsLookup = createSelector(
  [selectorChartZoomOptionsLookup, (_, axisId: AxisId) => axisId],
  (axisLookup, axisId) => axisLookup[axisId],
);

export const selectorDefaultXAxisTickNumber = createSelector(
  [selectorChartDrawingArea],
  function selectorDefaultXAxisTickNumber(drawingArea) {
    return getDefaultTickNumber(drawingArea.width);
  },
);

export const selectorDefaultYAxisTickNumber = createSelector(
  [selectorChartDrawingArea],
  function selectorDefaultYAxisTickNumber(drawingArea) {
    return getDefaultTickNumber(drawingArea.height);
  },
);

type DomainDefinition = {
  domain: ReadonlyArray<string | NumberValue>;
  tickNumber?: number;
};

export const selectorChartXDomains = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorPreferStrictDomainInLineCharts,
    selectorDefaultXAxisTickNumber,
  ],
  function selectorChartXDomains(
    axes,
    formattedSeries,
    seriesConfig,
    preferStrictDomainInLineCharts,
    defaultTickNumber,
  ) {
    const axisDirection = 'x';
    const domains: Record<AxisId, DomainDefinition> = {};

    axes?.forEach((eachAxis, axisIndex) => {
      const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;

      if (isBandScaleConfig(axis) || isPointScaleConfig(axis)) {
        domains[axis.id] = { domain: axis.data! };
        return;
      }

      const axisExtrema = getAxisExtrema(
        axis,
        axisDirection,
        seriesConfig as ChartSeriesConfig<CartesianChartSeriesType>,
        axisIndex,
        formattedSeries,
      );

      domains[axis.id] = calculateInitialDomainAndTickNumber(
        axis as Readonly<DefaultedAxis<ContinuousScaleName, any, Readonly<ChartsAxisProps>>>,
        'x',
        axisIndex,
        formattedSeries,
        axisExtrema,
        defaultTickNumber,
        preferStrictDomainInLineCharts,
      );
    });

    return domains;
  },
);

export const selectorChartYDomains = createSelector(
  [
    selectorChartRawYAxis,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorPreferStrictDomainInLineCharts,
    selectorDefaultYAxisTickNumber,
  ],
  function selectorChartYDomains(
    axes,
    formattedSeries,
    seriesConfig,
    preferStrictDomainInLineCharts,
    defaultTickNumber,
  ) {
    const axisDirection = 'y';
    const domains: Record<AxisId, DomainDefinition> = {};

    axes?.forEach((eachAxis, axisIndex) => {
      const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;

      if (isBandScaleConfig(axis) || isPointScaleConfig(axis)) {
        domains[axis.id] = { domain: axis.data! };
        return;
      }

      const axisExtrema = getAxisExtrema(
        axis,
        axisDirection,
        seriesConfig as ChartSeriesConfig<CartesianChartSeriesType>,
        axisIndex,
        formattedSeries,
      );

      domains[axis.id] = calculateInitialDomainAndTickNumber(
        axis as Readonly<DefaultedAxis<ContinuousScaleName, any, Readonly<ChartsAxisProps>>>,
        'y',
        axisIndex,
        formattedSeries,
        axisExtrema,
        defaultTickNumber,
        preferStrictDomainInLineCharts,
      );
    });

    return domains;
  },
);

export const selectorChartZoomAxisFilters = createSelector(
  [
    selectorChartZoomMap,
    selectorChartZoomOptionsLookup,
    selectorChartRawXAxis,
    selectorChartRawYAxis,
    selectorChartXDomains,
    selectorChartYDomains,
  ],
  (zoomMap, zoomOptions, xAxis, yAxis, xDomains, yDomains) => {
    if (!zoomMap || !zoomOptions) {
      return undefined;
    }

    let hasFilter = false;
    const filters: Record<AxisId, ExtremumFilter> = {};
    const axes = [...(xAxis ?? []), ...(yAxis ?? [])];

    for (let i = 0; i < axes.length; i += 1) {
      const axis = axes[i];

      if (!zoomOptions[axis.id] || zoomOptions[axis.id].filterMode !== 'discard') {
        continue;
      }

      const zoom = zoomMap.get(axis.id);
      if (zoom === undefined || (zoom.start <= 0 && zoom.end >= 100)) {
        // No zoom, or zoom with all data visible
        continue;
      }

      const axisDirection = i < (xAxis?.length ?? 0) ? 'x' : 'y';

      if (axis.scaleType === 'band' || axis.scaleType === 'point') {
        filters[axis.id] = createDiscreteScaleGetAxisFilter(
          axis.data,
          zoom.start,
          zoom.end,
          axisDirection,
        );
      } else {
        const { domain } = axisDirection === 'x' ? xDomains[axis.id] : yDomains[axis.id];
        filters[axis.id] = createContinuousScaleGetAxisFilter(
          // For continuous scales, the domain is always a two-value array.
          domain as readonly [NumberValue, NumberValue],
          zoom.start,
          zoom.end,
          axisDirection,
          axis.data,
        );
      }

      hasFilter = true;
    }

    if (!hasFilter) {
      return undefined;
    }

    return createGetAxisFilters(filters);
  },
);

export const selectorChartFilteredXDomains = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomMap,
    selectorChartZoomOptionsLookup,
    selectorChartZoomAxisFilters,
    selectorPreferStrictDomainInLineCharts,
    selectorChartXDomains,
  ],
  (
    axes,
    formattedSeries,
    seriesConfig,
    zoomMap,
    zoomOptions,
    getFilters,
    preferStrictDomainInLineCharts,
    domains,
  ) => {
    const filteredDomains: Record<AxisId, ReadonlyArray<string | NumberValue>> = {};

    axes?.forEach((axis, axisIndex) => {
      const domain = domains[axis.id].domain;

      if (isBandScaleConfig(axis) || isPointScaleConfig(axis)) {
        filteredDomains[axis.id] = domain;
        return;
      }

      const zoom = zoomMap?.get(axis.id);
      const zoomOption = zoomOptions?.[axis.id];
      const filter = zoom === undefined && !zoomOption ? getFilters : undefined; // Do not apply filtering if zoom is already defined.

      if (!filter) {
        filteredDomains[axis.id] = domain;
        return;
      }

      const rawTickNumber = domains[axis.id].tickNumber!;
      const axisExtrema = getAxisExtrema(
        axis,
        'x',
        seriesConfig as ChartSeriesConfig<CartesianChartSeriesType>,
        axisIndex,
        formattedSeries,
        filter,
      );

      filteredDomains[axis.id] = calculateFinalDomain(
        axis as Readonly<DefaultedAxis<ContinuousScaleName, any, Readonly<ChartsAxisProps>>>,
        'x',
        axisIndex,
        formattedSeries,
        axisExtrema,
        rawTickNumber,
        preferStrictDomainInLineCharts,
      );
    });

    return filteredDomains;
  },
  {
    memoizeOptions: {
      resultEqualityCheck: (a: any, b: any) => isDeepEqual(a, b),
    },
  },
);

export const selectorChartFilteredYDomains = createSelector(
  [
    selectorChartRawYAxis,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomMap,
    selectorChartZoomOptionsLookup,
    selectorChartZoomAxisFilters,
    selectorPreferStrictDomainInLineCharts,
    selectorChartYDomains,
  ],
  (
    axes,
    formattedSeries,
    seriesConfig,
    zoomMap,
    zoomOptions,
    getFilters,
    preferStrictDomainInLineCharts,
    domains,
  ) => {
    const filteredDomains: Record<AxisId, ReadonlyArray<string | NumberValue>> = {};

    axes?.forEach((axis, axisIndex) => {
      const domain = domains[axis.id].domain;

      if (isBandScaleConfig(axis) || isPointScaleConfig(axis)) {
        filteredDomains[axis.id] = domain;
        return;
      }

      const zoom = zoomMap?.get(axis.id);
      const zoomOption = zoomOptions?.[axis.id];
      const filter = zoom === undefined && !zoomOption ? getFilters : undefined; // Do not apply filtering if zoom is already defined.

      if (!filter) {
        filteredDomains[axis.id] = domain;
        return;
      }

      const rawTickNumber = domains[axis.id].tickNumber!;
      const axisExtrema = getAxisExtrema(
        axis,
        'y',
        seriesConfig as ChartSeriesConfig<CartesianChartSeriesType>,
        axisIndex,
        formattedSeries,
        filter,
      );

      filteredDomains[axis.id] = calculateFinalDomain(
        axis as Readonly<DefaultedAxis<ContinuousScaleName, any, Readonly<ChartsAxisProps>>>,
        'y',
        axisIndex,
        formattedSeries,
        axisExtrema,
        rawTickNumber,
        preferStrictDomainInLineCharts,
      );
    });

    return filteredDomains;
  },
  {
    memoizeOptions: {
      resultEqualityCheck: (a: any, b: any) => isDeepEqual(a, b),
    },
  },
);

export const selectorChartNormalizedXScales = createSelector(
  [selectorChartRawXAxis, selectorChartFilteredXDomains],
  function selectorChartNormalizedXScales(axes, filteredDomains) {
    const scales: Record<AxisId, D3Scale> = {};

    axes?.forEach((eachAxis) => {
      const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;
      const domain = filteredDomains[axis.id]!;

      scales[axis.id] = getNormalizedAxisScale(axis, domain);
    });

    return scales;
  },
);

export const selectorChartNormalizedYScales = createSelector(
  [selectorChartRawYAxis, selectorChartFilteredYDomains],
  function selectorChartNormalizedYScales(axes, filteredDomains) {
    const scales: Record<AxisId, D3Scale> = {};

    axes?.forEach((eachAxis) => {
      const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;
      const domain = filteredDomains[axis.id]!;

      scales[axis.id] = getNormalizedAxisScale(axis, domain);
    });

    return scales;
  },
);

export const selectorChartXScales = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartNormalizedXScales,
    selectorChartDrawingArea,
    selectorChartZoomMap,
  ],
  function selectorChartXScales(axes, normalizedScales, drawingArea, zoomMap) {
    const scales: Record<AxisId, D3Scale> = {};

    axes?.forEach((eachAxis) => {
      const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;
      const zoom = zoomMap?.get(axis.id);

      const zoomRange: [number, number] = zoom ? [zoom.start, zoom.end] : [0, 100];
      const range = getRange(drawingArea, 'x', axis);

      const scale = normalizedScales[axis.id].copy();
      const zoomedRange = zoomScaleRange(range, zoomRange);

      scale.range(zoomedRange);

      scales[axis.id] = scale;
    });

    return scales;
  },
);

export const selectorChartYScales = createSelector(
  [
    selectorChartRawYAxis,
    selectorChartNormalizedYScales,
    selectorChartDrawingArea,
    selectorChartZoomMap,
  ],
  function selectorChartYScales(axes, normalizedScales, drawingArea, zoomMap) {
    const scales: Record<AxisId, D3Scale> = {};

    axes?.forEach((eachAxis) => {
      const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;
      const zoom = zoomMap?.get(axis.id);

      const zoomRange: [number, number] = zoom ? [zoom.start, zoom.end] : [0, 100];
      const range = getRange(drawingArea, 'y', axis);

      const scale = normalizedScales[axis.id].copy();

      const scaleRange = isOrdinalScale(scale) ? range.reverse() : range;
      const zoomedRange = zoomScaleRange(scaleRange, zoomRange);

      scale.range(zoomedRange);

      scales[axis.id] = scale;
    });

    return scales;
  },
);

/**
 * The only interesting selectors that merge axis data and zoom if provided.
 */

export const selectorChartXAxis = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomMap,
    selectorChartXDomains,
    selectorChartXScales,
  ],
  (axis, drawingArea, formattedSeries, seriesConfig, zoomMap, domains, scales) =>
    computeAxisValue({
      scales,
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'x',
      zoomMap,
      domains,
    }),
);

export const selectorChartYAxis = createSelector(
  [
    selectorChartRawYAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomMap,
    selectorChartYDomains,
    selectorChartYScales,
  ],
  (axis, drawingArea, formattedSeries, seriesConfig, zoomMap, domains, scales) =>
    computeAxisValue({
      scales,
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'y',
      zoomMap,
      domains,
    }),
);

export const selectorChartAxis = createSelector(
  [selectorChartXAxis, selectorChartYAxis, (_, axisId: AxisId) => axisId],
  (xAxes, yAxes, axisId) => xAxes?.axis[axisId] ?? yAxes?.axis[axisId],
);

export const selectorChartRawAxis = createSelector(
  [selectorChartRawXAxis, selectorChartRawYAxis, (state, axisId: AxisId) => axisId],
  (xAxes, yAxes, axisId) => {
    const axis = xAxes?.find((a) => a.id === axisId) ?? yAxes?.find((a) => a.id === axisId) ?? null;

    if (!axis) {
      return undefined;
    }

    return axis;
  },
);

export const selectorChartDefaultXAxisId = createSelector(
  [selectorChartRawXAxis],
  (xAxes) => xAxes![0].id,
);

export const selectorChartDefaultYAxisId = createSelector(
  [selectorChartRawYAxis],
  (yAxes) => yAxes![0].id,
);

const EMPTY_MAP = new Map<SeriesId, Flatbush>();
export const selectorChartSeriesEmptyFlatbushMap = () => EMPTY_MAP;

export const selectorChartSeriesFlatbushMap = createSelector(
  [
    selectorChartSeriesProcessed,
    selectorChartNormalizedXScales,
    selectorChartNormalizedYScales,
    selectorChartDefaultXAxisId,
    selectorChartDefaultYAxisId,
  ],
  function selectChartSeriesFlatbushMap(
    allSeries,
    xAxesScaleMap,
    yAxesScaleMap,
    defaultXAxisId,
    defaultYAxisId,
  ) {
    // FIXME: Do we want to support non-scatter series here?
    const validSeries = allSeries.scatter;
    const flatbushMap = new Map<SeriesId, Flatbush>();

    if (!validSeries) {
      return flatbushMap;
    }

    validSeries.seriesOrder.forEach((seriesId) => {
      const {
        data,
        xAxisId = defaultXAxisId,
        yAxisId = defaultYAxisId,
      } = validSeries.series[seriesId];

      const flatbush = new Flatbush(data.length);

      const originalXScale = xAxesScaleMap[xAxisId];
      const originalYScale = yAxesScaleMap[yAxisId];

      for (const datum of data) {
        // Add the points using a [0, 1] range so that we don't need to recreate the Flatbush structure when zooming.
        // This doesn't happen in practice, though, because currently the scales depend on the drawing area.
        flatbush.add(originalXScale(datum.x)!, originalYScale(datum.y)!);
      }

      flatbush.finish();
      flatbushMap.set(seriesId, flatbush);
    });

    return flatbushMap;
  },
);
