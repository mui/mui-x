'use client';
import * as React from 'react';
import { defaultSlotsMaterial } from '../internals/material';
import { ChartsSlotsProvider } from '../context/ChartsSlotsContext';
import { useChartsDataProviderProps } from './useChartsDataProviderProps';
import { ChartsProvider } from '../context/ChartsProvider';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { ChartAnyPluginSignature } from '../internals/plugins/models/plugin';
import type { AllPluginSignatures } from '../internals/plugins/allPlugins';
import { ChartsLocalizationProvider } from '../ChartsLocalizationProvider';
import type { ChartsDataProviderProps } from './ChartsDataProvider';

/**
 * The data provider logic, without defaulting `plugins` to `DEFAULT_PLUGINS`.
 *
 * Chart components render this directly and always pass their own `plugins`
 * list, so the default plugin set — and everything it references (closest-point,
 * progressive rendering, ...) — stays out of their bundles. The public
 * {@link ChartsDataProvider} wraps this and supplies `DEFAULT_PLUGINS` for
 * standalone/composition usage.
 */
export function ChartDataProviderInternal<
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
>(props: ChartsDataProviderProps<SeriesType, TSignatures>) {
  const { children, localeText, chartProviderProps, slots, slotProps } =
    useChartsDataProviderProps(props);

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
