import type { ProPluginsPerSeriesType } from '@mui/x-charts-pro/internals';
import type { ChartAnyPluginSignature, ChartPublicAPI } from '@mui/x-charts/internals';
import type { BarChartPremiumPluginSignatures } from '../BarChartPremium/BarChartPremium.plugins';
import type { AllPluginSignatures, DefaultPluginSignatures } from '../internals/plugins/allPlugins';
import type { GeoPremiumPluginSignatures } from '../ChartsGeoDataProviderPremium/ChartsGeoDataProviderPremium.plugins';
import type { ScatterChartPremiumPluginSignatures } from '../ScatterChartPremium/ScatterChartPremium.plugins';
import type { HeatmapPremiumPluginSignatures } from '../HeatmapPremium/HeatmapPremium.plugins';
import type { CandlestickChartPluginSignatures } from '../CandlestickChart/CandlestickChart.plugins';
import type { RadialLineChartPluginSignatures } from '../RadialLineChart/RadialLineChart.plugins';
import type { RadialBarChartPluginSignatures } from '../RadialBarChart/RadialBarChart.plugins';

export type PremiumPluginsPerSeriesType = Omit<
  ProPluginsPerSeriesType,
  'bar' | 'scatter' | 'heatmap' | 'composition'
> & {
  bar: BarChartPremiumPluginSignatures;
  rangeBar: BarChartPremiumPluginSignatures;
  scatter: ScatterChartPremiumPluginSignatures;
  heatmap: HeatmapPremiumPluginSignatures;
  ohlc: CandlestickChartPluginSignatures;
  radialLine: RadialLineChartPluginSignatures;
  radialBar: RadialBarChartPluginSignatures;
  mapShape: GeoPremiumPluginSignatures;
  composition: DefaultPluginSignatures;
};

/**
 * The API of the chart `apiRef` object.
 * The chart type can be passed as the first generic parameter to narrow down the API to the specific chart type.
 * @example ChartProApi<'bar'>
 * If the chart is being created using composition, the `composition` value can be used.
 * @example ChartProApi<'composition'>
 */
export type ChartPremiumApi<
  ChartType extends keyof PremiumPluginsPerSeriesType | undefined = undefined,
  Signatures extends readonly ChartAnyPluginSignature[] =
    ChartType extends keyof PremiumPluginsPerSeriesType
      ? PremiumPluginsPerSeriesType[ChartType]
      : AllPluginSignatures,
> = ChartPublicAPI<Signatures>;
