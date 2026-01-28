import * as React from 'react';
import useId from '@mui/utils/useId';
import { type ChartsGridProps } from '@mui/x-charts/ChartsGrid';
import { type ChartsWrapperProps } from '@mui/x-charts/ChartsWrapper';
import { type ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import { type ChartsClipPathProps } from '@mui/x-charts/ChartsClipPath';
import { type ChartsAxisProps, type XAxis } from '@mui/x-charts/internals';
import { type ChartsAxisHighlightProps } from '@mui/x-charts/ChartsAxisHighlight';
import { type ChartContainerPremiumProps } from '../ChartContainerPremium';
import { type CandlestickChartProps } from './CandlestickChart';
import { type CandlestickPlotProps } from './CandlestickPlot';
import {
  CANDLESTICK_CHART_PLUGINS,
  type CandlestickChartPluginSignatures,
} from './CandlestickChart.plugins';

/**
 * A helper function that extracts CandlestickChartProps from the input props
 * and returns an object with props for the children components of CandlestickChart.
 *
 * @param props The input props for CandlestickChart
 * @returns An object with props for the children components of CandlestickChart
 */
export function useCandlestickChartProps(props: CandlestickChartProps) {
  const {
    xAxis,
    yAxis,
    series,
    width,
    height,
    margin,
    colors,
    dataset,
    sx,
    grid,
    children,
    slots,
    slotProps,
    skipAnimation,
    loading,
    className,
    axisHighlight,
    ...other
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const xAxisWithDefault: XAxis[] | undefined = React.useMemo(
    () =>
      xAxis?.map((axis) => ({
        scaleType: 'band',
        // TODO: Should we also include hours?
        ordinalTimeTicks: ['years', 'quarterly', 'months', 'biweekly', 'weeks', 'days'],
        ...axis,
      })),
    [xAxis],
  );

  const seriesWithDefault = React.useMemo(
    () =>
      series.map((s) => ({
        type: 'ohlc' as const,
        ...s,
      })),
    [series],
  );

  const axisHighlightProps = {
    ...axisHighlight,
    x: axisHighlight?.x ?? ('line' as const),
    y: axisHighlight?.y ?? ('line' as const),
  } satisfies ChartsAxisHighlightProps;

  const chartContainerProps: ChartContainerPremiumProps<'ohlc', CandlestickChartPluginSignatures> =
    {
      ...other,
      series: seriesWithDefault,
      width,
      height,
      margin,
      colors,
      dataset,
      xAxis: xAxisWithDefault,
      yAxis,
      disableAxisListener: axisHighlightProps.x === 'none' && axisHighlightProps.y === 'none',
      className,
      skipAnimation,
      plugins: CANDLESTICK_CHART_PLUGINS,
    };

  const candlestickPlotProps: CandlestickPlotProps = {
    slots,
    slotProps,
  };

  const gridProps: ChartsGridProps = {
    vertical: grid?.vertical,
    horizontal: grid?.horizontal,
  };

  const clipPathGroupProps = {
    clipPath: `url(#${clipPathId})`,
  };

  const clipPathProps: ChartsClipPathProps = {
    id: clipPathId,
  };

  const overlayProps: ChartsOverlayProps = {
    slots,
    slotProps,
    loading,
  };

  const chartsAxisProps: ChartsAxisProps = {
    slots,
    slotProps,
  };

  const chartsWrapperProps: Omit<ChartsWrapperProps, 'children'> = {
    sx,
  };

  return {
    chartsWrapperProps,
    chartContainerProps,
    candlestickPlotProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    overlayProps,
    chartsAxisProps,
    axisHighlightProps,
    children,
  };
}
