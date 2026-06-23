'use client';
import { useTheme, useThemeProps } from '@mui/material/styles';
import type { ChartsRadialDataProviderProps } from './ChartsRadialDataProvider';
import { type ChartsProviderProps } from '../context/ChartsProvider';
import {
  type ChartAnyPluginSignature,
  type MergeSignaturesProperty,
} from '../internals/plugins/models';
import { type ChartCorePluginSignatures } from '../internals/plugins/corePlugins';
import { type RadialPluginSignatures, RADIAL_PLUGINS } from './ChartsRadialDataProvider.plugins';
import { type ChartsLocalizationProviderProps } from '../ChartsLocalizationProvider';
import { type ChartSeriesConfig } from '../internals/plugins/corePlugins/useChartSeriesConfig';
import { type PolarChartSeriesType } from '../models/seriesType/config';

const RADIAL_SERIES_CONFIG: ChartSeriesConfig<never> = {};

export const useChartsRadialDataProviderProps = <
  SeriesType extends PolarChartSeriesType = PolarChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = RadialPluginSignatures<SeriesType>,
>(
  inProps: ChartsRadialDataProviderProps<SeriesType, TSignatures> & ChartsLocalizationProviderProps,
) => {
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiChartsRadialDataProvider' });

  const {
    children,
    localeText,
    plugins = RADIAL_PLUGINS,
    slots,
    slotProps,
    seriesConfig = RADIAL_SERIES_CONFIG,
    ...other
  } = props;

  const theme = useTheme();

  const chartProviderProps: ChartsProviderProps<SeriesType, TSignatures> = {
    plugins: plugins as ChartsProviderProps<SeriesType, TSignatures>['plugins'],
    pluginParams: {
      theme: theme.palette.mode,
      seriesConfig,
      ...other,
    } as MergeSignaturesProperty<
      [...ChartCorePluginSignatures<SeriesType>, ...TSignatures],
      'params'
    >,
  };

  return {
    children,
    localeText,
    chartProviderProps,
    slots,
    slotProps,
  };
};
