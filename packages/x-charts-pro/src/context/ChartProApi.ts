import { ChartAnyPluginSignature, ChartPublicAPI } from '@mui/x-charts/internals';
import { HeatmapPluginSignatures } from '../Heatmap/Heatmap.plugins';
import { LineChartProPluginSignatures } from '../LineChartPro/LineChartPro.plugins';
import { ScatterChartProPluginSignatures } from '../ScatterChartPro/ScatterChartPro.plugins';
import { BarChartProPluginSignatures } from '../BarChartPro/BarChartPro.plugins';
import { AllPluginSignatures, DefaultPluginSignatures } from '../internals/plugins/allPlugins';
import { FunnelChartPluginSignatures } from '../FunnelChart/FunnelChart.plugins';
import { RadarChartProPluginSignatures } from '../RadarChartPro/RadarChartPro.plugins';
import { PieChartProPluginSignatures } from '../PieChartPro/PieChartPro.plugins';

export type ProPluginsPerSeriesType = {
  heatmap: HeatmapPluginSignatures;
  line: LineChartProPluginSignatures;
  scatter: ScatterChartProPluginSignatures;
  bar: BarChartProPluginSignatures;
  funnel: FunnelChartPluginSignatures;
  radar: RadarChartProPluginSignatures;
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
  ChartType extends keyof ProPluginsPerSeriesType | undefined = undefined,
  Signatures extends
    readonly ChartAnyPluginSignature[] = ChartType extends keyof ProPluginsPerSeriesType
    ? ProPluginsPerSeriesType[ChartType]
    : AllPluginSignatures,
> = ChartPublicAPI<Signatures>;
