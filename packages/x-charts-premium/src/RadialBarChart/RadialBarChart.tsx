'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
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
import { ChartsLegend, type ChartsLegendSlots, type ChartsLegendSlotProps } from '../ChartsLegend';
import { ChartsSurface } from '../ChartsSurface';
import {
  ChartsTooltip,
  type ChartsTooltipSlots,
  type ChartsTooltipSlotProps,
} from '../ChartsTooltip';
import { ChartsWrapper } from '../ChartsWrapper';
import { ChartsClipPath } from '../ChartsClipPath';
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
import type { RadialBarSeriesType } from '../models/seriesType/radialBar';
import { type RadialBarChartPluginSignatures } from './RadialBarChart.plugins';
import { RadialBarPlot } from './RadialBarPlot';
import { useRadialBarChartProps } from './useRadialBarChartProps';

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
    chartsWrapperProps,
    chartsContainerProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    overlayProps,
    legendProps,
    children,
  } = useRadialBarChartProps(props);

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
  radiusAxis: PropTypes.arrayOf(PropTypes.object),
  /**
   * The configuration of the rotation-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  rotationAxis: PropTypes.arrayOf(PropTypes.object),
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
