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
  ChartsTooltipSlotComponentProps,
  ChartsTooltipSlotsComponent,
} from '../ChartsTooltip';
import { ChartsAxisHighlight, ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { AxisConfig } from '../models/axis';
import { MakeOptional } from '../models/helpers';
import { LineSeriesType } from '../models/seriesType/line';
import { AreaPlotSlotsComponent, AreaPlotSlotComponentProps } from '../LineChart/AreaPlot';
import { LinePlotSlotsComponent, LinePlotSlotComponentProps } from '../LineChart/LinePlot';
import { MarkPlotSlotsComponent, MarkPlotSlotComponentProps } from '../LineChart/MarkPlot';
import {
  LineHighlightPlotSlotsComponent,
  LineHighlightPlotSlotComponentProps,
} from '../LineChart/LineHighlightPlot';
import { BarPlotSlotsComponent, BarPlotSlotComponentProps } from '../BarChart/BarPlot';
import OnClickHandler from '../OnClickHandler';

export interface SparkLineChartSlotsComponent
  extends AreaPlotSlotsComponent,
    LinePlotSlotsComponent,
    MarkPlotSlotsComponent,
    LineHighlightPlotSlotsComponent,
    BarPlotSlotsComponent,
    ChartsTooltipSlotsComponent {}
export interface SparkLineChartSlotComponentProps
  extends AreaPlotSlotComponentProps,
    LinePlotSlotComponentProps,
    MarkPlotSlotComponentProps,
    LineHighlightPlotSlotComponentProps,
    BarPlotSlotComponentProps,
    ChartsTooltipSlotComponentProps {}

export interface SparkLineChartProps
  extends Omit<ResponsiveChartContainerProps, 'series' | 'xAxis' | 'yAxis'> {
  /**
   * The xAxis configuration.
   * Notice it is a single configuration object, not an array of configuration.
   */
  xAxis?: MakeOptional<AxisConfig, 'id'>;
  tooltip?: ChartsTooltipProps;
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
   */
  valueFormatter?: (value: number) => string;
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
   * Overridable component slots.
   * @default {}
   */
  slots?: SparkLineChartSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: SparkLineChartSlotComponentProps;
  onClick?: (event: any, series: any, itemData: any) => void;
}

const SPARKLINE_DEFAULT_MARGIN = {
  top: 5,
  bottom: 5,
  left: 5,
  right: 5,
};

const SparkLineChart = React.forwardRef(function SparkLineChart(props: SparkLineChartProps, ref) {
  const {
    xAxis,
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
    valueFormatter = (v: number) => v.toString(),
    onClick,
    area,
    curve = 'linear',
  } = props;

  const defaultXHighlight: { x: 'band' | 'none' } =
    showHighlight && plotType === 'bar' ? { x: 'band' } : { x: 'none' };
  const axisHighlight = {
    ...defaultXHighlight,
    ...inAxisHighlight,
  };

  return (
    <ResponsiveChartContainer
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
      xAxis={[
        {
          id: DEFAULT_X_AXIS_KEY,
          scaleType: plotType === 'bar' ? 'band' : 'point',
          data: Array.from({ length: data.length }, (_, index) => index),
          hideTooltip: xAxis === undefined,
          ...xAxis,
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
      <OnClickHandler trigger={tooltip?.trigger} onClick={onClick} />
      {plotType === 'bar' && (
        <BarPlot slots={slots} slotProps={slotProps} sx={{ shapeRendering: 'auto' }} />
      )}

      {plotType === 'line' && (
        <React.Fragment>
          <AreaPlot slots={slots} slotProps={slotProps} />
          <LinePlot slots={slots} slotProps={slotProps} />
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
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
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
  dataset: PropTypes.arrayOf(PropTypes.object),
  desc: PropTypes.string,
  disableAxisListener: PropTypes.bool,
  height: PropTypes.number,
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
  onClick: PropTypes.func,
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
   */
  valueFormatter: PropTypes.func,
  viewBox: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  width: PropTypes.number,
  /**
   * The xAxis configuration.
   * Notice it is a single configuration object, not an array of configuration.
   */
  xAxis: PropTypes.shape({
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
    max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
    scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
    slotProps: PropTypes.object,
    slots: PropTypes.object,
    stroke: PropTypes.string,
    tickFontSize: PropTypes.number,
    tickMaxStep: PropTypes.number,
    tickMinStep: PropTypes.number,
    tickNumber: PropTypes.number,
    tickSize: PropTypes.number,
    valueFormatter: PropTypes.func,
  }),
} as any;

export { SparkLineChart };
