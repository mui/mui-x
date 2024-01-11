import * as React from 'react';
import { scaleBand, scalePoint } from 'd3-scale';
import PropTypes from 'prop-types';
import {
  getExtremumX as getBarExtremumX,
  getExtremumY as getBarExtremumY,
} from '../BarChart/extremums';
import {
  getExtremumX as getScatterExtremumX,
  getExtremumY as getScatterExtremumY,
} from '../ScatterChart/extremums';
import {
  getExtremumX as getLineExtremumX,
  getExtremumY as getLineExtremumY,
} from '../LineChart/extremums';
import { AxisConfig, AxisDefaultized, isBandScaleConfig, isPointScaleConfig } from '../models/axis';
import { getScale } from '../internals/getScale';
import { DrawingContext } from './DrawingProvider';
import { SeriesContext } from './SeriesContextProvider';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import {
  CartesianChartSeriesType,
  ChartSeries,
  DatasetType,
  ExtremumGetter,
  ExtremumGetterResult,
} from '../models/seriesType/config';
import { MakeOptional } from '../models/helpers';
import { getTickNumber } from '../hooks/useTicks';

export type CartesianContextProviderProps = {
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used with id set to `DEFAULT_X_AXIS_KEY`.
   */
  xAxis?: MakeOptional<AxisConfig, 'id'>[];
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used with id set to `DEFAULT_Y_AXIS_KEY`.
   */
  yAxis?: MakeOptional<AxisConfig, 'id'>[];
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: DatasetType;
  children: React.ReactNode;
};

const DEFAULT_CATEGORY_GAP_RATIO = 0.2;
const DEFAULT_BAR_GAP_RATIO = 0.1;

// TODO: those might be better placed in a distinct file
const xExtremumGetters: { [T in CartesianChartSeriesType]: ExtremumGetter<T> } = {
  bar: getBarExtremumX,
  scatter: getScatterExtremumX,
  line: getLineExtremumX,
};

const yExtremumGetters: { [T in CartesianChartSeriesType]: ExtremumGetter<T> } = {
  bar: getBarExtremumY,
  scatter: getScatterExtremumY,
  line: getLineExtremumY,
};

type DefaultizedAxisConfig = {
  [axisKey: string]: AxisDefaultized;
};

export const CartesianContext = React.createContext<{
  /**
   * Mapping from x-axis key to scaling configuration.
   */
  xAxis: {
    DEFAULT_X_AXIS_KEY: AxisDefaultized;
  } & DefaultizedAxisConfig;
  /**
   * Mapping from y-axis key to scaling configuration.
   */
  yAxis: {
    DEFAULT_X_AXIS_KEY: AxisDefaultized;
  } & DefaultizedAxisConfig;
  /**
   * The x-axes IDs sorted by order they got provided.
   */
  xAxisIds: string[];
  /**
   * The y-axes IDs sorted by order they got provided.
   */
  yAxisIds: string[];
  // @ts-ignore
}>({ xAxis: {}, yAxis: {}, xAxisIds: [], yAxisIds: [] });

/**
 * API:
 *
 * - [CartesianContextProvider API](https://mui.com/x/api/charts/cartesian-context-provider/)
 */
function CartesianContextProvider(props: CartesianContextProviderProps) {
  const { xAxis: inXAxis, yAxis: inYAxis, dataset, children } = props;
  const formattedSeries = React.useContext(SeriesContext);
  const drawingArea = React.useContext(DrawingContext);

  const xAxis = React.useMemo(
    () =>
      inXAxis?.map((axisConfig) => {
        const dataKey = axisConfig.dataKey;
        if (dataKey === undefined || axisConfig.data !== undefined) {
          return axisConfig;
        }
        if (dataset === undefined) {
          throw Error('MUI X Charts: x-axis uses `dataKey` but no `dataset` is provided.');
        }
        return {
          ...axisConfig,
          data: dataset.map((d) => d[dataKey]),
        };
      }),
    [inXAxis, dataset],
  );

  const yAxis = React.useMemo(
    () =>
      inYAxis?.map((axisConfig) => {
        const dataKey = axisConfig.dataKey;
        if (dataKey === undefined || axisConfig.data !== undefined) {
          return axisConfig;
        }
        if (dataset === undefined) {
          throw Error('MUI X Charts: y-axis uses `dataKey` but no `dataset` is provided.');
        }
        return {
          ...axisConfig,
          data: dataset.map((d) => d[dataKey]),
        };
      }),
    [inYAxis, dataset],
  );

  const value = React.useMemo(() => {
    const axisExtremumCallback = <T extends keyof typeof xExtremumGetters>(
      acc: ExtremumGetterResult,
      chartType: T,
      axis: AxisConfig,
      getters: { [T2 in CartesianChartSeriesType]: ExtremumGetter<T2> },
      isDefaultAxis: boolean,
    ): ExtremumGetterResult => {
      const getter = getters[chartType];
      const series = (formattedSeries[chartType]?.series as { [id: string]: ChartSeries<T> }) ?? {};

      const [minChartTypeData, maxChartTypeData] = getter({
        series,
        axis,
        isDefaultAxis,
      });

      const [minData, maxData] = acc;

      if (minData === null || maxData === null) {
        return [minChartTypeData!, maxChartTypeData!];
      }

      if (minChartTypeData === null || maxChartTypeData === null) {
        return [minData, maxData];
      }

      return [Math.min(minChartTypeData, minData), Math.max(maxChartTypeData, maxData)];
    };

    const getAxisExtremum = (
      axis: AxisConfig,
      getters: { [T in CartesianChartSeriesType]: ExtremumGetter<T> },
      isDefaultAxis: boolean,
    ) => {
      const charTypes = Object.keys(getters) as CartesianChartSeriesType[];

      return charTypes.reduce(
        (acc, charType) => axisExtremumCallback(acc, charType, axis, getters, isDefaultAxis),
        [null, null] as ExtremumGetterResult,
      );
    };

    const allXAxis: AxisConfig[] = [
      ...(xAxis?.map((axis, index) => ({ id: `deaultized-x-axis-${index}`, ...axis })) ?? []),
      // Allows to specify an axis with id=DEFAULT_X_AXIS_KEY
      ...(xAxis === undefined || xAxis.findIndex(({ id }) => id === DEFAULT_X_AXIS_KEY) === -1
        ? [{ id: DEFAULT_X_AXIS_KEY, scaleType: 'linear' } as AxisConfig]
        : []),
    ];

    const completedXAxis: DefaultizedAxisConfig = {};
    allXAxis.forEach((axis, axisIndex) => {
      const isDefaultAxis = axisIndex === 0;
      const [minData, maxData] = getAxisExtremum(axis, xExtremumGetters, isDefaultAxis);

      const range = [drawingArea.left, drawingArea.left + drawingArea.width];

      if (isBandScaleConfig(axis)) {
        const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
        const barGapRatio = axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO;
        completedXAxis[axis.id] = {
          categoryGapRatio,
          barGapRatio,
          ...axis,
          scale: scaleBand(axis.data!, range)
            .paddingInner(categoryGapRatio)
            .paddingOuter(categoryGapRatio / 2),
          tickNumber: axis.data!.length,
        };
      }
      if (isPointScaleConfig(axis)) {
        completedXAxis[axis.id] = {
          ...axis,
          scale: scalePoint(axis.data!, range),
          tickNumber: axis.data!.length,
        };
      }
      if (axis.scaleType === 'band' || axis.scaleType === 'point') {
        // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
        return;
      }

      const scaleType = axis.scaleType ?? 'linear';

      const extremums = [axis.min ?? minData, axis.max ?? maxData];
      const tickNumber = getTickNumber({ ...axis, range, domain: extremums });

      const niceScale = getScale(scaleType, extremums, range).nice(tickNumber);
      const niceDomain = niceScale.domain();
      const domain = [axis.min ?? niceDomain[0], axis.max ?? niceDomain[1]];

      completedXAxis[axis.id] = {
        ...axis,
        scaleType,
        scale: niceScale.domain(domain),
        tickNumber,
      } as AxisDefaultized<typeof scaleType>;
    });

    const allYAxis: AxisConfig[] = [
      ...(yAxis?.map((axis, index) => ({ id: `deaultized-y-axis-${index}`, ...axis })) ?? []),
      ...(yAxis === undefined || yAxis.findIndex(({ id }) => id === DEFAULT_Y_AXIS_KEY) === -1
        ? [{ id: DEFAULT_Y_AXIS_KEY, scaleType: 'linear' } as AxisConfig]
        : []),
    ];

    const completedYAxis: DefaultizedAxisConfig = {};
    allYAxis.forEach((axis, axisIndex) => {
      const isDefaultAxis = axisIndex === 0;
      const [minData, maxData] = getAxisExtremum(axis, yExtremumGetters, isDefaultAxis);
      const range = [drawingArea.top + drawingArea.height, drawingArea.top];

      if (isBandScaleConfig(axis)) {
        const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
        completedYAxis[axis.id] = {
          categoryGapRatio,
          barGapRatio: 0,
          ...axis,
          scale: scaleBand(axis.data!, [range[1], range[0]])
            .paddingInner(categoryGapRatio)
            .paddingOuter(categoryGapRatio / 2),
          tickNumber: axis.data!.length,
        };
      }
      if (isPointScaleConfig(axis)) {
        completedYAxis[axis.id] = {
          ...axis,
          scale: scalePoint(axis.data!, [range[1], range[0]]),
          tickNumber: axis.data!.length,
        };
      }
      if (axis.scaleType === 'band' || axis.scaleType === 'point') {
        // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
        return;
      }

      const scaleType = axis.scaleType ?? 'linear';

      const extremums = [axis.min ?? minData, axis.max ?? maxData];
      const tickNumber = getTickNumber({ ...axis, range, domain: extremums });

      const niceScale = getScale(scaleType, extremums, range).nice(tickNumber);
      const niceDomain = niceScale.domain();
      const domain = [axis.min ?? niceDomain[0], axis.max ?? niceDomain[1]];

      completedYAxis[axis.id] = {
        ...axis,
        scaleType,
        scale: niceScale.domain(domain),
        tickNumber,
      } as AxisDefaultized<typeof scaleType>;
    });

    return {
      xAxis: completedXAxis,
      yAxis: completedYAxis,
      xAxisIds: allXAxis.map(({ id }) => id),
      yAxisIds: allYAxis.map(({ id }) => id),
    };
  }, [
    drawingArea.height,
    drawingArea.left,
    drawingArea.top,
    drawingArea.width,
    formattedSeries,
    xAxis,
    yAxis,
  ]);

  // @ts-ignore
  return <CartesianContext.Provider value={value}>{children}</CartesianContext.Provider>;
}

CartesianContextProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset: PropTypes.arrayOf(PropTypes.object),
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used with id set to `DEFAULT_X_AXIS_KEY`.
   */
  xAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
  ),
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used with id set to `DEFAULT_Y_AXIS_KEY`.
   */
  yAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
  ),
} as any;

export { CartesianContextProvider };
