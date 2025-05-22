import { ChartAnyPluginSignature, ChartPublicAPI } from '@mui/x-charts/internals';
import { HeatmapPluginsSignatures } from '../Heatmap/Heatmap.plugins';
import { LineChartProPluginsSignatures } from '../LineChartPro/LineChartPro.plugins';
import { ScatterChartProPluginsSignatures } from '../ScatterChartPro/ScatterChartPro.plugins';
import { BarChartProPluginsSignatures } from '../BarChartPro/BarChartPro.plugins';
import { AllPluginSignatures, DefaultPluginSignatures } from '../internals/plugins/allPlugins';
import { FunnelChartPluginsSignatures } from '../FunnelChart/FunnelChart.plugins';
import { RadarChartProPluginsSignatures } from '../RadarChartPro/RadarChartPro.plugins';

type PluginsPerSeriesType = {
  heatmap: HeatmapPluginsSignatures;
  line: LineChartProPluginsSignatures;
  scatter: ScatterChartProPluginsSignatures;
  bar: BarChartProPluginsSignatures;
  funnel: FunnelChartPluginsSignatures;
  radar: RadarChartProPluginsSignatures;
  /* Special value when creating a chart using composition. */
  composition: DefaultPluginSignatures;
};

/**
 * The API of the chart `apiRef` object.
 * The chart type can be passed as the first generic parameter to narrow down the API to the specific chart type.
 * @example ChartProApi<'bar'>
 */
export type ChartProApi<
  TSeries extends keyof PluginsPerSeriesType | undefined = undefined,
  TSignatures extends
    readonly ChartAnyPluginSignature[] = TSeries extends keyof PluginsPerSeriesType
    ? PluginsPerSeriesType[TSeries]
    : AllPluginSignatures,
> = ChartPublicAPI<TSignatures>;
