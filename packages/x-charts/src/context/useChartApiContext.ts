'use client';

import * as React from 'react';
import { ChartApi } from '../ChartContainer';
import { useChartContext } from './ChartProvider';

type PluginSignaturesFromApi<Api> =
  Api extends ChartApi<any, infer TSignatures> ? TSignatures : never;

/**
 * The `useChartApiContext` hook provides access to the chart API.
 * It can be used to interact with the chart when rendering custom components that are descendants of the `ChartDataProvider` component.
 * @example
 * const apiRef = useChartApiContext<ChartApi<'bar'>>();
 */
export function useChartApiContext<Api extends ChartApi = ChartApi>() {
  const { publicAPI } = useChartContext<PluginSignaturesFromApi<Api>>();
  const apiRef = React.useRef<Api>(publicAPI as unknown as Api);

  React.useEffect(() => {
    apiRef.current = publicAPI as unknown as Api;
  }, [publicAPI]);

  return apiRef;
}
