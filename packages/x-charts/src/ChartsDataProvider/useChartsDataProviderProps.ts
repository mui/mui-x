'use client';
import { useTheme, useThemeProps } from '@mui/material/styles';
import type { ChartsDataProviderProps } from './ChartsDataProvider';
import { type ChartsProviderProps } from '../context/ChartsProvider';
import { defaultSeriesConfig } from '../internals/plugins/utils/defaultSeriesConfig';
import {
  type ChartAnyPluginSignature,
  type MergeSignaturesProperty,
} from '../internals/plugins/models';
import { type ChartSeriesType } from '../models/seriesType/config';
import { type ChartCorePluginSignatures } from '../internals/plugins/corePlugins';
import { type AllPluginSignatures, DEFAULT_PLUGINS } from '../internals/plugins/allPlugins';
import { type ChartsLocalizationProviderProps } from '../ChartsLocalizationProvider';

export const useChartsDataProviderProps = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  inProps: ChartsDataProviderProps<TSeries, TSignatures> & ChartsLocalizationProviderProps,
) => {
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiChartsDataProvider' });

  const {
    children,
    localeText,
    plugins = DEFAULT_PLUGINS,
    slots,
    slotProps,
    seriesConfig = defaultSeriesConfig,
    ...other
  } = props;

  const theme = useTheme();

  const chartProviderProps: ChartsProviderProps<TSeries, TSignatures> = {
    plugins: plugins as ChartsProviderProps<TSeries, TSignatures>['plugins'],
    pluginParams: {
      theme: theme.palette.mode,
      seriesConfig,
      ...other,
    } as MergeSignaturesProperty<[...ChartCorePluginSignatures<TSeries>, ...TSignatures], 'params'>,
  };

  return {
    children,
    localeText,
    chartProviderProps,
    slots,
    slotProps,
  };
};
