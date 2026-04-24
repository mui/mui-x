'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import {
  ChartsProvider,
  ChartsSlotsProvider,
  type ChartsProviderProps,
  type ChartAnyPluginSignature,
  type PolarChartSeriesType,
} from '@mui/x-charts/internals';
import { type ChartsRadialDataProviderProps } from '@mui/x-charts/ChartsRadialDataProvider';
import { ChartsLocalizationProvider } from '@mui/x-charts/ChartsLocalizationProvider';
import { ChartsWatermark, defaultSlotsMaterial } from '@mui/x-charts-pro/internals';
import { useLicenseVerifier } from '@mui/x-license/internals';
import { type ChartsSlotPropsPro, type ChartsSlotsPro } from '@mui/x-charts-pro/internals';
import { useChartsRadialDataProviderPremiumProps } from './useChartsRadialDataProviderPremiumProps';
import {
  RADIAL_PREMIUM_PLUGINS,
  type RadialPremiumPluginSignatures,
} from './ChartsRadialDataProviderPremium.plugins';

const packageInfo = {
  releaseDate: '__RELEASE_INFO__',
  version: process.env.MUI_VERSION!,
  name: 'x-charts-premium' as const,
};

export interface ChartsRadialDataProviderPremiumSlots extends ChartsSlotsPro {}

export interface ChartsRadialDataProviderPremiumSlotProps extends ChartsSlotPropsPro {}

export type ChartsRadialDataProviderPremiumProps<
  SeriesType extends PolarChartSeriesType = PolarChartSeriesType,
  TSignatures extends
    readonly ChartAnyPluginSignature[] = RadialPremiumPluginSignatures<SeriesType>,
> = ChartsRadialDataProviderProps<SeriesType, TSignatures> &
  ChartsProviderProps<SeriesType, TSignatures>['pluginParams'] & {
    /**
     * Slots to customize charts' components.
     */
    slots?: Partial<ChartsRadialDataProviderPremiumSlots>;
    /**
     * The props for the slots.
     */
    slotProps?: Partial<ChartsRadialDataProviderPremiumSlotProps>;
  };

/**
 * Orchestrates the data providers for radial chart components and hooks.
 *
 * Similar to `ChartsDataProviderPremium`, but uses the radial axis plugin instead of the cartesian one,
 * and only supports polar series types.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/react-charts/composition/)
 *
 * API:
 *
 * - [ChartsRadialDataProviderPremium API](https://mui.com/x/api/charts/charts-radial-data-provider-premium/)
 */
function ChartsRadialDataProviderPremium<
  SeriesType extends PolarChartSeriesType = PolarChartSeriesType,
  TSignatures extends
    readonly ChartAnyPluginSignature[] = RadialPremiumPluginSignatures<SeriesType>,
>(props: ChartsRadialDataProviderPremiumProps<SeriesType, TSignatures>) {
  const { children, localeText, chartProviderProps, slots, slotProps } =
    useChartsRadialDataProviderPremiumProps({
      ...props,
      plugins: props.plugins ?? RADIAL_PREMIUM_PLUGINS,
    });

  useLicenseVerifier(packageInfo);

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
      <ChartsWatermark packageInfo={packageInfo} />
    </ChartsProvider>
  );
}

ChartsRadialDataProviderPremium.propTypes = {
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

export { ChartsRadialDataProviderPremium };
