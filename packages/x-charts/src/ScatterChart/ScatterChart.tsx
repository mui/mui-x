import * as React from 'react';
import PropTypes from 'prop-types';
import {
  ScatterPlot,
  ScatterPlotSlotComponentProps,
  ScatterPlotSlotsComponent,
} from './ScatterPlot';
import {
  ResponsiveChartContainer,
  ResponsiveChartContainerProps,
} from '../ResponsiveChartContainer';
import { ChartsAxis, ChartsAxisProps } from '../ChartsAxis';
import { ScatterSeriesType } from '../models/seriesType/scatter';
import { MakeOptional } from '../models/helpers';
import {
  ChartsTooltip,
  ChartsTooltipProps,
  ChartsTooltipSlotComponentProps,
  ChartsTooltipSlotsComponent,
} from '../ChartsTooltip';
import {
  ChartsLegend,
  ChartsLegendProps,
  ChartsLegendSlotComponentProps,
  ChartsLegendSlotsComponent,
} from '../ChartsLegend';
import { ChartsAxisHighlight, ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsAxisSlotsComponent, ChartsAxisSlotComponentProps } from '../models/axis';
import OnClickHandler from '../OnClickHandler';

export interface ScatterChartSlotsComponent
  extends ChartsAxisSlotsComponent,
    ScatterPlotSlotsComponent,
    ChartsLegendSlotsComponent,
    ChartsTooltipSlotsComponent {}
export interface ScatterChartSlotComponentProps
  extends ChartsAxisSlotComponentProps,
    ScatterPlotSlotComponentProps,
    ChartsLegendSlotComponentProps,
    ChartsTooltipSlotComponentProps {}

export interface ScatterChartProps
  extends Omit<ResponsiveChartContainerProps, 'series'>,
    Omit<ChartsAxisProps, 'slots' | 'slotProps'> {
  series: MakeOptional<ScatterSeriesType, 'type'>[];
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
  slots?: ScatterChartSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ScatterChartSlotComponentProps;
  onClick?: (event: any, series: any, itemData: any) => void;
}

const ScatterChart = React.forwardRef(function ScatterChart(props: ScatterChartProps, ref) {
  const {
    xAxis,
    yAxis,
    series,
    tooltip,
    axisHighlight,
    legend,
    width,
    height,
    margin,
    colors,
    sx,
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    children,
    slots,
    slotProps,
    onClick,
  } = props;
  return (
    <ResponsiveChartContainer
      ref={ref}
      series={series.map((s) => ({ type: 'scatter', ...s }))}
      width={width}
      height={height}
      margin={margin}
      colors={colors}
      xAxis={xAxis}
      yAxis={yAxis}
      sx={sx}
    >
      <ChartsAxis
        topAxis={topAxis}
        leftAxis={leftAxis}
        rightAxis={rightAxis}
        bottomAxis={bottomAxis}
        slots={slots}
        slotProps={slotProps}
      />
      <ScatterPlot slots={slots} slotProps={slotProps} />
      <ChartsLegend {...legend} slots={slots} slotProps={slotProps} />
      <ChartsAxisHighlight x="none" y="none" {...axisHighlight} />
      <ChartsTooltip trigger="item" {...tooltip} />
      <OnClickHandler trigger="item" onClick={onClick} />
      {children}
    </ResponsiveChartContainer>
  );
});

ScatterChart.propTypes = {
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
      axisId: PropTypes.string.isRequired,
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'top']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
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
  /**
   * Indicate which axis to display the left of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
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
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
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
  onClick: PropTypes.func,
  /**
   * Indicate which axis to display the right of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
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
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
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
      data: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
        }),
      ).isRequired,
      highlightScope: PropTypes.shape({
        faded: PropTypes.oneOf(['global', 'none', 'series']),
        highlighted: PropTypes.oneOf(['item', 'none', 'series']),
      }),
      id: PropTypes.string,
      label: PropTypes.string,
      markerSize: PropTypes.number,
      type: PropTypes.oneOf(['scatter']),
      valueFormatter: PropTypes.func,
      xAxisKey: PropTypes.string,
      yAxisKey: PropTypes.string,
    }),
  ).isRequired,
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
      axisId: PropTypes.string.isRequired,
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'top']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
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
  ),
} as any;

export { ScatterChart };
