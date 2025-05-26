import * as React from 'react';
import { ChartProApi, ProPluginsPerSeriesType } from '../ChartContainerPro';

/**
 * Hook that instantiates a [[ChartProApiRef]].
 * The chart type can be passed as the generic parameter to narrow down the API to the specific chart type.
 * @example
 * ```tsx
 * // Generic chart API ref
 * const apiRef = useChartProApiRef();
 * // Typed chart API ref for a specific chart type
 * const barApiRef = useChartProApiRef<'bar'>();
 * ```
 * @example
 * ```tsx
 * // The API can be used passed to the chart component and used to interact with the chart.
 * <BarChart apiRef={barApiRef} />
 * ```
 * @example
 * ```tsx
 * // The API can be used to access chart methods and properties.
 * barApiRef.current?.getSeries();
 * ```
 */
export const useChartProApiRef = <TSeries extends keyof ProPluginsPerSeriesType>() =>
  React.useRef<ChartProApi<TSeries> | undefined>(undefined);
