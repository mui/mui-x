import * as React from 'react';
import PropTypes from 'prop-types';
import { BarPlot } from '../BarChart';
import { LinePlot, AreaPlot, LineHighlightPlot } from '../LineChart';
import {
  ResponsiveChartContainer,
  ResponsiveChartContainerProps,
} from '../ResponsiveChartContainer';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import {
  ChartsTooltip,
  ChartsTooltipProps,
  ChartsTooltipSlotProps,
  ChartsTooltipSlots,
} from '../ChartsTooltip';
import { ChartsAxisHighlight, ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { AxisConfig, ChartsXAxisProps, ChartsYAxisProps, ScaleName } from '../models/axis';
import { MakeOptional } from '../models/helpers';
import { LineSeriesType } from '../models/seriesType/line';
import { CardinalDirections } from '../models/layout';
import { AreaPlotSlots, AreaPlotSlotProps } from '../LineChart/AreaPlot';
import { LinePlotSlots, LinePlotSlotProps } from '../LineChart/LinePlot';
import { MarkPlotSlots, MarkPlotSlotProps } from '../LineChart/MarkPlot';
import { LineHighlightPlotSlots, LineHighlightPlotSlotProps } from '../LineChart/LineHighlightPlot';
import { BarPlotSlots, BarPlotSlotProps } from '../BarChart/BarPlot';

export interface SparkLineChartSlots
  extends AreaPlotSlots,
    LinePlotSlots,
    MarkPlotSlots,
    LineHighlightPlotSlots,
    Omit<BarPlotSlots, 'barLabel'>,
    ChartsTooltipSlots<'line' | 'bar'> {}
export interface SparkLineChartSlotProps
  extends AreaPlotSlotProps,
    LinePlotSlotProps,
    MarkPlotSlotProps,
    LineHighlightPlotSlotProps,
    BarPlotSlotProps,
    ChartsTooltipSlotProps<'line' | 'bar'> {}

export interface SparkLineChartProps
  extends Omit<
    ResponsiveChartContainerProps,
    'series' | 'xAxis' | 'yAxis' | 'zAxis' | 'margin' | 'plugins'
  > {
  /**
   * The xAxis configuration.
   * Notice it is a single [[AxisConfig]] object, not an array of configuration.
   */
  xAxis?: MakeOptional<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id'>;
  /**
   * The yAxis configuration.
   * Notice it is a single [[AxisConfig]] object, not an array of configuration.
   */
  yAxis?: MakeOptional<AxisConfig<ScaleName, any, ChartsYAxisProps>, 'id'>;
  tooltip?: ChartsTooltipProps<'line' | 'bar'>;
  axisHighlight?: ChartsAxisHighlightProps;
  /**
   * Type of plot used.
   * @default 'line'
   */
  plotType?: 'line' | 'bar';
  /**
   * Data to plot.
   */
  data: number[];
  /**
   * Formatter used by the tooltip.
   * @param {number} value The value to format.
   * @returns {string} the formatted value.
   * @default (value: number | null) => (value === null ? '' : value.toString())
   */
  valueFormatter?: (value: number | null) => string;
  /**
   * Set to `true` to enable the tooltip in the sparkline.
   * @default false
   */
  showTooltip?: boolean;
  /**
   * Set to `true` to highlight the value.
   * With line, it shows a point.
   * With bar, it shows a highlight band.
   * @default false
   */
  showHighlight?: boolean;
  /**
   * Set to `true` to fill spark line area.
   * Has no effect if plotType='bar'.
   * @default false
   */
  area?: LineSeriesType['area'];
  /**
   * @default 'linear'
   */
  curve?: LineSeriesType['curve'];
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default {
   *   top: 5,
   *   bottom: 5,
   *   left: 5,
   *   right: 5,
   * }
   */
  margin?: Partial<CardinalDirections<number>>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: SparkLineChartSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: SparkLineChartSlotProps;
}

const SPARKLINE_DEFAULT_MARGIN = {
  top: 5,
  bottom: 5,
  left: 5,
  right: 5,
};

/**
 * Demos:
 *
 * - [SparkLine](https://mui.com/x/react-charts/sparkline/)
 *
 * API:
 *
 * - [SparkLineChart API](https://mui.com/x/api/charts/spark-line-chart/)
 */
const SparkLineChart = React.forwardRef(function SparkLineChart(props: SparkLineChartProps, ref) {
  const {
    xAxis,
    yAxis,
    width,
    height,
    margin = SPARKLINE_DEFAULT_MARGIN,
    colors,
    sx,
    showTooltip,
    tooltip,
    showHighlight,
    axisHighlight: inAxisHighlight,
    children,
    slots,
    slotProps,
    data,
    plotType = 'line',
    valueFormatter = (value: number | null) => (value === null ? '' : value.toString()),
    area,
    curve = 'linear',
    className,
    ...other
  } = props;

  const defaultXHighlight: { x: 'band' | 'none' } =
    showHighlight && plotType === 'bar' ? { x: 'band' } : { x: 'none' };
  const axisHighlight = {
    ...defaultXHighlight,
    ...inAxisHighlight,
  };

  return (
    <ResponsiveChartContainer
      {...other}
      ref={ref}
      series={[
        {
          type: plotType,
          data,
          valueFormatter,
          ...(plotType === 'bar' ? {} : { area, curve, disableHighlight: !showHighlight }),
        },
      ]}
      width={width}
      height={height}
      margin={margin}
      className={className}
      xAxis={[
        {
          id: DEFAULT_X_AXIS_KEY,
          scaleType: plotType === 'bar' ? 'band' : 'point',
          data: Array.from({ length: data.length }, (_, index) => index),
          hideTooltip: xAxis === undefined,
          ...xAxis,
        },
      ]}
      yAxis={[
        {
          id: DEFAULT_X_AXIS_KEY,
          ...yAxis,
        },
      ]}
      colors={colors}
      sx={sx}
      disableAxisListener={
        (!showTooltip || tooltip?.trigger !== 'axis') &&
        axisHighlight?.x === 'none' &&
        axisHighlight?.y === 'none'
      }
    >
      {plotType === 'bar' && (
        <BarPlot
          skipAnimation
          slots={slots}
          slotProps={slotProps}
          sx={{ shapeRendering: 'auto' }}
        />
      )}

      {plotType === 'line' && (
        <React.Fragment>
          <AreaPlot skipAnimation slots={slots} slotProps={slotProps} />
          <LinePlot skipAnimation slots={slots} slotProps={slotProps} />
          <LineHighlightPlot slots={slots} slotProps={slotProps} />
        </React.Fragment>
      )}

      <ChartsAxisHighlight {...axisHighlight} />
      {showTooltip && <ChartsTooltip {...tooltip} slotProps={slotProps} slots={slots} />}

      {children}
    </ResponsiveChartContainer>
  );
});

SparkLineChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Set to `true` to fill spark line area.
   * Has no effect if plotType='bar'.
   * @default false
   */
  area: PropTypes.bool,
  axisHighlight: PropTypes.shape({
    x: PropTypes.oneOf(['band', 'line', 'none']),
    y: PropTypes.oneOf(['band', 'line', 'none']),
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   * @default blueberryTwilightPalette
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  /**
   * @default 'linear'
   */
  curve: PropTypes.oneOf([
    'catmullRom',
    'linear',
    'monotoneX',
    'monotoneY',
    'natural',
    'step',
    'stepAfter',
    'stepBefore',
  ]),
  /**
   * Data to plot.
   */
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset: PropTypes.arrayOf(PropTypes.object),
  desc: PropTypes.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * The item currently highlighted. Turns highlighting into a controlled prop.
   */
  highlightedItem: PropTypes.shape({
    dataIndex: PropTypes.number,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default {
   *   top: 5,
   *   bottom: 5,
   *   left: 5,
   *   right: 5,
   * }
   */
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
  /**
   * Type of plot used.
   * @default 'line'
   */
  plotType: PropTypes.oneOf(['bar', 'line']),
  /**
   * Set to `true` to highlight the value.
   * With line, it shows a point.
   * With bar, it shows a highlight band.
   * @default false
   */
  showHighlight: PropTypes.bool,
  /**
   * Set to `true` to enable the tooltip in the sparkline.
   * @default false
   */
  showTooltip: PropTypes.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  title: PropTypes.string,
  tooltip: PropTypes.shape({
    axisContent: PropTypes.elementType,
    classes: PropTypes.object,
    itemContent: PropTypes.elementType,
    slotProps: PropTypes.object,
    slots: PropTypes.object,
    trigger: PropTypes.oneOf(['axis', 'item', 'none']),
  }),
  /**
   * Formatter used by the tooltip.
   * @param {number} value The value to format.
   * @returns {string} the formatted value.
   * @default (value: number | null) => (value === null ? '' : value.toString())
   */
  valueFormatter: PropTypes.func,
  viewBox: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
  /**
   * The xAxis configuration.
   * Notice it is a single [[AxisConfig]] object, not an array of configuration.
   */
  xAxis: PropTypes.shape({
    classes: PropTypes.object,
    colorMap: PropTypes.oneOfType([
      PropTypes.shape({
        colors: PropTypes.arrayOf(PropTypes.string).isRequired,
        type: PropTypes.oneOf(['ordinal']).isRequired,
        unknownColor: PropTypes.string,
        values: PropTypes.arrayOf(
          PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
            .isRequired,
        ),
      }),
      PropTypes.shape({
        color: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string.isRequired), PropTypes.func])
          .isRequired,
        max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
        min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
        type: PropTypes.oneOf(['continuous']).isRequired,
      }),
      PropTypes.shape({
        colors: PropTypes.arrayOf(PropTypes.string).isRequired,
        thresholds: PropTypes.arrayOf(
          PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
        ).isRequired,
        type: PropTypes.oneOf(['piecewise']).isRequired,
      }),
    ]),
    data: PropTypes.array,
    dataKey: PropTypes.string,
    disableLine: PropTypes.bool,
    disableTicks: PropTypes.bool,
    fill: PropTypes.string,
    hideTooltip: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string,
    labelFontSize: PropTypes.number,
    labelStyle: PropTypes.object,
    max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    position: PropTypes.oneOf(['bottom', 'top']),
    reverse: PropTypes.bool,
    scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
    slotProps: PropTypes.object,
    slots: PropTypes.object,
    stroke: PropTypes.string,
    sx: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
      PropTypes.func,
      PropTypes.object,
    ]),
    tickFontSize: PropTypes.number,
    tickInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.array, PropTypes.func]),
    tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
    tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
    tickLabelStyle: PropTypes.object,
    tickMaxStep: PropTypes.number,
    tickMinStep: PropTypes.number,
    tickNumber: PropTypes.number,
    tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
    tickSize: PropTypes.number,
    valueFormatter: PropTypes.func,
  }),
  /**
   * The yAxis configuration.
   * Notice it is a single [[AxisConfig]] object, not an array of configuration.
   */
  yAxis: PropTypes.shape({
    classes: PropTypes.object,
    colorMap: PropTypes.oneOfType([
      PropTypes.shape({
        colors: PropTypes.arrayOf(PropTypes.string).isRequired,
        type: PropTypes.oneOf(['ordinal']).isRequired,
        unknownColor: PropTypes.string,
        values: PropTypes.arrayOf(
          PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
            .isRequired,
        ),
      }),
      PropTypes.shape({
        color: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string.isRequired), PropTypes.func])
          .isRequired,
        max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
        min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
        type: PropTypes.oneOf(['continuous']).isRequired,
      }),
      PropTypes.shape({
        colors: PropTypes.arrayOf(PropTypes.string).isRequired,
        thresholds: PropTypes.arrayOf(
          PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
        ).isRequired,
        type: PropTypes.oneOf(['piecewise']).isRequired,
      }),
    ]),
    data: PropTypes.array,
    dataKey: PropTypes.string,
    disableLine: PropTypes.bool,
    disableTicks: PropTypes.bool,
    fill: PropTypes.string,
    hideTooltip: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string,
    labelFontSize: PropTypes.number,
    labelStyle: PropTypes.object,
    max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    position: PropTypes.oneOf(['left', 'right']),
    reverse: PropTypes.bool,
    scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
    slotProps: PropTypes.object,
    slots: PropTypes.object,
    stroke: PropTypes.string,
    sx: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
      PropTypes.func,
      PropTypes.object,
    ]),
    tickFontSize: PropTypes.number,
    tickInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.array, PropTypes.func]),
    tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
    tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
    tickLabelStyle: PropTypes.object,
    tickMaxStep: PropTypes.number,
    tickMinStep: PropTypes.number,
    tickNumber: PropTypes.number,
    tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
    tickSize: PropTypes.number,
    valueFormatter: PropTypes.func,
  }),
} as any;

export { SparkLineChart };
