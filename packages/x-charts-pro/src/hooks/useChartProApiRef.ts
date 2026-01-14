'use client';
import * as React from 'react';
import { type ChartAnyPluginSignature } from '@mui/x-charts/internals';
import { type AllPluginSignatures } from '../internals/plugins/allPlugins';
import { type ProPluginsPerSeriesType, type ChartProApi } from '../context/ChartProApi';

/**
 * Hook that instantiates a [[ChartProApiRef]].
 * The chart type needs to be given as the generic parameter to narrow down the API to the specific chart type.
 * @example
 * ```tsx
 * const barApiRef = useChartProApiRef<'bar'>();
 * ```
 * @example
 * ```tsx
 * // The API can be passed to the chart component and used to interact with the chart.
 * <BarChart apiRef={barApiRef} />
 * ```
 * @example
 * ```tsx
 * // The API can be used to access chart methods and properties.
 * barApiRef.current?.getSeries();
 * ```
 */
export const useChartProApiRef = <
  ChartType extends keyof ProPluginsPerSeriesType = never,
  Signatures extends readonly ChartAnyPluginSignature[] =
    ChartType extends keyof ProPluginsPerSeriesType
      ? ProPluginsPerSeriesType[ChartType]
      : AllPluginSignatures,
>() => React.useRef<ChartProApi<ChartType, Signatures> | undefined>(undefined);
