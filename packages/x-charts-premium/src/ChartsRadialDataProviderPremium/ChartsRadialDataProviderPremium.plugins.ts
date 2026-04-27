import {
  RADIAL_PLUGINS,
  type RadialPluginSignatures,
} from '@mui/x-charts/ChartsRadialDataProvider';
import { type PolarChartSeriesType } from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
} from '@mui/x-charts-pro/plugins';

export const RADIAL_PREMIUM_PLUGINS = [...RADIAL_PLUGINS, useChartProExport] as const;

export type RadialPremiumPluginSignatures<
  SeriesType extends PolarChartSeriesType = PolarChartSeriesType,
> = [...RadialPluginSignatures<SeriesType>, UseChartProExportSignature];
