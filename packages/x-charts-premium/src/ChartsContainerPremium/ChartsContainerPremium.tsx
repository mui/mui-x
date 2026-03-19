'use client';
import * as React from 'react';
import { ChartsSurface, type ChartsSurfaceProps } from '@mui/x-charts/ChartsSurface';
import { type ChartAnyPluginSignature, type ChartSeriesType } from '@mui/x-charts/internals';
import { type AllPluginSignatures } from '../internals/plugins/allPlugins';
import {
  ChartsDataProviderPremium,
  type ChartsDataProviderPremiumProps,
} from '../ChartsDataProviderPremium';
import { useChartsContainerPremiumProps } from './useChartsContainerPremiumProps';

export interface ChartsContainerPremiumSlots {}

export interface ChartsContainerPremiumSlotProps {}

export type ChartsContainerPremiumProps<
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
> = ChartsDataProviderPremiumProps<SeriesType, TSignatures> & ChartsSurfaceProps;

type ChartsContainerPremiumComponent = <
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
>(
  props: ChartsContainerPremiumProps<SeriesType, TSignatures> & {
    ref?: React.ForwardedRef<SVGSVGElement>;
  },
) => React.JSX.Element;

/**
 * It sets up the data providers as well as the `<svg>` for the chart.
 *
 * This is a combination of both the `ChartsDataProviderPremium` and `ChartsSurface` components.
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
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
>(props: ChartsContainerPremiumProps<SeriesType, TSignatures>, ref: React.Ref<HTMLDivElement>) {
  const { chartsDataProviderPremiumProps, children, chartsSurfaceProps } =
    useChartsContainerPremiumProps<SeriesType, TSignatures>(props);

  return (
    <ChartsDataProviderPremium<SeriesType, TSignatures> {...chartsDataProviderPremiumProps}>
      <ChartsSurface {...chartsSurfaceProps} ref={ref}>
        {children}
      </ChartsSurface>
    </ChartsDataProviderPremium>
  );
}) as unknown as ChartsContainerPremiumComponent;

export { ChartsContainerPremium };
