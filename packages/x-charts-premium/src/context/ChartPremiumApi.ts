import type { ProPluginsPerSeriesType } from '@mui/x-charts-pro/internals';
import type { ChartAnyPluginSignature, ChartPublicAPI } from '@mui/x-charts/internals';
import type { BarChartPremiumPluginSignatures } from '../BarChartPremium/BarChartPremium.plugins';
import type { AllPluginSignatures } from '../internals/plugins/allPlugins';

export type PremiumPluginsPerSeriesType = Omit<ProPluginsPerSeriesType, 'bar'> & {
  bar: BarChartPremiumPluginSignatures;
};

/**
 * The API of the chart `apiRef` object.
 * The chart type can be passed as the first generic parameter to narrow down the API to the specific chart type.
 * @example ChartProApi<'bar'>
 * If the chart is being created using composition, the `composition` value can be used.
 * @example ChartProApi<'composition'>
 */
export type ChartPremiumApi<
  ChartType extends keyof ProPluginsPerSeriesType | undefined = undefined,
  Signatures extends readonly ChartAnyPluginSignature[] =
    ChartType extends keyof ProPluginsPerSeriesType
      ? PremiumPluginsPerSeriesType[ChartType]
      : AllPluginSignatures,
> = ChartPublicAPI<Signatures>;
