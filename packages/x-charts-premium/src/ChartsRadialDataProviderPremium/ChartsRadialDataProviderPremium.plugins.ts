import { type PolarChartSeriesType } from '@mui/x-charts/internals';
import {
  RADIAL_PRO_PLUGINS,
  type RadialProPluginSignatures,
} from '@mui/x-charts-pro/ChartsRadialDataProviderPro';

export const RADIAL_PREMIUM_PLUGINS = [...RADIAL_PRO_PLUGINS] as const;

export type RadialPremiumPluginSignatures<
  SeriesType extends PolarChartSeriesType = PolarChartSeriesType,
> = [...RadialProPluginSignatures<SeriesType>];
