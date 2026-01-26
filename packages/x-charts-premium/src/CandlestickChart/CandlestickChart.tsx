import * as React from 'react';
import PropTypes from 'prop-types';
import {
  ChartsAxis,
  type ChartsAxisProps,
  type ChartsAxisSlotProps,
  type ChartsAxisSlots,
} from '@mui/x-charts/ChartsAxis';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { ChartsGrid, type ChartsGridProps } from '@mui/x-charts/ChartsGrid';
import {
  ChartsTooltip,
  type ChartsTooltipSlots,
  type ChartsTooltipSlotProps,
} from '@mui/x-charts/ChartsTooltip';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import {
  ChartsOverlay,
  type ChartsOverlayProps,
  type ChartsOverlaySlotProps,
  type ChartsOverlaySlots,
} from '@mui/x-charts/ChartsOverlay';
import type { MakeOptional } from '@mui/x-internals/types';
import { useThemeProps } from '@mui/material/styles';
import { type ChartsSlotProps, type ChartsSlots } from '@mui/x-charts/internals';
import {
  ChartsAxisHighlight,
  type ChartsAxisHighlightProps,
} from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsSvgLayer } from '@mui/x-charts/ChartsSvgLayer';
import { ChartsWebGlLayer } from '@mui/x-charts/ChartsWebGlLayer';
import { ChartDataProviderPremium } from '../ChartDataProviderPremium';
import { type OHLCSeriesType } from '../models';
import { type CandlestickChartPluginSignatures } from './CandlestickChart.plugins';
import { CandlestickPlot, type CandlestickPlotProps } from './CandlestickPlot';
import { useCandlestickChartProps } from './useCandlestickChartProps';
import { useChartsContainerPremiumProps } from '../ChartsContainerPremium/useChartsContainerPremiumProps';
import { type ChartsContainerPremiumProps } from '../ChartsContainerPremium';

export interface CandlestickChartSlots
  extends ChartsAxisSlots, ChartsOverlaySlots, ChartsTooltipSlots, Partial<ChartsSlots> {}
export interface CandlestickChartSlotProps
  extends
    ChartsAxisSlotProps,
    ChartsOverlaySlotProps,
    ChartsTooltipSlotProps,
    Partial<ChartsSlotProps> {}

export type OHLCSeries = MakeOptional<OHLCSeriesType, 'type'>;

export interface CandlestickChartProps
  extends
    Omit<
      ChartsContainerPremiumProps<'ohlc', CandlestickChartPluginSignatures>,
      'series' | 'plugins' | 'experimentalFeatures'
    >,
    Omit<ChartsAxisProps, 'slots' | 'slotProps'>,
    Omit<CandlestickPlotProps, 'slots' | 'slotProps'>,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'> {
  /**
   * The series to display in the bar chart.
   * An array of [[OHLCSeries]] objects.
   */
  series: ReadonlyArray<OHLCSeries>;
  /**
   * Option to display a cartesian grid in the background.
   */
  grid?: Pick<ChartsGridProps, 'vertical' | 'horizontal'>;
  /**
   * The configuration of axes highlight.
   * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
   * @default { x: 'line', y: 'line' }
   */
  axisHighlight?: ChartsAxisHighlightProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: CandlestickChartSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: CandlestickChartSlotProps;
}

/**
 * Demos:
 *
 * - [Candlestick](https://mui.com/x/react-charts/candlestick/)
 *
 * API:
 *
 * - [CandlestickChart API](https://mui.com/x/api/charts/candlestick/)
 */
const CandlestickChart = React.forwardRef(function CandlestickChart(
  inProps: CandlestickChartProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiCandlestickChart' });
  const {
    chartsWrapperProps,
    chartContainerProps,
    candlestickPlotProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    overlayProps,
    chartsAxisProps,
    axisHighlightProps,
    children,
  } = useCandlestickChartProps(props);
  const { chartDataProviderPremiumProps, chartsSurfaceProps } = useChartsContainerPremiumProps(
    chartContainerProps,
    ref,
  );

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;

  return (
    <ChartDataProviderPremium<'ohlc', CandlestickChartPluginSignatures>
      {...chartDataProviderPremiumProps}
    >
      <ChartsWrapper {...chartsWrapperProps}>
        <ChartsLayerContainer>
          <ChartsWebGlLayer>
            <CandlestickPlot {...candlestickPlotProps} />
          </ChartsWebGlLayer>
          <ChartsSvgLayer {...chartsSurfaceProps}>
            <ChartsGrid {...gridProps} />
            <g {...clipPathGroupProps}>
              <ChartsOverlay {...overlayProps} />
              <ChartsAxisHighlight {...axisHighlightProps} />
            </g>
            <ChartsAxis {...chartsAxisProps} />
            <ChartsClipPath {...clipPathProps} />
            {children}
          </ChartsSvgLayer>
        </ChartsLayerContainer>
        {!props.loading && (
          <Tooltip
            // TODO: Do we want trigger item to be the default?
            trigger="item"
            {...props.slotProps?.tooltip}
          />
        )}
      </ChartsWrapper>
    </ChartDataProviderPremium>
  );
});

CandlestickChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.shape({
      setAxisZoomData: PropTypes.func.isRequired,
      setZoomData: PropTypes.func.isRequired,
    }),
  }),
  /**
   * A gap added between axes when multiple axes are rendered on the same side of the chart.
   * @default 0
   */
  axesGap: PropTypes.number,
  /**
   * The configuration of axes highlight.
   * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
   * @default { x: 'line', y: 'line' }
   */
  axisHighlight: PropTypes.shape({
    x: PropTypes.oneOf(['band', 'line', 'none']),
    y: PropTypes.oneOf(['band', 'line', 'none']),
  }),
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
      seriesId: PropTypes.string,
      type: PropTypes.oneOf(['ohlc']).isRequired,
    }),
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
    PropTypes.shape({
      dataIndex: PropTypes.number,
      seriesId: PropTypes.string,
      type: PropTypes.oneOf(['ohlc']).isRequired,
    }),
  ),
  /**
   * The list of zoom data related to each axis.
   * Used to initialize the zoom in a specific configuration without controlling it.
   */
  initialZoom: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      end: PropTypes.number.isRequired,
      start: PropTypes.number.isRequired,
    }),
  ),
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
   * The function called when the pointer position corresponds to a new axis data item.
   * This update can either be caused by a pointer movement, or an axis update.
   * In case of multiple axes, the function is called if at least one axis is updated.
   * The argument contains the identifier for all axes with a `data` property.
   * @param {AxisItemIdentifier[]} axisItems The array of axes item identifiers.
   */
  onHighlightedAxisChange: PropTypes.func,
  /**
   * The callback fired when the tooltip item changes.
   *
   * @param {SeriesItemIdentifier<TSeries> | null} tooltipItem  The newly highlighted item.
   */
  onTooltipItemChange: PropTypes.func,
  /**
   * Callback fired when the zoom has changed.
   *
   * @param {ZoomData[]} zoomData Updated zoom data.
   */
  onZoomChange: PropTypes.func,
  /**
   * The series to display in the bar chart.
   * An array of [[OHLCSeries]] objects.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
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
    seriesId: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['ohlc']).isRequired,
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
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
        zoom: PropTypes.oneOfType([
          PropTypes.shape({
            filterMode: PropTypes.oneOf(['discard', 'keep']),
            maxEnd: PropTypes.number,
            maxSpan: PropTypes.number,
            minSpan: PropTypes.number,
            minStart: PropTypes.number,
            panning: PropTypes.bool,
            slider: PropTypes.shape({
              enabled: PropTypes.bool,
              preview: PropTypes.bool,
              showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
              size: PropTypes.number,
            }),
            step: PropTypes.number,
          }),
          PropTypes.bool,
        ]),
      }),
    ]).isRequired,
  ),
  /**
   * The list of zoom data related to each axis.
   */
  zoomData: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      end: PropTypes.number.isRequired,
      start: PropTypes.number.isRequired,
    }),
  ),
  /**
   * Configuration for zoom interactions.
   */
  zoomInteractionConfig: PropTypes.shape({
    pan: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.oneOf(['drag', 'pressAndDrag', 'wheel']),
        PropTypes.shape({
          pointerMode: PropTypes.oneOf(['mouse', 'touch']),
          requiredKeys: PropTypes.arrayOf(PropTypes.string),
          type: PropTypes.oneOf(['drag']).isRequired,
        }),
        PropTypes.shape({
          pointerMode: PropTypes.oneOf(['mouse', 'touch']),
          requiredKeys: PropTypes.arrayOf(PropTypes.string),
          type: PropTypes.oneOf(['pressAndDrag']).isRequired,
        }),
        PropTypes.shape({
          allowedDirection: PropTypes.oneOf(['x', 'xy', 'y']),
          pointerMode: PropTypes.any,
          requiredKeys: PropTypes.arrayOf(PropTypes.string),
          type: PropTypes.oneOf(['wheel']).isRequired,
        }),
      ]).isRequired,
    ),
    zoom: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.oneOf(['brush', 'doubleTapReset', 'pinch', 'tapAndDrag', 'wheel']),
        PropTypes.shape({
          pointerMode: PropTypes.any,
          requiredKeys: PropTypes.arrayOf(PropTypes.string),
          type: PropTypes.oneOf(['wheel']).isRequired,
        }),
        PropTypes.shape({
          pointerMode: PropTypes.any,
          requiredKeys: PropTypes.array,
          type: PropTypes.oneOf(['pinch']).isRequired,
        }),
        PropTypes.shape({
          pointerMode: PropTypes.oneOf(['mouse', 'touch']),
          requiredKeys: PropTypes.arrayOf(PropTypes.string),
          type: PropTypes.oneOf(['tapAndDrag']).isRequired,
        }),
        PropTypes.shape({
          pointerMode: PropTypes.oneOf(['mouse', 'touch']),
          requiredKeys: PropTypes.arrayOf(PropTypes.string),
          type: PropTypes.oneOf(['doubleTapReset']).isRequired,
        }),
        PropTypes.shape({
          pointerMode: PropTypes.any,
          requiredKeys: PropTypes.array,
          type: PropTypes.oneOf(['brush']).isRequired,
        }),
      ]).isRequired,
    ),
  }),
} as any;

export { CandlestickChart };
