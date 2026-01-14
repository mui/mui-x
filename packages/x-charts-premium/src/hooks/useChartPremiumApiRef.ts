'use client';
import * as React from 'react';
import { type ChartAnyPluginSignature } from '@mui/x-charts/internals';
import { type ChartPremiumApi } from '../context';
import { type AllPluginSignatures } from '../internals/plugins/allPlugins';
import { type PremiumPluginsPerSeriesType } from '../context/ChartPremiumApi';

/**
 * Hook that instantiates a [[ChartPremiumApiRef]].
 * The chart type needs to be given as the generic parameter to narrow down the API to the specific chart type.
 * @example
 * ```tsx
 * const barApiRef = useChartPremiumApiRef<'bar'>();
 * ```
 * @example
 * ```tsx
 * // The API can be passed to the chart component and used to interact with the chart.
 * <BarChartPremium apiRef={barApiRef} />
 * ```
 * @example
 * ```tsx
 * // The API can be used to access chart methods and properties.
 * barApiRef.current?.getSeries();
 * ```
 */
export const useChartPremiumApiRef = <
  ChartType extends keyof PremiumPluginsPerSeriesType = never,
  Signatures extends readonly ChartAnyPluginSignature[] =
    ChartType extends keyof PremiumPluginsPerSeriesType
      ? PremiumPluginsPerSeriesType[ChartType]
      : AllPluginSignatures,
>() => React.useRef<ChartPremiumApi<ChartType, Signatures> | undefined>(undefined);
