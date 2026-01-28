'use client';
import * as React from 'react';
import { ChartsSvgSurface, type ChartsSvgSurfaceProps } from '@mui/x-charts/ChartsSvgSurface';
import { type ChartAnyPluginSignature, type ChartSeriesType } from '@mui/x-charts/internals';
import { type AllPluginSignatures } from '../internals/plugins/allPlugins';
import {
  ChartDataProviderPremium,
  type ChartDataProviderPremiumProps,
} from '../ChartDataProviderPremium';
import { useChartContainerPremiumProps } from './useChartContainerPremiumProps';

export interface ChartContainerPremiumSlots {}

export interface ChartContainerPremiumSlotProps {}

export type ChartContainerPremiumProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
> = ChartDataProviderPremiumProps<TSeries, TSignatures> & ChartsSvgSurfaceProps;

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
 * This is a combination of both the `ChartDataProviderPremium` and `ChartsSvgSurface` components.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 *
 * API:
 *
 * - [ChartContainerPremium API](https://mui.com/x/api/charts/chart-container-premium/)
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
    <ChartDataProviderPremium<TSeries, TSignatures> {...chartDataProviderPremiumProps}>
      <ChartsSvgSurface {...chartsSurfaceProps}>{children}</ChartsSvgSurface>
    </ChartDataProviderPremium>
  );
}) as unknown as ChartContainerPremiumComponent;

export { ChartContainerPremium };
