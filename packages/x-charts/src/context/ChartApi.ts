import type { PieChartPluginSignatures } from '../PieChart/PieChart.plugins';
import type { BarChartPluginsSignatures } from '../BarChart/BarChart.plugins';
import type { ScatterChartPluginsSignatures } from '../ScatterChart/ScatterChart.plugins';
import type { LineChartPluginsSignatures } from '../LineChart/LineChart.plugins';
import type { AllPluginSignatures, DefaultPluginSignatures } from '../internals/plugins/allPlugins';
import type { ChartAnyPluginSignature } from '../internals/plugins/models/plugin';
import type { ChartPublicAPI } from '../internals/plugins/models';

type PluginsPerSeriesType = {
  line: LineChartPluginsSignatures;
  scatter: ScatterChartPluginsSignatures;
  bar: BarChartPluginsSignatures;
  pie: PieChartPluginSignatures;
  /* Special value when creating a chart using composition. */
  composition: DefaultPluginSignatures;
};

/**
 * The API of the chart `apiRef` object.
 * The chart type can be passed as the first generic parameter to narrow down the API to the specific chart type.
 * @example ChartApi<'bar'>
 * If the chart is being created using composition, the `composition` value can be used.
 * @example ChartApi<'composition'>
 */
export type ChartApi<
  TSeries extends keyof PluginsPerSeriesType | undefined = undefined,
  TSignatures extends
    readonly ChartAnyPluginSignature[] = TSeries extends keyof PluginsPerSeriesType
    ? PluginsPerSeriesType[TSeries]
    : AllPluginSignatures,
> = ChartPublicAPI<TSignatures>;
