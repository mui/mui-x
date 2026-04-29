import { type BarChartPluginSignatures } from '@mui/x-charts/BarChart';
import { useBarChartProps } from '@mui/x-charts/internals';
import { type ChartsContainerProps } from '@mui/x-charts/ChartsContainer';
import { type BarChartPremiumProps } from './BarChartPremium';
import { type BarPlotPremiumProps } from './BarPlotPremium';
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
  const { renderer, ...rest } = props;
  const { chartsContainerProps, barPlotProps, ...barChartProps } = useBarChartProps(
    rest as Parameters<typeof useBarChartProps>[0],
  );

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
    chartsContainerProps: chartsContainerProps as ChartsContainerProps<
      'bar' | 'rangeBar',
      BarChartPluginSignatures
    >,
    barPlotPremiumProps,
    rangeBarPlotProps,
  };
}
