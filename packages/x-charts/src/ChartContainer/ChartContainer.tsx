'use client';
import * as React from 'react';
import { ChartSeriesType } from '../models/seriesType/config';
import { ChartDataProvider, ChartDataProviderProps } from '../context/ChartDataProvider';
import { useChartContainerProps } from './useChartContainerProps';
import { ChartsSurface, ChartsSurfaceProps } from '../ChartsSurface';
import { UseChartCartesianAxisSignature } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxis.types';

export interface ChartContainerProps<SeriesType extends ChartSeriesType = ChartSeriesType>
  extends Omit<
      ChartDataProviderProps<[UseChartCartesianAxisSignature<SeriesType>], SeriesType>,
      'children'
    >,
    ChartsSurfaceProps {}

/**
 * It sets up the data providers as well as the `<svg>` for the chart.
 *
 * This is a combination of both the `ChartDataProvider` and `ChartsSurface` components.
 *
 * Demos:
 *
 * - [Composition](http://localhost:3001/x/react-charts/composition/)
 *
 * API:
 *
 * - [ChartContainer API](https://mui.com/x/api/charts/chart-container/)
 *
 * @example
 * ```jsx
 * <ChartContainer
 *   series={[{ label: "Label", type: "bar", data: [10, 20] }]}
 *   xAxis={[{ data: ["A", "B"], scaleType: "band", id: "x-axis" }]}
 * >
 *    <BarPlot />
 *    <ChartsXAxis position="bottom" axisId="x-axis" />
 * </ChartContainer>
 * ```
 */
const ChartContainer = React.forwardRef(function ChartContainer<TSeries extends ChartSeriesType>(
  props: ChartContainerProps<TSeries>,
  ref: React.Ref<SVGSVGElement>,
) {
  const { chartDataProviderProps, children, chartsSurfaceProps } = useChartContainerProps(
    props,
    ref,
  );

  return (
    <ChartDataProvider<[UseChartCartesianAxisSignature<TSeries>], any> {...chartDataProviderProps}>
      <ChartsSurface {...chartsSurfaceProps}>{children}</ChartsSurface>
    </ChartDataProvider>
  );
}) as <TSeries extends ChartSeriesType>(
  props: ChartContainerProps<TSeries> & { ref?: React.ForwardedRef<SVGSVGElement> },
) => React.JSX.Element;

export { ChartContainer };
