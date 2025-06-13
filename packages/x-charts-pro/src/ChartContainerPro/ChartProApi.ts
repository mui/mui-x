import { ChartAnyPluginSignature, ChartPublicAPI } from '@mui/x-charts/internals';
import { HeatmapPluginsSignatures } from '../Heatmap/Heatmap.plugins';
import { LineChartProPluginsSignatures } from '../LineChartPro/LineChartPro.plugins';
import { ScatterChartProPluginsSignatures } from '../ScatterChartPro/ScatterChartPro.plugins';
import { BarChartProPluginsSignatures } from '../BarChartPro/BarChartPro.plugins';
import { AllPluginSignatures, DefaultPluginSignatures } from '../internals/plugins/allPlugins';
import { FunnelChartPluginsSignatures } from '../FunnelChart/FunnelChart.plugins';
import { RadarChartProPluginsSignatures } from '../RadarChartPro/RadarChartPro.plugins';
import { PieChartProPluginSignatures } from '../PieChartPro/PieChartPro.plugins';

export type ProPluginsPerSeriesType = {
  heatmap: HeatmapPluginsSignatures;
  line: LineChartProPluginsSignatures;
  scatter: ScatterChartProPluginsSignatures;
  bar: BarChartProPluginsSignatures;
  funnel: FunnelChartPluginsSignatures;
  radar: RadarChartProPluginsSignatures;
  pie: PieChartProPluginSignatures;
  /* Special value when creating a chart using composition. */
  composition: DefaultPluginSignatures;
};

/**
 * The API of the chart `apiRef` object.
 * The chart type can be passed as the first generic parameter to narrow down the API to the specific chart type.
 * @example ChartProApi<'bar'>
 * If the chart is being created using composition, the `composition` value can be used.
 * @example ChartProApi<'composition'>
 */
export type ChartProApi<
  TSeries extends keyof ProPluginsPerSeriesType | undefined = undefined,
  TSignatures extends
    readonly ChartAnyPluginSignature[] = TSeries extends keyof ProPluginsPerSeriesType
    ? ProPluginsPerSeriesType[TSeries]
    : AllPluginSignatures,
> = ChartPublicAPI<TSignatures>;
