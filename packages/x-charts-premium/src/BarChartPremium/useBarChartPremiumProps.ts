import type { BarChartPluginSignatures } from '@mui/x-charts/BarChart';
import { useBarChartProps } from '@mui/x-charts/internals';
import { type ChartContainerProps } from '@mui/x-charts/ChartContainer';
import { type BarChartPremiumProps } from './BarChartPremium';
import { type RangeBarPlotProps } from './RangeBar/RangeBarPlot';

import type {} from '../typeOverloads';

/**
 * A helper function that extracts BarChartPremiumProps from the input props
 * and returns an object with props for the children components of BarChartPremium.
 *
 * @param props The input props for BarChartPremium
 * @returns An object with props for the children components of BarChartPremium
 */
export function useBarChartPremiumProps(props: BarChartPremiumProps) {
  const { chartContainerProps, ...barChartProps } = useBarChartProps(props);

  const rangeBarPlotProps: RangeBarPlotProps = {
    onItemClick: props.onItemClick as RangeBarPlotProps['onItemClick'],
    slots: props.slots,
    slotProps: props.slotProps,
    borderRadius: props.borderRadius,
  };

  return {
    ...barChartProps,
    chartContainerProps: chartContainerProps as ChartContainerProps<
      'bar' | 'rangeBar',
      BarChartPluginSignatures
    >,
    rangeBarPlotProps,
  };
}
