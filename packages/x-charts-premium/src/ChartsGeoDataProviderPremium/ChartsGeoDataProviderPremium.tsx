'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { ChartsProvider, ChartsSlotsProvider } from '@mui/x-charts/internals';
import type {
  ChartsProviderProps,
  ChartAnyPluginSignature,
  ChartSeriesType,
} from '@mui/x-charts/internals';
import { ChartsLocalizationProvider } from '@mui/x-charts/ChartsLocalizationProvider';
import type { ChartsLocalizationProviderProps } from '@mui/x-charts/ChartsLocalizationProvider';
import { ChartsWatermark, defaultSlotsMaterial } from '@mui/x-charts-pro/internals';
import { useLicenseVerifier } from '@mui/x-license/internals';
import type { ChartsSlotPropsPro, ChartsSlotsPro } from '@mui/x-charts-pro/internals';
import { useChartsGeoDataProviderPremiumProps } from './useChartsGeoDataProviderPremiumProps';
import { GEO_PREMIUM_PLUGINS } from './ChartsGeoDataProviderPremium.plugins';
import type { GeoPremiumPluginSignatures } from './ChartsGeoDataProviderPremium.plugins';

const packageInfo = {
  releaseDate: '__RELEASE_INFO__',
  version: process.env.MUI_VERSION!,
  name: 'x-charts-premium' as const,
};

export interface ChartsGeoDataProviderPremiumSlots extends ChartsSlotsPro {}

export interface ChartsGeoDataProviderPremiumSlotProps extends ChartsSlotPropsPro {}

export type ChartsGeoDataProviderPremiumProps<
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = GeoPremiumPluginSignatures<SeriesType>,
> = React.PropsWithChildren<
  ChartsProviderProps<SeriesType, TSignatures>['pluginParams'] &
    Pick<ChartsProviderProps<SeriesType, TSignatures>, 'plugins'>
> &
  ChartsLocalizationProviderProps & {
    /**
     * Slots to customize charts' components.
     */
    slots?: Partial<ChartsGeoDataProviderPremiumSlots>;
    /**
     * The props for the slots.
     */
    slotProps?: Partial<ChartsGeoDataProviderPremiumSlotProps>;
  };

/**
 * Orchestrates the data providers for geographic chart components and hooks.
 *
 * Similar to `ChartsDataProviderPremium`, but tailored to map / geo series.
 *
 * Demos:
 *
 * - [Map](https://mui.com/x/react-charts/map/)
 *
 * API:
 *
 * - [ChartsGeoDataProviderPremium API](https://mui.com/x/api/charts/charts-geo-data-provider-premium/)
 */
function ChartsGeoDataProviderPremium<
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = GeoPremiumPluginSignatures<SeriesType>,
>(props: ChartsGeoDataProviderPremiumProps<SeriesType, TSignatures>) {
  const { children, localeText, chartProviderProps, slots, slotProps } =
    useChartsGeoDataProviderPremiumProps({
      ...props,
      plugins: props.plugins ?? GEO_PREMIUM_PLUGINS,
    });

  useLicenseVerifier(packageInfo);

  return (
    <ChartsProvider<SeriesType, TSignatures> {...chartProviderProps}>
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

ChartsGeoDataProviderPremium.propTypes /* remove-proptypes */ = {
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
  experimentalFeatures: PropTypes.any,
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

export { ChartsGeoDataProviderPremium };
