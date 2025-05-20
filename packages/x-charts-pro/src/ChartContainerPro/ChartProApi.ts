import { ChartAnyPluginSignature, ChartSeriesType } from '@mui/x-charts/internals';
import { ChartContainerProProps } from './ChartContainerPro';
import { HeatmapPluginsSignatures } from '../Heatmap/Heatmap.plugins';
import { LineChartProPluginsSignatures } from '../LineChartPro/LineChartPro.plugins';
import { ScatterChartProPluginsSignatures } from '../ScatterChartPro/ScatterChartPro.plugins';
import { BarChartProPluginsSignatures } from '../BarChartPro/BarChartPro.plugins';

type PluginsPerSeriesType = {
  heatmap: HeatmapPluginsSignatures;
  line: LineChartProPluginsSignatures;
  scatter: ScatterChartProPluginsSignatures;
  bar: BarChartProPluginsSignatures;
};

export type ChartProApi<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends
    readonly ChartAnyPluginSignature[] = TSeries extends keyof PluginsPerSeriesType
    ? PluginsPerSeriesType[TSeries]
    : [],
> = NonNullable<NonNullable<ChartContainerProProps<TSeries, TSignatures>['apiRef']>['current']>;
