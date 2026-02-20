'use client';
import * as React from 'react';
import { ChartsSurface, type ChartsSurfaceProps } from '@mui/x-charts/ChartsSurface';
import { type ChartAnyPluginSignature, type ChartSeriesType } from '@mui/x-charts/internals';
import { type AllPluginSignatures } from '../internals/plugins/allPlugins';
import {
  ChartDataProviderPremium,
  type ChartDataProviderPremiumProps,
} from '../ChartDataProviderPremium';
import { useChartsContainerPremiumProps } from './useChartsContainerPremiumProps';

export interface ChartsContainerPremiumSlots {}

export interface ChartsContainerPremiumSlotProps {}

export type ChartsContainerPremiumProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
> = ChartDataProviderPremiumProps<TSeries, TSignatures> & ChartsSurfaceProps;

type ChartsContainerPremiumComponent = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartsContainerPremiumProps<TSeries, TSignatures> & {
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
 * - [ChartsContainerPremium API](https://mui.com/x/api/charts/charts-container-premium/)
 *
 * @example
 * ```jsx
 * <ChartsContainerPremium
 *   series={[{ label: "Label", type: "bar", data: [10, 20] }]}
 *   xAxis={[{ data: ["A", "B"], scaleType: "band", id: "x-axis" }]}
 * >
 *    <BarPlot />
 *    <ChartsXAxis axisId="x-axis" />
 * </ChartsContainerPremium>
 * ```
 */
const ChartsContainerPremium = React.forwardRef(function ChartsContainerPremium<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(props: ChartsContainerPremiumProps<TSeries, TSignatures>, ref: React.Ref<SVGSVGElement>) {
  const { chartDataProviderPremiumProps, children, chartsSurfaceProps } =
    useChartsContainerPremiumProps<TSeries, TSignatures>(props);

  return (
    <ChartDataProviderPremium<TSeries, TSignatures> {...chartDataProviderPremiumProps}>
      <ChartsSurface {...chartsSurfaceProps} ref={ref}>
        {children}
      </ChartsSurface>
    </ChartDataProviderPremium>
  );
}) as unknown as ChartsContainerPremiumComponent;

export { ChartsContainerPremium };
