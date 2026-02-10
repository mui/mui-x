import { useHeatmapProps } from '@mui/x-charts-pro/internals';
import { type HeatmapPremiumProps } from './HeatmapPremium';
import { type HeatmapPlotPremiumProps } from './HeatmapPlotPremium';

export type UseHeatmapPremiumProps = HeatmapPremiumProps;

export function useHeatmapPremiumProps(props: UseHeatmapPremiumProps) {
  const { chartDataProviderProProps, heatmapPlotProps, ...other } = useHeatmapProps(props);

  const heatmapPlotPremiumProps: HeatmapPlotPremiumProps = {
    ...heatmapPlotProps,
    renderer: props.renderer ?? 'svg-single',
  };

  return {
    ...other,
    heatmapPlotPremiumProps,
    chartDataProviderPremiumProps: chartDataProviderProProps,
  };
}
