'use client';
import PropTypes from 'prop-types';
import { Watermark } from '@mui/x-license/Watermark';
import {
  ChartsProvider,
  type ChartSeriesType,
  type ChartAnyPluginSignature,
  type ChartsProviderProps,
  ChartsSlotsProvider,
  type ChartSeriesConfig,
} from '@mui/x-charts/internals';
import { ChartsLocalizationProvider } from '@mui/x-charts/ChartsLocalizationProvider';
import { defaultSlotsMaterial } from '@mui/x-charts-pro/internals';
import { useLicenseVerifier } from '@mui/x-license/useLicenseVerifier';
import {
  type ChartsSlotPropsPro,
  type ChartsSlotsPro,
  defaultSeriesConfigPro,
} from '@mui/x-charts-pro/internals';
import { type ChartsDataProviderProProps } from '@mui/x-charts-pro/ChartsDataProviderPro';
import { rangeBarSeriesConfig } from '../BarChartPremium/RangeBar/seriesConfig';
import { type AllPluginSignatures, DEFAULT_PLUGINS } from '../internals/plugins/allPlugins';
import { useChartsDataProviderPremiumProps } from './useChartsDataProviderPremiumProps';

const releaseInfo = '__RELEASE_INFO__';
const packageIdentifier = 'x-charts-premium';

export interface ChartsDataProviderPremiumSlots extends ChartsSlotsPro {}

export interface ChartsDataProviderPremiumSlotProps extends ChartsSlotPropsPro {}

export type ChartsDataProviderPremiumProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
> = ChartsDataProviderProProps<TSeries, TSignatures> &
  ChartsProviderProps<TSeries, TSignatures>['pluginParams'] & {
    /**
     * Slots to customize charts' components.
     */
    slots?: Partial<ChartsDataProviderPremiumSlots>;
    /**
     * The props for the slots.
     */
    slotProps?: Partial<ChartsDataProviderPremiumSlotProps>;
  };

export const defaultSeriesConfigPremium: ChartSeriesConfig<
  'bar' | 'rangeBar' | 'scatter' | 'line' | 'pie'
> = {
  ...defaultSeriesConfigPro,
  rangeBar: rangeBarSeriesConfig,
};

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
 * - [ChartsDataProviderPremium API](https://mui.com/x/api/charts/charts-data-provider-premium/)
 *
 * @example
 * ```jsx
 * <ChartsDataProviderPremium
 *   series={[{ label: "Label", type: "bar", data: [10, 20] }]}
 *   xAxis={[{ data: ["A", "B"], scaleType: "band", id: "x-axis" }]}
 * >
 *   <ChartsSurface>
 *      <BarPlot />
 *      <ChartsXAxis axisId="x-axis" />
 *   </ChartsSurface>
 *   {'Custom Legend Component'}
 * </ChartsDataProviderPremium>
 * ```
 */
function ChartsDataProviderPremium<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(props: ChartsDataProviderPremiumProps<TSeries, TSignatures>) {
  const { children, localeText, chartProviderProps, slots, slotProps } =
    useChartsDataProviderPremiumProps({
      ...props,
      seriesConfig: props.seriesConfig ?? defaultSeriesConfigPremium,
      plugins: props.plugins ?? DEFAULT_PLUGINS,
    });

  useLicenseVerifier(packageIdentifier, releaseInfo);

  return (
    <ChartsProvider {...chartProviderProps}>
      <ChartsLocalizationProvider localeText={localeText}>
        <ChartsSlotsProvider
          slots={slots}
          slotProps={slotProps}
          defaultSlots={defaultSlotsMaterial}
        >
          {children}
        </ChartsSlotsProvider>
      </ChartsLocalizationProvider>
      <Watermark packageName={packageIdentifier} releaseInfo={releaseInfo} />
    </ChartsProvider>
  );
}

ChartsDataProviderPremium.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.any,
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
   * Options to enable features planned for the next major.
   */
  experimentalFeatures: PropTypes.shape({
    preferStrictDomainInLineCharts: PropTypes.bool,
  }),
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: PropTypes.string,
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
   * The array of series to display.
   * Each type of series has its own specificity.
   * Please refer to the appropriate docs page to learn more about it.
   */
  series: PropTypes.arrayOf(PropTypes.object),
  /**
   * If `true`, animations are skipped.
   * If unset or `false`, the animations respects the user's `prefers-reduced-motion` setting.
   */
  skipAnimation: PropTypes.bool,
  /**
   * The props for the slots.
   */
  slotProps: PropTypes.object,
  /**
   * Slots to customize charts' components.
   */
  slots: PropTypes.object,
  theme: PropTypes.oneOf(['dark', 'light']),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
} as any;

export { ChartsDataProviderPremium };
