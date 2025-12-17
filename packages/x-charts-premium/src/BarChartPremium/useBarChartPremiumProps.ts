import { useBarChartProps } from '@mui/x-charts/internals';
import { type BarChartPremiumProps } from './BarChartPremium';

/**
 * A helper function that extracts BarChartPremiumProps from the input props
 * and returns an object with props for the children components of BarChartPremium.
 *
 * @param props The input props for BarChartPremium
 * @returns An object with props for the children components of BarChartPremium
 */
export function useBarChartPremiumProps(props: BarChartPremiumProps) {
  return useBarChartProps(props);
}
