'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { MakeOptional } from '@mui/x-internals/types';
import { AreaPlot, AreaPlotProps, AreaPlotSlotProps, AreaPlotSlots } from './AreaPlot';
import { LinePlot, LinePlotProps, LinePlotSlotProps, LinePlotSlots } from './LinePlot';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';
import { MarkPlot, MarkPlotProps, MarkPlotSlotProps, MarkPlotSlots } from './MarkPlot';
import { ChartsAxis, ChartsAxisProps } from '../ChartsAxis/ChartsAxis';
import { LineSeriesType } from '../models/seriesType/line';
import { ChartsTooltip } from '../ChartsTooltip';
import { ChartsTooltipSlots, ChartsTooltipSlotProps } from '../ChartsTooltip/ChartTooltip.types';
import { ChartsLegend, ChartsLegendSlotProps, ChartsLegendSlots } from '../ChartsLegend';
import { ChartsAxisHighlight, ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsClipPath } from '../ChartsClipPath';
import { ChartsAxisSlotProps, ChartsAxisSlots } from '../models/axis';
import {
  LineHighlightPlot,
  LineHighlightPlotSlots,
  LineHighlightPlotSlotProps,
} from './LineHighlightPlot';
import { ChartsGrid, ChartsGridProps } from '../ChartsGrid';
import {
  ChartsOnAxisClickHandler,
  ChartsOnAxisClickHandlerProps,
} from '../ChartsOnAxisClickHandler';
import {
  ChartsOverlay,
  ChartsOverlayProps,
  ChartsOverlaySlotProps,
  ChartsOverlaySlots,
} from '../ChartsOverlay';
import { useLineChartProps } from './useLineChartProps';

export interface LineChartSlots
  extends ChartsAxisSlots,
    AreaPlotSlots,
    LinePlotSlots,
    MarkPlotSlots,
    LineHighlightPlotSlots,
    ChartsLegendSlots,
    ChartsOverlaySlots,
    ChartsTooltipSlots {}
export interface LineChartSlotProps
  extends ChartsAxisSlotProps,
    AreaPlotSlotProps,
    LinePlotSlotProps,
    MarkPlotSlotProps,
    LineHighlightPlotSlotProps,
    ChartsLegendSlotProps,
    ChartsOverlaySlotProps,
    ChartsTooltipSlotProps {}

export interface LineChartProps
  extends Omit<ChartContainerProps, 'series' | 'plugins' | 'zAxis'>,
    Omit<ChartsAxisProps, 'slots' | 'slotProps'>,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'>,
    ChartsOnAxisClickHandlerProps {
  /**
   * The series to display in the line chart.
   * An array of [[LineSeriesType]] objects.
   */
  series: MakeOptional<LineSeriesType, 'type'>[];
  /**
   * Option to display a cartesian grid in the background.
   */
  grid?: Pick<ChartsGridProps, 'vertical' | 'horizontal'>;
  /**
   * The configuration of axes highlight.
   * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
   * @default { x: 'line' }
   */
  axisHighlight?: ChartsAxisHighlightProps;
  /**
   * If `true`, the legend is not rendered.
   */
  hideLegend?: boolean;
  /**
   * If `true`, render the line highlight item.
   */
  disableLineItemHighlight?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: LineChartSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: LineChartSlotProps;
  /**
   * Callback fired when an area element is clicked.
   */
  onAreaClick?: AreaPlotProps['onItemClick'];
  /**
   * Callback fired when a line element is clicked.
   */
  onLineClick?: LinePlotProps['onItemClick'];
  /**
   * Callback fired when a mark element is clicked.
   */
  onMarkClick?: MarkPlotProps['onItemClick'];
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
  /**
   * If `true` marks will render `<circle />` instead of `<path />` and drop theme override for faster rendering.
   */
  experimentalMarkRendering?: boolean;
}

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineChart API](https://mui.com/x/api/charts/line-chart/)
 */
const LineChart = React.forwardRef(function LineChart(
  inProps: LineChartProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiLineChart' });
  const {
    chartContainerProps,
    axisClickHandlerProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    areaPlotProps,
    linePlotProps,
    markPlotProps,
    overlayProps,
    chartsAxisProps,
    axisHighlightProps,
    lineHighlightPlotProps,
    legendProps,
    children,
  } = useLineChartProps(props);

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;

  return (
    <ChartContainer ref={ref} {...chartContainerProps}>
      {props.onAxisClick && <ChartsOnAxisClickHandler {...axisClickHandlerProps} />}
      <ChartsGrid {...gridProps} />
      <g {...clipPathGroupProps}>
        <AreaPlot {...areaPlotProps} />
        <LinePlot {...linePlotProps} />
        <ChartsOverlay {...overlayProps} />
        <ChartsAxisHighlight {...axisHighlightProps} />
      </g>
      <ChartsAxis {...chartsAxisProps} />
      <g data-drawing-container>
        {/* The `data-drawing-container` indicates that children are part of the drawing area. Ref: https://github.com/mui/mui-x/issues/13659 */}
        <MarkPlot {...markPlotProps} />
      </g>
      <LineHighlightPlot {...lineHighlightPlotProps} />
      {!props.hideLegend && <ChartsLegend {...legendProps} />}
      {!props.loading && <Tooltip {...props.slotProps?.tooltip} />}
      <ChartsClipPath {...clipPathProps} />
      {children}
    </ChartContainer>
  );
});

LineChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The configuration of axes highlight.
   * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
   * @default { x: 'line' }
   */
  axisHighlight: PropTypes.shape({
    x: PropTypes.oneOf(['band', 'line', 'none']),
    y: PropTypes.oneOf(['band', 'line', 'none']),
  }),
  /**
   * Indicate which axis to display the bottom of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default xAxisIds[0] The id of the first provided axis
   */
  bottomAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   * @default blueberryTwilightPalette
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
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
   * If `true`, render the line highlight item.
   */
  disableLineItemHighlight: PropTypes.bool,
  /**
   * If `true` marks will render `<circle />` instead of `<path />` and drop theme override for faster rendering.
   */
  experimentalMarkRendering: PropTypes.bool,
  /**
   * Option to display a cartesian grid in the background.
   */
  grid: PropTypes.shape({
    horizontal: PropTypes.bool,
    vertical: PropTypes.bool,
  }),
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * If `true`, the legend is not rendered.
   */
  hideLegend: PropTypes.bool,
  /**
   * The item currently highlighted. Turns highlighting into a controlled prop.
   */
  highlightedItem: PropTypes.shape({
    dataIndex: PropTypes.number,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  /**
   * Indicate which axis to display the left of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default yAxisIds[0] The id of the first provided axis
   */
  leftAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /**
   * If `true`, a loading overlay is displayed.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default object Depends on the charts type.
   */
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
  /**
   * Callback fired when an area element is clicked.
   */
  onAreaClick: PropTypes.func,
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
   * Callback fired when a line element is clicked.
   */
  onLineClick: PropTypes.func,
  /**
   * Callback fired when a mark element is clicked.
   */
  onMarkClick: PropTypes.func,
  /**
   * Indicate which axis to display the right of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default null
   */
  rightAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /**
   * The series to display in the line chart.
   * An array of [[LineSeriesType]] objects.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * If `true`, animations are skipped.
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
  /**
   * Indicate which axis to display the top of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default null
   */
  topAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis: PropTypes.arrayOf(
    PropTypes.shape({
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
          color: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string.isRequired),
            PropTypes.func,
          ]).isRequired,
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
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
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
  ),
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis: PropTypes.arrayOf(
    PropTypes.shape({
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
          color: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string.isRequired),
            PropTypes.func,
          ]).isRequired,
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
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
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
  ),
} as any;

export { LineChart };
