import { type BarChartPluginSignatures } from '@mui/x-charts/BarChart';
import { useBarChartProps } from '@mui/x-charts/internals';
import { type ChartsContainerProps } from '@mui/x-charts/ChartsContainer';
import { type BarChartPremiumProps } from './BarChartPremium';
import { type BarPlotPremiumProps } from './BarPlotPremium';
import { type RangeBarPlotProps } from './RangeBar/RangeBarPlot';

import type {} from '../typeOverloads';

/**
 * Default minimum spacing (in pixels) between ticks on band axes when the WebGL
 * renderer is active. Without this, a chart with 20k bars would render 20k SVG
 * ticks, dwarfing the gain from drawing bars on the GPU.
 */
const WEBGL_DEFAULT_BAND_TICK_SPACING = 50;

/**
 * A helper function that extracts BarChartPremiumProps from the input props
 * and returns an object with props for the children components of BarChartPremium.
 *
 * @param props The input props for BarChartPremium
 * @returns An object with props for the children components of BarChartPremium
 */
export function useBarChartPremiumProps(props: BarChartPremiumProps) {
  const { renderer, ...rest } = props;
  const { chartsContainerProps, barPlotProps, ...barChartProps } = useBarChartProps(
    rest as Parameters<typeof useBarChartProps>[0],
  );

  const premiumContainerProps =
    renderer === 'webgl'
      ? {
          ...chartsContainerProps,
          xAxis: applyWebGLBandTickSpacing(chartsContainerProps.xAxis),
          yAxis: applyWebGLBandTickSpacing(chartsContainerProps.yAxis),
        }
      : chartsContainerProps;

  const barPlotPremiumProps: BarPlotPremiumProps = {
    ...barPlotProps,
    renderer,
  };

  const rangeBarPlotProps: RangeBarPlotProps = {
    onItemClick: props.onItemClick as RangeBarPlotProps['onItemClick'],
    slots: props.slots,
    slotProps: props.slotProps,
    borderRadius: props.borderRadius,
  };

  return {
    ...barChartProps,
    chartsContainerProps: premiumContainerProps as ChartsContainerProps<
      'bar' | 'rangeBar',
      BarChartPluginSignatures
    >,
    barPlotPremiumProps,
    rangeBarPlotProps,
  };
}

function applyWebGLBandTickSpacing<T extends { scaleType?: string; tickSpacing?: number }>(
  axes: readonly T[] | undefined,
): readonly T[] | undefined {
  if (!axes) {
    return axes;
  }
  return axes.map((axis) => {
    if (axis.scaleType === 'band' && axis.tickSpacing === undefined) {
      return { ...axis, tickSpacing: WEBGL_DEFAULT_BAND_TICK_SPACING };
    }
    return axis;
  });
}
