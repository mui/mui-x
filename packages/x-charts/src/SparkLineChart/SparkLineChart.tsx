'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { ChartsClipPath } from '../ChartsClipPath';
import { type ChartsColor, type ChartsColorPalette } from '../colorPalettes';
import { BarPlot } from '../BarChart';
import { LinePlot, AreaPlot, LineHighlightPlot } from '../LineChart';
import { type ChartContainerProps } from '../ChartContainer';
import { ChartDataProvider } from '../ChartDataProvider';
import { ChartsSurface } from '../ChartsSurface';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { ChartsTooltip } from '../ChartsTooltip';
import type {
  ChartsTooltipSlots,
  ChartsTooltipSlotProps,
} from '../ChartsTooltip/ChartTooltip.types';
import { ChartsAxisHighlight, type ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import type { XAxis, YAxis } from '../models/axis';
import type { LineSeriesType, BarSeriesType } from '../models/seriesType';
import type { AreaPlotSlots, AreaPlotSlotProps } from '../LineChart/AreaPlot';
import type { LinePlotSlots, LinePlotSlotProps } from '../LineChart/LinePlot';
import type { MarkPlotSlots, MarkPlotSlotProps } from '../LineChart/MarkPlot';
import type {
  LineHighlightPlotSlots,
  LineHighlightPlotSlotProps,
} from '../LineChart/LineHighlightPlot';
import type { BarPlotSlots, BarPlotSlotProps } from '../BarChart/BarPlot';
import type { ChartMargin } from '../internals/plugins/corePlugins/useChartDimensions/useChartDimensions.types';
import { FocusedLineMark } from '../LineChart/FocusedLineMark';

export interface SparkLineChartSlots
  extends
    AreaPlotSlots,
    LinePlotSlots,
    MarkPlotSlots,
    LineHighlightPlotSlots,
    Omit<BarPlotSlots, 'barLabel'>,
    ChartsTooltipSlots {}
export interface SparkLineChartSlotProps
  extends
    AreaPlotSlotProps,
    LinePlotSlotProps,
    MarkPlotSlotProps,
    LineHighlightPlotSlotProps,
    BarPlotSlotProps,
    ChartsTooltipSlotProps {}

export interface SparkLineChartProps<PlotType extends 'line' | 'bar' = 'line' | 'bar'> extends Omit<
  ChartContainerProps,
  | 'series'
  | 'xAxis'
  | 'yAxis'
  | 'zAxis'
  | 'radiusAxis'
  | 'rotationAxis'
  | 'axesGap'
  | 'margin'
  | 'plugins'
  | 'colors'
  | 'slots'
  | 'slotProps'
  | 'experimentalFeatures'
> {
  /**
   * The xAxis configuration.
   * Notice it is a single [[AxisConfig]] object, not an array of configuration.
   */
  xAxis?: XAxis;
  /**
   * The yAxis configuration.
   * Notice it is a single [[AxisConfig]] object, not an array of configuration.
   */
  yAxis?: YAxis;
  axisHighlight?: ChartsAxisHighlightProps;
  /**
   * Type of plot used.
   * @default 'line'
   */
  plotType?: PlotType;
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
  area?: PlotType extends 'line' ? LineSeriesType['area'] : never;
  /**
   * @default 'linear'
   */
  curve?: PlotType extends 'line' ? LineSeriesType['curve'] : never;
  /**
   * The value of the line at the base of the series area.
   *
   * - `'min'` the area will fill the space **under** the line.
   * - `'max'` the area will fill the space **above** the line.
   * - `number` the area will fill the space between this value and the line
   *
   * @default 0
   */
  baseline?: PlotType extends 'line' ? LineSeriesType['baseline'] : never;
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

  /**
   * When `true`, the chart's drawing area will not be clipped and elements within can visually overflow the chart.
   *
   * @default false
   */
  disableClipping?: boolean;

  /**
   * The clipped area offset in pixels.
   *
   * This prevents partial clipping of lines when they are drawn on the edge of the drawing area.
   *
   * @default { top: 1, right: 1, bottom: 1, left: 1 }
   */
  clipAreaOffset?: { top?: number; right?: number; bottom?: number; left?: number };
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
    xAxis: xAxisProps,
    yAxis: yAxisProps,
    width,
    height,
    margin = SPARK_LINE_DEFAULT_MARGIN,
    color,
    baseline,
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
    disableClipping,
    clipAreaOffset,
    onHighlightChange,
    onHighlightedAxisChange,
    highlightedAxis,
    highlightedItem,
    ...other
  } = props;
  const id = useId();
  const clipPathId = `${id}-clip-path`;
  const clipPathOffset = React.useMemo(
    () => ({
      top: clipAreaOffset?.top ?? 1,
      right: clipAreaOffset?.right ?? 1,
      bottom: clipAreaOffset?.bottom ?? 1,
      left: clipAreaOffset?.left ?? 1,
    }),
    [clipAreaOffset?.bottom, clipAreaOffset?.left, clipAreaOffset?.right, clipAreaOffset?.top],
  );

  const defaultXHighlight: { x: 'band' | 'none' } = React.useMemo(
    () => (showHighlight && plotType === 'bar' ? { x: 'band' } : { x: 'none' }),
    [plotType, showHighlight],
  );
  const axisHighlight = React.useMemo(
    () => ({
      ...defaultXHighlight,
      ...inAxisHighlight,
    }),
    [defaultXHighlight, inAxisHighlight],
  );

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;

  const colors: ChartsColorPalette | undefined = React.useMemo(() => {
    if (color == null) {
      return undefined;
    }

    return typeof color === 'function' ? (mode: 'light' | 'dark') => [color(mode)] : [color];
  }, [color]);

  const series = React.useMemo(
    () => [
      {
        type: plotType,
        data,
        valueFormatter,
        ...(plotType === 'bar' ? {} : { area, curve, baseline, disableHighlight: !showHighlight }),
      } as LineSeriesType | BarSeriesType,
    ],
    [area, baseline, curve, data, plotType, showHighlight, valueFormatter],
  );

  const xAxis: XAxis[] = React.useMemo(
    () => [
      {
        id: DEFAULT_X_AXIS_KEY,
        scaleType: plotType === 'bar' ? 'band' : 'point',
        hideTooltip: xAxisProps === undefined,
        ...xAxisProps,
        data: xAxisProps?.data ?? Array.from({ length: data.length }, (_, index) => index),
        position: 'none',
      },
    ],
    [data.length, plotType, xAxisProps],
  );
  const yAxis: YAxis[] = React.useMemo(
    () => [
      {
        id: DEFAULT_Y_AXIS_KEY,
        ...yAxisProps,
        position: 'none',
      },
    ],
    [yAxisProps],
  );
  return (
    <ChartDataProvider
      series={series}
      width={width}
      height={height}
      margin={margin}
      xAxis={xAxis}
      yAxis={yAxis}
      colors={colors}
      disableAxisListener={
        onHighlightedAxisChange === undefined &&
        (!showTooltip || slotProps?.tooltip?.trigger !== 'axis') &&
        axisHighlight?.x === 'none' &&
        axisHighlight?.y === 'none'
      }
      onHighlightChange={onHighlightChange}
      onHighlightedAxisChange={onHighlightedAxisChange}
      highlightedAxis={highlightedAxis}
      highlightedItem={highlightedItem}
    >
      <ChartsSurface className={className} ref={ref} sx={sx} {...other}>
        <g clipPath={`url(#${clipPathId})`}>
          {plotType === 'bar' && <BarPlot skipAnimation slots={slots} slotProps={slotProps} />}

          {plotType === 'line' && (
            <React.Fragment>
              <AreaPlot skipAnimation slots={slots} slotProps={slotProps} />
              <LinePlot skipAnimation slots={slots} slotProps={slotProps} />
            </React.Fragment>
          )}
        </g>
        {plotType === 'line' && (
          <React.Fragment>
            <LineHighlightPlot slots={slots} slotProps={slotProps} />
            <FocusedLineMark />
          </React.Fragment>
        )}
        {disableClipping ? null : <ChartsClipPath id={clipPathId} offset={clipPathOffset} />}
        <ChartsAxisHighlight {...axisHighlight} />
        {children}
      </ChartsSurface>
      {showTooltip && <Tooltip {...props.slotProps?.tooltip} />}
    </ChartDataProvider>
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
  /**
   * The value of the line at the base of the series area.
   *
   * - `'min'` the area will fill the space **under** the line.
   * - `'max'` the area will fill the space **above** the line.
   * - `number` the area will fill the space between this value and the line
   *
   * @default 0
   */
  baseline: PropTypes.oneOfType([PropTypes.oneOf(['max', 'min']), PropTypes.number]),
  /**
   * Configuration for the brush interaction.
   */
  brushConfig: PropTypes.shape({
    enabled: PropTypes.bool,
    preventHighlight: PropTypes.bool,
    preventTooltip: PropTypes.bool,
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * The clipped area offset in pixels.
   *
   * This prevents partial clipping of lines when they are drawn on the edge of the drawing area.
   *
   * @default { top: 1, right: 1, bottom: 1, left: 1 }
   */
  clipAreaOffset: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
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
   * When `true`, the chart's drawing area will not be clipped and elements within can visually overflow the chart.
   *
   * @default false
   */
  disableClipping: PropTypes.bool,
  /**
   * If true, the voronoi interaction are ignored.
   */
  disableVoronoi: PropTypes.bool,
  enableKeyboardNavigation: PropTypes.bool,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * List of hidden series and/or items.
   *
   * Different chart types use different keys.
   *
   * @example
   * ```ts
   * [
   *   {
   *     type: 'pie',
   *     seriesId: 'series-1',
   *     dataIndex: 3,
   *   },
   *   {
   *     type: 'line',
   *     seriesId: 'series-2',
   *   }
   * ]
   * ```
   */
  hiddenItems: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string,
        type: PropTypes.oneOf(['bar']).isRequired,
      }),
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string,
        type: PropTypes.oneOf(['line']).isRequired,
      }),
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string,
        type: PropTypes.oneOf(['scatter']).isRequired,
      }),
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string,
        type: PropTypes.oneOf(['pie']).isRequired,
      }),
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string,
        type: PropTypes.oneOf(['radar']).isRequired,
      }),
    ]).isRequired,
  ),
  /**
   * The controlled axis highlight.
   * Identified by the axis id, and data index.
   */
  highlightedAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      dataIndex: PropTypes.number.isRequired,
    }),
  ),
  /**
   * The highlighted item.
   * Used when the highlight is controlled.
   */
  highlightedItem: PropTypes.shape({
    dataIndex: PropTypes.number,
    seriesId: PropTypes.string.isRequired,
  }),
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: PropTypes.string,
  /**
   * List of initially hidden series and/or items.
   * Used for uncontrolled state.
   *
   * Different chart types use different keys.
   *
   * @example
   * ```ts
   * [
   *   {
   *     type: 'pie',
   *     seriesId: 'series-1',
   *     dataIndex: 3,
   *   },
   *   {
   *     type: 'line',
   *     seriesId: 'series-2',
   *   }
   * ]
   * ```
   */
  initialHiddenItems: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string,
        type: PropTypes.oneOf(['bar']).isRequired,
      }),
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string,
        type: PropTypes.oneOf(['line']).isRequired,
      }),
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string,
        type: PropTypes.oneOf(['scatter']).isRequired,
      }),
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string,
        type: PropTypes.oneOf(['pie']).isRequired,
      }),
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string,
        type: PropTypes.oneOf(['radar']).isRequired,
      }),
    ]).isRequired,
  ),
  /**
   * Localized text for chart components.
   */
  localeText: PropTypes.object,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   *
   * Accepts a `number` to be used on all sides or an object with the optional properties: `top`, `bottom`, `left`, and `right`.
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
   * @param {null | ChartsAxisData} data The data about the clicked axis and items associated with it.
   */
  onAxisClick: PropTypes.func,
  /**
   * Callback fired when any hidden identifiers change.
   * @param {VisibilityIdentifier[]} hiddenItems The new list of hidden identifiers.
   */
  onHiddenItemsChange: PropTypes.func,
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
  /**
   * The function called when the pointer position corresponds to a new axis data item.
   * This update can either be caused by a pointer movement, or an axis update.
   * In case of multiple axes, the function is called if at least one axis is updated.
   * The argument contains the identifier for all axes with a `data` property.
   * @param {AxisItemIdentifier[]} axisItems The array of axes item identifiers.
   */
  onHighlightedAxisChange: PropTypes.func,
  /**
   * Callback fired when clicking close to an item.
   * This is only available for scatter plot for now.
   * @param {MouseEvent} event Mouse event caught at the svg level
   * @param {ScatterItemIdentifier} scatterItemIdentifier Identify which item got clicked
   */
  onItemClick: PropTypes.func,
  /**
   * The callback fired when the tooltip item changes.
   *
   * @param {SeriesItemIdentifier<TSeries> | null} tooltipItem  The newly highlighted item.
   */
  onTooltipItemChange: PropTypes.func,
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
   * The tooltip item.
   * Used when the tooltip is controlled.
   */
  tooltipItem: PropTypes.oneOfType([
    PropTypes.shape({
      dataIndex: PropTypes.number.isRequired,
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['bar']).isRequired,
    }),
    PropTypes.shape({
      dataIndex: PropTypes.number,
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['line']).isRequired,
    }),
    PropTypes.shape({
      dataIndex: PropTypes.number.isRequired,
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['scatter']).isRequired,
    }),
    PropTypes.shape({
      dataIndex: PropTypes.number.isRequired,
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['pie']).isRequired,
    }),
    PropTypes.shape({
      dataIndex: PropTypes.number,
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['radar']).isRequired,
    }),
  ]),
  /**
   * Formatter used by the tooltip.
   * @param {number} value The value to format.
   * @returns {string} the formatted value.
   * @default (value: number | null) => (value === null ? '' : value.toString())
   */
  valueFormatter: PropTypes.func,
  /**
   * Defines the maximum distance between a scatter point and the pointer that triggers the interaction.
   * If set to `'item'`, the radius is the `markerSize`.
   * If `undefined`, the radius is assumed to be infinite.
   */
  voronoiMaxRadius: PropTypes.oneOfType([PropTypes.oneOf(['item']), PropTypes.number]),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
  /**
   * The xAxis configuration.
   * Notice it is a single [[AxisConfig]] object, not an array of configuration.
   */
  xAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axis: PropTypes.oneOf(['x']),
      barGapRatio: PropTypes.number,
      categoryGapRatio: PropTypes.number,
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
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          getValue: PropTypes.func.isRequired,
          tickLabelStyle: PropTypes.object,
          tickSize: PropTypes.number,
        }),
      ),
      height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      offset: PropTypes.number,
      ordinalTimeTicks: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.oneOf(['biweekly', 'days', 'hours', 'months', 'quarterly', 'weeks', 'years']),
          PropTypes.shape({
            format: PropTypes.func.isRequired,
            getTickNumber: PropTypes.func.isRequired,
            isTick: PropTypes.func.isRequired,
          }),
        ]).isRequired,
      ),
      position: PropTypes.oneOf(['bottom', 'none', 'top']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['band']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickLabelMinGap: PropTypes.number,
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
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
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          getValue: PropTypes.func.isRequired,
          tickLabelStyle: PropTypes.object,
          tickSize: PropTypes.number,
        }),
      ),
      height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      offset: PropTypes.number,
      ordinalTimeTicks: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.oneOf(['biweekly', 'days', 'hours', 'months', 'quarterly', 'weeks', 'years']),
          PropTypes.shape({
            format: PropTypes.func.isRequired,
            getTickNumber: PropTypes.func.isRequired,
            isTick: PropTypes.func.isRequired,
          }),
        ]).isRequired,
      ),
      position: PropTypes.oneOf(['bottom', 'none', 'top']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['point']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickLabelMinGap: PropTypes.number,
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
      axis: PropTypes.oneOf(['x']),
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
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
      height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.number,
      min: PropTypes.number,
      offset: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'none', 'top']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['log']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickLabelMinGap: PropTypes.number,
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
      axis: PropTypes.oneOf(['x']),
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
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
      constant: PropTypes.number,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      domainLimit: PropTypes.oneOfType([PropTypes.oneOf(['nice', 'strict']), PropTypes.func]),
      height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.number,
      min: PropTypes.number,
      offset: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'none', 'top']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['symlog']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickLabelMinGap: PropTypes.number,
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
      axis: PropTypes.oneOf(['x']),
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
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
      height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.number,
      min: PropTypes.number,
      offset: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'none', 'top']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['pow']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickLabelMinGap: PropTypes.number,
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
      axis: PropTypes.oneOf(['x']),
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
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
      height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.number,
      min: PropTypes.number,
      offset: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'none', 'top']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['sqrt']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickLabelMinGap: PropTypes.number,
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
      axis: PropTypes.oneOf(['x']),
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
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
      height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          valueOf: PropTypes.func.isRequired,
        }),
      ]),
      min: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          valueOf: PropTypes.func.isRequired,
        }),
      ]),
      offset: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'none', 'top']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['time']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickLabelMinGap: PropTypes.number,
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
      axis: PropTypes.oneOf(['x']),
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
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
      height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          valueOf: PropTypes.func.isRequired,
        }),
      ]),
      min: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          valueOf: PropTypes.func.isRequired,
        }),
      ]),
      offset: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'none', 'top']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['utc']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickLabelMinGap: PropTypes.number,
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
      axis: PropTypes.oneOf(['x']),
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
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
      height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.number,
      min: PropTypes.number,
      offset: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'none', 'top']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['linear']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickLabelMinGap: PropTypes.number,
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
  ]),
  /**
   * The yAxis configuration.
   * Notice it is a single [[AxisConfig]] object, not an array of configuration.
   */
  yAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axis: PropTypes.oneOf(['y']),
      barGapRatio: PropTypes.number,
      categoryGapRatio: PropTypes.number,
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
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          getValue: PropTypes.func.isRequired,
          tickLabelStyle: PropTypes.object,
          tickSize: PropTypes.number,
        }),
      ),
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      offset: PropTypes.number,
      ordinalTimeTicks: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.oneOf(['biweekly', 'days', 'hours', 'months', 'quarterly', 'weeks', 'years']),
          PropTypes.shape({
            format: PropTypes.func.isRequired,
            getTickNumber: PropTypes.func.isRequired,
            isTick: PropTypes.func.isRequired,
          }),
        ]).isRequired,
      ),
      position: PropTypes.oneOf(['left', 'none', 'right']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['band']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
    }),
    PropTypes.shape({
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
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          getValue: PropTypes.func.isRequired,
          tickLabelStyle: PropTypes.object,
          tickSize: PropTypes.number,
        }),
      ),
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      offset: PropTypes.number,
      ordinalTimeTicks: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.oneOf(['biweekly', 'days', 'hours', 'months', 'quarterly', 'weeks', 'years']),
          PropTypes.shape({
            format: PropTypes.func.isRequired,
            getTickNumber: PropTypes.func.isRequired,
            isTick: PropTypes.func.isRequired,
          }),
        ]).isRequired,
      ),
      position: PropTypes.oneOf(['left', 'none', 'right']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['point']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
    }),
    PropTypes.shape({
      axis: PropTypes.oneOf(['y']),
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
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
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.number,
      min: PropTypes.number,
      offset: PropTypes.number,
      position: PropTypes.oneOf(['left', 'none', 'right']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['log']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
    }),
    PropTypes.shape({
      axis: PropTypes.oneOf(['y']),
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
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
      constant: PropTypes.number,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      domainLimit: PropTypes.oneOfType([PropTypes.oneOf(['nice', 'strict']), PropTypes.func]),
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.number,
      min: PropTypes.number,
      offset: PropTypes.number,
      position: PropTypes.oneOf(['left', 'none', 'right']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['symlog']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
    }),
    PropTypes.shape({
      axis: PropTypes.oneOf(['y']),
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
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
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.number,
      min: PropTypes.number,
      offset: PropTypes.number,
      position: PropTypes.oneOf(['left', 'none', 'right']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['pow']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
    }),
    PropTypes.shape({
      axis: PropTypes.oneOf(['y']),
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
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
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.number,
      min: PropTypes.number,
      offset: PropTypes.number,
      position: PropTypes.oneOf(['left', 'none', 'right']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['sqrt']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
    }),
    PropTypes.shape({
      axis: PropTypes.oneOf(['y']),
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
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
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          valueOf: PropTypes.func.isRequired,
        }),
      ]),
      min: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          valueOf: PropTypes.func.isRequired,
        }),
      ]),
      offset: PropTypes.number,
      position: PropTypes.oneOf(['left', 'none', 'right']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['time']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
    }),
    PropTypes.shape({
      axis: PropTypes.oneOf(['y']),
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
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
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          valueOf: PropTypes.func.isRequired,
        }),
      ]),
      min: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          valueOf: PropTypes.func.isRequired,
        }),
      ]),
      offset: PropTypes.number,
      position: PropTypes.oneOf(['left', 'none', 'right']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['utc']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
    }),
    PropTypes.shape({
      axis: PropTypes.oneOf(['y']),
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
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
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.number,
      min: PropTypes.number,
      offset: PropTypes.number,
      position: PropTypes.oneOf(['left', 'none', 'right']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['linear']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
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
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
    }),
  ]),
} as any;

export { SparkLineChart };
