'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import {
  defaultSlotsMaterial,
  type ChartsSlotProps,
  type ChartsSlots,
} from '../internals/material';
import { ChartsSlotsProvider } from '../context/ChartsSlotsContext';
import { ChartsProvider, type ChartsProviderProps } from '../context/ChartsProvider';
import { type ChartAnyPluginSignature } from '../internals/plugins/models/plugin';
import {
  ChartsLocalizationProvider,
  type ChartsLocalizationProviderProps,
} from '../ChartsLocalizationProvider';
import { useChartsPolarDataProviderProps } from './useChartsPolarDataProviderProps';
import { type PolarPluginSignatures } from './ChartsPolarDataProvider.plugins';

export interface ChartsPolarDataProviderSlots extends ChartsSlots {}

export interface ChartsPolarDataProviderSlotProps extends ChartsSlotProps {}

export type ChartsPolarDataProviderProps<
  TSignatures extends readonly ChartAnyPluginSignature[] = PolarPluginSignatures,
> = React.PropsWithChildren<
  ChartsProviderProps<'line', TSignatures>['pluginParams'] &
    Pick<ChartsProviderProps<'line', TSignatures>, 'plugins'>
> &
  ChartsLocalizationProviderProps & {
    /**
     * Slots to customize charts' components.
     */
    slots?: Partial<ChartsPolarDataProviderSlots>;
    /**
     * The props for the slots.
     */
    slotProps?: Partial<ChartsPolarDataProviderSlotProps>;
  };

/**
 * Orchestrates the data providers for polar chart components and hooks.
 *
 * Similar to `ChartsDataProvider`, but uses the polar axis plugin instead of the cartesian one,
 * and only supports the line series config.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/react-charts/composition/)
 *
 * API:
 *
 * - [ChartsPolarDataProvider API](https://mui.com/x/api/charts/charts-polar-data-provider/)
 */
function ChartsPolarDataProvider<
  TSignatures extends readonly ChartAnyPluginSignature[] = PolarPluginSignatures,
>(props: ChartsPolarDataProviderProps<TSignatures>) {
  const { children, localeText, chartProviderProps, slots, slotProps } =
    useChartsPolarDataProviderProps(props);

  return (
    <ChartsProvider<'line', TSignatures> {...chartProviderProps}>
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

ChartsPolarDataProvider.propTypes = {
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

export { ChartsPolarDataProvider };
