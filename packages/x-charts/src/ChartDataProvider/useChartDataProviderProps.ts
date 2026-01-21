'use client';
import { useTheme, useThemeProps } from '@mui/material/styles';
import type { ChartDataProviderProps } from './ChartDataProvider';
import { type ChartProviderProps } from '../context/ChartProvider';
import {
  type ChartAnyPluginSignature,
  type MergeSignaturesProperty,
} from '../internals/plugins/models';
import { type ChartSeriesType } from '../models/seriesType/config';
import { type ChartCorePluginSignatures } from '../internals/plugins/corePlugins';
import { type AllPluginSignatures, DEFAULT_PLUGINS } from '../internals/plugins/allPlugins';
import { type ChartsLocalizationProviderProps } from '../ChartsLocalizationProvider';

export const useChartDataProviderProps = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  inProps: ChartDataProviderProps<TSeries, TSignatures> & ChartsLocalizationProviderProps,
) => {
  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiChartDataProvider' });

  const { children, localeText, plugins = DEFAULT_PLUGINS, slots, slotProps, ...other } = props;

  const theme = useTheme();

  const chartProviderProps: ChartProviderProps<TSignatures> = {
    plugins: plugins as ChartProviderProps<TSignatures>['plugins'],
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
