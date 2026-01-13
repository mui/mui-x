'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { type MakeOptional } from '@mui/x-internals/types';
import { type ChartsSlotProps, type ChartsSlots } from '../internals/material';
import { type ChartsToolbarSlotProps, type ChartsToolbarSlots } from '../Toolbar';
import { BarPlot, type BarPlotProps, type BarPlotSlotProps, type BarPlotSlots } from './BarPlot';
import { type ChartContainerProps } from '../ChartContainer';
import { ChartsAxis, type ChartsAxisProps } from '../ChartsAxis';
import { type BarSeriesType } from '../models/seriesType/bar';
import { ChartsTooltip } from '../ChartsTooltip';
import {
  type ChartsTooltipSlots,
  type ChartsTooltipSlotProps,
} from '../ChartsTooltip/ChartTooltip.types';
import { ChartsLegend, type ChartsLegendSlots, type ChartsLegendSlotProps } from '../ChartsLegend';
import { ChartsAxisHighlight, type ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsClipPath } from '../ChartsClipPath';
import { type ChartsAxisSlots, type ChartsAxisSlotProps } from '../models/axis';
import { ChartsGrid, type ChartsGridProps } from '../ChartsGrid';
import {
  ChartsOverlay,
  type ChartsOverlayProps,
  type ChartsOverlaySlotProps,
  type ChartsOverlaySlots,
} from '../ChartsOverlay/ChartsOverlay';
import { useBarChartProps } from './useBarChartProps';
import { ChartDataProvider } from '../ChartDataProvider';
import { ChartsSurface } from '../ChartsSurface';
import { useChartContainerProps } from '../ChartContainer/useChartContainerProps';
import { ChartsWrapper } from '../ChartsWrapper';
import type { BarChartPluginSignatures } from './BarChart.plugins';
import { FocusedBar } from './FocusedBar';

export interface BarChartSlots
  extends
    ChartsAxisSlots,
    BarPlotSlots,
    ChartsLegendSlots,
    ChartsOverlaySlots,
    ChartsTooltipSlots,
    ChartsToolbarSlots,
    Partial<ChartsSlots> {}
export interface BarChartSlotProps
  extends
    ChartsAxisSlotProps,
    BarPlotSlotProps,
    ChartsLegendSlotProps,
    ChartsOverlaySlotProps,
    ChartsTooltipSlotProps,
    ChartsToolbarSlotProps,
    Partial<ChartsSlotProps> {}

export type BarSeries = MakeOptional<BarSeriesType, 'type'>;

export interface BarChartProps
  extends
    Omit<
      ChartContainerProps<'bar', BarChartPluginSignatures>,
      'series' | 'plugins' | 'zAxis' | 'experimentalFeatures'
    >,
    Omit<ChartsAxisProps, 'slots' | 'slotProps'>,
    Omit<BarPlotProps, 'slots' | 'slotProps'>,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'> {
  /**
   * The series to display in the bar chart.
   * An array of [[BarSeries]] objects.
   */
  series: ReadonlyArray<BarSeries>;
  /**
   * Option to display a cartesian grid in the background.
   */
  grid?: Pick<ChartsGridProps, 'vertical' | 'horizontal'>;
  /**
   * The configuration of axes highlight.
   * Default is set to 'band' in the bar direction.
   * Depends on `layout` prop.
   * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
   *
   */
  axisHighlight?: ChartsAxisHighlightProps;
  /**
   * If `true`, the legend is not rendered.
   */
  hideLegend?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BarChartSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BarChartSlotProps;
  /**
   * The direction of the bar elements.
   * @default 'vertical'
   */
  layout?: BarSeriesType['layout'];
  /**
   * If true, shows the default chart toolbar.
   * @default false
   */
  showToolbar?: boolean;
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
const BarChart = React.forwardRef(function BarChart(
  inProps: BarChartProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiBarChart' });
  const {
    chartsWrapperProps,
    chartContainerProps,
    barPlotProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    overlayProps,
    chartsAxisProps,
    axisHighlightProps,
    legendProps,
    children,
  } = useBarChartProps(props);
  const { chartDataProviderProps, chartsSurfaceProps } = useChartContainerProps(
    chartContainerProps,
    ref,
  );

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;
  const Toolbar = props.slots?.toolbar;

  return (
    <ChartDataProvider<'bar', BarChartPluginSignatures> {...chartDataProviderProps}>
      <ChartsWrapper {...chartsWrapperProps}>
        {props.showToolbar && Toolbar ? <Toolbar {...props.slotProps?.toolbar} /> : null}
        {!props.hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsSurface {...chartsSurfaceProps}>
          <ChartsGrid {...gridProps} />
          <g {...clipPathGroupProps}>
            <BarPlot {...barPlotProps} />
            <ChartsOverlay {...overlayProps} />
            <ChartsAxisHighlight {...axisHighlightProps} />
            <FocusedBar />
          </g>
          <ChartsAxis {...chartsAxisProps} />
          <ChartsClipPath {...clipPathProps} />
          {children}
        </ChartsSurface>
        {!props.loading && <Tooltip {...props.slotProps?.tooltip} />}
      </ChartsWrapper>
    </ChartDataProvider>
  );
});

BarChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.object,
  }),
  /**
   * The configuration of axes highlight.
   * Default is set to 'band' in the bar direction.
   * Depends on `layout` prop.
   * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
   */
  axisHighlight: PropTypes.shape({
    x: PropTypes.oneOf(['band', 'line', 'none']),
    y: PropTypes.oneOf(['band', 'line', 'none']),
  }),
  /**
   * @deprecated Use `barLabel` in the chart series instead.
   * If provided, the function will be used to format the label of the bar.
   * It can be set to 'value' to display the current value.
   * @param {BarItem} item The item to format.
   * @param {BarLabelContext} context data about the bar.
   * @returns {string} The formatted label.
   */
  barLabel: PropTypes.oneOfType([PropTypes.oneOf(['value']), PropTypes.func]),
  /**
   * Defines the border radius of the bar element.
   */
  borderRadius: PropTypes.number,
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
   * Color palette used to colorize multiple series.
   * @default rainbowSurgePalette
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
  enableKeyboardNavigation: PropTypes.bool,
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
    PropTypes.shape({
      dataIndex: PropTypes.number,
      seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      type: PropTypes.oneOf(['bar']).isRequired,
    }),
  ),
  /**
   * If `true`, the legend is not rendered.
   */
  hideLegend: PropTypes.bool,
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
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }),
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: PropTypes.string,
  /**
   * The direction of the bar elements.
   * @default 'vertical'
   */
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  /**
   * If `true`, a loading overlay is displayed.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * Localized text for chart components.
   */
  localeText: PropTypes.object,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   *
   * Accepts a `number` to be used on all sides or an object with the optional properties: `top`, `bottom`, `left`, and `right`.
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
   * Callback fired when a bar item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {BarItemIdentifier} barItemIdentifier The bar item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * The callback fired when the tooltip item changes.
   *
   * @param {SeriesItemIdentifier<TSeries> | null} tooltipItem  The newly highlighted item.
   */
  onTooltipItemChange: PropTypes.func,
  /**
   * The type of renderer to use for the bar plot.
   * - `svg-single`: Renders every bar in a `<rect />` element.
   * - `svg-batch`: Batch renders bars in `<path />` elements for better performance with large datasets, at the cost of some limitations.
   *                Read more: https://mui.com/x/react-charts/bars/#performance
   *
   * @default 'svg-single'
   */
  renderer: PropTypes.oneOf(['svg-batch', 'svg-single']),
  /**
   * The series to display in the bar chart.
   * An array of [[BarSeries]] objects.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * If true, shows the default chart toolbar.
   * @default false
   */
  showToolbar: PropTypes.bool,
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
  tooltipItem: PropTypes.shape({
    dataIndex: PropTypes.number.isRequired,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    type: PropTypes.oneOf(['bar']).isRequired,
  }),
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
    PropTypes.oneOfType([
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
        height: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        height: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        height: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        height: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        height: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        height: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        height: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        height: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        height: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
    ]).isRequired,
  ),
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis: PropTypes.arrayOf(
    PropTypes.oneOfType([
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        width: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        width: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        width: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        width: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        width: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        width: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        width: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        width: PropTypes.number,
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
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
          ),
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
        width: PropTypes.number,
      }),
    ]).isRequired,
  ),
} as any;

export { BarChart };
