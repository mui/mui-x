import { useBarChartProps } from '@mui/x-charts/internals';
import { type RangeBarPlotProps } from './RangeBar/RangeBarPlot';
import { type BarChartProProps } from './BarChartPro';

/**
 * A helper function that extracts BarChartProProps from the input props
 * and returns an object with props for the children components of BarChartPro.
 *
 * @param props The input props for BarChartPro
 * @returns An object with props for the children components of BarChartPro
 */
export function useBarChartProProps(props: BarChartProProps) {
  const barChartProps = useBarChartProps(props);

  const rangeBarPlotProps: RangeBarPlotProps = {
    onItemClick: props.onItemClick as RangeBarPlotProps['onItemClick'],
    slots: props.slots,
    slotProps: props.slotProps,
    borderRadius: props.borderRadius,
  };

  return {
    ...barChartProps,
    rangeBarPlotProps,
  };
}
