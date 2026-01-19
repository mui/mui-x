import { useHeatmapProps } from '@mui/x-charts-pro/internals';
import { type HeatmapPremiumProps } from './HeatmapPremium';

export type UseHeatmapPremiumProps = HeatmapPremiumProps;

export function useHeatmapPremiumProps(props: UseHeatmapPremiumProps) {
  const { chartDataProviderProProps, ...other } = useHeatmapProps(props);

  return {
    ...other,
    chartDataProviderPremiumProps: chartDataProviderProProps,
  };
}
