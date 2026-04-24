import {
  RADIAL_PLUGINS,
  type RadialPluginSignatures,
} from '@mui/x-charts/ChartsRadialDataProvider';
import { type PolarChartSeriesType } from '@mui/x-charts/internals';
import { useChartProExport, type UseChartProExportSignature } from '../internals/plugins/useChartProExport';

export const RADIAL_PRO_PLUGINS = [...RADIAL_PLUGINS, useChartProExport] as const;

export type RadialProPluginSignatures<
  SeriesType extends PolarChartSeriesType = PolarChartSeriesType,
> = [...RadialPluginSignatures<SeriesType>, UseChartProExportSignature];
