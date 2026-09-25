import { useHeatmapProps } from '@mui/x-charts-pro/internals';
import type { HeatmapPremiumProps } from './HeatmapPremium';
import type { HeatmapPlotPremiumProps } from './HeatmapPlotPremium';
import { HEATMAP_PREMIUM_PLUGINS } from './HeatmapPremium.plugins';
import type { HeatmapPremiumPluginSignatures } from './HeatmapPremium.plugins';
import type { ChartsDataProviderPremiumProps } from '../ChartsDataProviderPremium';

export type UseHeatmapPremiumProps = HeatmapPremiumProps;

export function useHeatmapPremiumProps(props: UseHeatmapPremiumProps) {
  const { chartsDataProviderProProps, heatmapPlotProps, ...other } = useHeatmapProps(props);

  const heatmapPlotPremiumProps: HeatmapPlotPremiumProps = {
    ...heatmapPlotProps,
    renderer: props.renderer ?? 'svg-single',
  };

  // Pro's hook hardcodes the Pro plugin list and types `apiRef` against it.
  // Annotated so the declaration build can name the type.
  const chartsDataProviderPremiumProps: ChartsDataProviderPremiumProps<
    'heatmap',
    HeatmapPremiumPluginSignatures
  > = {
    ...chartsDataProviderProProps,
    apiRef: props.apiRef,
    plugins: HEATMAP_PREMIUM_PLUGINS,
  };

  return {
    ...other,
    heatmapPlotPremiumProps,
    chartsDataProviderPremiumProps,
  };
}
