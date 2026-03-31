import { useHeatmapProps } from '@mui/x-charts-pro/internals';
import { type HeatmapPremiumProps } from './HeatmapPremium';
import { type HeatmapPlotPremiumProps } from './HeatmapPlotPremium';

type UseHeatmapPremiumProps = HeatmapPremiumProps;

export function useHeatmapPremiumProps(props: UseHeatmapPremiumProps) {
  const { chartsDataProviderProProps, heatmapPlotProps, ...other } = useHeatmapProps(props);

  const heatmapPlotPremiumProps: HeatmapPlotPremiumProps = {
    ...heatmapPlotProps,
    renderer: props.renderer ?? 'svg-single',
  };

  return {
    ...other,
    heatmapPlotPremiumProps,
    chartsDataProviderPremiumProps: chartsDataProviderProProps,
  };
}
