import { type ChartAnyPluginSignature, type ChartPublicAPI } from '@mui/x-charts/internals';
import { type HeatmapPluginSignatures } from '../Heatmap/Heatmap.plugins';
import { type LineChartProPluginSignatures } from '../LineChartPro/LineChartPro.plugins';
import { type ScatterChartProPluginSignatures } from '../ScatterChartPro/ScatterChartPro.plugins';
import { type BarChartProPluginSignatures } from '../BarChartPro/BarChartPro.plugins';
import {
  type AllPluginSignatures,
  type DefaultPluginSignatures,
} from '../internals/plugins/allPlugins';
import { type FunnelChartPluginSignatures } from '../FunnelChart/FunnelChart.plugins';
import { type RadarChartProPluginSignatures } from '../RadarChartPro/RadarChartPro.plugins';
import { type PieChartProPluginSignatures } from '../PieChartPro/PieChartPro.plugins';
import { type SankeyChartPluginSignatures } from '../SankeyChart/SankeyChart.plugins';

export type ProPluginsPerSeriesType = {
  heatmap: HeatmapPluginSignatures;
  line: LineChartProPluginSignatures;
  scatter: ScatterChartProPluginSignatures;
  bar: BarChartProPluginSignatures;
  funnel: FunnelChartPluginSignatures;
  radar: RadarChartProPluginSignatures;
  pie: PieChartProPluginSignatures;
  sankey: SankeyChartPluginSignatures;
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
  Signatures extends readonly ChartAnyPluginSignature[] =
    ChartType extends keyof ProPluginsPerSeriesType
      ? ProPluginsPerSeriesType[ChartType]
      : AllPluginSignatures,
> = ChartPublicAPI<Signatures>;
