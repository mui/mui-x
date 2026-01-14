'use client';
import * as React from 'react';
import { ChartsSurface, type ChartsSurfaceProps } from '@mui/x-charts/ChartsSurface';
import { type ChartAnyPluginSignature, type ChartSeriesType } from '@mui/x-charts/internals';
import { type AllPluginSignatures } from '../internals/plugins/allPlugins';
import {
  ChartDataProviderPremium,
  type ChartDataProviderPremiumProps,
} from '../ChartDataProviderPremium';
import { useChartContainerPremiumProps } from './useChartContainerPremiumProps';

export type ChartContainerPremiumProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
> = ChartDataProviderPremiumProps<TSeries, TSignatures> & ChartsSurfaceProps;

type ChartContainerPremiumComponent = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartContainerPremiumProps<TSeries, TSignatures> & {
    ref?: React.ForwardedRef<SVGSVGElement>;
  },
) => React.JSX.Element;

/**
 * It sets up the data providers as well as the `<svg>` for the chart.
 *
 * This is a combination of both the `ChartDataProviderPremium` and `ChartsSurface` components.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 *
 * API:
 *
 * - [ChartContainer API](https://mui.com/x/api/charts/chart-container/)
 *
 * @example
 * ```jsx
 * <ChartContainerPremium
 *   series={[{ label: "Label", type: "bar", data: [10, 20] }]}
 *   xAxis={[{ data: ["A", "B"], scaleType: "band", id: "x-axis" }]}
 * >
 *    <BarPlot />
 *    <ChartsXAxis axisId="x-axis" />
 * </ChartContainerPremium>
 * ```
 */
const ChartContainerPremium = React.forwardRef(function ChartContainerPremium<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(props: ChartContainerPremiumProps<TSeries, TSignatures>, ref: React.Ref<SVGSVGElement>) {
  const { chartDataProviderPremiumProps, children, chartsSurfaceProps } =
    useChartContainerPremiumProps<TSeries, TSignatures>(props, ref);

  return (
    <ChartDataProviderPremium {...chartDataProviderPremiumProps}>
      <ChartsSurface {...chartsSurfaceProps}>{children}</ChartsSurface>
    </ChartDataProviderPremium>
  );
}) as unknown as ChartContainerPremiumComponent;

export { ChartContainerPremium };
