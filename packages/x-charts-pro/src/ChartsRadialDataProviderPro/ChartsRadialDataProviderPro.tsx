'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import {
  ChartsProvider,
  ChartsSlotsProvider,
  type ChartAnyPluginSignature,
  type ChartsProviderProps,
  type PolarChartSeriesType,
} from '@mui/x-charts/internals';
import {
  defaultSlotsMaterial,
  type ChartsSlotPropsPro,
  type ChartsSlotsPro,
} from '../internals/material';
import {
  ChartsLocalizationProvider,
  type ChartsLocalizationProviderProps,
} from '../ChartsLocalizationProvider';
import { useChartsRadialDataProviderProProps } from './useChartsRadialDataProviderProProps';
import { type RadialProPluginSignatures } from './ChartsRadialDataProviderPro.plugins';

export interface ChartsRadialDataProviderProSlots extends ChartsSlotsPro {}

export interface ChartsRadialDataProviderProSlotProps extends ChartsSlotPropsPro {}

export type ChartsRadialDataProviderProProps<
  SeriesType extends PolarChartSeriesType = PolarChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = RadialProPluginSignatures<SeriesType>,
> = React.PropsWithChildren<
  ChartsProviderProps<SeriesType, TSignatures>['pluginParams'] &
    Pick<ChartsProviderProps<SeriesType, TSignatures>, 'plugins'>
> &
  ChartsLocalizationProviderProps & {
    /**
     * Slots to customize charts' components.
     */
    slots?: Partial<ChartsRadialDataProviderProSlots>;
    /**
     * The props for the slots.
     */
    slotProps?: Partial<ChartsRadialDataProviderProSlotProps>;
  };

/**
 * Orchestrates the data providers for radial chart components and hooks.
 *
 * Similar to `ChartsDataProvider`, but uses the radial axis plugin instead of the cartesian one,
 * and only supports the line series config.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/react-charts/composition/)
 *
 * API:
 *
 * - [ChartsRadialDataProviderPro API](https://mui.com/x/api/charts/charts-radial-data-provider/)
 */
function ChartsRadialDataProviderPro<
  SeriesType extends PolarChartSeriesType = PolarChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = RadialProPluginSignatures<SeriesType>,
>(props: ChartsRadialDataProviderProProps<SeriesType, TSignatures>) {
  const { children, localeText, chartProviderProps, slots, slotProps } =
    useChartsRadialDataProviderProProps(props);

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
    </ChartsProvider>
  );
}

ChartsRadialDataProviderPro.propTypes = {
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

export { ChartsRadialDataProviderPro as Unstable_ChartsRadialDataProviderPro };
