import * as React from 'react';
import useId from '@mui/utils/useId';
import PropTypes from 'prop-types';
import { BarPlot, BarPlotProps, BarPlotSlotComponentProps, BarPlotSlotsComponent } from './BarPlot';
import {
  ResponsiveChartContainer,
  ResponsiveChartContainerProps,
} from '../ResponsiveChartContainer';
import { ChartsAxis, ChartsAxisProps } from '../ChartsAxis';
import { BarSeriesType } from '../models/seriesType/bar';
import { MakeOptional } from '../models/helpers';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import {
  ChartsTooltip,
  ChartsTooltipProps,
  ChartsTooltipSlotComponentProps,
  ChartsTooltipSlotsComponent,
} from '../ChartsTooltip';
import {
  ChartsLegend,
  ChartsLegendProps,
  ChartsLegendSlotsComponent,
  ChartsLegendSlotComponentProps,
} from '../ChartsLegend';
import { ChartsAxisHighlight, ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsClipPath } from '../ChartsClipPath';
import { ChartsAxisSlotsComponent, ChartsAxisSlotComponentProps } from '../models/axis';

export interface BarChartSlotsComponent
  extends ChartsAxisSlotsComponent,
    BarPlotSlotsComponent,
    ChartsLegendSlotsComponent,
    ChartsTooltipSlotsComponent {}
export interface BarChartSlotComponentProps
  extends ChartsAxisSlotComponentProps,
    BarPlotSlotComponentProps,
    ChartsLegendSlotComponentProps,
    ChartsTooltipSlotComponentProps {}

export interface BarChartProps
  extends Omit<ResponsiveChartContainerProps, 'series'>,
    Omit<ChartsAxisProps, 'slots' | 'slotProps'>,
    Pick<BarPlotProps, 'skipAnimation'> {
  series: MakeOptional<BarSeriesType, 'type'>[];
  tooltip?: ChartsTooltipProps;
  axisHighlight?: ChartsAxisHighlightProps;
  /**
   * @deprecated Consider using `slotProps.legend` instead.
   */
  legend?: ChartsLegendProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BarChartSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BarChartSlotComponentProps;
  layout?: BarSeriesType['layout'];
}

/**
 * Demos:
 *
 * - [Bars](https://mui.com/x/react-charts/bars/)
 * - [Bar demonstration](https://mui.com/x/react-charts/bar-demo/)
 * - [Stacking](https://mui.com/x/react-charts/stacking/)
 *
 * API:
 *
 * - [BarChart API](https://mui.com/x/api/charts/bar-chart/)
 */
const BarChart = React.forwardRef(function BarChart(props: BarChartProps, ref) {
  const {
    xAxis,
    yAxis,
    series,
    width,
    height,
    margin,
    colors,
    dataset,
    sx,
    layout,
    tooltip,
    axisHighlight,
    legend,
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    skipAnimation,
    children,
    slots,
    slotProps,
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const hasHorizontalSeries =
    layout === 'horizontal' ||
    (layout === undefined && series.some((item) => item.layout === 'horizontal'));

  const defaultAxisConfig = {
    scaleType: 'band',
    data: Array.from(
      { length: Math.max(...series.map((s) => (s.data ?? dataset ?? []).length)) },
      (_, index) => index,
    ),
  } as const;

  const defaultizedAxisHighlight = {
    ...(hasHorizontalSeries ? ({ y: 'band' } as const) : ({ x: 'band' } as const)),
    ...axisHighlight,
  };
  return (
    <ResponsiveChartContainer
      ref={ref}
      series={series.map((s) => ({
        type: 'bar',
        ...s,
        layout: hasHorizontalSeries ? 'horizontal' : 'vertical',
      }))}
      width={width}
      height={height}
      margin={margin}
      xAxis={
        xAxis ??
        (hasHorizontalSeries ? undefined : [{ id: DEFAULT_X_AXIS_KEY, ...defaultAxisConfig }])
      }
      yAxis={
        yAxis ??
        (hasHorizontalSeries ? [{ id: DEFAULT_Y_AXIS_KEY, ...defaultAxisConfig }] : undefined)
      }
      colors={colors}
      dataset={dataset}
      sx={sx}
      disableAxisListener={
        tooltip?.trigger !== 'axis' && axisHighlight?.x === 'none' && axisHighlight?.y === 'none'
      }
    >
      <g clipPath={`url(#${clipPathId})`}>
        <BarPlot slots={slots} slotProps={slotProps} skipAnimation={skipAnimation} />
      </g>
      <ChartsAxis
        topAxis={topAxis}
        leftAxis={leftAxis}
        rightAxis={rightAxis}
        bottomAxis={bottomAxis}
        slots={slots}
        slotProps={slotProps}
      />
      <ChartsLegend {...legend} slots={slots} slotProps={slotProps} />
      <ChartsAxisHighlight {...defaultizedAxisHighlight} />
      <ChartsTooltip {...tooltip} slots={slots} slotProps={slotProps} />
      <ChartsClipPath id={clipPathId} />
      {children}
    </ResponsiveChartContainer>
  );
});

BarChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  axisHighlight: PropTypes.shape({
    x: PropTypes.oneOf(['band', 'line', 'none']),
    y: PropTypes.oneOf(['band', 'line', 'none']),
  }),
  /**
   * Indicate which axis to display the bottom of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default xAxisIds[0] The id of the first provided axis
   */
  bottomAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      position: PropTypes.oneOf(['bottom', 'top']),
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
    }),
    PropTypes.string,
  ]),
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  dataset: PropTypes.arrayOf(PropTypes.object),
  desc: PropTypes.string,
  disableAxisListener: PropTypes.bool,
  height: PropTypes.number,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  /**
   * Indicate which axis to display the left of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default yAxisIds[0] The id of the first provided axis
   */
  leftAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      position: PropTypes.oneOf(['left', 'right']),
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
    }),
    PropTypes.string,
  ]),
  /**
   * @deprecated Consider using `slotProps.legend` instead.
   */
  legend: PropTypes.shape({
    classes: PropTypes.object,
    direction: PropTypes.oneOf(['column', 'row']),
    hidden: PropTypes.bool,
    position: PropTypes.shape({
      horizontal: PropTypes.oneOf(['left', 'middle', 'right']).isRequired,
      vertical: PropTypes.oneOf(['bottom', 'middle', 'top']).isRequired,
    }),
    slotProps: PropTypes.object,
    slots: PropTypes.object,
  }),
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
  /**
   * Indicate which axis to display the right of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default null
   */
  rightAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      position: PropTypes.oneOf(['left', 'right']),
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
    }),
    PropTypes.string,
  ]),
  series: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.number),
      dataKey: PropTypes.string,
      highlightScope: PropTypes.shape({
        faded: PropTypes.oneOf(['global', 'none', 'series']),
        highlighted: PropTypes.oneOf(['item', 'none', 'series']),
      }),
      id: PropTypes.string,
      label: PropTypes.string,
      layout: PropTypes.oneOf(['horizontal', 'vertical']),
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
  /**
   * If `true`, animations are skiped.
   * @default false
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
   * Indicate which axis to display the top of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default null
   */
  topAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      position: PropTypes.oneOf(['bottom', 'top']),
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

export { BarChart };
