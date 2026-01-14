import { type ConvertSignaturesIntoPlugins } from '@mui/x-charts/internals';
import {
  BAR_CHART_PRO_PLUGINS,
  type BarChartProPluginSignatures,
} from '@mui/x-charts-pro/BarChartPro';

export type BarChartPremiumPluginSignatures = BarChartProPluginSignatures;

export const BAR_CHART_PREMIUM_PLUGINS: ConvertSignaturesIntoPlugins<BarChartPremiumPluginSignatures> =
  BAR_CHART_PRO_PLUGINS;
