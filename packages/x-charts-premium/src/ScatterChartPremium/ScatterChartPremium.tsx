'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import {
  HighlightedScatterMark,
  type ScatterChartProps,
  type ScatterChartSlots,
  type ScatterChartSlotProps,
} from '@mui/x-charts/ScatterChart';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsOverlay } from '@mui/x-charts/ChartsOverlay';
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsTooltip, type ChartsTooltipProps } from '@mui/x-charts/ChartsTooltip';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsBrushOverlay } from '@mui/x-charts/ChartsBrushOverlay';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsSvgLayer } from '@mui/x-charts/ChartsSvgLayer';
import { useScatterChartProps } from '@mui/x-charts/internals';
import {
  type ChartsToolbarProSlotProps,
  type ChartsToolbarProSlots,
} from '@mui/x-charts-pro/ChartsToolbarPro';
import { ChartsZoomSlider } from '@mui/x-charts-pro/ChartsZoomSlider';
import { type ChartsSlotPropsPro, type ChartsSlotsPro } from '@mui/x-charts-pro/internals';
import { ChartsDataProviderPremium } from '../ChartsDataProviderPremium';
import { useChartsContainerPremiumProps } from '../ChartsContainerPremium/useChartsContainerPremiumProps';
import { type ChartsContainerPremiumProps } from '../ChartsContainerPremium';
import { ChartsToolbarPro } from '../ChartsToolbarPro';
import { ScatterPlotPremium } from './ScatterPlotPremium';
import {
  SCATTER_CHART_PREMIUM_PLUGINS,
  type ScatterChartPremiumPluginSignatures,
} from './ScatterChartPremium.plugins';
import { ChartsWebGLLayer } from '../ChartsWebGLLayer';

export interface ScatterChartPremiumSlots
  extends Omit<ScatterChartSlots, 'toolbar'>, ChartsToolbarProSlots, Partial<ChartsSlotsPro> {}

export interface ScatterChartPremiumSlotProps
  extends
    Omit<ScatterChartSlotProps, 'toolbar' | 'tooltip'>,
    ChartsToolbarProSlotProps,
    Partial<ChartsSlotPropsPro> {
  tooltip?: Partial<ChartsTooltipProps<'item' | 'none'>>;
}

export interface ScatterChartPremiumProps
  extends
    Omit<
      ScatterChartProps,
      'apiRef' | 'slots' | 'slotProps' | 'plugins' | 'seriesConfig' | 'renderer'
    >,
    Omit<
      ChartsContainerPremiumProps<'scatter', ScatterChartPremiumPluginSignatures>,
      | 'series'
      | 'onItemClick'
      | 'slots'
      | 'slotProps'
      | 'highlightedAxis'
      | 'onHighlightedAxisChange'
    > {
  /**
   * The renderer to use for drawing the scatter points.
   * - `svg-single`: Renders each point as its own SVG element (full interactivity).
   * - `svg-batch`: Renders points in a batched SVG path (faster, reduced interactivity).
   * - `webgl`: Renders points into a WebGL canvas (fastest, no per-item SVG interactivity).
   * @default 'svg-single'
   */
  renderer?: 'svg-single' | 'svg-batch' | 'webgl';
  slots?: ScatterChartPremiumSlots;
  slotProps?: ScatterChartPremiumSlotProps;
}

const ScatterChartPremium = React.forwardRef(function ScatterChartPremium(
  inProps: ScatterChartPremiumProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiScatterChartPremium' });
  const {
    initialZoom,
    zoomData,
    onZoomChange,
    apiRef,
    showToolbar,
    renderer = 'svg-single',
    ...other
  } = props;

  const {
    chartsWrapperProps,
    chartsContainerProps,
    chartsAxisProps,
    gridProps,
    scatterPlotProps,
    overlayProps,
    legendProps,
    axisHighlightProps,
    children,
  } = useScatterChartProps({
    ...other,
    // webgl has no per-item DOM events (same as 'svg-batch'), so route click handling
    // through voronoi by passing 'svg-batch' through to useScatterChartProps.
    renderer: renderer === 'webgl' ? 'svg-batch' : renderer,
  });

  const { chartsDataProviderPremiumProps, chartsSurfaceProps } = useChartsContainerPremiumProps<
    'scatter',
    ScatterChartPremiumPluginSignatures
  >({
    ...chartsContainerProps,
    initialZoom,
    zoomData,
    onZoomChange,
    apiRef,
    plugins: SCATTER_CHART_PREMIUM_PLUGINS,
  });

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;
  const Toolbar = props.slots?.toolbar ?? ChartsToolbarPro;
  const { className: chartsLayerContainerClassName, ...chartsSvgLayerProps } = chartsSurfaceProps;

  return (
    <ChartsDataProviderPremium<'scatter', ScatterChartPremiumPluginSignatures>
      {...chartsDataProviderPremiumProps}
    >
      <ChartsWrapper {...chartsWrapperProps} ref={ref}>
        {showToolbar ? <Toolbar {...props.slotProps?.toolbar} /> : null}
        {!props.hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsLayerContainer className={chartsLayerContainerClassName}>
          <ChartsSvgLayer>
            <ChartsGrid {...gridProps} />
          </ChartsSvgLayer>
          {renderer === 'webgl' && (
            <ChartsWebGLLayer>
              <ScatterPlotPremium {...scatterPlotProps} renderer={renderer} />
            </ChartsWebGLLayer>
          )}
          <ChartsSvgLayer {...chartsSvgLayerProps}>
            <ChartsAxis {...chartsAxisProps} />
            <ChartsZoomSlider />
            {renderer !== 'webgl' && (
              <g data-drawing-container>
                <ScatterPlotPremium {...scatterPlotProps} renderer={renderer} />
              </g>
            )}
            {renderer === 'webgl' && (
              <g data-drawing-container>
                <HighlightedScatterMark />
              </g>
            )}
            <ChartsOverlay {...overlayProps} />
            <ChartsAxisHighlight {...axisHighlightProps} />
            <ChartsBrushOverlay />
            {children}
          </ChartsSvgLayer>
        </ChartsLayerContainer>
        {!props.loading && <Tooltip trigger="item" {...props.slotProps?.tooltip} />}
      </ChartsWrapper>
    </ChartsDataProviderPremium>
  );
});

ScatterChartPremium.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.shape({
      exportAsImage: PropTypes.func.isRequired,
      exportAsPrint: PropTypes.func.isRequired,
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
   * @default { x: 'none', y: 'none' }
   */
  axisHighlight: PropTypes.shape({
    x: PropTypes.oneOf(['band', 'line', 'none']),
    y: PropTypes.oneOf(['band', 'line', 'none']),
  }),
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
  /**
   * The description of the chart.
   * Used to provide an accessible description for the chart.
   */
  desc: PropTypes.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
  /**
   * If true, the closest point interaction is disabled and falls back to hover events.
   * @default false
   * @deprecated Use `disableHitArea` instead.
   */
  disableClosestPoint: PropTypes.bool,
  /**
   * If true, the hit area interaction is disabled and falls back to hover events.
   * @default false
   */
  disableHitArea: PropTypes.bool,
  /**
   * If `true`, disables keyboard navigation for the chart.
   */
  disableKeyboardNavigation: PropTypes.bool,
  /**
   * If true, the interaction will not use the Voronoi cell and fall back to hover events.
   * @default false
   * @deprecated Use `disableHitArea` instead.
   */
  disableVoronoi: PropTypes.bool,
  /**
   * Options to enable features planned for the next major.
   */
  experimentalFeatures: PropTypes.object,
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
    PropTypes.oneOfType([
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['scatter']),
      }),
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['scatter']).isRequired,
      }),
    ]).isRequired,
  ),
  /**
   * If `true`, the legend is not rendered.
   */
  hideLegend: PropTypes.bool,
  /**
   * The highlighted item.
   * Used when the highlight is controlled.
   */
  highlightedItem: PropTypes.oneOfType([
    PropTypes.shape({
      dataIndex: PropTypes.number,
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['scatter']).isRequired,
    }),
    PropTypes.shape({
      dataIndex: PropTypes.number,
      seriesId: PropTypes.string.isRequired,
    }),
  ]),
  /**
   * Defines the maximum distance between a scatter point and the pointer that triggers the interaction.
   * If set to `'item'`, the radius is the `markerSize`.
   * If `undefined`, the radius is assumed to be infinite.
   */
  hitAreaRadius: PropTypes.oneOfType([PropTypes.oneOf(['item']), PropTypes.number]),
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
        seriesId: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['scatter']),
      }),
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['scatter']).isRequired,
      }),
    ]).isRequired,
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
   * @param {VisibilityIdentifierWithType[]} hiddenItems The new list of hidden identifiers.
   */
  onHiddenItemsChange: PropTypes.func,
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemIdentifierWithType<SeriesType> | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element if using hit area interaction. Or the Mouse event from the scatter element, when `disableHitArea=true`.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * The function called when the pointer position corresponds to a new axis data item.
   * This update can either be caused by a pointer movement, or an axis update.
   * In case of multiple axes, the function is called if at least one axis is updated.
   * The argument contains the identifier for all axes with a `data` property.
   * @param {AxisItemIdentifier[]} axisItems The array of axes item identifiers.
   */
  onTooltipAxisChange: PropTypes.func,
  /**
   * The callback fired when the tooltip item changes.
   *
   * @param {SeriesItemIdentifier<SeriesType> | null} tooltipItem  The newly highlighted item.
   */
  onTooltipItemChange: PropTypes.func,
  /**
   * Callback fired when the zoom has changed.
   *
   * @param {ZoomData[]} zoomData Updated zoom data.
   */
  onZoomChange: PropTypes.func,
  /**
   * The renderer to use for drawing the scatter points.
   * - `svg-single`: Renders each point as its own SVG element (full interactivity).
   * - `svg-batch`: Renders points in a batched SVG path (faster, reduced interactivity).
   * - `webgl`: Renders points into a WebGL canvas (fastest, no per-item SVG interactivity).
   * @default 'svg-single'
   */
  renderer: PropTypes.oneOf(['svg-batch', 'svg-single', 'webgl']),
  /**
   * The series to display in the scatter chart.
   * An array of [[ScatterSeries]] objects.
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
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  theme: PropTypes.oneOf(['dark', 'light']),
  /**
   * The title of the chart.
   * Used to provide an accessible label for the chart.
   */
  title: PropTypes.string,
  /**
   * The controlled axis tooltip.
   * Identified by the axis id, and data index.
   */
  tooltipAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      dataIndex: PropTypes.number.isRequired,
    }),
  ),
  /**
   * The tooltip item.
   * Used when the tooltip is controlled.
   */
  tooltipItem: PropTypes.oneOfType([
    PropTypes.shape({
      dataIndex: PropTypes.number.isRequired,
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['scatter']).isRequired,
    }),
    PropTypes.shape({
      dataIndex: PropTypes.number.isRequired,
      seriesId: PropTypes.string.isRequired,
    }),
  ]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
        width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
        width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
        width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
        width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
        width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
        width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
        width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
        width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
        className: PropTypes.string,
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
        valueGetter: PropTypes.func,
        width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
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
              preview: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
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
   * The configuration of the z-axes.
   */
  zAxis: PropTypes.arrayOf(
    PropTypes.shape({
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
      id: PropTypes.string,
      max: PropTypes.number,
      min: PropTypes.number,
      valueGetter: PropTypes.func,
    }),
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
          pointerMode: PropTypes.oneOf(['mouse', 'touch']),
          requiredKeys: PropTypes.arrayOf(PropTypes.string),
          type: PropTypes.oneOf(['brush']).isRequired,
        }),
      ]).isRequired,
    ),
  }),
} as any;

export { ScatterChartPremium };
