'use client';
import { useTheme, useThemeProps } from '@mui/material/styles';
import type { ChartsPolarDataProviderProps } from './ChartsPolarDataProvider';
import { type ChartsProviderProps } from '../context/ChartsProvider';
import {
  type ChartAnyPluginSignature,
  type MergeSignaturesProperty,
} from '../internals/plugins/models';
import { type ChartCorePluginSignatures } from '../internals/plugins/corePlugins';
import { type PolarPluginSignatures, POLAR_PLUGINS } from './ChartsPolarDataProvider.plugins';
import { type ChartsLocalizationProviderProps } from '../ChartsLocalizationProvider';
import { lineSeriesConfig } from '../LineChart/seriesConfig';
import { type ChartSeriesConfig } from '../internals/plugins/corePlugins/useChartSeriesConfig';

const POLAR_SERIES_CONFIG: ChartSeriesConfig<'line'> = {
  line: lineSeriesConfig,
};

export const useChartsPolarDataProviderProps = <
  TSignatures extends readonly ChartAnyPluginSignature[] = PolarPluginSignatures,
>(
  inProps: ChartsPolarDataProviderProps<TSignatures> & ChartsLocalizationProviderProps,
) => {
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiChartsPolarDataProvider' });

  const {
    children,
    localeText,
    plugins = POLAR_PLUGINS,
    slots,
    slotProps,
    seriesConfig = POLAR_SERIES_CONFIG,
    ...other
  } = props;

  const theme = useTheme();

  const chartProviderProps: ChartsProviderProps<'line', TSignatures> = {
    plugins: plugins as ChartsProviderProps<'line', TSignatures>['plugins'],
    pluginParams: {
      theme: theme.palette.mode,
      seriesConfig,
      ...other,
    } as MergeSignaturesProperty<[...ChartCorePluginSignatures<'line'>, ...TSignatures], 'params'>,
  };

  return {
    children,
    localeText,
    chartProviderProps,
    slots,
    slotProps,
  };
};
