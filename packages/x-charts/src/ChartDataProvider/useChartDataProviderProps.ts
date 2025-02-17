'use client';
import { useTheme } from '@mui/material/styles';
import type { ChartDataProviderProps } from './ChartDataProvider';
import { AnimationProviderProps } from '../context/AnimationProvider';
import { ChartProviderProps } from '../context/ChartProvider';
import { ChartAnyPluginSignature, MergeSignaturesProperty } from '../internals/plugins/models';
import { ChartSeriesType } from '../models/seriesType/config';
import { ChartCorePluginSignatures } from '../internals/plugins/corePlugins';
import { AllPluginSignatures } from '../internals/plugins/allPlugins';

export const useChartDataProviderProps = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartDataProviderProps<TSeries, TSignatures>,
) => {
  const { children, skipAnimation, plugins, seriesConfig, ...other } = props;

  const theme = useTheme();

  const chartProviderProps: Omit<ChartProviderProps<TSeries, TSignatures>, 'children'> = {
    plugins,
    seriesConfig,
    pluginParams: {
      theme: theme.palette.mode,
      ...other,
    } as unknown as MergeSignaturesProperty<
      [...ChartCorePluginSignatures, ...TSignatures],
      'params'
    >,
  };

  const animationProviderProps: Omit<AnimationProviderProps, 'children'> = {
    skipAnimation,
  };

  return {
    children,
    animationProviderProps,
    chartProviderProps,
  };
};
