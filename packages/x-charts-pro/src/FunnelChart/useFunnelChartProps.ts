'use client';
import { DEFAULT_MARGINS, DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '@mui/x-charts/constants';
import { ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import { ChartsAxisProps } from '@mui/x-charts/ChartsAxis';
import { ChartsLegendSlotExtension } from '@mui/x-charts/ChartsLegend';
import useId from '@mui/utils/useId';
import { ChartsClipPathProps } from '@mui/x-charts/ChartsClipPath';
import { ChartsWrapperProps, defaultizeMargin } from '@mui/x-charts/internals';
import { ChartsAxisHighlightProps } from '@mui/x-charts/ChartsAxisHighlight';
import { AxisConfig, ChartsXAxisProps, ChartsYAxisProps, ScaleName } from '@mui/x-charts/models';
import { warnOnce } from '@mui/x-internals/warning';
import { FunnelPlotProps } from './FunnelPlot';
import type { FunnelChartProps } from './FunnelChart';
import { ChartContainerProProps } from '../ChartContainerPro';

function getCategoryAxisConfig(
  categoryAxis: FunnelChartProps['categoryAxis'],
  series: FunnelChartProps['series'],
  isHorizontal: boolean,
  direction: 'y',
): AxisConfig<ScaleName, any, ChartsYAxisProps>;
function getCategoryAxisConfig(
  categoryAxis: FunnelChartProps['categoryAxis'],
  series: FunnelChartProps['series'],
  isHorizontal: boolean,
  direction: 'x',
): AxisConfig<ScaleName, any, ChartsXAxisProps>;
function getCategoryAxisConfig(
  categoryAxis: FunnelChartProps['categoryAxis'],
  series: FunnelChartProps['series'],
  isHorizontal: boolean,
  direction: 'x' | 'y',
): AxisConfig<ScaleName, any, any> {
  const maxSeriesLength = Math.max(...series.map((s) => (s.data ?? []).length), 0);
  const maxSeriesValue = Array.from({ length: maxSeriesLength }, (_, index) =>
    series.reduce((a, s) => a + (s.data?.[index]?.value ?? 0), 0),
  );

  if (process.env.NODE_ENV !== 'production') {
    if (
      ((categoryAxis?.position === 'left' || categoryAxis?.position === 'right') && isHorizontal) ||
      ((categoryAxis?.position === 'top' || categoryAxis?.position === 'bottom') && !isHorizontal)
    ) {
      warnOnce(
        [
          `MUI X: the categoryAxis position is set to '${categoryAxis.position}' but the series layout is ${isHorizontal ? 'horizontal' : 'vertical'}.`,
          `Ensure that the categoryAxis position is set to '${isHorizontal ? 'top' : 'left'}' or '${isHorizontal ? 'bottom' : 'right'}' for ${isHorizontal ? 'horizontal' : 'vertical'} layout.\n`,
        ],
        'warning',
      );
    }
  }

  const side = isHorizontal ? 'bottom' : 'left';
  const categoryValues = {
    id: direction === 'x' ? DEFAULT_X_AXIS_KEY : DEFAULT_Y_AXIS_KEY,
    ...categoryAxis,
    ...(categoryAxis?.size ? { [isHorizontal ? 'height' : 'width']: categoryAxis.size } : {}),
    position: categoryAxis?.position ?? (categoryAxis?.categories ? side : 'none'),
  } as const;

  // If the scaleType is not defined or is 'band', our job is simple.
  if (!categoryAxis?.scaleType || categoryAxis.scaleType === 'band') {
    return {
      scaleType: 'band',
      categoryGapRatio: 0,
      // Use the categories as the domain if they are defined.
      data: categoryAxis?.categories
        ? categoryAxis.categories
        : // Otherwise we just need random data to create the band scale.
          Array.from({ length: maxSeriesLength }, (_, index) => index),
      tickLabelPlacement: 'middle',
      ...categoryValues,
    } as const;
  }

  // If the scaleType is other than 'band', we have to do some magic.
  // First we need to calculate the tick values additively and in reverse order.
  const tickValues = [
    ...maxSeriesValue
      .toReversed()
      .map((_, i, arr) => arr.slice(0, i).reduce((a, value) => a + value, 0)),
    // We add the total value of the series as the last tick value
    maxSeriesValue.reduce((a, value) => a + value, 0),
  ];

  return {
    scaleType: categoryAxis.scaleType,
    domainLimit: 'strict',
    tickLabelPlacement: 'middle',
    tickInterval: tickValues,
    // No need to show the first tick label
    tickLabelInterval: (_: any, i: number) => i !== 0,
    // We trick the valueFormatter to show the category values.
    // By using the index of the tickValues array we can get the category value.
    valueFormatter: (value) =>
      `${categoryAxis.categories?.toReversed()[tickValues.findIndex((v) => v === value) - 1]}`,
    ...categoryValues,
  } as const;
}

/**
 * A helper function that extracts FunnelChartProps from the input props
 * and returns an object with props for the children components of FunnelChart.
 *
 * @param props The input props for FunnelChart
 * @returns An object with props for the children components of FunnelChart
 */
export const useFunnelChartProps = (props: FunnelChartProps) => {
  const {
    categoryAxis,
    series,
    width,
    height,
    margin: marginProps,
    colors,
    sx,
    children,
    slots,
    slotProps,
    skipAnimation,
    loading,
    onItemClick,
    highlightedItem,
    onHighlightChange,
    className,
    hideLegend,
    axisHighlight,
    apiRef,
    ...rest
  } = props;
  const margin = defaultizeMargin(marginProps, DEFAULT_MARGINS);

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const isHorizontal = series.some((s) => s.layout === 'horizontal');

  const valueAxisConfig = {
    id: isHorizontal ? DEFAULT_Y_AXIS_KEY : DEFAULT_X_AXIS_KEY,
    scaleType: 'linear',
    domainLimit: 'strict',
    position: 'none',
  } as const;

  const xAxis = isHorizontal
    ? getCategoryAxisConfig(categoryAxis, series, isHorizontal, 'x')
    : valueAxisConfig;
  const yAxis = isHorizontal
    ? valueAxisConfig
    : getCategoryAxisConfig(categoryAxis, series, isHorizontal, 'y');

  const chartContainerProps: ChartContainerProProps<'funnel'> = {
    ...rest,
    series: series.map((s) => ({
      type: 'funnel' as const,
      layout: isHorizontal ? 'horizontal' : 'vertical',
      ...s,
    })),
    width,
    height,
    margin,
    colors,
    xAxis: [xAxis],
    yAxis: [yAxis],
    sx,
    highlightedItem,
    onHighlightChange,
    className,
    apiRef,
  };

  const funnelPlotProps: FunnelPlotProps = {
    onItemClick,
    slots,
    slotProps,
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

  const legendProps: ChartsLegendSlotExtension = {
    slots,
    slotProps,
  };

  const clipPathGroupProps = {
    clipPath: `url(#${clipPathId})`,
  };

  const clipPathProps: ChartsClipPathProps = {
    id: clipPathId,
  };

  const chartsWrapperProps: Omit<ChartsWrapperProps, 'children'> = {
    sx,
    legendPosition: props.slotProps?.legend?.position,
    legendDirection: props.slotProps?.legend?.direction,
  };

  const axisHighlightProps: ChartsAxisHighlightProps = {
    ...axisHighlight,
  };

  return {
    chartContainerProps,
    funnelPlotProps,
    overlayProps,
    chartsAxisProps,
    legendProps,
    clipPathGroupProps,
    clipPathProps,
    chartsWrapperProps,
    axisHighlightProps,
    children,
  };
};
