import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { BarPlot } from '../BarChart';
import { LinePlot, MarkPlot, AreaPlot, markElementClasses } from '../LineChart';
import {
  ResponsiveChartContainer,
  ResponsiveChartContainerProps,
} from '../ResponsiveChartContainer';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { ChartsTooltip, ChartsTooltipProps } from '../ChartsTooltip';
import { ChartsAxisHighlight, ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { AxisConfig } from '../models/axis';
import { MakeOptional } from '../models/helpers';

const SparkLineMarkPlot = styled(MarkPlot)({
  [`& .${markElementClasses.root}`]: {
    display: 'none',
    [`&.${markElementClasses.highlighted}`]: { display: 'inherit' },
  },
});

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
   * Data to plot
   */
  data: number[];
  /**
   * Formatter used by the tooltip
   * @param value The value to format
   * @returns The formated value
   */
  valueFormatter?: (value: number) => string;
  /**
   * Set to `true` to enable the tooltip in the sparkline
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
    data,
    plotType = 'line',
    valueFormatter = (v: number) => v.toString(),
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
      series={[{ type: plotType, data, valueFormatter }]}
      width={width}
      height={height}
      margin={margin}
      xAxis={[
        {
          id: DEFAULT_X_AXIS_KEY,
          scaleType: plotType === 'bar' ? 'band' : 'linear',
          data: Array.from({ length: data.length }, (_, index) => index),
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
      {plotType === 'bar' && <BarPlot />}
      {plotType === 'line' && (
        <React.Fragment>
          <AreaPlot />
          <LinePlot />
          {showHighlight && <SparkLineMarkPlot />}
        </React.Fragment>
      )}

      <ChartsAxisHighlight {...axisHighlight} />
      {showTooltip && <ChartsTooltip {...tooltip} />}

      {children}
    </ResponsiveChartContainer>
  );
});

SparkLineChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  axisHighlight: PropTypes.shape({
    x: PropTypes.oneOf(['band', 'line', 'none']),
    y: PropTypes.oneOf(['line', 'none']),
  }),
  /**
   * Indicate which axis to display the bottom of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`
   * @default xAxisIds[0] The id of the first provided axis
   */
  bottomAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.string.isRequired,
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'top']),
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  desc: PropTypes.string,
  disableAxisListener: PropTypes.bool,
  height: PropTypes.number,
  /**
   * Indicate which axis to display the left of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`
   * @default yAxisIds[0] The id of the first provided axis
   */
  leftAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.string.isRequired,
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      position: PropTypes.oneOf(['left', 'right']),
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
  legend: PropTypes.shape({
    classes: PropTypes.object,
    direction: PropTypes.oneOf(['column', 'row']),
    hidden: PropTypes.bool,
    itemWidth: PropTypes.number,
    markSize: PropTypes.number,
    offset: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    position: PropTypes.shape({
      horizontal: PropTypes.oneOf(['left', 'middle', 'right']).isRequired,
      vertical: PropTypes.oneOf(['bottom', 'middle', 'top']).isRequired,
    }),
    spacing: PropTypes.number,
  }),
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
  /**
   * Indicate which axis to display the right of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`
   * @default null
   */
  rightAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.string.isRequired,
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      position: PropTypes.oneOf(['left', 'right']),
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
  series: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
      highlightScope: PropTypes.shape({
        faded: PropTypes.oneOf(['global', 'none', 'series']),
        highlighted: PropTypes.oneOf(['item', 'none', 'series']),
      }),
      id: PropTypes.string,
      label: PropTypes.string,
      stack: PropTypes.string,
      stackOffset: PropTypes.oneOf(['diverging', 'expand', 'none', 'silhouette', 'wiggle']),
      stackOrder: PropTypes.oneOf([
        'appearance',
        'ascending',
        'descending',
        'insideOut',
        'none',
        'reverse',
      ]),
      type: PropTypes.oneOf(['bar']),
      valueFormatter: PropTypes.func,
      xAxisKey: PropTypes.string,
      yAxisKey: PropTypes.string,
    }),
  ).isRequired,
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
    trigger: PropTypes.oneOf(['axis', 'item', 'none']),
  }),
  /**
   * Indicate which axis to display the top of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`
   * @default null
   */
  topAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.string.isRequired,
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'top']),
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
  viewBox: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  width: PropTypes.number,
  xAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      data: PropTypes.array,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      id: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      max: PropTypes.number,
      maxTicks: PropTypes.number,
      min: PropTypes.number,
      minTicks: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickSize: PropTypes.number,
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
  ),
  yAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      data: PropTypes.array,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      id: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      max: PropTypes.number,
      maxTicks: PropTypes.number,
      min: PropTypes.number,
      minTicks: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickSize: PropTypes.number,
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
  ),
} as any;

export { SparkLineChart };
