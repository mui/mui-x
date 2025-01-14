'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useChartDataProviderProps } from './useChartDataProviderProps';
import { AnimationProvider, AnimationProviderProps } from '../AnimationProvider';
import { HighlightedProvider, HighlightedProviderProps } from '../HighlightedProvider';
import { ChartProvider, ChartProviderProps } from '../ChartProvider';
import { ChartSeriesType } from '../../models/seriesType/config';
import { ChartAnyPluginSignature } from '../../internals/plugins/models/plugin';
import { AllPluginSignatures } from '../../internals/plugins/allPlugins';

export type ChartDataProviderProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
> = Omit<
  HighlightedProviderProps &
    AnimationProviderProps &
    ChartProviderProps<TSeries, TSignatures>['pluginParams'],
  'children'
> &
  Pick<ChartProviderProps<TSeries, TSignatures>, 'seriesConfig' | 'plugins'> & {
    children?: React.ReactNode;
  };

/**
 * Orchestrates the data providers for the chart components and hooks.
 *
 * Use this component if you have custom HTML components that need to access the chart data.
 *
 * Demos:
 *
 * - [Composition](http://localhost:3001/x/react-charts/composition/)
 *
 * API:
 *
 * - [ChartDataProvider API](https://mui.com/x/api/charts/chart-data-provider/)
 *
 * @example
 * ```jsx
 * <ChartDataProvider
 *   series={[{ label: "Label", type: "bar", data: [10, 20] }]}
 *   xAxis={[{ data: ["A", "B"], scaleType: "band", id: "x-axis" }]}
 * >
 *   <ChartsSurface>
 *      <BarPlot />
 *      <ChartsXAxis position="bottom" axisId="x-axis" />
 *   </ChartsSurface>
 *   {'Custom Legend Component'}
 * </ChartDataProvider>
 * ```
 */
function ChartDataProvider<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(props: ChartDataProviderProps<TSeries, TSignatures>) {
  const { children, highlightedProviderProps, animationProviderProps, chartProviderProps } =
    useChartDataProviderProps(props);

  return (
    <ChartProvider<TSeries, TSignatures> {...chartProviderProps}>
      <HighlightedProvider {...highlightedProviderProps}>
        <AnimationProvider {...animationProviderProps}>{children}</AnimationProvider>
      </HighlightedProvider>
    </ChartProvider>
  );
}

ChartDataProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.any,
  children: PropTypes.node,
  /**
   * Color palette used to colorize multiple series.
   * @default blueberryTwilightPalette
   */
  colors: PropTypes.any,
  dataset: PropTypes.any,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.any,
  /**
   * The item currently highlighted. Turns highlighting into a controlled prop.
   */
  highlightedItem: PropTypes.any,
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: PropTypes.any,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   */
  margin: PropTypes.any,
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.any,
  /**
   * The array of series to display.
   * Each type of series has its own specificity.
   * Please refer to the appropriate docs page to learn more about it.
   */
  series: PropTypes.any,
  /**
   * If `true`, animations are skipped.
   * If unset or `false`, the animations respects the user's `prefers-reduced-motion` setting.
   */
  skipAnimation: PropTypes.any,
  theme: PropTypes.any,
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.any,
} as any;

export { ChartDataProvider };
