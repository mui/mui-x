'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { Watermark } from '@mui/x-license/Watermark';
import {
  ChartProvider,
  AnimationProvider,
  ChartSeriesType,
  ChartAnyPluginSignature,
} from '@mui/x-charts/internals';
import { HighlightedProvider } from '@mui/x-charts/context';
import { ChartDataProviderProps } from '@mui/x-charts/ChartDataProvider';
import { useLicenseVerifier } from '@mui/x-license/useLicenseVerifier';
import { AllPluginSignatures } from '../internals/plugins/allPlugins';
import { useChartDataProviderProProps } from './useChartDataProviderProProps';
import { getReleaseInfo } from '../internals/utils/releaseInfo';

const releaseInfo = getReleaseInfo();
const packageIdentifier = 'x-charts-pro';

export type ChartDataProviderProProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
> = ChartDataProviderProps<TSeries, TSignatures>;

/**
 * Orchestrates the data providers for the chart components and hooks.
 *
 * Use this component if you have custom HTML components that need to access the chart data.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 *
 * API:
 *
 * - [ChartDataProviderPro API](https://mui.com/x/api/charts/chart-data-provider/)
 *
 * @example
 * ```jsx
 * <ChartDataProviderPro
 *   series={[{ label: "Label", type: "bar", data: [10, 20] }]}
 *   xAxis={[{ data: ["A", "B"], scaleType: "band", id: "x-axis" }]}
 * >
 *   <ChartsSurface>
 *      <BarPlot />
 *      <ChartsXAxis position="bottom" axisId="x-axis" />
 *   </ChartsSurface>
 *   {'Custom Legend Component'}
 * </ChartDataProviderPro>
 * ```
 */
function ChartDataProviderPro<TSeries extends ChartSeriesType = ChartSeriesType>(
  props: ChartDataProviderProProps<TSeries>,
) {
  const { children, highlightedProviderProps, animationProviderProps, chartProviderProps } =
    useChartDataProviderProProps(props);

  useLicenseVerifier(packageIdentifier, releaseInfo);

  return (
    <ChartProvider {...chartProviderProps}>
      <HighlightedProvider {...highlightedProviderProps}>
        <AnimationProvider {...animationProviderProps}>
          {children}
          <Watermark packageName={packageIdentifier} releaseInfo={releaseInfo} />
        </AnimationProvider>
      </HighlightedProvider>
    </ChartProvider>
  );
}

ChartDataProviderPro.propTypes = {
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

export { ChartDataProviderPro };
