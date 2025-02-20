'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { MakeOptional } from '@mui/x-internals/types';
import { ChartsColor, ChartsColorPalette } from '../colorPalettes';
import { BarPlot } from '../BarChart';
import { LinePlot, AreaPlot, LineHighlightPlot } from '../LineChart';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { ChartsTooltip } from '../ChartsTooltip';
import { ChartsTooltipSlots, ChartsTooltipSlotProps } from '../ChartsTooltip/ChartTooltip.types';
import { ChartsAxisHighlight, ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { AxisConfig, ChartsXAxisProps, ChartsYAxisProps, ScaleName } from '../models/axis';
import { LineSeriesType, BarSeriesType } from '../models/seriesType';
import { AreaPlotSlots, AreaPlotSlotProps } from '../LineChart/AreaPlot';
import { LinePlotSlots, LinePlotSlotProps } from '../LineChart/LinePlot';
import { MarkPlotSlots, MarkPlotSlotProps } from '../LineChart/MarkPlot';
import { LineHighlightPlotSlots, LineHighlightPlotSlotProps } from '../LineChart/LineHighlightPlot';
import { BarPlotSlots, BarPlotSlotProps } from '../BarChart/BarPlot';
import { ChartMargin } from '../internals/plugins/corePlugins/useChartDimensions/useChartDimensions.types';

export interface SparkLineChartSlots
  extends AreaPlotSlots,
    LinePlotSlots,
    MarkPlotSlots,
    LineHighlightPlotSlots,
    Omit<BarPlotSlots, 'barLabel'>,
    ChartsTooltipSlots {}
export interface SparkLineChartSlotProps
  extends AreaPlotSlotProps,
    LinePlotSlotProps,
    MarkPlotSlotProps,
    LineHighlightPlotSlotProps,
    BarPlotSlotProps,
    ChartsTooltipSlotProps {}

export interface SparkLineChartProps
  extends Omit<
    ChartContainerProps,
    'series' | 'xAxis' | 'yAxis' | 'zAxis' | 'margin' | 'plugins' | 'colors'
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
   *
   * Accepts a `number` to be used on all sides or an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default 5
   */
  margin?: Partial<ChartMargin> | number;
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

  /**
   * Color used to colorize the sparkline.
   * @default rainbowSurgePalette[0]
   */
  color?: ChartsColor;
}

const SPARK_LINE_DEFAULT_MARGIN = 5;

/**
 * Demos:
 *
 * - [SparkLine](https://mui.com/x/react-charts/sparkline/)
 *
 * API:
 *
 * - [SparkLineChart API](https://mui.com/x/api/charts/spark-line-chart/)
 */
const SparkLineChart = React.forwardRef(function SparkLineChart(
  props: SparkLineChartProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const {
    xAxis,
    yAxis,
    width,
    height,
    margin = SPARK_LINE_DEFAULT_MARGIN,
    color,
    sx,
    showTooltip,
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

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;

  const colors: ChartsColorPalette | undefined = React.useMemo(() => {
    if (color == null) {
      return undefined;
    }

    return typeof color === 'function' ? (mode: 'light' | 'dark') => [color(mode)] : [color];
  }, [color]);

  return (
    <ChartContainer
      {...other}
      ref={ref}
      series={[
        {
          type: plotType,
          data,
          valueFormatter,
          ...(plotType === 'bar' ? {} : { area, curve, disableHighlight: !showHighlight }),
        } as LineSeriesType | BarSeriesType,
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
          position: 'none',
        },
      ]}
      yAxis={[
        {
          id: DEFAULT_Y_AXIS_KEY,
          ...yAxis,
          position: 'none',
        },
      ]}
      colors={colors}
      sx={sx}
      disableAxisListener={
        (!showTooltip || slotProps?.tooltip?.trigger !== 'axis') &&
        axisHighlight?.x === 'none' &&
        axisHighlight?.y === 'none'
      }
    >
      {plotType === 'bar' && <BarPlot skipAnimation slots={slots} slotProps={slotProps} />}

      {plotType === 'line' && (
        <React.Fragment>
          <AreaPlot skipAnimation slots={slots} slotProps={slotProps} />
          <LinePlot skipAnimation slots={slots} slotProps={slotProps} />
          <LineHighlightPlot slots={slots} slotProps={slotProps} />
        </React.Fragment>
      )}

      <ChartsAxisHighlight {...axisHighlight} />
      {showTooltip && <Tooltip {...props.slotProps?.tooltip} />}

      {children}
    </ChartContainer>
  );
});

SparkLineChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.object,
  }),
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
   * Color used to colorize the sparkline.
   * @default rainbowSurgePalette[0]
   */
  color: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * @default 'linear'
   */
  curve: PropTypes.oneOf([
    'bumpX',
    'bumpY',
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
   * If true, the voronoi interaction are ignored.
   */
  disableVoronoi: PropTypes.bool,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * The highlighted item.
   * Used when the highlight is controlled.
   */
  highlightedItem: PropTypes.shape({
    dataIndex: PropTypes.number,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }),
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: PropTypes.string,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default 5
   */
  margin: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      top: PropTypes.number,
    }),
  ]),
  /**
   * The function called for onClick events.
   * The second argument contains information about all line/bar elements at the current mouse position.
   * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
   * @param {null | AxisData} data The data about the clicked axis and items associated with it.
   */
  onAxisClick: PropTypes.func,
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
  /**
   * Callback fired when clicking close to an item.
   * This is only available for scatter plot for now.
   * @param {MouseEvent} event Mouse event caught at the svg level
   * @param {ScatterItemIdentifier} scatterItemIdentifier Identify which item got clicked
   */
  onItemClick: PropTypes.func,
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
   * If `true`, animations are skipped.
   * If unset or `false`, the animations respects the user's `prefers-reduced-motion` setting.
   */
  skipAnimation: PropTypes.bool,
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
  theme: PropTypes.oneOf(['dark', 'light']),
  title: PropTypes.string,
  /**
   * Formatter used by the tooltip.
   * @param {number} value The value to format.
   * @returns {string} the formatted value.
   * @default (value: number | null) => (value === null ? '' : value.toString())
   */
  valueFormatter: PropTypes.func,
  /**
   * Defines the maximal distance between a scatter point and the pointer that triggers the interaction.
   * If `undefined`, the radius is assumed to be infinite.
   */
  voronoiMaxRadius: PropTypes.number,
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
  /**
   * The xAxis configuration.
   * Notice it is a single [[AxisConfig]] object, not an array of configuration.
   */
  xAxis: PropTypes.shape({
    axis: PropTypes.oneOf(['x']),
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
    domainLimit: PropTypes.oneOfType([PropTypes.oneOf(['nice', 'strict']), PropTypes.func]),
    fill: PropTypes.string,
    height: PropTypes.number,
    hideTooltip: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    offset: PropTypes.number,
    position: PropTypes.oneOf(['bottom', 'none', 'top']),
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
    axis: PropTypes.oneOf(['y']),
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
    domainLimit: PropTypes.oneOfType([PropTypes.oneOf(['nice', 'strict']), PropTypes.func]),
    fill: PropTypes.string,
    hideTooltip: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    offset: PropTypes.number,
    position: PropTypes.oneOf(['left', 'none', 'right']),
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
    width: PropTypes.number,
  }),
} as any;

export { SparkLineChart };
