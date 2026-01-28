'use client';

import * as React from 'react';
import { type ChartApi } from './ChartApi';
import { useChartContext } from './ChartProvider';

type PluginSignaturesFromApi<Api> =
  Api extends ChartApi<any, infer TSignatures> ? TSignatures : never;

/**
 * The `useChartApiContext` hook provides access to the chart API.
 * This is only available when the chart is rendered within a chart or a `ChartDataProvider` component.
 * If you want to access the chart API outside those components, you should use the `apiRef` prop instead.
 * @example
 * const apiRef = useChartApiContext<ChartApi<'bar'>>();
 */
export function useChartApiContext<Api extends ChartApi>() {
  const { publicAPI } = useChartContext<PluginSignaturesFromApi<Api>>();
  const apiRef = React.useRef<Api>(publicAPI as unknown as Api);

  React.useEffect(() => {
    apiRef.current = publicAPI as unknown as Api;
  }, [publicAPI]);

  return apiRef;
}
