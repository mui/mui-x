'use client';
import * as React from 'react';
import type {} from '../typeOverloads';
import { Watermark } from '@mui/x-license/Watermark';
import { useLicenseVerifier } from '@mui/x-license/useLicenseVerifier';
import { ChartsSurface, ChartsSurfaceProps } from '@mui/x-charts/ChartsSurface';
import { ChartDataProvider, ChartDataProviderProps } from '@mui/x-charts/context';
import { ChartSeriesType, UseChartCartesianAxisSignature } from '@mui/x-charts/internals';
import { getReleaseInfo } from '../internals/utils/releaseInfo';
import { useChartContainerProProps } from './useChartContainerProProps';
import { UseChartProZoomSignature } from '../internals/plugins/useChartProZoom/useChartProZoom.types';

export interface ChartContainerProProps<TSeries extends ChartSeriesType = ChartSeriesType>
  extends ChartDataProviderProps<
      [UseChartCartesianAxisSignature<TSeries>, UseChartProZoomSignature],
      TSeries
    >,
    ChartsSurfaceProps {}

const releaseInfo = getReleaseInfo();

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
 * <ChartContainerPro
 *   series={[{ label: "Label", type: "bar", data: [10, 20] }]}
 *   xAxis={[{ data: ["A", "B"], scaleType: "band", id: "x-axis" }]}
 * >
 *    <BarPlot />
 *    <ChartsXAxis position="bottom" axisId="x-axis" />
 * </ChartContainerPro>
 * ```
 */
const ChartContainerPro = React.forwardRef(function ChartContainerProInner<
  TSeries extends ChartSeriesType = ChartSeriesType,
>(props: ChartContainerProProps<TSeries>, ref: React.Ref<SVGSVGElement>) {
  const { chartDataProviderProProps, children, chartsSurfaceProps } =
    useChartContainerProProps<TSeries>(props, ref);

  useLicenseVerifier('x-charts-pro', releaseInfo);

  return (
    <ChartDataProvider<[UseChartCartesianAxisSignature<TSeries>, UseChartProZoomSignature], any>
      {...chartDataProviderProProps}
    >
      <ChartsSurface {...chartsSurfaceProps}>{children}</ChartsSurface>
      <Watermark packageName="x-charts-pro" releaseInfo={releaseInfo} />
    </ChartDataProvider>
  );
}) as <TSeries extends ChartSeriesType = ChartSeriesType>(
  props: ChartContainerProProps<TSeries> & { ref?: React.ForwardedRef<SVGSVGElement> },
) => React.JSX.Element;

export { ChartContainerPro };
