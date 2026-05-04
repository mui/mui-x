'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { useThemeProps } from '@mui/material/styles';
import { type MakeOptional } from '@mui/x-internals/types';
import {
  useChartsContainerProps,
  type ChartsSlots,
  type ChartsSlotProps,
} from '@mui/x-charts/internals';
import {
  Unstable_ChartsRadialGrid as ChartsRadialGrid,
  type ChartsRadialGridProps,
} from '@mui/x-charts/ChartsRadialGrid';
import {
  ChartsLegend,
  type ChartsLegendSlots,
  type ChartsLegendSlotProps,
  type ChartsLegendSlotExtension,
} from '../ChartsLegend';
import { ChartsSurface } from '../ChartsSurface';
import {
  ChartsTooltip,
  type ChartsTooltipSlots,
  type ChartsTooltipSlotProps,
} from '../ChartsTooltip';
import { ChartsWrapper, type ChartsWrapperProps } from '../ChartsWrapper';
import { ChartsClipPath, type ChartsClipPathProps } from '../ChartsClipPath';
import {
  ChartsOverlay,
  type ChartsOverlayProps,
  type ChartsOverlaySlots,
  type ChartsOverlaySlotProps,
} from '../ChartsOverlay';
import { type ChartsToolbarSlots, type ChartsToolbarSlotProps } from '../Toolbar';
import { radialBarSeriesConfig } from './seriesConfig';
import {
  ChartsRadialDataProviderPremium,
  type ChartsRadialDataProviderPremiumProps,
} from '../ChartsRadialDataProviderPremium';
import { type ChartsRadialDataProviderProps } from '../ChartsRadialDataProvider';
import type { RadialBarSeriesType } from '../models/seriesType/radialBar';
import { DEFAULT_ROTATION_AXIS_KEY } from '../constants';
import {
  RADIAL_BAR_CHART_PLUGINS,
  type RadialBarChartPluginSignatures,
} from './RadialBarChart.plugins';
import { RadialBarPlot } from './RadialBarPlot';

export type RadialBarSeries = MakeOptional<RadialBarSeriesType, 'type'>;

export interface RadialBarChartSlots
  extends
    ChartsLegendSlots,
    ChartsOverlaySlots,
    ChartsTooltipSlots,
    ChartsToolbarSlots,
    Partial<ChartsSlots> {}
export interface RadialBarChartSlotProps
  extends
    ChartsLegendSlotProps,
    ChartsOverlaySlotProps,
    ChartsTooltipSlotProps,
    ChartsToolbarSlotProps,
    Partial<ChartsSlotProps> {}

export interface RadialBarChartProps
  extends
    Omit<
      ChartsRadialDataProviderPremiumProps<'radialBar', RadialBarChartPluginSignatures>,
      'series' | 'plugins' | 'zAxis' | 'slots' | 'slotProps'
    >,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'> {
  /**
   * The series to display in the radial bar chart.
   * An array of [[RadialBarSeries]] objects.
   */
  series: Readonly<RadialBarSeries[]>;
  /**
   * Option to display a radial grid in the background.
   */
  grid?: Pick<ChartsRadialGridProps, 'radius' | 'rotation'>;
  /**
   * If `true`, the legend is not rendered.
   */
  hideLegend?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: RadialBarChartSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: RadialBarChartSlotProps;
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
  /**
   * If true, shows the default chart toolbar.
   * @default false
   */
  showToolbar?: boolean;
}

const seriesConfig = { radialBar: radialBarSeriesConfig };

/**
 * Demos:
 *
 * - [Radial bar demonstration](https://mui.com/x/react-charts/radial-bar/)
 *
 * API:
 *
 * - [RadialBarChart API](https://mui.com/x/api/charts/radial-bar-chart/)
 */
const RadialBarChart = React.forwardRef(function RadialBarChart(
  inProps: RadialBarChartProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiRadialBarChart' });
  const {
    rotationAxis,
    radiusAxis,
    series,
    width,
    height,
    margin,
    colors,
    dataset,
    hideLegend,
    grid,
    children,
    slots,
    slotProps,
    skipAnimation,
    loading,
    showToolbar,
    ...other
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const seriesWithDefault = React.useMemo(
    () =>
      series.map((s) => ({
        type: 'radialBar' as const,
        ...s,
      })),
    [series],
  );

  const chartsContainerProps: ChartsRadialDataProviderProps<
    'radialBar',
    RadialBarChartPluginSignatures
  > = {
    ...other,
    series: seriesWithDefault,
    width,
    height,
    margin,
    colors,
    dataset,
    rotationAxis: rotationAxis ?? [
      {
        id: DEFAULT_ROTATION_AXIS_KEY,
        scaleType: 'band',
        data: Array.from(
          { length: Math.max(...series.map((s) => (s.data ?? dataset ?? []).length)) },
          (_, index) => index,
        ),
      },
    ],
    radiusAxis,
    skipAnimation,
    plugins: RADIAL_BAR_CHART_PLUGINS,
  };

  const gridProps: ChartsRadialGridProps | undefined = grid;

  const clipPathGroupProps = {
    clipPath: `url(#${clipPathId})`,
  };

  const clipPathProps: ChartsClipPathProps = {
    id: clipPathId,
  };

  const overlayProps: ChartsOverlayProps = {
    slots,
    slotProps,
    loading,
  };

  const legendProps: ChartsLegendSlotExtension = {
    slots,
    slotProps,
  };

  const chartsWrapperProps: Omit<ChartsWrapperProps, 'children'> = {
    legendPosition: props.slotProps?.legend?.position,
    legendDirection: props.slotProps?.legend?.direction,
    hideLegend: props.hideLegend ?? false,
  };

  const { chartsDataProviderProps, chartsSurfaceProps } = useChartsContainerProps<
    'radialBar',
    RadialBarChartPluginSignatures
  >(chartsContainerProps);

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;
  const Toolbar = props.slots?.toolbar;

  return (
    <ChartsRadialDataProviderPremium<'radialBar', RadialBarChartPluginSignatures>
      {...chartsDataProviderProps}
      seriesConfig={seriesConfig}
    >
      <ChartsWrapper {...chartsWrapperProps} ref={ref}>
        {props.showToolbar && Toolbar ? <Toolbar {...props.slotProps?.toolbar} /> : null}
        {!props.hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsSurface {...chartsSurfaceProps}>
          <ChartsRadialGrid {...gridProps} />
          <g {...clipPathGroupProps}>
            <RadialBarPlot />
            <ChartsOverlay {...overlayProps} />
          </g>
          <ChartsClipPath {...clipPathProps} />
          {children}
        </ChartsSurface>
        {!props.loading && <Tooltip {...props.slotProps?.tooltip} />}
      </ChartsWrapper>
    </ChartsRadialDataProviderPremium>
  );
});

RadialBarChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.shape({
      exportAsImage: PropTypes.func.isRequired,
      exportAsPrint: PropTypes.func.isRequired,
    }),
  }),
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
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
  /**
   * If `true`, disables keyboard navigation for the chart.
   */
  disableKeyboardNavigation: PropTypes.bool,
  /**
   * Options to enable features planned for the next major.
   */
  experimentalFeatures: PropTypes.object,
  /**
   * Option to display a radial grid in the background.
   */
  grid: PropTypes.shape({
    radius: PropTypes.bool,
    rotation: PropTypes.bool,
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
        type: PropTypes.oneOf(['radialBar']),
      }),
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['radialBar']).isRequired,
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
      dataIndex: PropTypes.number.isRequired,
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['radialBar']).isRequired,
    }),
    PropTypes.shape({
      dataIndex: PropTypes.number.isRequired,
      seriesId: PropTypes.string.isRequired,
    }),
  ]),
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
        type: PropTypes.oneOf(['radialBar']),
      }),
      PropTypes.shape({
        dataIndex: PropTypes.number,
        seriesId: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['radialBar']).isRequired,
      }),
    ]).isRequired,
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
   * The callback fired when the tooltip item changes.
   *
   * @param {SeriesItemIdentifier<SeriesType> | null} tooltipItem  The newly highlighted item.
   */
  onTooltipItemChange: PropTypes.func,
  /**
   * The configuration of the radial-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  radiusAxis: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
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
        maxRadius: PropTypes.number,
        minRadius: PropTypes.number,
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
        maxRadius: PropTypes.number,
        minRadius: PropTypes.number,
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
        maxRadius: PropTypes.number,
        min: PropTypes.number,
        minRadius: PropTypes.number,
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
        maxRadius: PropTypes.number,
        min: PropTypes.number,
        minRadius: PropTypes.number,
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
        maxRadius: PropTypes.number,
        min: PropTypes.number,
        minRadius: PropTypes.number,
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
        maxRadius: PropTypes.number,
        min: PropTypes.number,
        minRadius: PropTypes.number,
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
        maxRadius: PropTypes.number,
        min: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.shape({
            valueOf: PropTypes.func.isRequired,
          }),
        ]),
        minRadius: PropTypes.number,
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
        maxRadius: PropTypes.number,
        min: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.shape({
            valueOf: PropTypes.func.isRequired,
          }),
        ]),
        minRadius: PropTypes.number,
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
        maxRadius: PropTypes.number,
        min: PropTypes.number,
        minRadius: PropTypes.number,
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
   * The configuration of the rotation-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  rotationAxis: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
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
        endAngle: PropTypes.number,
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
        labelGap: PropTypes.number,
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
        startAngle: PropTypes.number,
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
        endAngle: PropTypes.number,
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
        labelGap: PropTypes.number,
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
        startAngle: PropTypes.number,
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
        endAngle: PropTypes.number,
        height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
        hideTooltip: PropTypes.bool,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        ignoreTooltip: PropTypes.bool,
        label: PropTypes.string,
        labelGap: PropTypes.number,
        labelStyle: PropTypes.object,
        max: PropTypes.number,
        min: PropTypes.number,
        offset: PropTypes.number,
        position: PropTypes.oneOf(['bottom', 'none', 'top']),
        reverse: PropTypes.bool,
        scaleType: PropTypes.oneOf(['log']),
        slotProps: PropTypes.object,
        slots: PropTypes.object,
        startAngle: PropTypes.number,
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
        endAngle: PropTypes.number,
        height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
        hideTooltip: PropTypes.bool,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        ignoreTooltip: PropTypes.bool,
        label: PropTypes.string,
        labelGap: PropTypes.number,
        labelStyle: PropTypes.object,
        max: PropTypes.number,
        min: PropTypes.number,
        offset: PropTypes.number,
        position: PropTypes.oneOf(['bottom', 'none', 'top']),
        reverse: PropTypes.bool,
        scaleType: PropTypes.oneOf(['symlog']),
        slotProps: PropTypes.object,
        slots: PropTypes.object,
        startAngle: PropTypes.number,
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
        endAngle: PropTypes.number,
        height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
        hideTooltip: PropTypes.bool,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        ignoreTooltip: PropTypes.bool,
        label: PropTypes.string,
        labelGap: PropTypes.number,
        labelStyle: PropTypes.object,
        max: PropTypes.number,
        min: PropTypes.number,
        offset: PropTypes.number,
        position: PropTypes.oneOf(['bottom', 'none', 'top']),
        reverse: PropTypes.bool,
        scaleType: PropTypes.oneOf(['pow']),
        slotProps: PropTypes.object,
        slots: PropTypes.object,
        startAngle: PropTypes.number,
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
        endAngle: PropTypes.number,
        height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
        hideTooltip: PropTypes.bool,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        ignoreTooltip: PropTypes.bool,
        label: PropTypes.string,
        labelGap: PropTypes.number,
        labelStyle: PropTypes.object,
        max: PropTypes.number,
        min: PropTypes.number,
        offset: PropTypes.number,
        position: PropTypes.oneOf(['bottom', 'none', 'top']),
        reverse: PropTypes.bool,
        scaleType: PropTypes.oneOf(['sqrt']),
        slotProps: PropTypes.object,
        slots: PropTypes.object,
        startAngle: PropTypes.number,
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
        endAngle: PropTypes.number,
        height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
        hideTooltip: PropTypes.bool,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        ignoreTooltip: PropTypes.bool,
        label: PropTypes.string,
        labelGap: PropTypes.number,
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
        startAngle: PropTypes.number,
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
        endAngle: PropTypes.number,
        height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
        hideTooltip: PropTypes.bool,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        ignoreTooltip: PropTypes.bool,
        label: PropTypes.string,
        labelGap: PropTypes.number,
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
        startAngle: PropTypes.number,
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
        endAngle: PropTypes.number,
        height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
        hideTooltip: PropTypes.bool,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        ignoreTooltip: PropTypes.bool,
        label: PropTypes.string,
        labelGap: PropTypes.number,
        labelStyle: PropTypes.object,
        max: PropTypes.number,
        min: PropTypes.number,
        offset: PropTypes.number,
        position: PropTypes.oneOf(['bottom', 'none', 'top']),
        reverse: PropTypes.bool,
        scaleType: PropTypes.oneOf(['linear']),
        slotProps: PropTypes.object,
        slots: PropTypes.object,
        startAngle: PropTypes.number,
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
   * The series to display in the radial bar chart.
   * An array of [[RadialBarSeries]] objects.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * If true, shows the default chart toolbar.
   * @default false
   */
  showToolbar: PropTypes.bool,
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
  theme: PropTypes.oneOf(['dark', 'light']),
  /**
   * The tooltip item.
   * Used when the tooltip is controlled.
   */
  tooltipItem: PropTypes.oneOfType([
    PropTypes.shape({
      dataIndex: PropTypes.number.isRequired,
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['radialBar']).isRequired,
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
} as any;

export { RadialBarChart as Unstable_RadialBarChart };
