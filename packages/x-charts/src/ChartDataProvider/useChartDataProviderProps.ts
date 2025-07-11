'use client';
import { useTheme, useThemeProps } from '@mui/material/styles';
import type { ChartDataProviderProps } from './ChartDataProvider';
import { ChartProviderProps } from '../context/ChartProvider';
import { ChartAnyPluginSignature, MergeSignaturesProperty } from '../internals/plugins/models';
import { ChartSeriesType } from '../models/seriesType/config';
import { ChartCorePluginSignatures } from '../internals/plugins/corePlugins';
import { AllPluginSignatures, DEFAULT_PLUGINS } from '../internals/plugins/allPlugins';
import { ChartsLocalizationProviderProps } from '../ChartsLocalizationProvider';

export const useChartDataProviderProps = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  inProps: ChartDataProviderProps<TSeries, TSignatures> & ChartsLocalizationProviderProps,
) => {
  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiChartDataProvider' });

  const {
    children,
    localeText,
    plugins = DEFAULT_PLUGINS,
    seriesConfig,
    slots,
    slotProps,
    ...other
  } = props;

  const theme = useTheme();

  const chartProviderProps: ChartProviderProps<TSeries, TSignatures> = {
    plugins: plugins as ChartProviderProps<TSeries, TSignatures>['plugins'],
    seriesConfig,
    pluginParams: {
      theme: theme.palette.mode,
      ...other,
    } as unknown as MergeSignaturesProperty<
      [...ChartCorePluginSignatures, ...TSignatures],
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
